"""Le a temperatura do DHT11 em graus Celsius.

Bloco correspondente: Temperatura DHT11.
"""

import time
from dht11_suporte import ler_dht11, temperatura_dht11


def ler_temperatura(conexao=0):
    """Devolve a ultima temperatura valida da conexao escolhida."""
    return temperatura_dht11(conexao)


while True:
    estado = ler_dht11(0)
    if estado["ok"]:
        print("Temperatura: {} C".format(estado["temperatura"]))
    else:
        print("Nao foi possivel ler o DHT11")
    time.sleep_ms(2_000)
