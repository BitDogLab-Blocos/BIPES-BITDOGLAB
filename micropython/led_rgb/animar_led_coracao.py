# animar_led_coracao.py
# Animação de batimento cardíaco no LED
# Bloco: 💓 Animar LED da cor batimento cardíaco

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

def animar_led_coracao(cor, duracao_total=5):
    """
    Simula um batimento cardíaco com dois pulsos rápidos.
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        duracao_total: Tempo total em segundos (padrão: 5)
    """
    tempo_inicio = time.time()
    
    while time.time() - tempo_inicio < duracao_total:
        # Primeiro pulso
        led_vermelho.duty_u16(cor[0] * 257)
        led_verde.duty_u16(cor[1] * 257)
        led_azul.duty_u16(cor[2] * 257)
        time.sleep_ms(100)
        
        # Pausa curta
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
        time.sleep_ms(100)
        
        # Segundo pulso
        led_vermelho.duty_u16(cor[0] * 257)
        led_verde.duty_u16(cor[1] * 257)
        led_azul.duty_u16(cor[2] * 257)
        time.sleep_ms(100)
        
        # Pausa longa
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
        time.sleep_ms(700)

# Exemplo de uso
if __name__ == "__main__":
    # Batimento cardíaco vermelho por 5 segundos
    animar_led_coracao((255, 0, 0), 5)
    
    # Desliga o LED
    led_vermelho.duty_u16(0)
    led_verde.duty_u16(0)
    led_azul.duty_u16(0)
