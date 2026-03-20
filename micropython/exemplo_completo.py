# exemplo_completo.py
# Exemplo completo combinando vários blocos
# Este exemplo mostra como usar os códigos isoladamente

from machine import Pin, PWM, I2C
from ssd1306 import SSD1306_I2C
import neopixel
import time

# ============== CONFIGURAÇÃO ==============
# LED RGB
LED_RED, LED_GREEN, LED_BLUE = 11, 12, 13
led_r = PWM(Pin(LED_RED), freq=1000)
led_g = PWM(Pin(LED_GREEN), freq=1000)
led_b = PWM(Pin(LED_BLUE), freq=1000)

# Matriz NeoPixel
np = neopixel.NeoPixel(Pin(7), 25)

# Buzzer
buzzer = PWM(Pin(21))

# Botões
btn_a = Pin(5, Pin.IN, Pin.PULL_UP)
btn_b = Pin(6, Pin.IN, Pin.PULL_UP)

# Display OLED
try:
    i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
    oled = SSD1306_I2C(128, 64, i2c)
    tem_display = True
except:
    tem_display = False

# ============== FUNÇÕES AUXILIARES ==============
def led_rgb(cor, brilho=100):
    """Controla o LED RGB."""
    led_r.duty_u16(int(cor[0] * 257 * brilho / 100))
    led_g.duty_u16(int(cor[1] * 257 * brilho / 100))
    led_b.duty_u16(int(cor[2] * 257 * brilho / 100))

def beep(freq=1000, duracao=200, volume=50):
    """Toca um beep no buzzer."""
    buzzer.freq(freq)
    buzzer.duty_u16(int(65535 * volume * 0.7 / 100))
    time.sleep_ms(duracao)
    buzzer.duty_u16(0)

def matriz_coracao(cor, brilho=50):
    """Desenha um coração na matriz."""
    padrao = [
        [24, 22], [23], 
        [15, 16, 17, 18, 19],
        [14, 13, 12, 11, 10],
        [5, 6, 7, 8, 9],
        [4, 3, 2, 1, 0]
    ]
    
    intensidade = brilho / 100 * 0.5
    r, g, b = int(cor[0] * intensidade), int(cor[1] * intensidade), int(cor[2] * intensidade)
    
    for i in range(25):
        np[i] = (r, g, b)
    np.write()

def limpar_matriz():
    """Desliga todos os LEDs da matriz."""
    for i in range(25):
        np[i] = (0, 0, 0)
    np.write()

def escrever_display(texto, linha=0):
    """Escreve no display OLED."""
    if tem_display:
        oled.text(texto, 0, linha * 10, 1)
        oled.show()

def limpar_display():
    """Limpa o display."""
    if tem_display:
        oled.fill(0)
        oled.show()

# ============== EXEMPLO PRINCIPAL ==============
def exemplo_sequencial():
    """
    Exemplo sequencial demonstrando vários recursos.
    Pressione Ctrl+C para sair.
    """
    print("=== Exemplo BitDogLab ===")
    print("1. LED Vermelho")
    
    if tem_display:
        limpar_display()
        escrever_display("BitDogLab", 0)
        escrever_display("Teste LED", 2)
    
    # LED vermelho
    led_rgb((255, 0, 0), 50)
    beep(500, 200)
    time.sleep(1)
    
    print("2. Matriz - Coracao")
    if tem_display:
        limpar_display()
        escrever_display("Coracao", 2)
    
    led_rgb((0, 0, 0))  # Desliga LED
    matriz_coracao((255, 0, 0), 50)
    beep(600, 200)
    time.sleep(2)
    
    print("3. LED Verde + Display")
    limpar_matriz()
    led_rgb((0, 255, 0), 50)
    
    if tem_display:
        limpar_display()
        escrever_display("Verde!", 2)
    
    beep(800, 200)
    time.sleep(1)
    
    print("4. Piscar LED Azul")
    if tem_display:
        limpar_display()
        escrever_display("Piscando", 2)
    
    for _ in range(5):
        led_rgb((0, 0, 255), 50)
        beep(1000, 100)
        time.sleep_ms(200)
        led_rgb((0, 0, 0))
        time.sleep_ms(200)
    
    print("5. Teste botoes")
    if tem_display:
        limpar_display()
        escrever_display("Pressione A", 1)
        escrever_display("ou B", 2)
    
    # Aguarda botão
    timeout = time.time() + 5
    while time.time() < timeout:
        if btn_a.value() == 0:
            print("Botao A pressionado!")
            led_rgb((255, 255, 0), 50)
            beep(1200, 300)
            if tem_display:
                limpar_display()
                escrever_display("Botao A!", 2)
            time.sleep(0.5)
            break
        elif btn_b.value() == 0:
            print("Botao B pressionado!")
            led_rgb((0, 255, 255), 50)
            beep(1500, 300)
            if tem_display:
                limpar_display()
                escrever_display("Botao B!", 2)
            time.sleep(0.5)
            break
        time.sleep_ms(10)
    
    # Final
    time.sleep(1)
    led_rgb((0, 0, 0))
    limpar_matriz()
    if tem_display:
        limpar_display()
        escrever_display("Fim!", 2)
    
    print("=== Fim do exemplo ===")

# Executa o exemplo
if __name__ == "__main__":
    try:
        exemplo_sequencial()
    except KeyboardInterrupt:
        # Limpa tudo ao sair
        led_rgb((0, 0, 0))
        limpar_matriz()
        buzzer.duty_u16(0)
        print("\nPrograma interrompido")
