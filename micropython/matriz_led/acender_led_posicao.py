# acender_led_posicao.py
# Acende um LED específico na matriz 5x5
# Bloco: 🔲 Ligar LED na linha X coluna Y

from machine import Pin
import neopixel
import time

# Configuração do NeoPixel (matriz 5x5)
NEOPIXEL_PIN = 7
NUM_LEDS = 25

# Inicializa a matriz de LEDs
np = neopixel.NeoPixel(Pin(NEOPIXEL_PIN), NUM_LEDS)

# Matriz de mapeamento (linha, coluna) -> índice do LED
LED_MATRIX = [
    [24, 23, 22, 21, 20],
    [15, 16, 17, 18, 19],
    [14, 13, 12, 11, 10],
    [5, 6, 7, 8, 9],
    [4, 3, 2, 1, 0]
]

def acender_led_posicao(linha, coluna, cor, intensidade=30, brilho_global=0.5, limpar=True):
    """
    Acende um LED específico na matriz 5x5.
    
    Args:
        linha: Linha do LED (0 a 4)
        coluna: Coluna do LED (0 a 4)
        cor: Tupla (R, G, B) com valores de 0 a 255
        intensidade: Intensidade de 0 a 100 (percentual)
        brilho_global: Fator de brilho global (0.0 a 1.0)
        limpar: Se True, limpa a matriz antes de acender
    """
    if limpar:
        for i in range(25):
            np[i] = (0, 0, 0)
    
    if 0 <= linha <= 4 and 0 <= coluna <= 4:
        led_index = LED_MATRIX[4 - linha][coluna]
        r = int(cor[0] * intensidade / 100 * brilho_global)
        g = int(cor[1] * intensidade / 100 * brilho_global)
        b = int(cor[2] * intensidade / 100 * brilho_global)
        np[led_index] = (r, g, b)
    
    np.write()

def acender_linha(linha, cor, intensidade=30, brilho_global=0.5):
    """
    Acende uma linha completa na matriz.
    
    Args:
        linha: Linha a acender (0 a 4)
        cor: Tupla (R, G, B)
        intensidade: Intensidade de 0 a 100
        brilho_global: Fator de brilho global
    """
    for i in range(25):
        np[i] = (0, 0, 0)
    
    if 0 <= linha <= 4:
        for x in range(5):
            led_index = LED_MATRIX[4 - linha][x]
            r = int(cor[0] * intensidade / 100 * brilho_global)
            g = int(cor[1] * intensidade / 100 * brilho_global)
            b = int(cor[2] * intensidade / 100 * brilho_global)
            np[led_index] = (r, g, b)
    
    np.write()

def acender_coluna(coluna, cor, intensidade=30, brilho_global=0.5):
    """
    Acende uma coluna completa na matriz.
    
    Args:
        coluna: Coluna a acender (0 a 4)
        cor: Tupla (R, G, B)
        intensidade: Intensidade de 0 a 100
        brilho_global: Fator de brilho global
    """
    for i in range(25):
        np[i] = (0, 0, 0)
    
    if 0 <= coluna <= 4:
        for y in range(5):
            led_index = LED_MATRIX[y][coluna]
            r = int(cor[0] * intensidade / 100 * brilho_global)
            g = int(cor[1] * intensidade / 100 * brilho_global)
            b = int(cor[2] * intensidade / 100 * brilho_global)
            np[led_index] = (r, g, b)
    
    np.write()

# Exemplo de uso
if __name__ == "__main__":
    # Acende o LED na posição (2, 2) - centro
    acender_led_posicao(2, 2, (255, 0, 0), 50)
    time.sleep(1)
    
    # Acende a linha 0
    acender_linha(0, (0, 255, 0), 50)
    time.sleep(1)
    
    # Acende a coluna 3
    acender_coluna(3, (0, 0, 255), 50)
    time.sleep(1)
    
    # Desliga a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()
