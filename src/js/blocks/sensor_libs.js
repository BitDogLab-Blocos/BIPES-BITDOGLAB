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
