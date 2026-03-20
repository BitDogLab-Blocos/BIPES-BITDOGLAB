# display_limpar.py
# Testa o bloco de limpar display
# Bloco: 🧹 Apagar display

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

# Escreve algo no display
oled.fill(0)
oled.text("Texto teste", 10, 20, 1)
oled.text("Vai sumir...", 10, 35, 1)
oled.show()
print("Texto exibido, aguardando 2s...")
time.sleep(2)

# Limpa o display
oled.fill(0)
oled.show()
print("Display limpo!")
