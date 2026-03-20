# joystick_controlar_led.py
# Controla o brilho do LED RGB com o joystick
# Bloco: Joystick controla LED

from machine import Pin, PWM, ADC
import time

# Configuração
led_vermelho = PWM(Pin(13), freq=1000)
joystick_y = ADC(Pin(26))

CENTER = 32768
DEADZONE = 5000

_intensidade_joy = 50  # Começa em 50%
cor = (255, 0, 0)  # Vermelho

print("Mova o joystick para cima/baixo para controlar o brilho!")

while True:
    raw_y = joystick_y.read_u16()

 # Cima aumenta, baixo diminui
    if raw_y < CENTER - DEADZONE:
        _intensidade_joy = min(100, _intensidade_joy + 2)
    elif raw_y > CENTER + DEADZONE:
        _intensidade_joy = max(0, _intensidade_joy - 2)

 # Aplica brilho ao LED
    led_vermelho.duty_u16(int(cor[0] * 257 * _intensidade_joy / 100))

    time.sleep_ms(50)
