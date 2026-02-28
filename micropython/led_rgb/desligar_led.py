# desligar_led.py
# Desliga o LED RGB
# Bloco: 🔦 Desligar LED da cor

from machine import Pin, PWM

# Configuração dos pinos do LED RGB
LED_RED = 11   # GPIO11 - Vermelho
LED_GREEN = 12 # GPIO12 - Verde
LED_BLUE = 13  # GPIO13 - Azul

# Inicializa os LEDs com PWM
led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)

def desligar_led(cor=None):
    """
    Desliga o LED RGB ou uma cor específica.
    
    Args:
        cor: Tupla (R, G, B) opcional. Se especificada, desliga apenas as cores presentes.
             Se None, desliga todas as cores.
    """
    if cor is None:
        led_vermelho.duty_u16(0)
        led_verde.duty_u16(0)
        led_azul.duty_u16(0)
    else:
        if cor[0] > 0:
            led_vermelho.duty_u16(0)
        if cor[1] > 0:
            led_verde.duty_u16(0)
        if cor[2] > 0:
            led_azul.duty_u16(0)

def desligar_todos_leds():
    """Desliga todos os LEDs RGB."""
    led_vermelho.duty_u16(0)
    led_verde.duty_u16(0)
    led_azul.duty_u16(0)

# Exemplo de uso
if __name__ == "__main__":
    import time
    
    # Liga o LED na cor vermelha
    led_vermelho.duty_u16(255 * 257)
    time.sleep(1)
    
    # Desliga o LED
    desligar_todos_leds()
