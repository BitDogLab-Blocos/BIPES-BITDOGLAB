# criar_desenho.py
# Cria um desenho personalizado na matriz 5x5
# Bloco: Criar desenho na Matriz

from machine import Pin
import neopixel

np = neopixel.NeoPixel(Pin(7), 25)
LED_MATRIX = [[24,23,22,21,20],[15,16,17,18,19],[14,13,12,11,10],[5,6,7,8,9],[4,3,2,1,0]]

# Desenho: letra "X"
# 1 = aceso, 0 = apagado
desenho = [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1]
]

cor = (0, 0, 50)  # Azul com brilho baixo

# Limpa
for i in range(25):
    np[i] = (0, 0, 0)

# Aplica o desenho
for linha in range(5):
    for coluna in range(5):
        if desenho[linha][coluna] == 1:
            np[LED_MATRIX[linha][coluna]] = cor

np.write()
print("Desenho exibido na matriz!")
