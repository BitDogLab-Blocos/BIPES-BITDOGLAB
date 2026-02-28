# criar_desenho.py
# Cria desenhos customizados na matriz 5x5
# Bloco: 🎨 Criar Desenho na Matriz

from machine import Pin
import neopixel
import time

# Configuração do NeoPixel
NEOPIXEL_PIN = 7
np = neopixel.NeoPixel(Pin(NEOPIXEL_PIN), 25)

# Mapeamento da matriz (linha, coluna) -> índice
LED_MATRIX = [
    [24, 23, 22, 21, 20],
    [15, 16, 17, 18, 19],
    [14, 13, 12, 11, 10],
    [5, 6, 7, 8, 9],
    [4, 3, 2, 1, 0]
]

def limpar_matriz():
    """Desliga todos os LEDs."""
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()

def desenhar_pixel(linha, coluna, cor, intensidade=30):
    """
    Acende um pixel específico.
    
    Args:
        linha: 0 a 4
        coluna: 0 a 4
        cor: (R, G, B)
        intensidade: 0 a 100
    """
    if 0 <= linha <= 4 and 0 <= coluna <= 4:
        led_idx = LED_MATRIX[4 - linha][coluna]
        r = int(cor[0] * intensidade / 100 * 0.5)
        g = int(cor[1] * intensidade / 100 * 0.5)
        b = int(cor[2] * intensidade / 100 * 0.5)
        np[led_idx] = (r, g, b)

def desenhar_linha_horizontal(linha, cor, intensidade=30):
    """Desenha uma linha horizontal."""
    for coluna in range(5):
        desenhar_pixel(linha, coluna, cor, intensidade)

def desenhar_linha_vertical(coluna, cor, intensidade=30):
    """Desenha uma linha vertical."""
    for linha in range(5):
        desenhar_pixel(linha, coluna, cor, intensidade)

def desenhar_retangulo(cor, intensidade=30):
    """Desenha um retângulo na borda."""
    for i in range(5):
        desenhar_pixel(0, i, cor, intensidade)  # Topo
        desenhar_pixel(4, i, cor, intensidade)  # Base
        desenhar_pixel(i, 0, cor, intensidade)  # Esquerda
        desenhar_pixel(i, 4, cor, intensidade)  # Direita
    np.write()

def desenhar_x(cor, intensidade=30):
    """Desenha um X."""
    for i in range(5):
        desenhar_pixel(i, i, cor, intensidade)
        desenhar_pixel(i, 4-i, cor, intensidade)
    np.write()

def desenhar_cruz(cor, intensidade=30):
    """Desenha uma cruz no centro."""
    desenhar_linha_horizontal(2, cor, intensidade)
    desenhar_linha_vertical(2, cor, intensidade)
    np.write()

def desenhar_padrao(matriz_5x5, cor, intensidade=30):
    """
    Desenha um padrão customizado.
    
    Args:
        matriz_5x5: Lista de 5 listas com 0s e 1s
        cor: (R, G, B)
        intensidade: 0 a 100
    """
    for linha in range(5):
        for coluna in range(5):
            if matriz_5x5[linha][coluna] == 1:
                desenhar_pixel(linha, coluna, cor, intensidade)
    np.write()

# Exemplos de desenhos
DESENHOS = {
    'casa': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0]
    ],
    'estrela': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
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
    ]
}

# Exemplo de uso
if __name__ == "__main__":
    limpar_matriz()
    
    # Desenha uma casa
    print("Desenhando casa...")
    desenhar_padrao(DESENHOS['casa'], (255, 165, 0), 50)
    time.sleep(2)
    
    # Desenha uma estrela
    print("Desenhando estrela...")
    limpar_matriz()
    desenhar_padrao(DESENHOS['estrela'], (255, 255, 0), 50)
    time.sleep(2)
    
    # Desenha um X
    print("Desenhando X...")
    limpar_matriz()
    desenhar_x((255, 0, 0), 50)
    time.sleep(2)
    
    limpar_matriz()
    print("Fim!")
