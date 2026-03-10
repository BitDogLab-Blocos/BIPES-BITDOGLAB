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
    '    except: return None, None\n'

};
