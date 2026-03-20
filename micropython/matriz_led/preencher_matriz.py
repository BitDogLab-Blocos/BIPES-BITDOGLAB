# preencher_matriz.py
# Preenche toda a matriz 5x5 de LEDs com uma cor
# Bloco: Ligar matriz de LED da cor

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

def preencher_matriz(cor, intensidade=30, brilho_global=0.5):
    """
    Preenche toda a matriz 5x5 com a cor especificada.
    
    Args:
        cor: Tupla (R, G, B) com valores de 0 a 255
        intensidade: Intensidade de 0 a 100 (percentual)
        brilho_global: Fator de brilho global (0.0 a 1.0)
    """
    r = int(cor[0] * intensidade / 100 * brilho_global)
    g = int(cor[1] * intensidade / 100 * brilho_global)
    b = int(cor[2] * intensidade / 100 * brilho_global)
    
    for i in range(25):
        np[i] = (r, g, b)
    
    np.write()

def desligar_matriz():
    """Desliga todos os LEDs da matriz."""
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()

# Exemplo de uso
if __name__ == "__main__":
 # Preenche a matriz com vermelho a 50% de intensidade
    preencher_matriz((255, 0, 0), 50)
    time.sleep(2)
    
 # Preenche a matriz com azul a 30% de intensidade
    preencher_matriz((0, 0, 255), 30)
    time.sleep(2)
    
 # Desliga a matriz
    desligar_matriz()
