# microfone_contar_palmas.py
# Conta palmas detectadas pelo microfone e mostra no display
# Blocos: Contar palmas, Total de palmas

from machine import Pin, I2C, ADC
from ssd1306 import SSD1306_I2C
import time

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
mic = ADC(Pin(28))

_MIC_OFFSET = 32768
_palmas = 0
_mic_ultima_palma = 0
LIMIAR_PALMA = 8000
COOLDOWN_MS = 300

print("Bata palmas! O contador aparece no display.")

while True:
 # Lê amostras
    pico = 0
    for _ in range(50):
        val = abs(mic.read_u16() - _MIC_OFFSET)
        if val > pico:
            pico = val

 # Detecta palma
    agora = time.ticks_ms()
    if pico > LIMIAR_PALMA and time.ticks_diff(agora, _mic_ultima_palma) > COOLDOWN_MS:
        _palmas += 1
        _mic_ultima_palma = agora
        print("Palma detectada! Total:", _palmas)

 # Mostra no display
    oled.fill(0)
    oled.text("Contador Palmas", 5, 2, 1)
    oled.text("Palmas: " + str(_palmas), 3, 28, 1)
    oled.show()

    time.sleep_ms(50)
