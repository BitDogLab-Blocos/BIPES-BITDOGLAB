# microfone_testar.py
# Testa o microfone mostrando o nível de som no display
# Bloco: Testar Microfone

from machine import Pin, I2C, ADC
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
mic = ADC(Pin(28))

_MIC_OFFSET = 32768

print("Teste do microfone - fale ou bata palmas!")

while True:
 # Lê 50 amostras e pega o valor de pico
    pico = 0
    for _ in range(50):
        val = abs(mic.read_u16() - _MIC_OFFSET)
        if val > pico:
            pico = val

 # Converte para nível 0-5
    _mic_nivel = min(5, pico // 3000)

 # Mostra no display
    oled.fill(0)
    oled.text("Microfone", 25, 2, 1)
    oled.text("Nivel: " + str(_mic_nivel), 3, 20, 1)

 # Barra visual
    barra = "#" * _mic_nivel + "." * (5 - _mic_nivel)
    oled.text("[" + barra + "]", 3, 35, 1)

    oled.text("Pico: " + str(pico), 3, 50, 1)
    oled.show()

    time.sleep_ms(100)
