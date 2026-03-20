# display_piscar_texto.py
# Faz um texto piscar no display OLED
# Bloco: Piscar texto

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

# Pisca "Ola!" na linha 1, centralizado, 5 vezes
texto = "Ola!"
x = max(3, (128 - len(texto) * 8) // 2)
y = 8  # linha 1

print("Piscando texto no display...")
for _ in range(5):
 # Acende
    oled.fill_rect(0, y, 128, 8, 0)
    oled.text(texto, x, y, 1)
    oled.show()
    time.sleep_ms(500)
 # Apaga
    oled.fill_rect(0, y, 128, 8, 0)
    oled.show()
    time.sleep_ms(300)

print("Fim do teste de piscar!")
