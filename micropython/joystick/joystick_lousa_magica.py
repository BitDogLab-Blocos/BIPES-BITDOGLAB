# joystick_lousa_magica.py
# Desenha livremente no display usando o joystick
# Bloco: 🕹️ Lousa Mágica

from machine import Pin, I2C, ADC
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
joystick_x = ADC(Pin(27))
joystick_y = ADC(Pin(26))
botao_joystick = Pin(22, Pin.IN, Pin.PULL_UP)

CENTER = 32768
DEADZONE = 5000

# Posição do cursor
_lx = 64
_ly = 32
_pen_size = 2

oled.fill(0)
oled.show()
print("Lousa Magica! Mova o joystick para desenhar.")
print("Pressione o botao do joystick para limpar.")

while True:
    raw_x = joystick_x.read_u16()
    raw_y = joystick_y.read_u16()

    # Movimentação
    if raw_x < CENTER - DEADZONE:
        _lx = max(0, _lx - 1)
    elif raw_x > CENTER + DEADZONE:
        _lx = min(127, _lx + 1)

    if raw_y < CENTER - DEADZONE:
        _ly = max(0, _ly - 1)
    elif raw_y > CENTER + DEADZONE:
        _ly = min(63, _ly + 1)

    # Desenha pixel na posição atual
    oled.fill_rect(_lx, _ly, _pen_size, _pen_size, 1)
    oled.show()

    # Botão do joystick limpa a tela
    if botao_joystick.value() == 0:
        oled.fill(0)
        oled.show()
        time.sleep_ms(200)

    time.sleep_ms(30)
