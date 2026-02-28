# botao_apertado.py
# Verifica se o botão está pressionado
# Blocos: 🎮 Enquanto pressionar o botão, 🎮 Se o botão for pressionado

from machine import Pin
import time

# Configuração dos botões
BOTAO_A_PIN = 5   # GPIO5 - Botão A (Esquerda/Vermelho)
BOTAO_B_PIN = 6   # GPIO6 - Botão B (Direita/Azul)
BOTAO_JOYSTICK_PIN = 22  # GPIO22 - Botão do Joystick

# Inicializa os botões com pull-up interno
botao_a = Pin(BOTAO_A_PIN, Pin.IN, Pin.PULL_UP)
botao_b = Pin(BOTAO_B_PIN, Pin.IN, Pin.PULL_UP)
botao_joystick = Pin(BOTAO_JOYSTICK_PIN, Pin.IN, Pin.PULL_UP)

def botao_apertado(botao):
    """
    Verifica se um botão está pressionado.
    
    Args:
        botao: 'A', 'B' ou 'JOYSTICK'
        
    Returns:
        bool: True se o botão está pressionado, False caso contrário
    """
    if botao == 'A':
        return botao_a.value() == 0
    elif botao == 'B':
        return botao_b.value() == 0
    elif botao == 'JOYSTICK':
        return botao_joystick.value() == 0
    return False

def aguardar_botao(botao):
    """
    Aguarda até que um botão seja pressionado.
    
    Args:
        botao: 'A', 'B' ou 'JOYSTICK'
    """
    while not botao_apertado(botao):
        time.sleep_ms(10)
    
    # Aguarda o debounce
    time.sleep_ms(50)
    
    # Aguarda soltar
    while botao_apertado(botao):
        time.sleep_ms(10)

# Exemplo de uso
if __name__ == "__main__":
    print("Pressione o botão A...")
    aguardar_botao('A')
    print("Botao A pressionado!")
    
    print("Pressione o botao B...")
    aguardar_botao('B')
    print("Botao B pressionado!")
