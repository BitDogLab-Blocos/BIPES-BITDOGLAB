# animacoes.py
# Animações para a matriz 5x5 de LEDs
# Blocos: ⚡ Piscar Rápido, 🐌 Piscar Devagar, ✨ Aparecer e Sumir, etc

from machine import Pin
import neopixel
import time

# Configuração do NeoPixel
NEOPIXEL_PIN = 7
np = neopixel.NeoPixel(Pin(NEOPIXEL_PIN), 25)

# Mapeamento da matriz
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

def piscar_rapido(padrao_func, cor, brilho=30, duracao=5):
    """
    Faz um padrão piscar rapidamente (200ms ligado, 200ms desligado).
    
    Args:
        padrao_func: Função que desenha o padrão
        cor: Tupla (R, G, B)
        brilho: Intensidade 0-100
        duracao: Tempo total em segundos
    """
    inicio = time.time()
    while time.time() - inicio < duracao:
        padrao_func(cor, brilho)
        time.sleep_ms(200)
        limpar_matriz()
        time.sleep_ms(200)

def piscar_lento(padrao_func, cor, brilho=30, duracao=5):
    """
    Faz um padrão piscar lentamente (1s ligado, 1s desligado).
    
    Args:
        padrao_func: Função que desenha o padrão
        cor: Tupla (R, G, B)
        brilho: Intensidade 0-100
        duracao: Tempo total em segundos
    """
    inicio = time.time()
    while time.time() - inicio < duracao:
        padrao_func(cor, brilho)
        time.sleep(1)
        limpar_matriz()
        time.sleep(1)

def aparecer_sumir(padrao_func, cor, brilho=30, duracao=5):
    """
    Efeito de fade in/out.
    
    Args:
        padrao_func: Função que desenha o padrão
        cor: Tupla (R, G, B)
        brilho: Intensidade máxima 0-100
        duracao: Tempo total em segundos
    """
    inicio = time.time()
    while time.time() - inicio < duracao:
        # Aumenta brilho
        for i in range(11):
            intensidade = int(brilho * i / 10)
            padrao_func(cor, intensidade)
            time.sleep_ms(50)
        
        # Diminui brilho
        for i in range(10, -1, -1):
            intensidade = int(brilho * i / 10)
            padrao_func(cor, intensidade)
            time.sleep_ms(50)
        
        time.sleep_ms(200)

def pulsar_brilho(padrao_func, cor, brilho=30, duracao=5):
    """
    Efeito de pulsação suave.
    
    Args:
        padrao_func: Função que desenha o padrão
        cor: Tupla (R, G, B)
        brilho: Intensidade máxima 0-100
        duracao: Tempo total em segundos
    """
    import math
    inicio = time.time()
    
    while time.time() - inicio < duracao:
        t = time.ticks_ms()
        # Onda senoidal para brilho
        intensidade = int(brilho * (0.5 + 0.5 * math.sin(t / 500)))
        padrao_func(cor, intensidade)
        time.sleep_ms(50)
    
    limpar_matriz()

def deslizar_esquerda(padrao, cor, brilho=30):
    """
    Desliza um padrão da direita para a esquerda.
    
    Args:
        padrao: Matriz 5x5 com o padrão
        cor: Tupla (R, G, B)
        brilho: Intensidade 0-100
    """
    intensidade = brilho / 100 * 0.5
    r, g, b = int(cor[0] * intensidade), int(cor[1] * intensidade), int(cor[2] * intensidade)
    
    for offset in range(6):
        limpar_matriz()
        
        for linha in range(5):
            for coluna in range(5):
                orig_col = coluna + offset
                if 0 <= orig_col < 5 and padrao[linha][orig_col] == 1:
                    led_idx = LED_MATRIX[linha][coluna]
                    np[led_idx] = (r, g, b)
        
        np.write()
        time.sleep_ms(150)
    
    limpar_matriz()

def deslizar_direita(padrao, cor, brilho=30):
    """Desliza um padrão da esquerda para a direita."""
    intensidade = brilho / 100 * 0.5
    r, g, b = int(cor[0] * intensidade), int(cor[1] * intensidade), int(cor[2] * intensidade)
    
    for offset in range(6):
        limpar_matriz()
        
        for linha in range(5):
            for coluna in range(5):
                orig_col = coluna - offset
                if 0 <= orig_col < 5 and padrao[linha][orig_col] == 1:
                    led_idx = LED_MATRIX[linha][coluna]
                    np[led_idx] = (r, g, b)
        
        np.write()
        time.sleep_ms(150)
    
    limpar_matriz()

# Exemplo de uso
if __name__ == "__main__":
    # Teste com padrão de coração
    coracao = [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ]
    
    def desenhar_padrao(cor, brilho):
        intensidade = brilho / 100 * 0.5
        r, g, b = int(cor[0] * intensidade), int(cor[1] * intensidade), int(cor[2] * intensidade)
        
        for linha in range(5):
            for coluna in range(5):
                if coracao[linha][coluna] == 1:
                    led_idx = LED_MATRIX[linha][coluna]
                    np[led_idx] = (r, g, b)
        np.write()
    
    print("Teste: pulsar_brilho")
    pulsar_brilho(desenhar_padrao, (255, 0, 0), 50, 3)
