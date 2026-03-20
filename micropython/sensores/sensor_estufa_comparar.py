# sensor_estufa_comparar.py
# Compara dois sensores AHT20 no experimento do efeito estufa
# Bloco: 🌡️ Experimento Efeito Estufa

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Display no I2C1
i2c_display = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c_display)

# Sensor 1 no I2C1, Sensor 2 no I2C0
AHT20_ADDR = 0x38

_i2c_estufa_esq = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
_i2c_estufa_dir = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)

def ler_aht20(i2c_bus):
    """Lê temperatura e umidade de um AHT20."""
    try:
        i2c_bus.writeto(AHT20_ADDR, bytes([0xAC, 0x33, 0x00]))
        time.sleep_ms(80)
        dados = i2c_bus.readfrom(AHT20_ADDR, 7)
        if dados[0] & 0x80 == 0:
            raw_umid = ((dados[1] << 16) | (dados[2] << 8) | dados[3]) >> 4
            raw_temp = ((dados[3] & 0x0F) << 16) | (dados[4] << 8) | dados[5]
            umid = round(raw_umid * 100 / 1048576, 1)
            temp = round(raw_temp * 200 / 1048576 - 50, 1)
            return temp, umid
    except:
        pass
    return None, None

print("Experimento Efeito Estufa - 2 sensores")
print("Sensor 1: I2C1 (SCL=3, SDA=2)")
print("Sensor 2: I2C0 (SCL=1, SDA=0)")

while True:
    temp1, umid1 = ler_aht20(_i2c_estufa_esq)
    temp2, umid2 = ler_aht20(_i2c_estufa_dir)

    oled.fill(0)
    # Linha divisória vertical
    oled.vline(64, 0, 64, 1)

    # Lado esquerdo: Sensor 1
    oled.text("Sensor 1", 5, 2, 1)
    if temp1 is not None:
        oled.text(str(temp1) + "C", 5, 22, 1)
        oled.text(str(umid1) + "%", 5, 38, 1)
    else:
        oled.text("Erro", 5, 28, 1)

    # Lado direito: Sensor 2
    oled.text("Sensor 2", 69, 2, 1)
    if temp2 is not None:
        oled.text(str(temp2) + "C", 69, 22, 1)
        oled.text(str(umid2) + "%", 69, 38, 1)
    else:
        oled.text("Erro", 69, 28, 1)

    oled.show()
    time.sleep(1)
