# display_mostrar_valor.py
# Mostra valores numéricos no display OLED
# Blocos: 🔢 Mostrar resultado, 📊 Mostrar valor

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C

# Configuração do display OLED
I2C_BUS = 1
I2C_SCL = 15
I2C_SDA = 14
I2C_FREQ = 400000
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 64

# Inicializa I2C e display
try:
    i2c = I2C(I2C_BUS, scl=Pin(I2C_SCL), sda=Pin(I2C_SDA), freq=I2C_FREQ)
    oled = SSD1306_I2C(DISPLAY_WIDTH, DISPLAY_HEIGHT, i2c)
except:
    print("Display OLED não encontrado!")
    oled = None

Y_POSITIONS = {1: 8, 2: 18, 3: 28, 4: 38, 5: 48}

def mostrar_valor(valor, linha=1, alinhamento='LEFT'):
    """
    Mostra um valor numérico no display.
    
    Args:
        valor: Valor a ser exibido (número ou string)
        linha: Linha de 1 a 5
        alinhamento: 'LEFT', 'CENTER' ou 'RIGHT'
    """
    if oled is None:
        return
    
    texto = str(valor)
    y = Y_POSITIONS.get(linha, 8)
    
    # Limpa a área antes de escrever
    if alinhamento == 'LEFT':
        x_clear = 3
    elif alinhamento == 'CENTER':
        x_clear = max(3, (128 - len(texto) * 8) // 2 - 16)
    else:  # RIGHT
        x_clear = max(3, 128 - len(texto) * 8 - 32)
    
    oled.fill_rect(x_clear, y, 128 - x_clear, 8, 0)
    
    # Calcula posição X
    text_width = len(texto) * 8
    if alinhamento == 'LEFT':
        x = 3
    elif alinhamento == 'CENTER':
        x = max(3, (128 - text_width) // 2)
    else:  # RIGHT
        x = max(3, 125 - text_width)
    
    oled.text(texto, x, y, 1)

def limpar_display():
    """Limpa todo o display."""
    if oled:
        oled.fill(0)

def atualizar_display():
    """Atualiza o display."""
    if oled:
        oled.show()

# Exemplo de uso
if __name__ == "__main__":
    if oled:
        import time
        
        limpar_display()
        
        # Contador
        for i in range(100):
            mostrar_valor(f"Contagem: {i}", 3, 'CENTER')
            atualizar_display()
            time.sleep_ms(100)
