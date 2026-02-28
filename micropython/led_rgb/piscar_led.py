# piscar_led.py
# Faz o LED piscar rapidamente
# Bloco: ⚡ Piscar LED da cor rapidamente

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

def piscar_led(cor, duracao_total=5):
    """
    Faz o LED piscar rapidamente (200ms ligado, 200ms desligado).
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        duracao_total: Tempo total em segundos (padrão: 5)
    """
    tempo_inicio = time.time()
    
    while time.time() - tempo_inicio < duracao_total:
        # Liga o LED
        led_vermelho.duty_u16(cor[0] * 257)
        led_verde.duty_u16(cor[1] * 257)
        led_azul.duty_u16(cor[2] * 257)
        time.sleep_ms(200)
        
        # Desliga o LED
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
        time.sleep_ms(200)

def piscar_led_lento(cor, duracao_total=5):
    """
    Faz o LED piscar lentamente (1s ligado, 1s desligado).
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        duracao_total: Tempo total em segundos (padrão: 5)
    """
    tempo_inicio = time.time()
    
    while time.time() - tempo_inicio < duracao_total:
        # Liga o LED
        led_vermelho.duty_u16(cor[0] * 257)
        led_verde.duty_u16(cor[1] * 257)
        led_azul.duty_u16(cor[2] * 257)
        time.sleep(1)
        
        # Desliga o LED
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
        time.sleep(1)

# Exemplo de uso
if __name__ == "__main__":
    # Pisca o LED vermelho rapidamente por 3 segundos
    piscar_led((255, 0, 0), 3)
