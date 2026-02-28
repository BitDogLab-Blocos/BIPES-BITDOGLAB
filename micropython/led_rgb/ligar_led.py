# ligar_led.py
# Liga o LED RGB na cor especificada
# Bloco: 💡 Ligar LED da cor

from machine import Pin, PWM

# Configuração dos pinos do LED RGB
LED_RED = 11   # GPIO11 - Vermelho
LED_GREEN = 12 # GPIO12 - Verde
LED_BLUE = 13  # GPIO13 - Azul

# Inicializa os LEDs com PWM
led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)

def ligar_led(cor):
    """
    Liga o LED RGB com a cor especificada.
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
             Exemplos: (255, 0, 0) = Vermelho
                       (0, 255, 0) = Verde
                       (0, 0, 255) = Azul
                       (255, 255, 0) = Amarelo
    """
    led_vermelho.duty_u16(cor[0] * 257)
    led_verde.duty_u16(cor[1] * 257)
    led_azul.duty_u16(cor[2] * 257)

# Exemplo de uso
if __name__ == "__main__":
    import time
    
    # Liga o LED na cor vermelha
    ligar_led((255, 0, 0))
    time.sleep(1)
    
    # Liga o LED na cor verde
    ligar_led((0, 255, 0))
    time.sleep(1)
    
    # Liga o LED na cor azul
    ligar_led((0, 0, 255))
    time.sleep(1)
    
    # Desliga o LED
    ligar_led((0, 0, 0))
