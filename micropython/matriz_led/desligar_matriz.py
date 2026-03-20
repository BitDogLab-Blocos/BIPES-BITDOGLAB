# desligar_matriz.py
# Desliga todos os LEDs da matriz NeoPixel
# Bloco: 🔲 Desligar Matriz

from machine import Pin
import neopixel

np = neopixel.NeoPixel(Pin(7), 25)

# Desliga todos os LEDs
for i in range(25):
    np[i] = (0, 0, 0)
np.write()

print("Matriz desligada!")
