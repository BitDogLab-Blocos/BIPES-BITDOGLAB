# ligar_led_brilho.py
# Liga o LED RGB com intensidade de brilho
# Bloco: 🔆 Ligar LED da cor com brilho de X%

from machine import Pin, PWM

# Configuração dos pinos do LED RGB
LED_RED = 11   # GPIO11 - Vermelho
LED_GREEN = 12 # GPIO12 - Verde
LED_BLUE = 13  # GPIO13 - Azul

# Inicializa os LEDs com PWM
led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)

def ligar_led_brilho(cor, intensidade):
    """
    Liga o LED RGB com a cor e intensidade especificadas.
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        intensidade: Valor de 0 a 100 (percentual)
    """
    led_vermelho.duty_u16(int(cor[0] * 257 * intensidade / 100))
    led_verde.duty_u16(int(cor[1] * 257 * intensidade / 100))
    led_azul.duty_u16(int(cor[2] * 257 * intensidade / 100))

# Exemplo de uso
if __name__ == "__main__":
    import time
    
    # Liga o LED na cor vermelha com 50% de brilho
    ligar_led_brilho((255, 0, 0), 50)
    time.sleep(2)
    
    # Liga o LED na cor azul com 100% de brilho
    ligar_led_brilho((0, 0, 255), 100)
    time.sleep(2)
    
    # Desliga o LED
    ligar_led_brilho((0, 0, 0), 0)
