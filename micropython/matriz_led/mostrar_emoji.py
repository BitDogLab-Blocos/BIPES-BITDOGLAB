# mostrar_emoji.py
# Mostra emojis na matriz 5x5
# Bloco: 😊 Mostrar emoji

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

# Padrões de emojis para matriz 5x5
EMOJIS = {
    'feliz': [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    'triste': [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1]
    ],
    'surpreso': [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0]
    ],
    'coracao': [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ],
    'seta_cima': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
    ],
    'seta_baixo': [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ],
    'sol': [
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1]
    ],
    'chuva': [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 1, 0, 0]
    ],
    'flor': [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0]
    ],
    'fantasma': [
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1]
    ],
    'arvore_natal': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ],
    'floco_neve': [
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1]
    ],
    'presente': [
        [0, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0]
    ],
    'sino': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0]
    ]
}

def mostrar_emoji(emoji_nome, cor, brilho=30):
    """
    Mostra um emoji na matriz 5x5.
    
    Args:
        emoji_nome: Nome do emoji ('feliz', 'triste', 'coracao', etc)
        cor: Tupla (R, G, B) com valores de 0 a 255
        brilho: Intensidade de 0 a 100
    """
    if emoji_nome not in EMOJIS:
        return
    
    padrao = EMOJIS[emoji_nome]
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
    emojis_para_testar = ['feliz', 'coracao', 'sol', 'flor', 'fantasma']
    
    for emoji in emojis_para_testar:
        mostrar_emoji(emoji, (255, 255, 0), 50)
        time.sleep(1)
    
    # Desliga a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()
