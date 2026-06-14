'use strict';

/**
 * sensor_libs.js — Bibliotecas de sensores embutidas (inline)
 *
 * Converte o código Python das bibliotecas em firmware/PyLibs/
 * em strings que são injetadas diretamente no código gerado pelos blocos.
 * Assim o usuário NÃO precisa enviar .py para a placa manualmente.
 *
 * Para adicionar um novo sensor:
 *   1. Crie o .py em firmware/PyLibs/
 *   2. Adicione aqui como string no objeto SensorLibs
 *   3. Use SensorLibs.NomeSensor no gerador do bloco
 */

var SensorLibs = {

  // =============================================
  // SSD1306 - Display OLED I2C pequeno
  // Fonte: firmware/PyLibs/ssd1306.py
  // =============================================
  SSD1306: `from micropython import const
import time
import framebuf

SET_CONTRAST        = const(0x81)
SET_ENTIRE_ON       = const(0xa4)
SET_NORM_INV        = const(0xa6)
SET_DISP            = const(0xae)
SET_MEM_ADDR        = const(0x20)
SET_COL_ADDR        = const(0x21)
SET_PAGE_ADDR       = const(0x22)
SET_DISP_START_LINE = const(0x40)
SET_SEG_REMAP       = const(0xa0)
SET_MUX_RATIO       = const(0xa8)
SET_COM_OUT_DIR     = const(0xc0)
SET_DISP_OFFSET     = const(0xd3)
SET_COM_PIN_CFG     = const(0xda)
SET_DISP_CLK_DIV    = const(0xd5)
SET_PRECHARGE       = const(0xd9)
SET_VCOM_DESEL      = const(0xdb)
SET_CHARGE_PUMP     = const(0x8d)

class SSD1306:
  def __init__(self, width, height, external_vcc):
    self.width = width
    self.height = height
    self.external_vcc = external_vcc
    self.pages = self.height // 8
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
      SET_PRECHARGE, 0x22 if self.external_vcc else 0xf1,
      SET_VCOM_DESEL, 0x30,
      SET_CONTRAST, 0xff,
      SET_ENTIRE_ON,
      SET_NORM_INV,
      SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
      SET_DISP | 0x01):
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

  def fill_rect(self, x, y, w, h, col):
    self.framebuf.fill_rect(x, y, w, h, col)

  def pixel(self, x, y, col):
    self.framebuf.pixel(x, y, col)

  def hline(self, x, y, w, col):
    self.framebuf.hline(x, y, w, col)

  def vline(self, x, y, h, col):
    self.framebuf.vline(x, y, h, col)

  def line(self, x1, y1, x2, y2, col):
    self.framebuf.line(x1, y1, x2, y2, col)

  def rect(self, x, y, w, h, col):
    self.framebuf.rect(x, y, w, h, col)

  def scroll(self, dx, dy):
    self.framebuf.scroll(dx, dy)

  def text(self, string, x, y, col=1):
    self.framebuf.text(string, x, y, col)

class SSD1306_I2C(SSD1306):
  def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):
    self.i2c = i2c
    self.addr = addr
    self.temp = bytearray(2)
    self.buffer = bytearray(((height // 8) * width) + 1)
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
`,

  // =============================================
  // AHT20 — Sensor de Temperatura e Umidade
  // Fonte: firmware/PyLibs/AHT20.py
  // =============================================
  AHT20:
    'AHT20_ADDR = 0x38\n' +
    'class AHT20:\n' +
    '  def __init__(self, i2c):\n' +
    '    self.i2c = i2c\n' +
    '    self.addr = AHT20_ADDR\n' +
    '    self.is_ready = False\n' +
    '    try:\n' +
    '      i2c.writeto(self.addr, b"\\xbe")\n' +
    '      time.sleep(0.1)\n' +
    '      s = i2c.readfrom(self.addr, 1)[0]\n' +
    '      if (s & 0x08) == 0x08:\n' +
    '        self.is_ready = True\n' +
    '    except: pass\n' +
    '  def get_data(self):\n' +
    '    if not self.is_ready: return None, None\n' +
    '    try:\n' +
    '      self.i2c.writeto(self.addr, b"\\xac\\x33\\x00")\n' +
    '      time.sleep(0.1)\n' +
    '      while self.i2c.readfrom(self.addr, 1)[0] & 0x80: time.sleep(0.01)\n' +
    '      d = self.i2c.readfrom(self.addr, 6)\n' +
    '      h = (((d[1] << 16) | (d[2] << 8) | d[3]) >> 4) * 100 / 0x100000\n' +
    '      t = (((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]) * 200 / 0x100000 - 50\n' +
    '      return round(t, 1), round(h, 1)\n' +
    '    except: return None, None\n',

  // =============================================
  // MPU6050 - Giroscopio/acelerometro do robo movel
  // Fonte: firmware/PyLibs/MPU6050.py
  // =============================================
  MPU6050:
    'MPU6050_ADDR = 0x68\n' +
    'class MPU6050:\n' +
    '  def __init__(self, i2c, addr=MPU6050_ADDR):\n' +
    '    self.i2c = i2c\n' +
    '    self.addr = addr\n' +
    '    self.offset_z = 0.0\n' +
    '    self.is_ready = False\n' +
    '    try:\n' +
    '      self.i2c.writeto_mem(self.addr, 0x6B, b"\\x00")\n' +
    '      self.i2c.writeto_mem(self.addr, 0x1B, b"\\x00")\n' +
    '      self.i2c.writeto_mem(self.addr, 0x1C, b"\\x00")\n' +
    '      self.is_ready = True\n' +
    '    except Exception as exc:\n' +
    '      print("MPU6050: erro ao inicializar:", exc)\n' +
    '  def _read_i16(self, reg):\n' +
    '    data = self.i2c.readfrom_mem(self.addr, reg, 2)\n' +
    '    value = (data[0] << 8) | data[1]\n' +
    '    return value - 65536 if value > 32767 else value\n' +
    '  def _gyro_dps(self, reg):\n' +
    '    return self._read_i16(reg) / 131.0\n' +
    '  def _accel_g(self, reg):\n' +
    '    return self._read_i16(reg) / 16384.0\n' +
    '  def gz(self):\n' +
    '    if not self.is_ready: return 0.0\n' +
    '    return self._gyro_dps(0x47) - self.offset_z\n' +
    '  def ax(self):\n' +
    '    return self._accel_g(0x3B) if self.is_ready else 0.0\n' +
    '  def ay(self):\n' +
    '    return self._accel_g(0x3D) if self.is_ready else 0.0\n' +
    '  def az(self):\n' +
    '    return self._accel_g(0x3F) if self.is_ready else 0.0\n' +
    '  def calibrate(self, samples=300, delay=5):\n' +
    '    if not self.is_ready: return False\n' +
    '    total = 0.0\n' +
    '    for _ in range(samples):\n' +
    '      total += self._gyro_dps(0x47)\n' +
    '      sleep_ms(delay)\n' +
    '    self.offset_z = total / samples\n' +
    '    return True\n',

  // =============================================
  // INA226 - Sensor de tensao/corrente do robo movel
  // Fonte: firmware/PyLibs/INA226.py
  // =============================================
  INA226:
    'INA226_ADDR = 0x40\n' +
    'CONFIG_REG = 0x00\n' +
    'SHUNT_VOLTAGE_REG = 0x01\n' +
    'BUS_VOLTAGE_REG = 0x02\n' +
    'class INA226:\n' +
    '  def __init__(self, i2c, addr=0x40, shunt_resistor=0.1):\n' +
    '    self.i2c = i2c\n' +
    '    self.addr = addr\n' +
    '    self.shunt_resistor = shunt_resistor\n' +
    '    self.is_ready = False\n' +
    '    try:\n' +
    '      self.configure()\n' +
    '      self.is_ready = True\n' +
    '    except Exception as exc:\n' +
    '      print("INA226: erro ao inicializar:", exc)\n' +
    '  def _write_register(self, reg, value):\n' +
    '    self.i2c.writeto_mem(self.addr, reg, bytearray([(value >> 8) & 0xFF, value & 0xFF]))\n' +
    '  def _read_register(self, reg):\n' +
    '    data = self.i2c.readfrom_mem(self.addr, reg, 2)\n' +
    '    return (data[0] << 8) | data[1]\n' +
    '  def _read_signed_register(self, reg):\n' +
    '    value = self._read_register(reg)\n' +
    '    return value - 65536 if value > 32767 else value\n' +
    '  def configure(self):\n' +
    '    self._write_register(CONFIG_REG, 0x4127)\n' +
    '  def voltage(self):\n' +
    '    if not self.is_ready: return 0.0\n' +
    '    return self._read_register(BUS_VOLTAGE_REG) * 1.25 / 1000\n' +
    '  def current(self):\n' +
    '    if not self.is_ready or self.shunt_resistor == 0: return 0.0\n' +
    '    shunt_voltage = self._read_signed_register(SHUNT_VOLTAGE_REG) * 2.5 / 1000000\n' +
    '    return -(shunt_voltage / self.shunt_resistor)\n',

  // =============================================
  // SH1107 - Display OLED I2C
  // Fonte base: firmware/PyLibs/sh1107.py
  // =============================================
  SH1107: `from micropython import const
import time
import framebuf

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
    self.i2c.writeto(self.address, b"\\x00" + command_list)

  def write_data(self, buf):
    self.i2c.writevto(self.address, (b"\\x40", buf))

  def reset(self):
    if self.res is not None:
      self.res(1)
      time.sleep_ms(1)
      self.res(0)
      time.sleep_ms(20)
      self.res(1)
      time.sleep_ms(20)
`

};
