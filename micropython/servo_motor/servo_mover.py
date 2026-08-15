"""Move um servomotor externo para um angulo entre 0 e 180 graus.

Bloco correspondente: Mover servo.
Na BitDogLab V7, as conexoes DIG 0, 1, 2 e 3 usam os GPIOs de mesmo numero.
"""

from machine import Pin, PWM


PINOS_DIG = {0: 0, 1: 1, 2: 2, 3: 3}
FREQUENCIA_PWM = 50
PULSO_MIN_NS = 640_000
PULSO_MAX_NS = 2_420_000

_servos = {}


def _obter_servo(conexao):
    conexao = int(conexao)
    if conexao not in PINOS_DIG:
        raise ValueError("Conexao DIG invalida")
    if conexao not in _servos:
        servo = PWM(Pin(PINOS_DIG[conexao]))
        servo.freq(FREQUENCIA_PWM)
        _servos[conexao] = servo
    return _servos[conexao]


def mover_servo(conexao, angulo):
    """Move o servo e devolve o angulo efetivamente utilizado."""
    angulo = max(0, min(180, angulo))
    pulso = PULSO_MIN_NS + int(
        ((PULSO_MAX_NS - PULSO_MIN_NS) * angulo) // 180
    )
    _obter_servo(conexao).duty_ns(pulso)
    return angulo


# Exemplo equivalente a: Mover servo na Conexao 0 para 90 graus.
mover_servo(0, 90)
