# display_borda.py
# Testa criação e remoção de borda no display
# Blocos: 📺 Criar borda, 📺 Limpar borda

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

# Teste 1: Criar borda + texto
oled.fill(0)
oled.rect(0, 0, 128, 64, 1)
oled.text("Com borda!", 20, 28, 1)
oled.show()
print("Borda criada")
time.sleep(2)

# Teste 2: Remover borda
oled.rect(0, 0, 128, 64, 0)
oled.text("Sem borda!", 20, 28, 1)
oled.show()
print("Borda removida")
time.sleep(2)

# Teste 3: Limpar tudo
oled.fill(0)
oled.show()
print("Display limpo")
