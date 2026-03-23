# Verificar qual sensor esta conectado
# Escaneia os barramentos I2C e mostra no display quais sensores foram encontrados
# Resultado esperado: display mostra Canal 0 e Canal 1 com sensores detectados

from machine import Pin, I2C
import time
from ssd1306 import SSD1306_I2C

i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

def verificar_sensores():
    i2c0 = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
    i2c1 = I2C(1, sda=Pin(2), scl=Pin(3), freq=400000)
    r0 = i2c0.scan()
    r1 = i2c1.scan()
    nomes = {56: "Temp e Umid", 104: "Acelerometro", 119: "Temp e Umid"}
    oled.fill(0)
    oled.text("Sensores:", 0, 0, 1)
    y = 12
    oled.text("Canal 0:", 0, y, 1)
    y += 10
    visto = []
    if r0:
        for a in r0:
            if a in nomes:
                n = nomes[a]
                if n not in visto:
                    visto.append(n)
                    oled.text(n + " OK", 8, y, 1)
                    y += 10
    if not visto:
        oled.text("nenhum", 8, y, 1)
        y += 10
    oled.text("Canal 1:", 0, y, 1)
    y += 10
    visto = []
    if r1:
        for a in r1:
            if a in nomes:
                n = nomes[a]
                if n not in visto:
                    visto.append(n)
                    oled.text(n + " OK", 8, y, 1)
                    y += 10
    if not visto:
        oled.text("nenhum", 8, y, 1)
    oled.show()

verificar_sensores()
