# display_testar_conexao.py
# Testa se o display OLED está conectado corretamente
# Bloco: Testar Display

from machine import Pin, I2C
from ssd1306 import SSD1306_I2C

# Configuração
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

# Mostra mensagem de teste
oled.fill(0)
oled.text("Display OK!", 15, 20, 1)
oled.text("SCL:3 SDA:2", 10, 36, 1)
oled.show()

print("Display conectado e funcionando!")
