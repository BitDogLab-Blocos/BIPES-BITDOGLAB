# joystick_controlar_buzzer.py
# Controla a frequência do buzzer com o joystick
# Bloco: Joystick controla Buzzer

from machine import Pin, PWM, ADC
import time

# Configuração
buzzer = PWM(Pin(21))
joystick_y = ADC(Pin(26))

CENTER = 32768
DEADZONE = 5000

_freq_joy = 1000

print("Mova o joystick para mudar a frequencia do buzzer!")
print("Ctrl+C para parar")

buzzer.freq(_freq_joy)
buzzer.duty_u16(int(65535 * 0.35))

try:
    while True:
        raw_y = joystick_y.read_u16()

        if raw_y < CENTER - DEADZONE:
            _freq_joy = min(5000, _freq_joy + 50)
        elif raw_y > CENTER + DEADZONE:
            _freq_joy = max(100, _freq_joy - 50)

        buzzer.freq(_freq_joy)
        time.sleep_ms(50)
except KeyboardInterrupt:
    buzzer.duty_u16(0)
    print("Buzzer desligado")
