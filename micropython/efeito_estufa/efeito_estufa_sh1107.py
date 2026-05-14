# Experimento Efeito Estufa - Display SH1107
# 2 sensores AHT20: interno (estufa) e externo (ambiente)
# BitDogLab - Plataforma BIPES
#
# Driver SH1107 embutido (igual aos blocos do BIPES)
# Nao requer arquivo sh1107.py separado

from machine import Pin, I2C
import time
import framebuf

# ============================================================
# DRIVER SH1107 (embutido - igual ao codigo dos blocos BIPES)
# ============================================================
from micropython import const

_LOW_COLUMN_ADDRESS = const(0x00)
_HIGH_COLUMN_ADDRESS = const(0x10)
_MEM_ADDRESSING_MODE = const(0x20)
_SET_CONTRAST = const(0x8100)
_SET_SEGMENT_REMAP = const(0xA0)
_SET_MULTIPLEX_RATIO = const(0xA800)
_SET_NORMAL_INVERSE = const(0xA6)
_SET_DISPLAY_OFFSET = const(0xD300)
_SET_DC_DC_CONVERTER_SF = const(0xAD81)
_SET_DISPLAY_OFF = const(0xAE)
_SET_DISPLAY_ON = const(0xAF)
_SET_PAGE_ADDRESS = const(0xB0)
_SET_SCAN_DIRECTION = const(0xC0)
_SET_DISP_CLK_DIV = const(0xD550)
_SET_DIS_PRECHARGE = const(0xD922)
_SET_VCOM_DSEL_LEVEL = const(0xDB35)


class SH1107(framebuf.FrameBuffer):
    def __init__(self, width, height, external_vcc=False, delay_ms=50, rotate=0):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.delay_ms = delay_ms
        self.rotate = rotate
        self.rotate90 = rotate == 90 or rotate == 270
        self.flip_flag = False
        self.inverse = False
        if self.rotate90:
            self.width, self.height = self.height, self.width
            _mode = framebuf.MONO_VLSB
        else:
            _mode = framebuf.MONO_HMSB
        self.pages = self.height // 8
        self.buffer = bytearray(self.pages * self.width)
        self.buffer_mv = memoryview(self.buffer)
        super().__init__(self.buffer, self.width, self.height, _mode)
        self.init_display()

    def init_display(self):
        _mux = 0x7F if self.height == 128 else 0x3F
        self.reset()
        self.write_command(bytes([_SET_DISPLAY_OFF]))
        self.fill(0)
        self.write_command((_SET_MULTIPLEX_RATIO | _mux).to_bytes(2, "big"))
        self.write_command((_MEM_ADDRESSING_MODE | (0x00 if self.rotate90 else 0x01)).to_bytes(1, "big"))
        self.write_command(bytes([_SET_PAGE_ADDRESS]))
        self.write_command(_SET_DC_DC_CONVERTER_SF.to_bytes(2, "big"))
        self.write_command(_SET_DISP_CLK_DIV.to_bytes(2, "big"))
        self.write_command(_SET_VCOM_DSEL_LEVEL.to_bytes(2, "big"))
        self.write_command(_SET_DIS_PRECHARGE.to_bytes(2, "big"))
        self.contrast(0x80)
        self.invert(0)
        self.flip(False, update=False)
        self.write_command(bytes([_SET_DISPLAY_ON]))
        time.sleep_ms(self.delay_ms)

    def contrast(self, contrast):
        self.write_command((_SET_CONTRAST | (contrast & 0xFF)).to_bytes(2, "big"))

    def invert(self, invert=0):
        self.write_command((_SET_NORMAL_INVERSE | (invert & 1)).to_bytes(1, "big"))
        self.inverse = bool(invert)

    def flip(self, flag=None, update=False):
        if flag is None:
            flag = not self.flip_flag
        if self.height == 128 and self.width == 128:
            _row_offset = 0x00
        elif self.rotate90:
            _row_offset = 0x60
        else:
            _row_offset = 0x20 if (self.rotate == 180) ^ flag else 0x60
        _remap = 0x00 if (self.rotate in (90, 180)) ^ flag else 0x01
        _direction = 0x08 if (self.rotate in (180, 270)) ^ flag else 0x00
        self.write_command((_SET_DISPLAY_OFFSET | _row_offset).to_bytes(2, "big"))
        self.write_command(bytes([_SET_SEGMENT_REMAP | _remap]))
        self.write_command(bytes([_SET_SCAN_DIRECTION | _direction]))
        self.flip_flag = flag
        if update:
            self.show()

    def show(self):
        if self.rotate90:
            _cmd = bytearray(3)
            _cmd[1] = _LOW_COLUMN_ADDRESS
            _cmd[2] = _HIGH_COLUMN_ADDRESS
            for _page in range(self.pages):
                _cmd[0] = _SET_PAGE_ADDRESS | _page
                self.write_command(_cmd)
                _start = self.width * _page
                self.write_data(self.buffer_mv[_start:_start + self.width])
        else:
            _row_bytes = self.width // 8
            _cmd = bytearray(2)
            for _row in range(self.height):
                _cmd[0] = _row & 0x0F
                _cmd[1] = _HIGH_COLUMN_ADDRESS | (_row >> 4)
                self.write_command(_cmd)
                _start = _row * _row_bytes
                self.write_data(self.buffer_mv[_start:_start + _row_bytes])

    def reset(self):
        pass


class SH1107_I2C(SH1107):
    def __init__(self, width, height, i2c, res=None, address=0x3C, rotate=0, external_vcc=False, delay_ms=50):
        self.i2c = i2c
        self.address = address
        self.res = res
        if res is not None:
            res.init(res.OUT, value=1)
        super().__init__(width, height, external_vcc, delay_ms, rotate)

    def write_command(self, command_list):
        self.i2c.writeto(self.address, b"\x00" + command_list)

    def write_data(self, buf):
        self.i2c.writevto(self.address, (b"\x40", buf))

    def reset(self):
        if self.res is not None:
            self.res(1)
            time.sleep_ms(1)
            self.res(0)
            time.sleep_ms(20)
            self.res(1)
            time.sleep_ms(20)


# ============================================================
# CONFIGURACAO DO DISPLAY E SENSORES
# ============================================================

# I2C para o display SH1107
i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
_sh1107_scan = i2c.scan()
_sh1107_addr = 0x3C if 0x3C in _sh1107_scan else (0x3D if 0x3D in _sh1107_scan else 0x3C)
oled = SH1107_I2C(128, 128, i2c, address=_sh1107_addr, rotate=90)

# Sensor 1 (estufa): I2C1 - SCL=GP3, SDA=GP2
# Sensor 2 (ambiente): I2C0 - SCL=GP1, SDA=GP0
AHT20_ADDR = 0x38
i2c_sensor1 = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
i2c_sensor2 = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)

_inicio = time.ticks_ms()


# ============================================================
# FUNCOES
# ============================================================

def ler_aht20(i2c):
    """Le temperatura (C) e umidade (%) de um AHT20."""
    try:
        i2c.writeto(AHT20_ADDR, bytes([0xAC, 0x33, 0x00]))
        time.sleep_ms(80)
        dados = i2c.readfrom(AHT20_ADDR, 7)
        if dados[0] & 0x80 == 0:
            ru = ((dados[1] << 16) | (dados[2] << 8) | dados[3]) >> 4
            rt = ((dados[3] & 0x0F) << 16) | (dados[4] << 8) | dados[5]
            temp = round(rt * 200 / 1048576 - 50, 1)
            umid = round(ru * 100 / 1048576, 1)
            return temp, umid
    except:
        pass
    return None, None


# ============================================================
# LOOP PRINCIPAL
# ============================================================

print("=== Experimento Efeito Estufa ===")
print("Sensor 1 (estufa): I2C1")
print("Sensor 2 (ambiente): I2C0")
print("Display: SH1107 128x128 (rotate=90)")

while True:
    temp1, umid1 = ler_aht20(i2c_sensor1)
    temp2, umid2 = ler_aht20(i2c_sensor2)

    oled.fill(0)
    # Linha divisoria vertical (altura total do display)
    oled.vline(64, 0, 128, 1)

    # Lado esquerdo: Sensor 1 (centralizado no eixo Y)
    oled.text("Sensor 1", 5, 44, 1)
    if temp1 is not None:
        oled.text(str(temp1) + "C", 5, 64, 1)
        oled.text(str(umid1) + "%", 5, 80, 1)
    else:
        oled.text("Erro", 5, 70, 1)

    # Lado direito: Sensor 2 (centralizado no eixo Y)
    oled.text("Sensor 2", 66, 44, 1)
    if temp2 is not None:
        oled.text(str(temp2) + "C", 66, 64, 1)
        oled.text(str(umid2) + "%", 66, 80, 1)
    else:
        oled.text("Erro", 66, 70, 1)

    oled.show()
    time.sleep(1)
