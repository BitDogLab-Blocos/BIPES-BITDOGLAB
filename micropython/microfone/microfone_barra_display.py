# microfone_barra_display.py
# Mostra uma barra de volume no display OLED
# Bloco: 🎙️ Barra de volume no display

from machine import Pin, I2C, ADC
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
mic = ADC(Pin(28))

_MIC_OFFSET = 32768

print("Barra de volume no display - fale ou faca barulho!")

while True:
    # Lê amostras
    pico = 0
    for _ in range(50):
        val = abs(mic.read_u16() - _MIC_OFFSET)
        if val > pico:
            pico = val

    # Calcula largura da barra (0 a 120 pixels)
    _barra_pct = min(100, pico * 100 // 15000)
    _barra_w = int(120 * _barra_pct / 100)

    # Desenha barra na linha 3 (y=28)
    y = 28
    oled.fill_rect(3, y, _barra_w, 6, 1)
    oled.fill_rect(_barra_w + 3, y, 120 - _barra_w, 6, 0)
    oled.show()

    time.sleep_ms(50)
