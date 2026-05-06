from machine import Pin, PWM, I2C
from time import sleep, sleep_ms, ticks_ms, ticks_diff
import framebuf

# ============================================================
# I2C
# ============================================================
i2c_mpu  = I2C(0, sda=Pin(0), scl=Pin(1), freq=400_000)
i2c_oled = I2C(1, sda=Pin(2), scl=Pin(3), freq=400_000)

# ============================================================
# OLED SH1107
# ============================================================
class SH1107(framebuf.FrameBuffer):
    def __init__(self, width, height, i2c, addr=0x3C):
        self.width  = width
        self.height = height
        self.i2c    = i2c
        self.addr   = addr
        self.pages  = height // 8
        self.buffer = bytearray(self.pages * width)
        super().__init__(self.buffer, width, height, framebuf.MONO_VLSB)
        self._init_display()

    def _cmd(self, cmd):
        self.i2c.writeto(self.addr, bytearray([0x80, cmd]))

    def _data(self, data):
        self.i2c.writeto(self.addr, b'\x40' + data)

    def _init_display(self):
        for c in [0xAE,0xDC,0x00,0x81,0x80,0xA0,0xC0,0xA4,0xA6,
                  0xA8,self.height-1,0xD3,0x00,0xD5,0x50,
                  0xD9,0x22,0xDB,0x35,0xAD,0x8A,0xAF]:
            self._cmd(c)
        self.fill(0)
        self.show()

    def show(self):
        for page in range(self.pages):
            self._cmd(0xB0 | page)
            self._cmd(0x00)
            self._cmd(0x10)
            s = self.width * page
            self._data(self.buffer[s:s + self.width])

    def msg(self, l0="", l1="", l2="", l3=""):
        self.fill(0)
        self.text(l0[:16], 0,  0)
        self.text(l1[:16], 0, 16)
        self.text(l2[:16], 0, 32)
        self.text(l3[:16], 0, 48)
        self.show()

# ============================================================
# MPU6050
# ============================================================
class MPU6050:
    def __init__(self, i2c, addr=0x68):
        self.i2c  = i2c
        self.addr = addr
        self.i2c.writeto_mem(addr, 0x6B, b'\x00')
        self.i2c.writeto_mem(addr, 0x1B, b'\x00')
        self.offset_z = 0.0

    def _raw(self, reg):
        d = self.i2c.readfrom_mem(self.addr, reg, 2)
        v = (d[0] << 8) | d[1]
        return (v - 65536 if v > 32767 else v) / 131.0

    def gz(self):
        return self._raw(0x47) - self.offset_z

    def calibrate(self, n=300):
        s = 0.0
        for _ in range(n):
            s += self._raw(0x47)
            sleep_ms(5)
        self.offset_z = s / n

# ============================================================
# MOTORES
# ============================================================
LEFT_FWD = Pin(4,  Pin.OUT)
LEFT_BWD = Pin(9,  Pin.OUT)
LEFT_PWM = PWM(Pin(8));  LEFT_PWM.freq(1000)

RIGHT_FWD = Pin(18, Pin.OUT)
RIGHT_BWD = Pin(19, Pin.OUT)
RIGHT_PWM = PWM(Pin(16)); RIGHT_PWM.freq(1000)

STBY = Pin(20, Pin.OUT)
STBY.value(1)

SPEED_GIRO = 35_000

def stop():
    LEFT_FWD.value(0);  LEFT_BWD.value(0);  LEFT_PWM.duty_u16(0)
    RIGHT_FWD.value(0); RIGHT_BWD.value(0); RIGHT_PWM.duty_u16(0)

def pivot_esq(d):
    LEFT_FWD.value(0);  LEFT_BWD.value(1);  LEFT_PWM.duty_u16(d)
    RIGHT_FWD.value(1); RIGHT_BWD.value(0); RIGHT_PWM.duty_u16(d)

def pivot_dir(d):
    LEFT_FWD.value(1);  LEFT_BWD.value(0);  LEFT_PWM.duty_u16(d)
    RIGHT_FWD.value(0); RIGHT_BWD.value(1); RIGHT_PWM.duty_u16(d)

# ============================================================
# INIT
# ============================================================
oled = SH1107(128, 64, i2c_oled)
mpu  = MPU6050(i2c_mpu)

oled.msg("Calibrando...", "Nao mexa!", "", "")
mpu.calibrate()
oled.msg("OK!", "Pressione A", "p/ iniciar", "")

BTN_A = Pin(5, Pin.IN, Pin.PULL_UP)
while BTN_A.value() == 1:
    sleep_ms(50)

# ============================================================
# FUNÇÃO GENÉRICA DE GIRO
# direcao: "L" ou "R"
# ============================================================
def girar(graus, direcao):
    label = "ESQ" if direcao == "L" else "DIR"
    oled.msg("Girando {}".format(label),
             "{:.0f} graus".format(graus), "", "")

    acumulado = 0.0
    t_ant = ticks_ms()
    sleep_ms(10)  # descarta dt inicial

    while acumulado < graus:
        agora = ticks_ms()
        dt = min(ticks_diff(agora, t_ant) / 1000.0, 0.05)
        t_ant = agora

        gz = mpu.gz()
        if abs(gz) < 0.8:
            gz = 0.0

        # gz positivo = esquerda neste sensor
        # para direita: gz será negativo, usamos abs para acumular
        if direcao == "L":
            acumulado += gz * dt
        else:
            acumulado -= gz * dt   # gz negativo ao girar direita → subtrai = positivo

        if direcao == "L":
            pivot_esq(SPEED_GIRO)
        else:
            pivot_dir(SPEED_GIRO)

        oled.msg("Girando {}".format(label),
                 "{:.1f}/{:.0f}g".format(acumulado, graus),
                 "", "")
        sleep_ms(10)

    stop()
    sleep_ms(200)
    oled.msg("Giro OK!", "{} {:.1f}g".format(label, acumulado), "", "")
    sleep_ms(600)

# ============================================================
# FUNÇÕES RETO E RÉ
# ============================================================
SPEED_RETO = 35_000

def frente(t):
    oled.msg("FRENTE", "{:.1f}s".format(t), "", "")
    LEFT_FWD.value(0);  LEFT_BWD.value(1);  LEFT_PWM.duty_u16(SPEED_RETO)
    RIGHT_FWD.value(0); RIGHT_BWD.value(1); RIGHT_PWM.duty_u16(SPEED_RETO)
    sleep(t)
    stop()

def re(t):
    oled.msg("RE", "{:.1f}s".format(t), "", "")
    LEFT_FWD.value(1);  LEFT_BWD.value(0);  LEFT_PWM.duty_u16(SPEED_RETO)
    RIGHT_FWD.value(1); RIGHT_BWD.value(0); RIGHT_PWM.duty_u16(SPEED_RETO)
    sleep(t)
    stop()

# ============================================================
# TRAJETO — 7 comandos
# ============================================================
oled.msg("Iniciando!", "", "", "")
sleep(1)

girar(90,  "L")      # 1. ESQ 90
sleep_ms(300)
frente(2.0)          # 2. FRENTE 2s
sleep_ms(300)
girar(90,  "R")      # 3. DIR 90
sleep_ms(300)
frente(1.5)          # 4. FRENTE 1.5s
sleep_ms(300)
girar(45,  "L")      # 5. ESQ 45
sleep_ms(300)
re(1.0)              # 6. RE 1s
sleep_ms(300)
stop()               # 7. PARA

oled.msg("Missao", "concluida!", "", "")
print("Missao concluida!")
