# display_mostrar_calculo.py
# Mostra resultados de cálculos no display
# Bloco: 🔢 Mostrar resultado

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

# Mostra diferentes cálculos em diferentes linhas
oled.fill(0)

# Linha 1: soma
resultado = str(10 + 5)
oled.text(resultado, 3, 8, 1)

# Linha 2: multiplicação
resultado2 = str(7 * 8)
oled.text(resultado2, 3, 18, 1)

# Linha 3: divisão
resultado3 = str(round(22 / 7, 2))
oled.text(resultado3, 3, 28, 1)

oled.show()
print("Cálculos exibidos no display!")
