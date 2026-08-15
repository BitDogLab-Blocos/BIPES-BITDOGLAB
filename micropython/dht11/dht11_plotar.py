"""Mostra um grafico continuo de temperatura ou umidade do DHT11.

Bloco correspondente: Mostrar grafico de DHT11.
Este exemplo usa o display OLED pequeno SSD1306 da BitDogLab.
"""

from machine import I2C, Pin
from ssd1306 import SSD1306_I2C
import time

from dht11_suporte import ler_dht11


POSICAO_TELA_TODA = 0
POSICAO_METADE_CIMA = 1
POSICAO_METADE_BAIXO = 2

i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400_000)
enderecos = i2c.scan()
endereco_oled = 0x3C if 0x3C in enderecos else (0x3D if 0x3D in enderecos else 0x3C)
oled = SSD1306_I2C(128, 64, i2c, addr=endereco_oled)

_historicos = {}


def _limites_verticais(posicao):
    if posicao == POSICAO_METADE_CIMA:
        return 0, 10, 31
    if posicao == POSICAO_METADE_BAIXO:
        return 32, 42, 63
    return 0, 10, 63


def mostrar_grafico(valor, posicao=POSICAO_TELA_TODA, titulo="DHT11"):
    """Adiciona um valor ao historico e atualiza o grafico no OLED."""
    valor = float(valor)
    chave = (titulo, posicao)
    historico = _historicos.setdefault(chave, [])
    historico.append(valor)
    if len(historico) > 60:
        historico.pop(0)

    y_titulo, y_inicio, y_fim = _limites_verticais(posicao)
    oled.fill_rect(0, y_titulo, 128, y_fim - y_titulo + 1, 0)
    oled.text("{}: {:.1f}".format(titulo, valor), 0, y_titulo, 1)

    if len(historico) > 1:
        minimo = min(historico)
        maximo = max(historico)
        if maximo == minimo:
            maximo = minimo + 1

        altura = y_fim - y_inicio
        quantidade = len(historico)
        ponto_anterior = None

        for indice, amostra in enumerate(historico):
            x = int(indice * 127 / (quantidade - 1))
            y = y_fim - int((amostra - minimo) * altura / (maximo - minimo))
            if ponto_anterior is None:
                oled.pixel(x, y, 1)
            else:
                oled.line(ponto_anterior[0], ponto_anterior[1], x, y, 1)
            ponto_anterior = (x, y)

    oled.show()


while True:
    estado = ler_dht11(0)
    if estado["ok"]:
        mostrar_grafico(
            estado["temperatura"],
            posicao=POSICAO_TELA_TODA,
            titulo="Temp",
        )
    time.sleep_ms(2_000)
