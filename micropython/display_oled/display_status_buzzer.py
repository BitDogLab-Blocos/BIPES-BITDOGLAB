# display_status_buzzer.py
# Mostra o estado do buzzer no display
# Bloco: 📺 Mostrar status do buzzer

from machine import Pin, PWM, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
buzzer = PWM(Pin(21))

# Teste 1: Buzzer tocando
buzzer.freq(1000)
buzzer.duty_u16(int(65535 * 0.35))

oled.fill(0)
oled.text("Buzzer: ON", 3, 8, 1)
oled.text("Freq: 1000 Hz", 3, 18, 1)
oled.show()
print("Buzzer ligado")
time.sleep(1)

# Teste 2: Buzzer parado
buzzer.duty_u16(0)

oled.fill(0)
oled.text("Buzzer: OFF", 3, 8, 1)
oled.show()
print("Buzzer desligado")
