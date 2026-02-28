# bipe_curto.py
# Toca bipes e alertas sonoros
# Blocos: 📍 Bipe curto, 📍 Bipe duplo, 🚨 Alerta intermitente

from machine import Pin, PWM
import time

# Configuração do buzzer
BUZZER_PIN = 21

# Inicializa o buzzer
buzzer = PWM(Pin(BUZZER_PIN))

def bipe_curto(volume=50):
    """Toca um bipe curto de 100ms."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    buzzer.freq(1500)
    buzzer.duty_u16(duty_cycle)
    time.sleep_ms(100)
    buzzer.duty_u16(0)

def bipe_duplo(volume=50):
    """Toca dois bipes rápidos."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    
    # Primeiro bipe
    buzzer.freq(1500)
    buzzer.duty_u16(duty_cycle)
    time.sleep_ms(100)
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    
    # Segundo bipe
    buzzer.duty_u16(duty_cycle)
    time.sleep_ms(100)
    buzzer.duty_u16(0)

def alerta_intermitente(volume=50):
    """Toca um alerta intermitente."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    buzzer.freq(2000)
    buzzer.duty_u16(duty_cycle)
    time.sleep_ms(200)
    buzzer.duty_u16(0)
    time.sleep_ms(800)

def som_de_moeda(volume=50):
    """Toca o som clássico de moeda."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(0)
    time.sleep_ms(50)
    buzzer.duty_u16(duty_cycle)
    
    buzzer.freq(494)  # B4
    time.sleep_ms(100)
    buzzer.freq(659)  # E5
    time.sleep_ms(150)
    buzzer.duty_u16(0)

def som_de_sucesso(volume=50):
    """Toca um som de sucesso (notas ascendentes)."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(duty_cycle)
    
    for freq in [392, 440, 494, 523]:
        buzzer.freq(freq)
        time.sleep_ms(100)
    
    buzzer.duty_u16(0)

def som_de_falha(volume=50):
    """Toca um som de falha (notas descendentes)."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(duty_cycle)
    
    for freq in [392, 370, 349]:
        buzzer.freq(freq)
        time.sleep_ms(200)
    
    buzzer.duty_u16(0)

def som_de_laser(volume=50):
    """Toca um som de laser."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(duty_cycle)
    
    for freq in [2000, 1000, 500]:
        buzzer.freq(freq)
        time.sleep_ms(50)
    
    buzzer.duty_u16(0)

def sirene_policial(volume=50):
    """Toca uma sirene policial."""
    duty_cycle = int(65535 * volume * 0.7 / 100)
    buzzer.duty_u16(duty_cycle)
    
    buzzer.freq(698)  # F5
    time.sleep_ms(400)
    buzzer.freq(587)  # D5
    time.sleep_ms(400)
    
    buzzer.duty_u16(0)

# Exemplo de uso
if __name__ == "__main__":
    bipe_curto(50)
    time.sleep_ms(500)
    bipe_duplo(50)
    time.sleep_ms(500)
    som_de_sucesso(50)
