// Python generators for the external LDR light sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for LDR blocks.');
    return;
  }

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function ldrConfig() {
    var profile = global.BitdogLabConfig || {};
    return profile.EXTERNAL && profile.EXTERNAL.LDR || {};
  }

  function ldrAdcPin() {
    var config = ldrConfig();
    var profile = global.BitdogLabConfig || {};
    if (config.ADC_PIN !== undefined) return config.ADC_PIN;
    return profile.PINS && profile.PINS.MIC;
  }

  function ensureLdrSupport() {
    Blockly.Python.definitions_['import_ldr_pin'] = 'from machine import Pin';
    Blockly.Python.definitions_['import_ldr_adc'] = 'from machine import ADC';
    Blockly.Python.definitions_['setup_ldr'] = 'ldr_adc = ADC(Pin(' + ldrAdcPin() + '))';
  }

  function ldrPercentageExpression() {
    // read_u16() is the MicroPython-normalized ADC range: 0..65535.
    // Keep the block output as an integer percentage for simple comparisons
    // in Blockly (for example, light > 60).
    return 'max(0, min(100, round(ldr_adc.read_u16() * 100 / 65535)))';
  }

  function ensureLdrGraphSupport(displayType) {
    _setupDisplayDefinitions(displayType);
    Blockly.Python.definitions_['import_time'] = 'import time';

    // Keep the graph renderer identical to the DHT11 graph block.
    Blockly.Python.definitions_['fonte_titulo'] =
      '# Fonte 3x5\n' +
      '_ft={"0":[7,5,5,5,7],"1":[2,6,2,2,7],"2":[7,1,7,4,7],"3":[7,1,7,1,7],\n' +
      '"4":[5,5,7,1,1],"5":[7,4,7,1,7],"6":[7,4,7,5,7],"7":[7,1,1,2,2],\n' +
      '"8":[7,5,7,5,7],"9":[7,5,7,1,7],".":[0,0,0,0,2],":":[0,2,0,2,0],\n' +
      '"-":[0,0,7,0,0],"T":[7,2,2,2,2],"e":[7,5,7,4,7],"m":[0,5,7,7,5],\n' +
      '"p":[7,5,7,4,4],"U":[5,5,5,5,7],"i":[2,0,2,2,2],"d":[1,1,7,5,7],\n' +
      '"S":[7,4,7,1,7],"o":[0,0,7,5,7],"a":[0,0,7,5,7],"b":[4,4,7,5,7],\n' +
      '"L":[7,4,4,4,7],"l":[6,2,2,2,7],"t":[2,2,7,2,3],"r":[0,0,7,4,4],"D":[6,5,5,5,6],\n' +
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

    Blockly.Python.definitions_['oled_compat'] =
      '# OLED compatibility helpers\n' +
      'def _oled_hline(x, y, w, c):\n' +
      '  for _x in range(x, x + max(0, w)):\n' +
      '    oled.pixel(_x, y, c)\n' +
      'def _oled_vline(x, y, h, c):\n' +
      '  for _y in range(y, y + max(0, h)):\n' +
      '    oled.pixel(x, _y, c)\n' +
      'def _oled_fill_rect(x, y, w, h, c):\n' +
      '  for _yy in range(y, y + max(0, h)):\n' +
      '    for _xx in range(x, x + max(0, w)):\n' +
      '      oled.pixel(_xx, _yy, c)\n' +
      'def _oled_line(x0, y0, x1, y1, c):\n' +
      '  dx = abs(x1 - x0)\n' +
      '  sx = 1 if x0 < x1 else -1\n' +
      '  dy = -abs(y1 - y0)\n' +
      '  sy = 1 if y0 < y1 else -1\n' +
      '  err = dx + dy\n' +
      '  while True:\n' +
      '    oled.pixel(x0, y0, c)\n' +
      '    if x0 == x1 and y0 == y1:\n' +
      '      break\n' +
      '    e2 = err * 2\n' +
      '    if e2 >= dy:\n' +
      '      err += dy\n' +
      '      x0 += sx\n' +
      '    if e2 <= dx:\n' +
      '      err += dx\n' +
      '      y0 += sy\n' +
      'if not hasattr(oled, "hline"):\n' +
      '  oled.hline = _oled_hline\n' +
      '  oled.vline = _oled_vline\n' +
      '  oled.fill_rect = _oled_fill_rect\n' +
      '  oled.line = _oled_line\n';

    Blockly.Python.definitions_['func_plot_grafico'] =
      '_plot_buffers = {}\n' +
      'def _plot_grafico(buf_id, valor, pos, titulo, display_type="SMALL"):\n' +
      '  try:\n' +
      '    val = float(valor)\n' +
      '    if buf_id not in _plot_buffers:\n' +
      '      _plot_buffers[buf_id] = []\n' +
      '    buf = _plot_buffers[buf_id]\n' +
      '    buf.append(val)\n' +
      '    max_buf_size = 60\n' +
      '    actual_height = getattr(oled, "height", 64)\n' +
      '    if display_type == "LARGE" and actual_height >= 128:\n' +
      '      max_buf_size = 100\n' +
      '      if pos == 0:\n' +
      '        y_tit, y_ini, y_fim = 0, 8, 127\n' +
      '      elif pos == 1:\n' +
      '        y_tit, y_ini, y_fim = 0, 8, 62\n' +
      '      else:\n' +
      '        y_tit, y_ini, y_fim = 64, 72, 127\n' +
      '    else:\n' +
      '      if pos == 0:\n' +
      '        y_tit, y_ini, y_fim = 0, 6, 63\n' +
      '      elif pos == 1:\n' +
      '        y_tit, y_ini, y_fim = 0, 6, 31\n' +
      '      else:\n' +
      '        y_tit, y_ini, y_fim = 32, 38, 63\n' +
      '    if len(buf) > max_buf_size: buf.pop(0)\n' +
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

  Blockly.Python['ldr_valor'] = function(block) {
    ensureLdrSupport();
    return [ldrPercentageExpression(), Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['ldr_plotar'] = function(block) {
    var displayType = _getDisplayType(block);
    ensureLdrSupport();
    ensureLdrGraphSupport(displayType);

    var value = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_ATOMIC) || '0';
    var position = block.getFieldValue('POSICAO') || '0';
    var blockId = String(block.id || 'graph').replace(/[^a-zA-Z0-9_]/g, '_');
    var valueName = Blockly.Python.nameDB_.getDistinctName(
      'ldr_graph_value',
      Blockly.VARIABLE_CATEGORY_NAME
    );
    var title = Blockly.Python.quote_('LDR:') + ' + str(round(' + valueName + ', 1))';

    return valueName + ' = (' + value + ')\n' +
      '_plot_grafico(' + Blockly.Python.quote_('ldr_' + position + '_' + blockId) + ', ' +
      valueName + ', ' + Number(position) + ', ' + title + ', ' +
      Blockly.Python.quote_(displayType) + ')\n';
  };

  console.log('[BitDogLab] LDR Python generators loaded.');
})(window);
