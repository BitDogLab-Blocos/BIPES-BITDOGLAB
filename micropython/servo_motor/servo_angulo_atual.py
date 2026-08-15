"""Consulta o ultimo angulo enviado a um servomotor externo.

Bloco correspondente: Angulo atual do servo.
Um servo comum nao informa sua posicao fisica; por isso o valor e mantido em memoria.
"""

from machine import Pin, PWM


PINOS_DIG = {0: 0, 1: 1, 2: 2, 3: 3}
PULSO_MIN_NS = 640_000
PULSO_MAX_NS = 2_420_000

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


def angulo_atual(conexao):
    """Devolve o ultimo angulo enviado ao servo desta conexao."""
    return _angulos.get(int(conexao), 0)


# Exemplo de uso dos dois blocos em conjunto.
mover_servo(0, 90)
print("Angulo atual:", angulo_atual(0))
