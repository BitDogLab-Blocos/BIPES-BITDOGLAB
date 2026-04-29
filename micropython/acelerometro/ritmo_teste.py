from machine import I2C, Pin, SoftI2C, PWM
import utime
import neopixel
from Mpu6050 import MPU6050
from ssd1306 import SSD1306_I2C

# --- Configurações de Hardware ---
i2c_oled = SoftI2C(scl=Pin(3), sda=Pin(2))
oled = SSD1306_I2C(128, 64, i2c_oled)

i2c_mpu = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
sensor = MPU6050(i2c_mpu)

led_r = PWM(Pin(13)); led_r.freq(1000)
led_g = PWM(Pin(11)); led_g.freq(1000)
np = neopixel.NeoPixel(Pin(7), 25)

def flash_leds(cor):
    if cor == "GREEN":
        led_g.duty_u16(65535); led_r.duty_u16(0)
    elif cor == "RED":
        led_r.duty_u16(65535); led_g.duty_u16(0)
    
def apagar_leds():
    led_r.duty_u16(0); led_g.duty_u16(0)
    for i in range(25): np[i] = (0,0,0)
    np.write()

def flash_matrix():
    for i in range(25): np[i] = (20, 20, 20)
    np.write()

# --- Lógica do Jogo ---
LINHA_ALVO = 20
bolinhas = [] 
last_spawn = utime.ticks_ms()
last_ay = 0
THRESHOLD_HIT = 0.4 
variacao_y = 0 # Inicializa a variável para o display

print("Jogo Iniciado! Valores de conferência no topo.")

while True:
    oled.fill(0)
    oled.line(LINHA_ALVO, 0, LINHA_ALVO, 64, 1)
    
    agora = utime.ticks_ms()
    if utime.ticks_diff(agora, last_spawn) > 3000:
        bolinhas.append(127)
        last_spawn = agora
        
    # --- 3. Leitura do Acelerômetro com Conferência ---
    hit_detectado = False
    ay_atual = 0
    try:
        ax, ay_atual, az = sensor.accel
        variacao_y = abs(ay_atual - last_ay)
        last_ay = ay_atual
        if variacao_y > THRESHOLD_HIT:
            hit_detectado = True
    except OSError:
        pass 
    
    # Exibe valores no topo: Y (posição) e V (força do movimento)
    oled.text("Y:{:.1f}".format(ay_atual), 35, 0, 1)
    oled.text("V:{:.1f}".format(variacao_y), 85, 0, 1)
    
    # 4. Atualiza e desenha as bolinhas
    remover_indice = -1
    for i, b_x in enumerate(bolinhas):
        bolinhas[i] -= 2 
        oled.fill_rect(bolinhas[i], 30, 8, 8, 1)
        
        if hit_detectado:
            distancia = abs(bolinhas[i] - LINHA_ALVO)
            if distancia <= 2:
                flash_leds("GREEN")
                flash_matrix()
                remover_indice = i
                print("PERFEITO!")
                break
            elif distancia <= 12:
                flash_leds("GREEN")
                remover_indice = i
                print("BOM!")
                break
            else:
                flash_leds("RED")
                print("ERRO!")
                break

    if remover_indice != -1:
        bolinhas.pop(remover_indice)

    if not hit_detectado:
        utime.sleep_ms(5)
        apagar_leds()

    bolinhas = [b for b in bolinhas if b > -10]
    
    oled.show()
    utime.sleep_ms(30)
