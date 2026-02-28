# alternar_led.py
# Alterna entre várias cores no LED RGB
# Bloco: 🔄 Alternar LED

from machine import Pin, PWM
import time

# Configuração dos pinos do LED RGB
LED_RED = 11
LED_GREEN = 12
LED_BLUE = 13

led_vermelho = PWM(Pin(LED_RED), freq=1000)
led_verde = PWM(Pin(LED_GREEN), freq=1000)
led_azul = PWM(Pin(LED_BLUE), freq=1000)

def aplicar_cor(cor):
    """Aplica uma cor ao LED."""
    led_vermelho.duty_u16(cor[0] * 257)
    led_verde.duty_u16(cor[1] * 257)
    led_azul.duty_u16(cor[2] * 257)

def alternar_cores(cores, tempo_cada=500, duracao_total=5):
    """
    Alterna entre várias cores.
    
    Args:
        cores: Lista de tuplas (R, G, B)
        tempo_cada: Tempo em ms para cada cor
        duracao_total: Tempo total em segundos
    """
    import time
    inicio = time.time()
    idx = 0
    
    while time.time() - inicio < duracao_total:
        aplicar_cor(cores[idx % len(cores)])
        idx += 1
        time.sleep_ms(tempo_cada)
    
    # Desliga
    aplicar_cor((0, 0, 0))

def transicao_cores(cor1, cor2, duracao=5):
    """
    Faz uma transição suave entre duas cores.
    
    Args:
        cor1: Cor inicial (R, G, B)
        cor2: Cor final (R, G, B)
        duracao: Tempo em segundos
    """
    inicio = time.time()
    
    while time.time() - inicio < duracao:
        progresso = (time.time() - inicio) / duracao
        
        r = int(cor1[0] * (1 - progresso) + cor2[0] * progresso)
        g = int(cor1[1] * (1 - progresso) + cor2[1] * progresso)
        b = int(cor1[2] * (1 - progresso) + cor2[2] * progresso)
        
        aplicar_cor((r, g, b))
        time.sleep_ms(50)
    
    aplicar_cor(cor2)

def batalha_cores(cor1, cor2, duracao=5):
    """
    Efeito de batalha entre duas cores (alterna aleatoriamente).
    
    Args:
        cor1: Primeira cor
        cor2: Segunda cor
        duracao: Tempo em segundos
    """
    import urandom
    inicio = time.time()
    
    while time.time() - inicio < duracao:
        if urandom.randint(0, 1) == 0:
            aplicar_cor(cor1)
        else:
            aplicar_cor(cor2)
        time.sleep_ms(urandom.randint(100, 300))
    
    aplicar_cor((0, 0, 0))

# Exemplo de uso
if __name__ == "__main__":
    VERMELHO = (255, 0, 0)
    VERDE = (0, 255, 0)
    AZUL = (0, 0, 255)
    AMARELO = (255, 255, 0)
    
    print("Alternando cores...")
    alternar_cores([VERMELHO, VERDE, AZUL, AMARELO], 500, 4)
    
    print("Transicao...")
    transicao_cores(VERMELHO, AZUL, 3)
    
    print("Batalha de cores...")
    batalha_cores(VERMELHO, AZUL, 3)
