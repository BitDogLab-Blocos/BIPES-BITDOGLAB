"""Controla o angulo de um servomotor com o joystick da BitDogLab.

Bloco correspondente: Joystick controla servo.
O exemplo aumenta o angulo para cima e diminui para baixo.
"""

from machine import ADC, Pin, PWM
import time


PINOS_DIG = {0: 0, 1: 1, 2: 2, 3: 3}
CENTRO_JOYSTICK = 32_768
ZONA_MORTA = 5_000
PULSO_MIN_NS = 640_000
PULSO_MAX_NS = 2_420_000

_joystick_x = ADC(Pin(27))
_joystick_y = ADC(Pin(26))
_servos = {}
_angulos = {}


def _obter_servo(conexao):
    conexao = int(conexao)
    if conexao not in PINOS_DIG:
        raise ValueError("Conexao DIG invalida")
    if conexao not in _servos:
        _servos[conexao] = PWM(Pin(PINOS_DIG[conexao]))
        _servos[conexao].freq(50)
        _angulos[conexao] = 0
    return _servos[conexao]


def mover_servo(conexao, angulo):
    conexao = int(conexao)
    angulo = max(0, min(180, angulo))
    pulso = PULSO_MIN_NS + int(
        ((PULSO_MAX_NS - PULSO_MIN_NS) * angulo) // 180
    )
    _obter_servo(conexao).duty_ns(pulso)
    _angulos[conexao] = angulo
    return angulo


def controlar_com_joystick(conexao=0, angulo_inicial=90, passo=2):
    """Le o joystick uma vez e atualiza o servo quando necessario."""
    conexao = int(conexao)
    if conexao not in _angulos:
        mover_servo(conexao, angulo_inicial)

    passo = max(1, abs(passo))
    valor_y = _joystick_y.read_u16()

    if valor_y < CENTRO_JOYSTICK - ZONA_MORTA:
        mover_servo(conexao, _angulos[conexao] + passo)
    elif valor_y > CENTRO_JOYSTICK + ZONA_MORTA:
        mover_servo(conexao, _angulos[conexao] - passo)

    return _angulos[conexao]


while True:
    controlar_com_joystick(conexao=0, angulo_inicial=90, passo=2)
    time.sleep_ms(20)
