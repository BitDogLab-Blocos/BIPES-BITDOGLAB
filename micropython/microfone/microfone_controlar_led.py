# microfone_controlar_led.py
# Controla o brilho do LED RGB com a voz
# Bloco: Controlar LED com voz

from machine import Pin, PWM, ADC
import time

# Configuração
led_vermelho = PWM(Pin(13), freq=1000)
led_verde = PWM(Pin(11), freq=1000)
led_azul = PWM(Pin(12), freq=1000)
mic = ADC(Pin(28))

_MIC_OFFSET = 32768

print("Fale ou faça barulho para controlar o LED!")

while True:
 # Lê amostras
    pico = 0
    for _ in range(50):
        val = abs(mic.read_u16() - _MIC_OFFSET)
        if val > pico:
            pico = val

 # Converte para porcentagem
    _barra_pct = min(100, pico * 100 // 15000)

 # Aplica ao LED (verde = silêncio, vermelho = barulho)
    led_vermelho.duty_u16(int(65535 * _barra_pct / 100))
    led_verde.duty_u16(int(65535 * (100 - _barra_pct) / 100))
    led_azul.duty_u16(0)

    time.sleep_ms(50)
