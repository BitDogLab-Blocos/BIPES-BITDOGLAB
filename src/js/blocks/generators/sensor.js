// Auto-extracted from legacy generators.js into sensor.js
'use strict';

function _setupAHT20Definitions() {
  var pins = BitdogLabConfig.PINS;
  var sensor = BitdogLabConfig.SENSOR;

  Blockly.Python.definitions_['import_pin']  = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c']  = 'from machine import I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['lib_aht20'] = SensorLibs.AHT20;

  var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
  var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;
  var i2c0Expr = 'I2C(' + sensor.I2C_BUS + ', sda=Pin(' + i2c0Sda + '), scl=Pin(' + i2c0Scl + '), freq=' + sensor.I2C_FREQ + ')';

  if (pins.I2C0_SDA !== undefined && pins.I2C_SDA !== undefined) {
    var i2c1Expr = 'I2C(1, sda=Pin(' + pins.I2C_SDA + '), scl=Pin(' + pins.I2C_SCL + '), freq=' + sensor.I2C_FREQ + ')';
    Blockly.Python.definitions_['setup_i2c_sensor'] =
      '_i2c_sensor = ' + i2c0Expr + '\n' +
      '_aht20 = AHT20(_i2c_sensor)\n' +
      '_i2c_sensor = _i2c_sensor if _aht20.is_ready else ' + i2c1Expr + '\n' +
      '_aht20 = _aht20 if _aht20.is_ready else AHT20(_i2c_sensor)';
  } else {
    Blockly.Python.definitions_['setup_i2c_sensor'] = '_i2c_sensor = ' + i2c0Expr;
    Blockly.Python.definitions_['setup_aht20'] = '_aht20 = AHT20(_i2c_sensor)';
  }
  Blockly.Python.definitions_['setup_aht20_cache'] = '_aht20_temp = 0\n_aht20_umid = 0\n_aht20_ultimo = 0';

  Blockly.Python.definitions_['func_aht20_atualizar'] =
    'def _aht20_atualizar():\n' +
    '  global _aht20_temp, _aht20_umid, _aht20_ultimo\n' +
    '  _agora = time.ticks_ms()\n' +
    '  if time.ticks_diff(_agora, _aht20_ultimo) < 500: return\n' +
    '  _aht20_ultimo = _agora\n' +
    '  _t, _u = _aht20.get_data()\n' +
    '  if _t is not None:\n' +
    '    _aht20_temp = round(_t, 1)\n' +
    '    _aht20_umid = round(_u, 1)\n';

  Blockly.Python.definitions_['func_ler_temperatura'] =
    'def _ler_temperatura():\n' +
    '  _aht20_atualizar()\n' +
    '  return _aht20_temp\n';

  Blockly.Python.definitions_['func_ler_umidade'] =
    'def _ler_umidade():\n' +
    '  _aht20_atualizar()\n' +
    '  return _aht20_umid\n';
}

function _setupEstufaGraficos() {
  var pins = BitdogLabConfig.PINS;
  var sensor = BitdogLabConfig.SENSOR;
  var display = BitdogLabConfig.DISPLAY;

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['lib_aht20'] = SensorLibs.AHT20;

  Blockly.Python.definitions_['setup_display'] =
    'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\n' +
    'oled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
  var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;

  Blockly.Python.definitions_['setup_estufa_sensores'] =
    '_i2c_estufa0 = I2C(' + sensor.I2C_BUS + ', sda=Pin(' + i2c0Sda + '), scl=Pin(' + i2c0Scl + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '_i2c_estufa1 = I2C(1, sda=Pin(' + pins.I2C_SDA + '), scl=Pin(' + pins.I2C_SCL + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '_aht_esq = AHT20(_i2c_estufa1)\n' +
    '_aht_dir = AHT20(_i2c_estufa0)';

  Blockly.Python.definitions_['fonte_titulo'] =
    '# Fonte 3x5\n' +
    '_ft={"0":[7,5,5,5,7],"1":[2,6,2,2,7],"2":[7,1,7,4,7],"3":[7,1,7,1,7],\n' +
    '"4":[5,5,7,1,1],"5":[7,4,7,1,7],"6":[7,4,7,5,7],"7":[7,1,1,2,2],\n' +
    '"8":[7,5,7,5,7],"9":[7,5,7,1,7],".":[0,0,0,0,2],":":[0,2,0,2,0],\n' +
    '"-":[0,0,7,0,0],"T":[7,2,2,2,2],"e":[7,5,7,4,7],"m":[0,5,7,7,5],\n' +
    '"p":[7,5,7,4,4],"U":[5,5,5,5,7],"i":[2,0,2,2,2],"d":[1,1,7,5,7],\n' +
    '"S":[7,4,7,1,7],"o":[0,0,7,5,7],"a":[0,0,7,5,7],"b":[4,4,7,5,7],\n' +
    '"l":[6,2,2,2,7],"t":[2,2,7,2,3],"r":[0,0,7,4,4],"D":[6,5,5,5,6],\n' +
    '"v":[0,0,5,5,2],"M":[5,7,7,5,5],"R":[7,5,7,4,4],"+":[0,2,7,2,0],\n' +
    '" ":[0,0,0,0,0]}\n' +
    'def _dc(x,y,c):\n' +
    '  g=_ft.get(c,_ft[" "])\n' +
    '  for r in range(5):\n' +
    '    b=g[r]\n' +
    '    for i in range(3):\n' +
    '      if b&(4>>i):oled.pixel(x+i,y+r,1)\n' +
    'def _dt(x,y,t):\n' +
    '  for c in str(t):_dc(x,y,c);x+=4\n';

  Blockly.Python.definitions_['func_plot_grafico'] =
    '_plot_buffers = {}\n' +
    'def _plot_grafico(buf_id, valor, pos, titulo):\n' +
    '  try:\n' +
    '    val = float(valor)\n' +
    '    if buf_id not in _plot_buffers:\n' +
    '      _plot_buffers[buf_id] = []\n' +
    '    buf = _plot_buffers[buf_id]\n' +
    '    buf.append(val)\n' +
    '    if len(buf) > 60: buf.pop(0)\n' +
    '    if pos == 0:\n' +
    '      y_tit, y_ini, y_fim = 0, 6, 63\n' +
    '    elif pos == 1:\n' +
    '      y_tit, y_ini, y_fim = 0, 6, 31\n' +
    '    else:\n' +
    '      y_tit, y_ini, y_fim = 32, 38, 63\n' +
    '    alt = y_fim - y_ini\n' +
    '    oled.fill_rect(0, y_tit, 128, 5, 0)\n' +
    '    _dt(0, y_tit, titulo)\n' +
    '    oled.fill_rect(0, y_ini, 128, y_fim - y_ini + 1, 0)\n' +
    '    if len(buf) < 2:\n' +
    '      oled.show()\n' +
    '      return\n' +
    '    v_min, v_max = min(buf), max(buf)\n' +
    '    v_med = sum(buf) / len(buf)\n' +
    '    if v_max == v_min: v_max = v_min + 1\n' +
    '    _sw = max(len(str(round(v_max,1))),len(str(round(v_med,1))),len(str(round(v_min,1))))\n' +
    '    _x0 = _sw * 4 + 2\n' +
    '    oled.hline(_x0, y_fim, 128 - _x0, 1)\n' +
    '    n = len(buf)\n' +
    '    for i in range(n):\n' +
    '      y = y_fim - int((buf[i] - v_min) / (v_max - v_min) * alt)\n' +
    '      y = max(y_ini, min(y, y_fim))\n' +
    '      x = _x0 + int(i * (127 - _x0) / (n - 1)) if n > 1 else _x0\n' +
    '      if i > 0:\n' +
    '        yp = y_fim - int((buf[i-1] - v_min) / (v_max - v_min) * alt)\n' +
    '        yp = max(y_ini, min(yp, y_fim))\n' +
    '        xp = _x0 + int((i - 1) * (127 - _x0) / (n - 1))\n' +
    '        oled.line(xp, yp, x, y, 1)\n' +
    '      else:\n' +
    '        oled.pixel(x, y, 1)\n' +
    '    _dt(0, y_ini, str(round(v_max,1)))\n' +
    '    _dt(0, y_ini + alt // 2 - 2, str(round(v_med,1)))\n' +
    '    _dt(0, y_fim - 5, str(round(v_min,1)))\n' +
    '    oled.show()\n' +
    '  except: pass';
}

Blockly.Python["chamar_formatar_dados_plotter"] = function(block) {
  var code = 'formatar_dados_para_plotter()\n';
  return code;
};

Blockly.Python["sensor_temperatura"] = function(_block) {
  _setupAHT20Definitions();
  return ['_ler_temperatura()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["sensor_umidade"] = function(_block) {
  _setupAHT20Definitions();
  return ['_ler_umidade()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["sensor_estufa_comparar"] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var sensor = BitdogLabConfig.SENSOR;
  var display = BitdogLabConfig.DISPLAY;
  var displayType = block.getFieldValue('DISPLAY_TYPE') || 'SMALL';

  Blockly.Python.definitions_['import_pin']  = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c']  = 'from machine import I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';

  // Biblioteca AHT20 inline
  Blockly.Python.definitions_['lib_aht20'] = SensorLibs.AHT20;

  // I2C do display (bus 1)
  if (displayType === 'LARGE') {
    Blockly.Python.definitions_['lib_sh1107'] = SensorLibs.SH1107;
    Blockly.Python.definitions_['setup_display'] =
      'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\n' +
      '_sh1107_scan = i2c.scan()\n' +
      '_sh1107_addr = 0x3C if 0x3C in _sh1107_scan else (0x3D if 0x3D in _sh1107_scan else 0x3C)\n' +
      'oled = SH1107_I2C(128, 128, i2c, address=_sh1107_addr, rotate=90)';
  } else {
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] =
      'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\n' +
      'oled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';
  }

  // Dois sensores AHT20: I2C0 e I2C1
  var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
  var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;

  Blockly.Python.definitions_['setup_estufa_sensores'] =
    '_i2c_estufa0 = I2C(' + sensor.I2C_BUS + ', sda=Pin(' + i2c0Sda + '), scl=Pin(' + i2c0Scl + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '_i2c_estufa1 = I2C(1, sda=Pin(' + pins.I2C_SDA + '), scl=Pin(' + pins.I2C_SCL + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '_aht_esq = AHT20(_i2c_estufa1)\n' +
    '_aht_dir = AHT20(_i2c_estufa0)';

  // Flags de visibilidade dos lados
  Blockly.Python.definitions_['setup_estufa_flags'] =
    '_estufa_esq_on = True\n_estufa_dir_on = True';

  // Função principal do experimento
  Blockly.Python.definitions_['func_estufa_comparar'] =
    'def _estufa_comparar():\n' +
    '  oled.fill(0)\n' +
    '  # Linha divisória central\n' +
    '  for y in range(64):\n' +
    '    oled.pixel(63, y, 1)\n' +
    '  # Lado esquerdo — Sensor 1 (I2C1)\n' +
    '  oled.text("Sensor", 2, 0, 1)\n' +
    '  oled.text("1", 22, 12, 1)\n' +
    '  if _estufa_esq_on:\n' +
    '    t1, u1 = _aht_esq.get_data() if _aht_esq.is_ready else (None, None)\n' +
    '    if t1 is not None:\n' +
    '      oled.text(str(t1) + " C", 2, 32, 1)\n' +
    '      oled.text(str(u1) + " %", 2, 48, 1)\n' +
    '    else:\n' +
    '      oled.text("--.- C", 2, 32, 1)\n' +
    '      oled.text("--.- %", 2, 48, 1)\n' +
    '  else:\n' +
    '    oled.text("OFF", 14, 38, 1)\n' +
    '  # Lado direito — Sensor 2 (I2C0)\n' +
    '  oled.text("Sensor", 67, 0, 1)\n' +
    '  oled.text("2", 87, 12, 1)\n' +
    '  if _estufa_dir_on:\n' +
    '    t2, u2 = _aht_dir.get_data() if _aht_dir.is_ready else (None, None)\n' +
    '    if t2 is not None:\n' +
    '      oled.text(str(t2) + " C", 67, 32, 1)\n' +
    '      oled.text(str(u2) + " %", 67, 48, 1)\n' +
    '    else:\n' +
    '      oled.text("--.- C", 67, 32, 1)\n' +
    '      oled.text("--.- %", 67, 48, 1)\n' +
    '  else:\n' +
    '    oled.text("OFF", 79, 38, 1)\n' +
    '  oled.show()\n';

  if (displayType === 'LARGE') {
    Blockly.Python.definitions_['func_estufa_comparar'] =
      'def _estufa_comparar():\n' +
      '  oled.fill(0)\n' +
      '  for y in range(128):\n' +
      '    oled.pixel(63, y, 1)\n' +
      '  oled.text("Sensor", 8, 8, 1)\n' +
      '  oled.text("1", 28, 20, 1)\n' +
      '  oled.text("Sensor", 72, 8, 1)\n' +
      '  oled.text("2", 92, 20, 1)\n' +
      '  if _estufa_esq_on:\n' +
      '    t1, u1 = _aht_esq.get_data() if _aht_esq.is_ready else (None, None)\n' +
      '    oled.text("Temp", 4, 44, 1)\n' +
      '    oled.text("Umid", 4, 84, 1)\n' +
      '    if t1 is not None:\n' +
      '      oled.text(str(t1) + " C", 4, 58, 1)\n' +
      '      oled.text(str(u1) + " %", 4, 98, 1)\n' +
      '    else:\n' +
      '      oled.text("--.- C", 4, 58, 1)\n' +
      '      oled.text("--.- %", 4, 98, 1)\n' +
      '  else:\n' +
      '    oled.text("OFF", 16, 68, 1)\n' +
      '  if _estufa_dir_on:\n' +
      '    t2, u2 = _aht_dir.get_data() if _aht_dir.is_ready else (None, None)\n' +
      '    oled.text("Temp", 68, 44, 1)\n' +
      '    oled.text("Umid", 68, 84, 1)\n' +
      '    if t2 is not None:\n' +
      '      oled.text(str(t2) + " C", 68, 58, 1)\n' +
      '      oled.text(str(u2) + " %", 68, 98, 1)\n' +
      '    else:\n' +
      '      oled.text("--.- C", 68, 58, 1)\n' +
      '      oled.text("--.- %", 68, 98, 1)\n' +
      '  else:\n' +
      '    oled.text("OFF", 80, 68, 1)\n' +
      '  oled.show()\n';
  }

  var code = '_estufa_comparar()\n' +
    'time.sleep_ms(500)\n';
  return code;
};

Blockly.Python["estufa_toggle_sensor1"] = function(_block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_estufa_flags'] =
    '_estufa_esq_on = True\n_estufa_dir_on = True';

  return '_estufa_esq_on = not _estufa_esq_on\n';
};

Blockly.Python["estufa_toggle_sensor2"] = function(_block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_estufa_flags'] =
    '_estufa_esq_on = True\n_estufa_dir_on = True';

  return '_estufa_dir_on = not _estufa_dir_on\n';
};

Blockly.Python["estufa_temp_sensor1"] = function(_block) {
  _setupEstufaGraficos();
  Blockly.Python.definitions_['func_ler_estufa_temp1'] =
    'def _ler_estufa_temp1():\n' +
    '  d = _aht_esq.get_data() if _aht_esq.is_ready else (None, None)\n' +
    '  return d[0] if d[0] is not None else 0';
  return ['_ler_estufa_temp1()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["estufa_umid_sensor1"] = function(_block) {
  _setupEstufaGraficos();
  Blockly.Python.definitions_['func_ler_estufa_umid1'] =
    'def _ler_estufa_umid1():\n' +
    '  d = _aht_esq.get_data() if _aht_esq.is_ready else (None, None)\n' +
    '  return d[1] if d[1] is not None else 0';
  return ['_ler_estufa_umid1()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["estufa_temp_sensor2"] = function(_block) {
  _setupEstufaGraficos();
  Blockly.Python.definitions_['func_ler_estufa_temp2'] =
    'def _ler_estufa_temp2():\n' +
    '  d = _aht_dir.get_data() if _aht_dir.is_ready else (None, None)\n' +
    '  return d[0] if d[0] is not None else 0';
  return ['_ler_estufa_temp2()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["estufa_umid_sensor2"] = function(_block) {
  _setupEstufaGraficos();
  Blockly.Python.definitions_['func_ler_estufa_umid2'] =
    'def _ler_estufa_umid2():\n' +
    '  d = _aht_dir.get_data() if _aht_dir.is_ready else (None, None)\n' +
    '  return d[1] if d[1] is not None else 0';
  return ['_ler_estufa_umid2()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["estufa_plotar"] = function(block) {
  _setupEstufaGraficos();
  var valor = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_ATOMIC) || '0';
  var rotulo = block.getFieldValue('ROTULO');
  var posicao = block.getFieldValue('POSICAO');
  var bufId = 'plot_' + rotulo + '_' + posicao;
  var varName = '_v_' + rotulo + '_' + posicao;

  var titulo = "'" + rotulo + ":' + str(round(" + varName + ", 1))";
  var code = varName + ' = (' + valor + ')\n' +
    "_plot_grafico('" + bufId + "', " + varName + ", " + posicao + ", " + titulo + ")\n";
  return code;
};

Blockly.Python["verificar_conexao_sensor"] = function(_block) {
  var pins = BitdogLabConfig.PINS;
  var sensor = BitdogLabConfig.SENSOR;
  var display = BitdogLabConfig.DISPLAY;

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';

  Blockly.Python.definitions_['setup_display'] =
    'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\n' +
    'oled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
  var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;

  Blockly.Python.definitions_['func_verificar_sensores'] =
    'def _verificar_sensores():\n' +
    '  _i0 = I2C(0, sda=Pin(' + i2c0Sda + '), scl=Pin(' + i2c0Scl + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '  _i1 = I2C(1, sda=Pin(' + pins.I2C_SDA + '), scl=Pin(' + pins.I2C_SCL + '), freq=' + sensor.I2C_FREQ + ')\n' +
    '  _r0 = _i0.scan()\n' +
    '  _r1 = _i1.scan()\n' +
    '  _nomes = {56:"Temp e Umid", 104:"Acelerometro", 119:"Temp e Umid"}\n' +
    '  oled.fill(0)\n' +
    '  oled.text("Sensores:", 0, 0, 1)\n' +
    '  _y = 12\n' +
    '  oled.text("Canal 0:", 0, _y, 1)\n' +
    '  _y += 10\n' +
    '  _visto = []\n' +
    '  if _r0:\n' +
    '    for _a in _r0:\n' +
    '      if _a in _nomes:\n' +
    '        _n = _nomes[_a]\n' +
    '        if _n not in _visto:\n' +
    '          _visto.append(_n)\n' +
    '          oled.text(_n + " OK", 8, _y, 1)\n' +
    '          _y += 10\n' +
    '  if not _visto:\n' +
    '    oled.text("nenhum", 8, _y, 1)\n' +
    '    _y += 10\n' +
    '  oled.text("Canal 1:", 0, _y, 1)\n' +
    '  _y += 10\n' +
    '  _visto = []\n' +
    '  if _r1:\n' +
    '    for _a in _r1:\n' +
    '      if _a in _nomes:\n' +
    '        _n = _nomes[_a]\n' +
    '        if _n not in _visto:\n' +
    '          _visto.append(_n)\n' +
    '          oled.text(_n + " OK", 8, _y, 1)\n' +
    '          _y += 10\n' +
    '  if not _visto:\n' +
    '    oled.text("nenhum", 8, _y, 1)\n' +
    '  oled.show()';

  return '_verificar_sensores()\n';
};
