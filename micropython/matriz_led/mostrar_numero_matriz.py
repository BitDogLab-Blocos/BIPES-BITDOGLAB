# mostrar_numero_matriz.py
# Mostra números de 0 a 9 na matriz 5x5
# Bloco: Mostrar número

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

# Padrões de números 0-9 para matriz 5x5
# Cada número é uma matriz 5x5 onde 1 = LED aceso, 0 = LED apagado
NUMEROS = {
    0: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    1: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0]
    ],
    2: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1]
    ],
    3: [
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
    ],
    4: [
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0]
    ],
    5: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
    ],
    6: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    7: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0]
    ],
    8: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    9: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ]
}

def mostrar_numero(numero, cor, brilho=30):
    """
    Mostra um número na matriz 5x5.
    
    Args:
        numero: Número de 0 a 9
        cor: Tupla (R, G, B) com valores de 0 a 255
        brilho: Intensidade de 0 a 100
    """
    if numero not in NUMEROS:
        return
    
    padrao = NUMEROS[numero]
    intensidade = brilho / 100 * 0.5
    
 # Limpa a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    
 # Acende os LEDs conforme o padrão
    for linha in range(5):
        for coluna in range(5):
            if padrao[linha][coluna] == 1:
                led_index = LED_MATRIX[linha][coluna]
                r = int(cor[0] * intensidade)
                g = int(cor[1] * intensidade)
                b = int(cor[2] * intensidade)
                np[led_index] = (r, g, b)
    
    np.write()

# Exemplo de uso
if __name__ == "__main__":
 # Mostra números de 0 a 9
    for n in range(10):
        mostrar_numero(n, (0, 255, 0), 50)
        time.sleep(1)
    
 # Desliga a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()
