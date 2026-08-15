"""Baixa um servomotor gradualmente ate o angulo escolhido.

Bloco correspondente: Descer servo.
"""

from machine import Pin, PWM
import time


PINOS_DIG = {0: 0, 1: 1, 2: 2, 3: 3}
PULSO_MIN_NS = 640_000
PULSO_MAX_NS = 2_420_000

_servos = {}


def _obter_servo(conexao):
    conexao = int(conexao)
    if conexao not in PINOS_DIG:
        raise ValueError("Conexao DIG invalida")
    if conexao not in _servos:
        _servos[conexao] = PWM(Pin(PINOS_DIG[conexao]))
        _servos[conexao].freq(50)
    return _servos[conexao]


def mover_servo(conexao, angulo):
    angulo = max(0, min(180, angulo))
    pulso = PULSO_MIN_NS + int(
        ((PULSO_MAX_NS - PULSO_MIN_NS) * angulo) // 180
    )
    _obter_servo(conexao).duty_ns(pulso)
    return angulo


def descer_gradualmente(conexao, inicio=180, destino=0, passo=10, pausa=3):
    """Move do angulo inicial ao destino, incluindo o angulo final."""
    destino = max(0, min(180, destino))
    angulo = max(0, min(180, inicio))
    passo = max(1, abs(passo))
    pausa = max(0, pausa)

    while angulo >= destino:
        mover_servo(conexao, angulo)
        time.sleep(pausa)
        if angulo <= destino:
            break
        angulo = max(angulo - passo, destino)


descer_gradualmente(conexao=0, inicio=180, destino=0, passo=10, pausa=3)
