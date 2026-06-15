from machine import Pin, PWM, I2C
from time import sleep, sleep_ms, ticks_ms, ticks_diff
import framebuf


# ============================================================
# CONFIGURACAO DO EXPERIMENTO 2
# ============================================================
ANGULOS = [45, 90, 135, 180]
TOTAL_REPETICOES = 1

MPU_I2C = 0
MPU_SDA = 0
MPU_SCL = 1

OLED_I2C = 1
OLED_SDA = 2
OLED_SCL = 3

INA_I2C = 1
INA_SDA = 2
INA_SCL = 3

BTN_A = Pin(5, Pin.IN, Pin.PULL_UP)
BTN_JOY = Pin(22, Pin.IN, Pin.PULL_UP)

LEFT_FWD = Pin(4, Pin.OUT)
LEFT_BWD = Pin(9, Pin.OUT)
LEFT_PWM = PWM(Pin(8))

RIGHT_FWD = Pin(18, Pin.OUT)
RIGHT_BWD = Pin(19, Pin.OUT)
RIGHT_PWM = PWM(Pin(16))

STBY = Pin(20, Pin.OUT)

PWM_FREQ = 1000
SPEED_MOVE = 35000
SPEED_TURN = 35000
TURN_DEADZONE_DPS = 0.8
TURN_TIMEOUT_MIN_MS = 1500
TURN_TIMEOUT_MS_PER_DEGREE = 120


# ============================================================
# OLED SSD1306
# ============================================================
SET_CONTRAST = 0x81
SET_ENTIRE_ON = 0xA4
SET_NORM_INV = 0xA6
SET_DISP = 0xAE
SET_MEM_ADDR = 0x20
SET_COL_ADDR = 0x21
SET_PAGE_ADDR = 0x22
SET_DISP_START_LINE = 0x40
SET_SEG_REMAP = 0xA0
SET_MUX_RATIO = 0xA8
SET_COM_OUT_DIR = 0xC0
SET_DISP_OFFSET = 0xD3
SET_COM_PIN_CFG = 0xDA
SET_DISP_CLK_DIV = 0xD5
SET_PRECHARGE = 0xD9
SET_VCOM_DESEL = 0xDB
SET_CHARGE_PUMP = 0x8D


class SSD1306:
    def __init__(self, width, height, external_vcc=False):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.pages = height // 8
        self.poweron()
        self.init_display()

    def init_display(self):
        for cmd in (
            SET_DISP | 0x00,
            SET_MEM_ADDR, 0x00,
            SET_DISP_START_LINE | 0x00,
            SET_SEG_REMAP | 0x01,
            SET_MUX_RATIO, self.height - 1,
            SET_COM_OUT_DIR | 0x08,
            SET_DISP_OFFSET, 0x00,
            SET_COM_PIN_CFG, 0x02 if self.height == 32 else 0x12,
            SET_DISP_CLK_DIV, 0x80,
            SET_PRECHARGE, 0x22 if self.external_vcc else 0xF1,
            SET_VCOM_DESEL, 0x30,
            SET_CONTRAST, 0xFF,
            SET_ENTIRE_ON,
            SET_NORM_INV,
            SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
            SET_DISP | 0x01
        ):
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    def poweroff(self):
        self.write_cmd(SET_DISP | 0x00)

    def contrast(self, contrast):
        self.write_cmd(SET_CONTRAST)
        self.write_cmd(contrast)

    def invert(self, invert):
        self.write_cmd(SET_NORM_INV | (invert & 1))

    def show(self):
        x0 = 0
        x1 = self.width - 1
        if self.width == 64:
            x0 += 32
            x1 += 32
        self.write_cmd(SET_COL_ADDR)
        self.write_cmd(x0)
        self.write_cmd(x1)
        self.write_cmd(SET_PAGE_ADDR)
        self.write_cmd(0)
        self.write_cmd(self.pages - 1)
        self.write_framebuf()

    def fill(self, col):
        self.framebuf.fill(col)

    def pixel(self, x, y, col):
        self.framebuf.pixel(x, y, col)

    def text(self, string, x, y, col=1):
        self.framebuf.text(string, x, y, col)


class SSD1306_I2C(SSD1306):
    def __init__(self, width, height, i2c, addr=0x3C, external_vcc=False):
        self.i2c = i2c
        self.addr = addr
        self.temp = bytearray(2)
        self.buffer = bytearray((height // 8) * width + 1)
        self.buffer[0] = 0x40
        self.framebuf = framebuf.FrameBuffer1(memoryview(self.buffer)[1:], width, height)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        self.temp[0] = 0x80
        self.temp[1] = cmd
        self.i2c.writeto(self.addr, self.temp)

    def write_framebuf(self):
        self.i2c.writeto(self.addr, self.buffer)

    def poweron(self):
        pass

    def msg(self, l0="", l1="", l2="", l3=""):
        self.fill(0)
        self.text(str(l0)[:16], 0, 0)
        self.text(str(l1)[:16], 0, 16)
        self.text(str(l2)[:16], 0, 32)
        self.text(str(l3)[:16], 0, 48)
        self.show()


# ============================================================
# MPU6050
# ============================================================
class MPU6050:
    def __init__(self, i2c, addr=0x68):
        self.i2c = i2c
        self.addr = addr
        self.offset_z = 0.0
        self.is_ready = False
        try:
            self.i2c.writeto_mem(addr, 0x6B, b"\x00")
            self.i2c.writeto_mem(addr, 0x1B, b"\x00")
            self.is_ready = True
        except Exception as exc:
            print("MPU6050: erro ao inicializar:", exc)

    def _read_i16(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        value = (data[0] << 8) | data[1]
        return value - 65536 if value > 32767 else value

    def _gz_raw(self):
        if not self.is_ready:
            return 0.0
        return self._read_i16(0x47) / 131.0

    def gz(self):
        return self._gz_raw() - self.offset_z

    def calibrate(self, samples=300):
        if not self.is_ready:
            return False
        total = 0.0
        for _ in range(samples):
            total += self._gz_raw()
            sleep_ms(5)
        self.offset_z = total / samples
        return True


# ============================================================
# INA226
# ============================================================
INA226_ADDR = 0x40
CONFIG_REG = 0x00
SHUNT_VOLTAGE_REG = 0x01
BUS_VOLTAGE_REG = 0x02


class INA226:
    def __init__(self, i2c, addr=0x40, shunt_resistor=0.1):
        self.i2c = i2c
        self.addr = addr
        self.shunt_resistor = shunt_resistor
        self.is_ready = False
        try:
            self.configure()
            self.is_ready = True
        except Exception as exc:
            print("INA226: erro ao inicializar:", exc)

    def _write_register(self, reg, value):
        self.i2c.writeto_mem(self.addr, reg, bytearray([
            (value >> 8) & 0xFF,
            value & 0xFF
        ]))

    def _read_register(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        return (data[0] << 8) | data[1]

    def _read_signed_register(self, reg):
        value = self._read_register(reg)
        return value - 65536 if value > 32767 else value

    def configure(self):
        self._write_register(CONFIG_REG, 0x4127)

    def voltage(self):
        if not self.is_ready:
            return 0.0
        return self._read_register(BUS_VOLTAGE_REG) * 1.25 / 1000

    def current(self):
        if not self.is_ready or self.shunt_resistor == 0:
            return 0.0
        shunt_voltage = self._read_signed_register(SHUNT_VOLTAGE_REG) * 2.5 / 1000000
        return -(shunt_voltage / self.shunt_resistor)


# ============================================================
# CONTROLES
# ============================================================
def wait_release():
    while BTN_A.value() == 0:
        sleep_ms(30)


def wait_press():
    while BTN_A.value() == 1:
        sleep_ms(30)
    sleep_ms(80)
    wait_release()


def wait_joy_release():
    while BTN_JOY.value() == 0:
        sleep_ms(30)


def wait_joy_press():
    while BTN_JOY.value() == 1:
        sleep_ms(30)
    sleep_ms(80)
    wait_joy_release()


def choose_index(title, options):
    index = 0
    while True:
        oled.msg(title, "A muda opcao", str(options[index]), "segure p/ OK")
        press_start = None
        while BTN_A.value() == 1:
            sleep_ms(20)
        press_start = ticks_ms()
        while BTN_A.value() == 0:
            if ticks_diff(ticks_ms(), press_start) > 900:
                wait_release()
                return index
            sleep_ms(20)
        index = (index + 1) % len(options)
        sleep_ms(120)


# ============================================================
# MOTORES
# ============================================================
def setup_motors():
    LEFT_PWM.freq(PWM_FREQ)
    RIGHT_PWM.freq(PWM_FREQ)
    STBY.value(1)
    stop()


def pwm(value):
    return max(0, min(65535, int(value)))


def stop():
    LEFT_FWD.value(0)
    LEFT_BWD.value(0)
    LEFT_PWM.duty_u16(0)
    RIGHT_FWD.value(0)
    RIGHT_BWD.value(0)
    RIGHT_PWM.duty_u16(0)


def pivot_right():
    STBY.value(1)
    LEFT_FWD.value(1)
    LEFT_BWD.value(0)
    RIGHT_FWD.value(0)
    RIGHT_BWD.value(1)
    LEFT_PWM.duty_u16(pwm(SPEED_TURN))
    RIGHT_PWM.duty_u16(pwm(SPEED_TURN))


def read_battery():
    try:
        return ina.voltage()
    except Exception:
        return 0.0


def read_current():
    try:
        return abs(ina.current())
    except Exception:
        return 0.0


def halt_message(l0, l1="", l2="", l3=""):
    stop()
    while True:
        oled.msg(l0, l1, l2, l3)
        sleep(1)


def run_repetition(target_angle):
    v_initial = read_battery()
    v_min = v_initial
    current_initial = read_current()
    current_max = current_initial

    accumulated = 0.0
    turn_start = ticks_ms()
    last = turn_start
    timeout_ms = max(TURN_TIMEOUT_MIN_MS, int(target_angle * TURN_TIMEOUT_MS_PER_DEGREE))
    samples = []
    sleep_ms(10)

    while accumulated < target_angle and ticks_diff(ticks_ms(), turn_start) < timeout_ms:
        now = ticks_ms()
        dt = min(ticks_diff(now, last) / 1000.0, 0.05)
        last = now

        gz = mpu.gz()
        if abs(gz) < TURN_DEADZONE_DPS:
            gz = 0.0

        delta = -gz * dt
        if delta > 0:
            accumulated += delta

        pivot_right()

        v = read_battery()
        if v < v_min:
            v_min = v
        current = read_current()
        if current > current_max:
            current_max = current
        samples.append((
            ticks_diff(now, turn_start),
            accumulated,
            gz,
            v,
            current
        ))
        sleep_ms(10)

    stop()
    sleep_ms(200)
    return accumulated, v_initial, v_min, current_initial, current_max, samples


def next_experiment_id(filename):
    last_id = 0
    try:
        with open(filename, "r") as existing:
            first = True
            for line in existing:
                if first:
                    first = False
                    continue
                parts = line.strip().split(",")
                if parts and parts[0].isdigit():
                    value = int(parts[0])
                    if value > last_id:
                        last_id = value
    except OSError:
        pass
    return "{:02d}".format(last_id + 1)


# ============================================================
# MAIN
# ============================================================
i2c_mpu = I2C(MPU_I2C, sda=Pin(MPU_SDA), scl=Pin(MPU_SCL), freq=400000)
i2c_oled = I2C(OLED_I2C, sda=Pin(OLED_SDA), scl=Pin(OLED_SCL), freq=400000)
i2c_ina = I2C(INA_I2C, sda=Pin(INA_SDA), scl=Pin(INA_SCL), freq=400000)

oled_scan = i2c_oled.scan()
oled_addr = 0x3C if 0x3C in oled_scan else (0x3D if 0x3D in oled_scan else 0x3C)
oled = SSD1306_I2C(128, 64, i2c_oled, addr=oled_addr)
mpu = MPU6050(i2c_mpu)
ina = INA226(i2c_ina)
setup_motors()

if not mpu.is_ready:
    try:
        scan = i2c_mpu.scan()
    except Exception:
        scan = []
    halt_message("ERRO MPU6050", "I2C0 GP0/GP1", "scan: {}".format(scan), "resetar")

if not ina.is_ready:
    try:
        scan = i2c_ina.scan()
    except Exception:
        scan = []
    halt_message("ERRO INA226", "I2C1 GP2/GP3", "scan: {}".format(scan), "resetar")

angle_index = choose_index("Angulo arco", ANGULOS)
target = ANGULOS[angle_index]

direction = "D"
direction_label = "DIR"
filename = "arco_{}_{}.csv".format(target, direction)
experiment_id = next_experiment_id(filename)
oled.msg("ID automatico", "Experimento", experiment_id, "aguarde")
sleep(1.5)

oled.msg("Calibrando MPU", "Nao mexa robo", "", "")
if not mpu.calibrate():
    halt_message("ERRO MPU6050", "falha calibrar", "", "resetar")

new_file = False
try:
    with open(filename, "r"):
        pass
except OSError:
    new_file = True

csv = open(filename, "a")
if new_file:
    csv.write("id,repeticao,angulo_alvo,direcao,t_ms,angulo_acumulado,gz,bateria,corrente,bateria_inicial,bateria_minima,corrente_inicial,corrente_maxima\n")
csv.flush()

for repetition in range(1, TOTAL_REPETICOES + 1):
    oled.msg("Coleta unica", "{} {} graus".format(direction_label, target),
             "Joy inicia", "ID {}".format(experiment_id))
    wait_joy_press()

    angle_acc, v_initial, v_min, current_initial, current_max, samples = run_repetition(target)

    for t_ms, angle_sample, gz, voltage, current in samples:
        csv.write("{},{},{},{},{},{:.2f},{:.3f},{:.2f},{:.3f},{:.2f},{:.2f},{:.3f},{:.3f}\n".format(
            experiment_id, repetition, target, direction, t_ms, angle_sample, gz,
            voltage, current, v_initial, v_min, current_initial, current_max
        ))
    csv.flush()

    oled.msg("Coleta OK",
             "Ang {:.1f}".format(angle_acc),
             "Imax {:.2f}A".format(current_max),
             "")

csv.close()
stop()

while True:
    oled.msg("CONCLUIDO 1/1", "Arquivo salvo:", filename[:16], "Reset p/ novo")
    sleep(1)
