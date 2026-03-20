# emojis.py
# Padrões de emojis para a matriz 5x5
# Blocos: Rosto Feliz, Coração, etc

# Cada emoji é uma matriz 5x5 onde 1 = LED aceso, 0 = LED apagado
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
    'seta_esquerda': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0]
    ],
    'seta_direita': [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 1, 0],
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

def obter_emoji(nome):
    """
    Retorna o padrão de um emoji.
    
    Args:
        nome: Nome do emoji
        
    Returns:
        list: Matriz 5x5 do emoji ou None se não existir
    """
    return EMOJIS.get(nome)

def listar_emojis():
    """Retorna uma lista com todos os nomes de emojis disponíveis."""
    return list(EMOJIS.keys())

# Exemplo de uso
if __name__ == "__main__":
    print("Emojis disponíveis:")
    for nome in listar_emojis():
        print(f"  - {nome}")
    
    print("\nPadrão do coracao:")
    for linha in obter_emoji('coracao'):
        print(linha)
