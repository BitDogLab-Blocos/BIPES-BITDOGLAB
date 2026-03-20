# escala_musical.py
# Toca escalas musicais
# Blocos: Escala musical ascendente, Escala musical descendente

from machine import Pin, PWM
import time

# Configuração do buzzer
BUZZER_PIN = 21

# Inicializa o buzzer
buzzer = PWM(Pin(BUZZER_PIN))

def escala_sobe(volume=50):
    """Toca uma escala musical ascendente (Dó maior)."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    notas = [262, 294, 330, 349, 392, 440, 494, 523]
    
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    buzzer.duty_u16(duty_cycle)
    
    for freq in notas:
        buzzer.freq(freq)
        time.sleep_ms(150)
    
    buzzer.duty_u16(0)

def escala_desce(volume=50):
    """Toca uma escala musical descendente (Dó maior)."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    notas = [523, 494, 440, 392, 349, 330, 294, 262]
    
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    buzzer.duty_u16(duty_cycle)
    
    for freq in notas:
        buzzer.freq(freq)
        time.sleep_ms(150)
    
    buzzer.duty_u16(0)

def brilha_brilha_estrelinha(volume=50):
    """Toca a melodia de Brilha Brilha Estrelinha."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    notas = [
        (392, 400), (392, 400), (294, 400), (294, 400),
        (330, 400), (330, 400), (294, 800),
        (262, 400), (262, 400), (494, 400), (494, 400),
        (440, 400), (440, 400), (392, 800)
    ]
    
    buzzer.duty_u16(duty_cycle)
    
    for freq, duracao in notas:
        buzzer.freq(freq)
        time.sleep_ms(duracao)
    
    buzzer.duty_u16(0)

# Exemplo de uso
if __name__ == "__main__":
    escala_sobe(50)
    time.sleep_ms(500)
    escala_desce(50)
