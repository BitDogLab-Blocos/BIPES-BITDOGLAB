# sinalizar_led_sos.py
# Sinal de socorro SOS em código Morse
# Bloco: 🆘 Sinalizar LED da cor ajuda (SOS)

from machine import Pin, PWM
import time

# Configuração dos pinos do LED RGB
LED_RED = 11   # GPIO11 - Vermelho
LED_GREEN = 12 # GPIO12 - Verde
LED_BLUE = 13  # GPIO13 - Azul

# Inicializa os LEDs com PWM
led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)

def sinalizar_sos(cor):
    """
    Emite o sinal de socorro S.O.S. em código Morse.
    Padrão: ... --- ... (3 curtos, 3 longos, 3 curtos)
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
    """
    def piscar(duracao):
        led_vermelho.duty_u16(cor[0] * 257)
        led_verde.duty_u16(cor[1] * 257)
        led_azul.duty_u16(cor[2] * 257)
        time.sleep_ms(duracao)
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
        time.sleep_ms(150)
    
 # Três piscadas curtas (S)
    for _ in range(3):
        piscar(150)
    time.sleep_ms(400)
    
 # Três piscadas longas (O)
    for _ in range(3):
        piscar(500)
    time.sleep_ms(400)
    
 # Três piscadas curtas (S)
    for _ in range(3):
        piscar(150)

# Exemplo de uso
if __name__ == "__main__":
 # Envia sinal SOS na cor vermelha
    sinalizar_sos((255, 0, 0))
