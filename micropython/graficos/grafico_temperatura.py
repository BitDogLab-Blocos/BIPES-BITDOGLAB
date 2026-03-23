# Grafico de temperatura em tempo real - Tela toda
# Plota a temperatura do Sensor 1 no display OLED
# Resultado esperado: grafico de linha atualizando com valores de temperatura

from machine import Pin, I2C
import time
from ssd1306 import SSD1306_I2C

AHT20_ADDR = 0x38
class AHT20:
    def __init__(self, i2c):
        self.i2c = i2c
        self.addr = AHT20_ADDR
        self.is_ready = False
        try:
            i2c.writeto(self.addr, b"\xbe")
            time.sleep(0.1)
            s = i2c.readfrom(self.addr, 1)[0]
            if (s & 0x08) == 0x08:
                self.is_ready = True
        except: pass
    def get_data(self):
        if not self.is_ready: return None, None
        try:
            self.i2c.writeto(self.addr, b"\xac\x33\x00")
            time.sleep(0.1)
            while self.i2c.readfrom(self.addr, 1)[0] & 0x80: time.sleep(0.01)
            d = self.i2c.readfrom(self.addr, 6)
            h = (((d[1] << 16) | (d[2] << 8) | d[3]) >> 4) * 100 / 0x100000
            t = (((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]) * 200 / 0x100000 - 50
            return round(t, 1), round(h, 1)
        except: return None, None

i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)
i2c1 = I2C(1, sda=Pin(2), scl=Pin(3), freq=400000)
aht = AHT20(i2c1)

# Fonte 3x5
_ft={"0":[7,5,5,5,7],"1":[2,6,2,2,7],"2":[7,1,7,4,7],"3":[7,1,7,1,7],
"4":[5,5,7,1,1],"5":[7,4,7,1,7],"6":[7,4,7,5,7],"7":[7,1,1,2,2],
"8":[7,5,7,5,7],"9":[7,5,7,1,7],".":[0,0,0,0,2],":":[0,2,0,2,0],
"-":[0,0,7,0,0],"T":[7,2,2,2,2],"e":[7,5,7,4,7],"m":[0,5,7,7,5],
"p":[7,5,7,4,4]," ":[0,0,0,0,0]}
def _dc(x,y,c):
    g=_ft.get(c,_ft[" "])
    for r in range(5):
        b=g[r]
        for i in range(3):
            if b&(4>>i):oled.pixel(x+i,y+r,1)
def _dt(x,y,t):
    for c in str(t):_dc(x,y,c);x+=4

_buf = []
def plot_grafico(valor, titulo):
    _buf.append(float(valor))
    if len(_buf) > 60: _buf.pop(0)
    y_tit, y_ini, y_fim = 0, 6, 63
    alt = y_fim - y_ini
    oled.fill_rect(0, y_tit, 128, 5, 0)
    _dt(0, y_tit, titulo)
    oled.fill_rect(0, y_ini, 128, y_fim - y_ini + 1, 0)
    if len(_buf) < 2:
        oled.show()
        return
    v_min, v_max = min(_buf), max(_buf)
    v_med = sum(_buf) / len(_buf)
    if v_max == v_min: v_max = v_min + 1
    _sw = max(len(str(round(v_max,1))),len(str(round(v_med,1))),len(str(round(v_min,1))))
    _x0 = _sw * 4 + 2
    oled.hline(_x0, y_fim, 128 - _x0, 1)
    n = len(_buf)
    for i in range(n):
        y = y_fim - int((_buf[i] - v_min) / (v_max - v_min) * alt)
        y = max(y_ini, min(y, y_fim))
        x = _x0 + int(i * (127 - _x0) / (n - 1)) if n > 1 else _x0
        if i > 0:
            yp = y_fim - int((_buf[i-1] - v_min) / (v_max - v_min) * alt)
            yp = max(y_ini, min(yp, y_fim))
            xp = _x0 + int((i - 1) * (127 - _x0) / (n - 1))
            oled.line(xp, yp, x, y, 1)
        else:
            oled.pixel(x, y, 1)
    _dt(0, y_ini, str(round(v_max,1)))
    _dt(0, y_ini + alt // 2 - 2, str(round(v_med,1)))
    _dt(0, y_fim - 5, str(round(v_min,1)))
    oled.show()

while True:
    d = aht.get_data() if aht.is_ready else (None, None)
    temp = d[0] if d[0] is not None else 0
    plot_grafico(temp, "Temp1:" + str(round(temp, 1)))
    time.sleep_ms(500)
