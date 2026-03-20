# display_dashboard_matriz.py
# Mostra informações da matriz de LEDs no display
# Bloco: Dashboard da Matriz

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import neopixel
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
np = neopixel.NeoPixel(Pin(7), 25)
LED_MATRIX = [[24,23,22,21,20],[15,16,17,18,19],[14,13,12,11,10],[5,6,7,8,9],[4,3,2,1,0]]

# Acende um emoji na matriz para ter dados
EMOJIS_5X5 = {"happy": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0]}
cor = (255, 255, 0)
brilho = 30
fator = brilho / 100 * 0.7
cor_ajustada = (int(cor[0] * fator), int(cor[1] * fator), int(cor[2] * fator))

for i in range(25):
    np[i] = (0, 0, 0)
padrao = EMOJIS_5X5["happy"]
for y in range(5):
    for x in range(5):
        if padrao[y * 5 + x] == 1:
            np[LED_MATRIX[y][x]] = cor_ajustada
np.write()

# Mostra dashboard no display
leds_acesos = sum(1 for i in range(25) if np[i] != (0, 0, 0))
oled.fill(0)
oled.text("=== MATRIZ ===", 5, 2, 1)
oled.text("Status: ON", 3, 16, 1)
oled.text("Emoji: Feliz", 3, 26, 1)
oled.text("Cor: (255,255,0)", 3, 36, 1)
oled.text("Brilho: 30%", 3, 46, 1)
oled.text("LEDs: " + str(leds_acesos) + "/25", 3, 56, 1)
oled.show()
print("Dashboard exibido!")
