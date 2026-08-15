"""Le a umidade relativa medida pelo DHT11.

Bloco correspondente: Umidade DHT11.
"""

import time
from dht11_suporte import ler_dht11, umidade_dht11


def ler_umidade(conexao=0):
    """Devolve a ultima umidade valida da conexao escolhida."""
    return umidade_dht11(conexao)


while True:
    estado = ler_dht11(0)
    if estado["ok"]:
        print("Umidade: {}%".format(estado["umidade"]))
    else:
        print("Nao foi possivel ler o DHT11")
    time.sleep_ms(2_000)
