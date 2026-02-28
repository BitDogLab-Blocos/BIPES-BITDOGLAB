# notas.py
# Definições das notas musicais
# Blocos: 🎵 Dó, 👑 Ré, 🐱 Mi, etc

# Frequências das notas em Hz (oitava 4)
NOTAS = {
    'DO': 262,    # C4
    'RE': 294,    # D4
    'MI': 330,    # E4
    'FA': 349,    # F4
    'SOL': 392,   # G4
    'LA': 440,    # A4
    'SI': 494,    # B4
}

# Frequências por oitava
def nota_frequencia(nota, oitava=4):
    """
    Retorna a frequência de uma nota em uma oitava específica.
    
    Args:
        nota: Nome da nota ('DO', 'RE', 'MI', etc)
        oitava: Número da oitava (4, 5 ou 6)
        
    Returns:
        int: Frequência em Hz
    """
    freq_base = NOTAS.get(nota.upper(), 262)
    
    # Multiplica ou divide por 2 para mudar de oitava
    if oitava == 4:
        return freq_base
    elif oitava == 5:
        return freq_base * 2
    elif oitava == 6:
        return freq_base * 4
    elif oitava == 3:
        return freq_base // 2
    else:
        return freq_base

# Constantes para facilitar
DO = 'DO'
RE = 'RE'
MI = 'MI'
FA = 'FA'
SOL = 'SOL'
LA = 'LA'
SI = 'SI'

# Exemplo de uso
if __name__ == "__main__":
    print("Notas e suas frequencias:")
    for nota, freq in NOTAS.items():
        print(f"{nota}: {freq}Hz (oitava 4)")
        print(f"  Oitava 5: {freq * 2}Hz")
        print(f"  Oitava 6: {freq * 4}Hz")
