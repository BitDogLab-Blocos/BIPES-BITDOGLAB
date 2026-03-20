# animar_led_brilhar.py
# Efeito de brilhar e desaparecer no LED
# Bloco: Animar LED da cor brilhar e desaparecer

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

def animar_led_brilhar(cor, duracao_total=5):
    """
    Efeito de aparecimento e desaparecimento gradual.
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        duracao_total: Tempo total em segundos (padrão: 5)
    """
    tempo_inicio = time.time()
    
    while time.time() - tempo_inicio < duracao_total:
 # Aumenta o brilho gradualmente
        for i in range(11):
            led_vermelho.duty_u16(int(cor[0] * 257 * i / 10))
            led_verde.duty_u16(int(cor[1] * 257 * i / 10))
            led_azul.duty_u16(int(cor[2] * 257 * i / 10))
            time.sleep_ms(50)
        
 # Diminui o brilho gradualmente
        for i in range(10, -1, -1):
            led_vermelho.duty_u16(int(cor[0] * 257 * i / 10))
            led_verde.duty_u16(int(cor[1] * 257 * i / 10))
            led_azul.duty_u16(int(cor[2] * 257 * i / 10))
            time.sleep_ms(50)
        
        time.sleep_ms(200)

# Exemplo de uso
if __name__ == "__main__":
 # Efeito de brilho azul por 5 segundos
    animar_led_brilhar((0, 0, 255), 5)
    
 # Desliga o LED
    led_vermelho.duty_u16(0)
    led_verde.duty_u16(0)
    led_azul.duty_u16(0)
