# acender_linha_coluna.py
# Acende uma linha ou coluna inteira da matriz
# Blocos: Acender linha, Acender coluna

from machine import Pin
import neopixel
import time

np = neopixel.NeoPixel(Pin(7), 25)
LED_MATRIX = [[24,23,22,21,20],[15,16,17,18,19],[14,13,12,11,10],[5,6,7,8,9],[4,3,2,1,0]]

cor = (0, 50, 0)  # Verde com brilho baixo

# === Teste 1: Acender cada linha ===
print("Acendendo linhas...")
for linha in range(5):
    for i in range(25):
        np[i] = (0, 0, 0)
    for coluna in range(5):
        np[LED_MATRIX[linha][coluna]] = cor
    np.write()
    print("Linha", linha)
    time.sleep(1)

# === Teste 2: Acender cada coluna ===
print("Acendendo colunas...")
for coluna in range(5):
    for i in range(25):
        np[i] = (0, 0, 0)
    for linha in range(5):
        np[LED_MATRIX[linha][coluna]] = cor
    np.write()
    print("Coluna", coluna)
    time.sleep(1)

# Desliga
for i in range(25):
    np[i] = (0, 0, 0)
np.write()
print("Fim!")
