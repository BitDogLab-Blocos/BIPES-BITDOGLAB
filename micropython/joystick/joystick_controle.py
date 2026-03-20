# joystick_controle.py
# Controla LEDs e buzzer com o joystick
# Blocos: Joystick controla LED, Joystick controla Buzzer

from machine import Pin, PWM, ADC
import time

# Pinos do Joystick
JOYSTICK_X_PIN = 27  # GPIO27 - Eixo X
JOYSTICK_Y_PIN = 26  # GPIO26 - Eixo Y
JOYSTICK_SW_PIN = 22 # GPIO22 - Botão

# Pinos de saída
LED_RED = 11
LED_GREEN = 12
LED_BLUE = 13
BUZZER_PIN = 21

# Inicializa ADCs do joystick
adc_x = ADC(Pin(JOYSTICK_X_PIN))
adc_y = ADC(Pin(JOYSTICK_Y_PIN))
adc_x.width(ADC.WIDTH_12BIT)
adc_y.width(ADC.WIDTH_12BIT)
adc_x.atten(ADC.ATTN_11DB)
adc_y.atten(ADC.ATTN_11DB)

# Inicializa LEDs e buzzer
led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)
buzzer = PWM(Pin(BUZZER_PIN))

def ler_joystick():
    """
    Lê os valores do joystick.
    
    Returns:
        tuple: (x, y, pressionado) onde x e y estão entre 0 e 4095
               e pressionado é True/False
    """
    x = adc_x.read()
    y = adc_y.read()
    sw = Pin(JOYSTICK_SW_PIN, Pin.IN, Pin.PULL_UP).value() == 0
    return x, y, sw

def controlar_led_joystick(cor, intensidade_inicial=50, 
                           dir_aumentar='UP', dir_diminuir='DOWN'):
    """
    Controla o brilho do LED com o joystick.
    
    Args:
        cor: Tupla (R, G, B)
        intensidade_inicial: Brilho inicial (0-100)
        dir_aumentar: Direção para aumentar ('UP', 'DOWN', 'LEFT', 'RIGHT')
        dir_diminuir: Direção para diminuir ('UP', 'DOWN', 'LEFT', 'RIGHT')
    """
    intensidade = intensidade_inicial
    
    x, y, _ = ler_joystick()
    
 # Centro está em aproximadamente 2048
 # Movimento detectado se valor < 1000 ou > 3000
    
    if dir_aumentar == 'UP' and y < 1000:
        intensidade = min(100, intensidade + 5)
    elif dir_aumentar == 'DOWN' and y > 3000:
        intensidade = min(100, intensidade + 5)
    elif dir_aumentar == 'LEFT' and x < 1000:
        intensidade = min(100, intensidade + 5)
    elif dir_aumentar == 'RIGHT' and x > 3000:
        intensidade = min(100, intensidade + 5)
    
    if dir_diminuir == 'UP' and y < 1000:
        intensidade = max(0, intensidade - 5)
    elif dir_diminuir == 'DOWN' and y > 3000:
        intensidade = max(0, intensidade - 5)
    elif dir_diminuir == 'LEFT' and x < 1000:
        intensidade = max(0, intensidade - 5)
    elif dir_diminuir == 'RIGHT' and x > 3000:
        intensidade = max(0, intensidade - 5)
    
 # Aplica a cor com a intensidade
    led_vermelho.duty_u16(int(cor[0] * 257 * intensidade / 100))
    led_verde.duty_u16(int(cor[1] * 257 * intensidade / 100))
    led_azul.duty_u16(int(cor[2] * 257 * intensidade / 100))
    
    return intensidade

def controlar_buzzer_joystick(freq_inicial=1000, volume=30,
                              dir_aumentar='UP', dir_diminuir='DOWN'):
    """
    Controla a frequência do buzzer com o joystick.
    
    Args:
        freq_inicial: Frequência inicial (200-4000 Hz)
        volume: Volume (0-100)
        dir_aumentar: Direção para aumentar frequência
        dir_diminuir: Direção para diminuir frequência
    """
    frequencia = freq_inicial
    duty_cycle = int(65535 * volume * 0.7 / 100)
    
    x, y, _ = ler_joystick()
    
    if dir_aumentar == 'UP' and y < 1000:
        frequencia = min(4000, frequencia + 100)
    elif dir_aumentar == 'DOWN' and y > 3000:
        frequencia = min(4000, frequencia + 100)
    elif dir_aumentar == 'LEFT' and x < 1000:
        frequencia = min(4000, frequencia + 100)
    elif dir_aumentar == 'RIGHT' and x > 3000:
        frequencia = min(4000, frequencia + 100)
    
    if dir_diminuir == 'UP' and y < 1000:
        frequencia = max(200, frequencia - 100)
    elif dir_diminuir == 'DOWN' and y > 3000:
        frequencia = max(200, frequencia - 100)
    elif dir_diminuir == 'LEFT' and x < 1000:
        frequencia = max(200, frequencia - 100)
    elif dir_diminuir == 'RIGHT' and x > 3000:
        frequencia = max(200, frequencia - 100)
    
    buzzer.freq(frequencia)
    buzzer.duty_u16(duty_cycle)
    
    return frequencia

# Exemplo de uso
if __name__ == "__main__":
    print("Mova o joystick para cima/baixo para controlar o LED verde")
    
    for _ in range(100):
        intensidade = controlar_led_joystick((0, 255, 0), 50, 'UP', 'DOWN')
        print(f"Intensidade: {intensidade}%")
        time.sleep_ms(100)
    
 # Desliga o LED
    led_vermelho.duty_u16(0)
    led_verde.duty_u16(0)
    led_azul.duty_u16(0)
    buzzer.duty_u16(0)
