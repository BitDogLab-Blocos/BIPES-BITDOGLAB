from machine import I2C, Pin, SoftI2C, PWM
import utime
from Mpu6050 import MPU6050
from ssd1306 import SSD1306_I2C

# 1. Configuração do LED Azul (GPIO 12)
led_azul = PWM(Pin(12))
led_azul.freq(1000)

# 2. Configuração do I2C para o OLED (Porta V7: SDA=2, SCL=3)
i2c_oled = SoftI2C(scl=Pin(3), sda=Pin(2))
oled = SSD1306_I2C(128, 64, i2c_oled)

# 3. Configuração do I2C para o Acelerômetro (Porta J6: SDA=0, SCL=1)
i2c_mpu = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
sensor = MPU6050(i2c_mpu)

# Constantes do display
LARGURA = 128
ALTURA = 64
TAM_PONTO = 5  # Tamanho do quadradinho

while True:
    ax, ay, az = sensor.accel
    
    # 4. Cálculo da posição baseada na inclinação
    pos_x = (LARGURA // 2) + int(ay * 60)
    pos_y = (ALTURA // 2) + int(ax * 40)
    
    # Variável para controlar se houve colisão
    colisao = False

    # 5. Verificação de bordas (Paredes)
    if pos_x <= 2 or pos_x >= (LARGURA - 3):
        colisao = True
    if pos_y <= 2 or pos_y >= (ALTURA - 3):
        colisao = True

    # Clampa (trava) o ponto dentro do display
    pos_x = max(2, min(LARGURA - 3, pos_x))
    pos_y = max(2, min(ALTURA - 3, pos_y))

    # 6. Controle do LED Azul
    if colisao:
        led_azul.duty_u16(65535) # Liga brilho máximo
    else:
        led_azul.duty_u16(0)     # Apaga

    # 7. Desenho no OLED
    oled.fill(0)
    oled.rect(0, 0, 128, 64, 1) # Desenha a moldura/parede
    oled.fill_rect(pos_x - 2, pos_y - 2, TAM_PONTO, TAM_PONTO, 1)
    
    # Mostra os valores de inclinação para conferência
    oled.text("X:{:.1f}".format(ax), 5, 5, 1)
    oled.text("Y:{:.1f}".format(ay), 85, 5, 1)
    
    # Status na tela em caso de colisão
    if colisao:
        # Posição ajustada para Y=30 para não tampar os números no topo
        oled.text("BATEU!", 40, 30, 1)
        
    oled.show()
    utime.sleep_ms(20)
