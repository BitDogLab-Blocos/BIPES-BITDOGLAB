# criar_melodia.py
# Cria melodias personalizadas
# Bloco: 🎼 Criar Melodia

from machine import Pin, PWM
import time

# Configuração do buzzer
BUZZER_PIN = 21
buzzer = PWM(Pin(BUZZER_PIN))

# Frequências das notas
NOTAS = {
    'DO': 262, 'RE': 294, 'MI': 330, 'FA': 349, 
    'SOL': 392, 'LA': 440, 'SI': 494,
    'DO5': 523, 'RE5': 587, 'MI5': 659, 'FA5': 698,
    'SOL5': 784, 'LA5': 880, 'SI5': 988,
    'PAUSA': 0
}

def tocar_nota(nome_nota, duracao_ms, volume=50):
    """
    Toca uma nota.
    
    Args:
        nome_nota: Nome da nota ('DO', 'RE', etc)
        duracao_ms: Duração em milissegundos
        volume: Volume 0-100
    """
    freq = NOTAS.get(nome_nota, 0)
    
    if freq == 0:
        buzzer.duty_u16(0)
        time.sleep_ms(duracao_ms)
        return
    
    duty = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(0)
    buzzer.freq(freq)
    buzzer.duty_u16(duty)
    time.sleep_ms(duracao_ms)
    buzzer.duty_u16(0)

def criar_melodia(notas, tempo_entre=50, volume=50):
    """
    Toca uma sequência de notas.
    
    Args:
        notas: Lista de tuplas (nota, duracao_ms)
        tempo_entre: Pausa entre notas em ms
        volume: Volume 0-100
    """
    for nota, duracao in notas:
        tocar_nota(nota, duracao, volume)
        if tempo_entre > 0:
            time.sleep_ms(tempo_entre)
    
    buzzer.duty_u16(0)

def criar_trilha_sonora(sons, volume=50):
    """
    Cria uma trilha sonora com sons e pausas.
    
    Args:
        sons: Lista de dicionários {'tipo': 'nota'|'pausa', ...}
        volume: Volume 0-100
    """
    for som in sons:
        if som['tipo'] == 'nota':
            tocar_nota(som['nota'], som['duracao'], volume)
        else:  # pausa
            buzzer.duty_u16(0)
            time.sleep_ms(som['duracao'])
    
    buzzer.duty_u16(0)

# Melodias de exemplo
PARABENS = [
    ('SOL', 200), ('SOL', 200), ('LA', 400), ('SOL', 400), ('DO5', 400), ('SI', 800),
    ('SOL', 200), ('SOL', 200), ('LA', 400), ('SOL', 400), ('RE5', 400), ('DO5', 800),
    ('SOL', 200), ('SOL', 200), ('SOL5', 400), ('MI5', 400), ('DO5', 400), ('SI', 400), ('LA', 600),
    ('FA5', 200), ('FA5', 200), ('MI5', 400), ('DO5', 400), ('RE5', 400), ('DO5', 800),
]

PIRATA = [
    ('MI5', 200), ('MI5', 200), ('MI5', 200), ('RE5', 100), ('SOL5', 400),
    ('MI5', 200), ('RE5', 100), ('SOL5', 400), ('MI5', 200), ('RE5', 100), ('LA5', 400),
]

# Exemplo de uso
if __name__ == "__main__":
    print("Tocando Parabens...")
    criar_melodia(PARABENS, 50, 50)
    time.sleep_ms(500)
    
    print("Tocando tema pirata...")
    criar_melodia(PIRATA, 50, 50)
    
    buzzer.duty_u16(0)
    print("Fim!")
