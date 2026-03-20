# joystick_mover_player.py
# Move um quadrado pelo display usando o joystick
# Bloco: 🕹️ Mover player no display

from machine import Pin, I2C, ADC
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
joystick_x = ADC(Pin(27))
joystick_y = ADC(Pin(26))

# Posição inicial do player
_px = 60
_py = 28
_player_size = 6

CENTER = 32768
DEADZONE = 5000

print("Mova o joystick para controlar o player! Ctrl+C para sair")

while True:
    raw_x = joystick_x.read_u16()
    raw_y = joystick_y.read_u16()

    # Movimentação
    if raw_x < CENTER - DEADZONE:
        _px = max(0, _px - 2)
    elif raw_x > CENTER + DEADZONE:
        _px = min(128 - _player_size, _px + 2)

    if raw_y < CENTER - DEADZONE:
        _py = max(0, _py - 2)
    elif raw_y > CENTER + DEADZONE:
        _py = min(64 - _player_size, _py + 2)

    # Desenha
    oled.fill(0)
    oled.fill_rect(_px, _py, _player_size, _player_size, 1)
    oled.show()
    time.sleep_ms(50)
