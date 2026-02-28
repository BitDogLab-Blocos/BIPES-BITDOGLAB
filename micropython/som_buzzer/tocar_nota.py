# tocar_nota.py
# Toca uma nota musical no buzzer
# Bloco: 🎵 Tocar nota

from machine import Pin, PWM
import time

# Configuração do buzzer
BUZZER_PIN = 21

# Frequências das notas (Hz)
NOTAS = {
    'C4': 262, 'D4': 294, 'E4': 330, 'F4': 349, 'G4': 392, 'A4': 440, 'B4': 494,
    'C5': 523, 'D5': 587, 'E5': 659, 'F5': 698, 'G5': 784, 'A5': 880, 'B5': 988,
    'C6': 1047, 'D6': 1175, 'E6': 1319, 'F6': 1397, 'G6': 1568, 'A6': 1760, 'B6': 1976
}

# Inicializa o buzzer
buzzer = PWM(Pin(BUZZER_PIN))

def tocar_nota(nota, oitava=4, volume=50, duracao=500):
    """
    Toca uma nota musical no buzzer.
    
    Args:
        nota: Nome da nota ('C', 'D', 'E', 'F', 'G', 'A', 'B')
        oitava: Oitava (4, 5 ou 6)
        volume: Volume de 0 a 100
        duracao: Duração em milissegundos
    """
    nota_key = nota + str(oitava)
    
    if nota_key not in NOTAS:
        return
    
    frequencia = NOTAS[nota_key]
    duty_cycle = int(65535 * volume * 0.7 / 100)
    
    buzzer.duty_u16(0)
    buzzer.freq(frequencia)
    buzzer.duty_u16(duty_cycle)
    time.sleep_ms(duracao)
    buzzer.duty_u16(0)

def parar_som():
    """Para o som do buzzer."""
    buzzer.duty_u16(0)

# Exemplo de uso
if __name__ == "__main__":
    # Toca a escala de Dó maior
    notas_escala = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']
    for nota in notas_escala:
        tocar_nota(nota, 4, 50, 300)
        time.sleep_ms(100)
    
    parar_som()
