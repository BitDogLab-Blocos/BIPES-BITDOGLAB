# joystick_cursor_matriz.py
# Move um LED pela matriz 5x5 usando o joystick
# Bloco: 🕹️ Mover ponto de luz na Matriz

from machine import Pin, ADC
import neopixel
import time

# Configuração
np = neopixel.NeoPixel(Pin(7), 25)
joystick_x = ADC(Pin(27))
joystick_y = ADC(Pin(26))
botao_joystick = Pin(22, Pin.IN, Pin.PULL_UP)

LED_MATRIX = [[24,23,22,21,20],[15,16,17,18,19],[14,13,12,11,10],[5,6,7,8,9],[4,3,2,1,0]]

CENTER = 32768
DEADZONE = 5000

# Posição inicial
_cursor_col = 2
_cursor_row = 2
_cursor_tempo = 0
cor = (0, 0, 255)
brilho = 30
fator = brilho / 100 * 0.7

print("Mova o joystick para controlar o LED na matriz!")
print("Pressione o botao do joystick para apagar tudo.")

while True:
    raw_x = joystick_x.read_u16()
    raw_y = joystick_y.read_u16()

    agora = time.ticks_ms()
    if time.ticks_diff(agora, _cursor_tempo) > 200:
        if raw_x < CENTER - DEADZONE:
            _cursor_col = max(0, _cursor_col - 1)
            _cursor_tempo = agora
        elif raw_x > CENTER + DEADZONE:
            _cursor_col = min(4, _cursor_col + 1)
            _cursor_tempo = agora
        if raw_y < CENTER - DEADZONE:
            _cursor_row = max(0, _cursor_row - 1)
            _cursor_tempo = agora
        elif raw_y > CENTER + DEADZONE:
            _cursor_row = min(4, _cursor_row + 1)
            _cursor_tempo = agora

    # Limpa e acende na posição
    for i in range(25):
        np[i] = (0, 0, 0)
    cor_ajustada = (int(cor[0] * fator), int(cor[1] * fator), int(cor[2] * fator))
    np[LED_MATRIX[_cursor_row][_cursor_col]] = cor_ajustada
    np.write()

    # Botão apaga tudo
    if botao_joystick.value() == 0:
        for i in range(25):
            np[i] = (0, 0, 0)
        np.write()
        time.sleep_ms(300)

    time.sleep_ms(50)
