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
  SH1107:
    'from micropython import const\n' +
    'import time\n' +
    'import framebuf\n' +
    '\n' +
    '_HIGH_COLUMN_ADDRESS = const(0x10)\n' +
    '_MEM_ADDRESSING_MODE = const(0x20)\n' +
    '_SET_CONTRAST = const(0x8100)\n' +
    '_SET_SEGMENT_REMAP = const(0xA0)\n' +
    '_SET_MULTIPLEX_RATIO = const(0xA800)\n' +
    '_SET_NORMAL_INVERSE = const(0xA6)\n' +
    '_SET_DISPLAY_OFFSET = const(0xD300)\n' +
    '_SET_DC_DC_CONVERTER_SF = const(0xAD81)\n' +
    '_SET_DISPLAY_OFF = const(0xAE)\n' +
    '_SET_DISPLAY_ON = const(0xAF)\n' +
    '_SET_PAGE_ADDRESS = const(0xB0)\n' +
    '_SET_SCAN_DIRECTION = const(0xC0)\n' +
    '_SET_DISP_CLK_DIV = const(0xD550)\n' +
    '_SET_DIS_PRECHARGE = const(0xD922)\n' +
    '_SET_VCOM_DSEL_LEVEL = const(0xDB35)\n' +
    '\n' +
    'class SH1107(framebuf.FrameBuffer):\n' +
    '  def __init__(self, width, height, external_vcc=False, delay_ms=50):\n' +
    '    self.width = width\n' +
    '    self.height = height\n' +
    '    self.external_vcc = external_vcc\n' +
    '    self.delay_ms = delay_ms\n' +
    '    self.pages = height // 8\n' +
    '    self.row_width = width // 8\n' +
    '    self.buffer = bytearray(self.pages * self.width)\n' +
    '    super().__init__(self.buffer, width, height, framebuf.MONO_HMSB)\n' +
    '    self.init_display()\n' +
    '\n' +
    '  def init_display(self):\n' +
    '    _mux = 0x7F if self.height == 128 else 0x3F\n' +
    '    _offset = 0x00 if self.height == 128 else 0x60\n' +
    '    self.reset()\n' +
    '    self.write_command(bytes([_SET_DISPLAY_OFF]))\n' +
    '    self.fill(0)\n' +
    '    self.write_command((_SET_MULTIPLEX_RATIO | _mux).to_bytes(2, "big"))\n' +
    '    self.write_command((_MEM_ADDRESSING_MODE | 0x01).to_bytes(1, "big"))\n' +
    '    self.write_command(bytes([_SET_PAGE_ADDRESS]))\n' +
    '    self.write_command(_SET_DC_DC_CONVERTER_SF.to_bytes(2, "big"))\n' +
    '    self.write_command(_SET_DISP_CLK_DIV.to_bytes(2, "big"))\n' +
    '    self.write_command(_SET_VCOM_DSEL_LEVEL.to_bytes(2, "big"))\n' +
    '    self.write_command(_SET_DIS_PRECHARGE.to_bytes(2, "big"))\n' +
    '    self.write_command((_SET_CONTRAST | 0x80).to_bytes(2, "big"))\n' +
    '    self.write_command(bytes([_SET_NORMAL_INVERSE]))\n' +
    '    self.write_command((_SET_DISPLAY_OFFSET | _offset).to_bytes(2, "big"))\n' +
    '    self.write_command(bytes([_SET_SEGMENT_REMAP | 0x01]))\n' +
    '    self.write_command(bytes([_SET_SCAN_DIRECTION]))\n' +
    '    self.write_command(bytes([_SET_DISPLAY_ON]))\n' +
    '    time.sleep_ms(self.delay_ms)\n' +
    '\n' +
    '  def show(self):\n' +
    '    _mv = memoryview(self.buffer)\n' +
    '    _row_cmd = bytearray(2)\n' +
    '    for _row in range(self.height):\n' +
    '      _row_cmd[0] = _row & 0x0F\n' +
    '      _row_cmd[1] = _HIGH_COLUMN_ADDRESS | (_row >> 4)\n' +
    '      self.write_command(_row_cmd)\n' +
    '      _start = _row * self.row_width\n' +
    '      self.write_data(_mv[_start:_start + self.row_width])\n' +
    '\n' +
    '  def reset(self):\n' +
    '    pass\n' +
    '\n' +
    'class SH1107_I2C(SH1107):\n' +
    '  def __init__(self, width, height, i2c, res=None, address=0x3C, rotate=0, external_vcc=False, delay_ms=50):\n' +
    '    self.i2c = i2c\n' +
    '    self.address = address\n' +
    '    self.res = res\n' +
    '    if res is not None:\n' +
    '      res.init(res.OUT, value=1)\n' +
    '    super().__init__(width, height, external_vcc, delay_ms)\n' +
    '\n' +
    '  def write_command(self, command_list):\n' +
    '    self.i2c.writeto(self.address, b"\\x00" + command_list)\n' +
    '\n' +
    '  def write_data(self, buf):\n' +
    '    self.i2c.writevto(self.address, (b"\\x40", buf))\n' +
    '\n' +
    '  def reset(self):\n' +
    '    if self.res is not None:\n' +
    '      self.res(1)\n' +
    '      time.sleep_ms(1)\n' +
    '      self.res(0)\n' +
    '      time.sleep_ms(20)\n' +
    '      self.res(1)\n' +
    '      time.sleep_ms(20)\n'

};
