# display_texto.py
# Escreve texto no display OLED SSD1306
# Bloco: ✏️ Escrever texto

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Configuração do display OLED
I2C_BUS = 1
I2C_SCL = 3
I2C_SDA = 2
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

# Posições Y para as 5 linhas (cada caractere tem 8 pixels de altura)
Y_POSITIONS = {
    1: 8,
    2: 18,
    3: 28,
    4: 38,
    5: 48
}

def escrever_texto(texto, linha=1, alinhamento='LEFT'):
    """
    Escreve texto no display OLED.
    
    Args:
        texto: String a ser exibida
        linha: Linha de 1 a 5
        alinhamento: 'LEFT', 'CENTER' ou 'RIGHT'
    """
    if oled is None:
        return
    
    y = Y_POSITIONS.get(linha, 8)
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
    """Atualiza o display (mostra o buffer)."""
    if oled:
        oled.show()

def desenhar_borda():
    """Desenha uma borda ao redor do display."""
    if oled:
        oled.rect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 1)

# Exemplo de uso
if __name__ == "__main__":
    if oled:
        limpar_display()
        desenhar_borda()
        escrever_texto("Ola, Mundo!", 1, 'CENTER')
        escrever_texto("BitDogLab", 3, 'CENTER')
        escrever_texto("Python", 5, 'CENTER')
        atualizar_display()
