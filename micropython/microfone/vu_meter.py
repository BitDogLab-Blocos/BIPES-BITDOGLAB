# vu_meter.py
# Medidor de volume usando o microfone
# Blocos: Medidor de barulho na Matriz, Medidor de barulho no Display

from machine import Pin, ADC
import neopixel
import time

# Configuração do microfone (GPIO28)
MIC_PIN = 28
mic = ADC(Pin(MIC_PIN))
mic.width(ADC.WIDTH_12BIT)
mic.atten(ADC.ATTN_11DB)

# Configuração da matriz de LEDs
NEOPIXEL_PIN = 7
np = neopixel.NeoPixel(Pin(NEOPIXEL_PIN), 25)

# Mapeamento da matriz (coluna 0 = base)
def led_para_nivel(nivel):
    """Converte nível (0-5) para LEDs acesos na coluna 0."""
    leds = []
    for i in range(nivel):
 # Coluna 0, da base para cima
        led_idx = 20 - i * 5  # 20, 15, 10, 5, 0
        leds.append(led_idx)
    return leds

def ler_nivel_som():
    """
    Lê o nível do som do microfone.
    
    Returns:
        int: Nível de 0 (silêncio) a 5 (barulho máximo)
    """
 # Lê múltiplas amostras para suavizar
    soma = 0
    for _ in range(10):
        valor = mic.read()
        soma += valor
        time.sleep_us(100)
    
    media = soma // 10
    
 # Converte para nível 0-5 (ajustar limiares conforme necessário)
 # Valor típico em silêncio: ~2048
 # Valor máximo: ~4095
    diff = abs(media - 2048)
    
    if diff < 50:
        return 0
    elif diff < 200:
        return 1
    elif diff < 400:
        return 2
    elif diff < 600:
        return 3
    elif diff < 800:
        return 4
    else:
        return 5

def ler_intensidade_som():
    """
    Lê a intensidade do som como porcentagem.
    
    Returns:
        int: Intensidade de 0 a 100
    """
    soma = 0
    for _ in range(10):
        valor = mic.read()
        soma += abs(valor - 2048)
        time.sleep_us(100)
    
    media = soma // 10
 # Mapeia 0-2048 para 0-100
    return min(100, (media * 100) // 2048)

def vu_meter_matriz(cor, brilho=30):
    """
    Mostra o nível do som na matriz de LEDs.
    
    Args:
        cor: Tupla (R, G, B)
        brilho: Intensidade de 0 a 100
    """
    nivel = ler_nivel_som()
    intensidade = brilho / 100 * 0.5
    
 # Limpa a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    
 # Acende LEDs conforme o nível
    r = int(cor[0] * intensidade)
    g = int(cor[1] * intensidade)
    b = int(cor[2] * intensidade)
    
    leds = led_para_nivel(nivel)
    for led_idx in leds:
        np[led_idx] = (r, g, b)
    
    np.write()
    return nivel

# Exemplo de uso
if __name__ == "__main__":
    print("VU Meter iniciado. Faça barulho!")
    
    for _ in range(200):
        nivel = vu_meter_matriz((0, 255, 0), 50)
        print(f"Nivel: {nivel}/5")
        time.sleep_ms(50)
    
 # Desliga a matriz
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()
