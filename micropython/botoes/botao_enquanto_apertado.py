# botao_enquanto_apertado.py
# Executa ações enquanto o botão estiver pressionado
# Bloco: 🎮 Enquanto pressionar o botão

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import neopixel
import time

# Configuração
botao_esquerda = Pin(5, Pin.IN, Pin.PULL_UP)
botao_direita = Pin(6, Pin.IN, Pin.PULL_UP)
botao_centro = Pin(10, Pin.IN, Pin.PULL_UP)
botao_joystick = Pin(22, Pin.IN, Pin.PULL_UP)

i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

np = neopixel.NeoPixel(Pin(7), 25)
LED_MATRIX = [[24,23,22,21,20],[15,16,17,18,19],[14,13,12,11,10],[5,6,7,8,9],[4,3,2,1,0]]
EMOJIS_5X5 = {
    "happy": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0],
    "sad":   [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 1,0,0,0,1]
}

def mostrar_emoji(nome, cor, brilho=30):
    """Mostra um emoji na matriz de LEDs."""
    for i in range(25):
        np[i] = (0, 0, 0)
    fator = brilho / 100 * 0.7
    cor_ajustada = (int(cor[0] * fator), int(cor[1] * fator), int(cor[2] * fator))
    if nome in EMOJIS_5X5:
        padrao = EMOJIS_5X5[nome]
        for y in range(5):
            for x in range(5):
                if padrao[y * 5 + x] == 1:
                    np[LED_MATRIX[y][x]] = cor_ajustada
    np.write()

# Exemplo: Enquanto pressionar botão A, mostra texto e emoji feliz
# Quando soltar, mostra texto diferente e emoji triste
while True:
    if botao_esquerda.value() == 0:
        oled.fill(0)
        oled.text("Ola!", 3, 8, 1)
        oled.show()
        mostrar_emoji("happy", (255, 255, 0), 30)
    else:
        oled.fill(0)
        oled.text("teste", 3, 8, 1)
        oled.show()
        mostrar_emoji("sad", (255, 255, 0), 30)
    time.sleep_ms(50)
