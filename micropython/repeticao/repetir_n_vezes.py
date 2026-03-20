# repetir_n_vezes.py
# Testa os blocos de repetição
# Blocos: Repetir N vezes, Repetir para sempre

from machine import Pin, PWM
import time

# LED RGB
led_vermelho = PWM(Pin(13), freq=1000)

# === Teste 1: Repetir N vezes ===
# Pisca o LED vermelho 5 vezes
print("Piscando LED 5 vezes...")
for _rep in range(5):
    led_vermelho.duty_u16(32768)
    time.sleep_ms(300)
    led_vermelho.duty_u16(0)
    time.sleep_ms(300)

print("Fim das 5 repetições!")

# === Teste 2: Repetir para sempre ===
# Descomente abaixo para testar (Ctrl+C para parar)
# print("Loop infinito - Ctrl+C para sair")
# while True:
# led_vermelho.duty_u16(32768)
# time.sleep_ms(500)
# led_vermelho.duty_u16(0)
# time.sleep_ms(500)
