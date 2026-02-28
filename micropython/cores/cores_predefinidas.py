# cores_predefinidas.py
# Cores predefinidas para uso nos LEDs
# Blocos: 🔴 Vermelho, 🟢 Verde, 🔵 Azul, etc

# Cores básicas (RGB)
VERMELHO = (255, 0, 0)
VERDE = (0, 255, 0)
AZUL = (0, 0, 255)
AMARELO = (255, 255, 0)
CIANO = (0, 255, 255)
MAGENTA = (255, 0, 255)
BRANCO = (255, 255, 255)
PRETO = (0, 0, 0)

# Cores adicionais
LARANJA = (255, 128, 0)
ROSA = (255, 64, 128)
VERDE_LIMAO = (128, 255, 0)
AZUL_CELESTE = (64, 196, 255)
TURQUESA = (64, 224, 208)

def misturar_cores(*cores):
    """
    Mistura várias cores retornando a média.
    
    Args:
        *cores: Tuplas (R, G, B) para misturar
        
    Returns:
        tuple: Cor resultante (R, G, B)
    """
    if not cores:
        return (0, 0, 0)
    
    r = sum(c[0] for c in cores) // len(cores)
    g = sum(c[1] for c in cores) // len(cores)
    b = sum(c[2] for c in cores) // len(cores)
    
    return (r, g, b)

# Exemplo de uso
if __name__ == "__main__":
    # Mistura vermelho e azul
    roxo = misturar_cores(VERMELHO, AZUL)
    print(f"Roxo: {roxo}")
    
    # Lista todas as cores
    cores = {
        'Vermelho': VERMELHO,
        'Verde': VERDE,
        'Azul': AZUL,
        'Amarelo': AMARELO,
        'Ciano': CIANO,
        'Magenta': MAGENTA,
        'Branco': BRANCO,
        'Laranja': LARANJA,
        'Rosa': ROSA,
    }
    
    for nome, cor in cores.items():
        print(f"{nome}: RGB{cor}")
