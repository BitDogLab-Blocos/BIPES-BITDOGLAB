# display_estado.py
# Mostra estados de LEDs, botões e outros componentes no display
# Blocos: 💡 Mostrar se LED esta ligado, 🎮 Mostrar se botao foi apertado

from machine import Pin, PWM, I2C
from ssd1306 import SSD1306_I2C

# Configuração do display
try:
    i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
    oled = SSD1306_I2C(128, 64, i2c)
    tem_display = True
except:
    tem_display = False

Y_POSITIONS = {1: 8, 2: 18, 3: 28, 4: 38, 5: 48}

def calcular_x(texto, alinhamento):
    """Calcula a posição X baseada no alinhamento."""
    text_width = len(texto) * 8
    if alinhamento == 'LEFT':
        return 3
    elif alinhamento == 'CENTER':
        return max(3, (128 - text_width) // 2)
    else:  # RIGHT
        return max(3, 125 - text_width)

def mostrar_estado_led(led_r, led_g, led_b, cor_nome, linha=1, alinhamento='LEFT'):
    """
    Mostra o estado do LED no display.
    
    Args:
        led_r, led_g, led_b: Valores PWM dos LEDs
        cor_nome: Nome da cor sendo verificada
        linha: 1 a 5
        alinhamento: LEFT, CENTER, RIGHT
    """
    if not tem_display:
        return
    
    ligado = led_r > 0 or led_g > 0 or led_b > 0
    estado = "LIGADO" if ligado else "DESLIGADO"
    texto = f"LED {cor_nome}:{estado}"
    
    y = Y_POSITIONS.get(linha, 8)
    x = calcular_x(texto, alinhamento)
    
    oled.fill_rect(0, y, 128, 8, 0)
    oled.text(texto, x, y, 1)

def mostrar_estado_botao(botao_pin, nome_botao, linha=1, alinhamento='LEFT'):
    """
    Mostra o estado de um botão no display.
    
    Args:
        botao_pin: Objeto Pin do botão
        nome_botao: 'A', 'B' ou 'JOYSTICK'
        linha: 1 a 5
        alinhamento: LEFT, CENTER, RIGHT
    """
    if not tem_display:
        return
    
    apertado = botao_pin.value() == 0
    estado = "APERTADO" if apertado else "SOLTO"
    texto = f"BTN {nome_botao}:{estado}"
    
    y = Y_POSITIONS.get(linha, 8)
    x = calcular_x(texto, alinhamento)
    
    oled.fill_rect(0, y, 128, 8, 0)
    oled.text(texto, x, y, 1)

def mostrar_contador_botao(contador, nome_botao, linha=1, alinhamento='LEFT'):
    """
    Mostra um contador de pressões do botão.
    
    Args:
        contador: Número de vezes que o botão foi pressionado
        nome_botao: 'A', 'B' ou 'JOYSTICK'
        linha: 1 a 5
        alinhamento: LEFT, CENTER, RIGHT
    """
    if not tem_display:
        return
    
    texto = f"{nome_botao}:{contador}"
    
    y = Y_POSITIONS.get(linha, 8)
    x = calcular_x(texto, alinhamento)
    
    oled.fill_rect(0, y, 128, 8, 0)
    oled.text(texto, x, y, 1)

def atualizar():
    """Atualiza o display."""
    if tem_display:
        oled.show()

def limpar():
    """Limpa o display."""
    if tem_display:
        oled.fill(0)

# Exemplo de uso
if __name__ == "__main__":
    if tem_display:
        import time
        
        # LEDs
        led_r = PWM(Pin(11), freq=1000)
        led_g = PWM(Pin(12), freq=1000)
        led_b = PWM(Pin(13), freq=1000)
        
        # Botões
        btn_a = Pin(5, Pin.IN, Pin.PULL_UP)
        
        limpar()
        
        # Liga LED vermelho
        led_r.duty_u16(32768)
        
        mostrar_estado_led(32768, 0, 0, "VM", 1, 'LEFT')
        mostrar_estado_botao(btn_a, "A", 2, 'LEFT')
        atualizar()
        
        time.sleep(2)
        
        # Desliga LED
        led_r.duty_u16(0)
        limpar()
        mostrar_estado_led(0, 0, 0, "VM", 1, 'LEFT')
        atualizar()
