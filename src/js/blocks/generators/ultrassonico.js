// Python generators for the external ultrasonic distance sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for ultrasonic blocks.');
    return;
  }

  // O display e o sensor usam os mesmos pinos I2C, mas a biblioteca do
  // sensor precisa de 100 kHz. Dois objetos I2C de hardware no mesmo
  // periférico podem causar falhas durante a leitura ou oled.show().
  // Usamos SoftI2C para o sensor e mantemos o hardware I2C exclusivo do OLED.
  function ensureUltrassonicoSharedBus() {
    if (!Blockly.Python.activeDisplayType ||
        !Blockly.Python.definitions_['setup_display']) {
      return false;
    }

    var profile = global.BitdogLabConfig || {};
    var pins = profile.PINS || {};
    var display = profile.DISPLAY || {};
    var config = profile.EXTERNAL && profile.EXTERNAL.ULTRASSONICO || {};
    var bus = config.I2C_BUS !== undefined ? config.I2C_BUS : 1;
    var freq = config.I2C_FREQ || 100000;
    var sda = config.I2C_SDA !== undefined ? config.I2C_SDA : pins.I2C_SDA;
    var scl = config.I2C_SCL !== undefined ? config.I2C_SCL : pins.I2C_SCL;

    Blockly.Python.definitions_['import_soft_i2c'] = 'from machine import SoftI2C';
    Blockly.Python.definitions_['setup_ultrassonico'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '# _i2c_ultrassonico = I2C(' + bus + ', sda=Pin(' + sda + '), scl=Pin(' + scl + '), freq=' + freq + ')\n' +
      '_i2c_ultrassonico = SoftI2C(sda=Pin(' + sda + '), scl=Pin(' + scl + '), freq=' + freq + ')\n' +
      '_ultrassonico = SensorUltrassonico(_i2c_ultrassonico)\n' +
      BitdogLabConfig.MARKERS.SETUP_END;
    Blockly.Python.definitions_['func_ultrassonico_rebind_display'] =
      'def _ultrassonico_rebind_display():\n' +
      '  global _ultrassonico_display_i2c\n' +
      '  _ultrassonico_display_i2c = I2C(' + (display.I2C_BUS !== undefined ? display.I2C_BUS : bus) +
        ', sda=Pin(' + (pins.I2C_SDA !== undefined ? pins.I2C_SDA : sda) +
        '), scl=Pin(' + (pins.I2C_SCL !== undefined ? pins.I2C_SCL : scl) +
        '), freq=' + (display.I2C_FREQ || 400000) + ')\n' +
      '  oled.i2c = _ultrassonico_display_i2c\n';
    Blockly.Python.definitions_['func_ultrassonico_prepare_bus'] =
      'def _ultrassonico_prepare_bus():\n' +
      '  global _i2c_ultrassonico\n' +
      '  _i2c_ultrassonico = SoftI2C(sda=Pin(' + sda + '), scl=Pin(' + scl + '), freq=' + freq + ')\n' +
      '  _ultrassonico.i2c = _i2c_ultrassonico\n';
    return true;
  }

  function ensureUltrassonicoReadSupport() {
    _setupUltrassonicoDefinitions();
    var usesSharedBus = ensureUltrassonicoSharedBus();
    Blockly.Python.definitions_['setup_ultrassonico_cache'] =
      '_ultrassonico_cache_valor = float("nan")\n' +
      '_ultrassonico_cache_tempo = 0\n' +
      '_ultrassonico_cache_pronto = False';
    Blockly.Python.definitions_['setup_ultrassonico_warmup'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      'time.sleep_ms(50)\n' +
      '_ultrassonico.ler()\n' +
      BitdogLabConfig.MARKERS.SETUP_END;
    Blockly.Python.definitions_['func_ultrassonico_valor'] =
      'def _ultrassonico_valor():\n' +
      '  global _ultrassonico_cache_valor, _ultrassonico_cache_tempo, _ultrassonico_cache_pronto\n' +
      '  _agora = time.ticks_ms()\n' +
      '  if _ultrassonico_cache_pronto and time.ticks_diff(_agora, _ultrassonico_cache_tempo) < 50:\n' +
      (usesSharedBus ? '    _ultrassonico_rebind_display()\n' : '') +
      '    return _ultrassonico_cache_valor\n' +
      (usesSharedBus ? '  _ultrassonico_prepare_bus()\n' : '') +
      '  _cm = _ultrassonico.ler()\n' +
      (usesSharedBus ? '  _ultrassonico_rebind_display()\n' : '') +
      '  _ultrassonico_cache_valor = float("nan") if _cm is None else _cm\n' +
      '  _ultrassonico_cache_tempo = time.ticks_ms()\n' +
      '  _ultrassonico_cache_pronto = True\n' +
      '  return _ultrassonico_cache_valor\n';
    Blockly.Python.definitions_['func_ultrassonico_formatar'] =
      'def _ultrassonico_formatar(_valor):\n' +
      '  return "OBJ" if _valor != _valor else str(_valor)\n';
  }

  function ensureUltrassonicoGraphSupport(displayType) {
    _setupDisplayDefinitions(displayType);
    ensureUltrassonicoReadSupport();
    Blockly.Python.definitions_['func_ultrassonico_grafico'] =
      '_ultrassonico_graficos = {}\n' +
      'def _ultrassonico_grafico(buf_id, valor, pos):\n' +
      '  try:\n' +
      '    _valor = float(valor)\n' +
      '    if buf_id not in _ultrassonico_graficos:\n' +
      '      _ultrassonico_graficos[buf_id] = []\n' +
      '    _buf = _ultrassonico_graficos[buf_id]\n' +
      '    _altura = getattr(oled, "height", 64)\n' +
      '    if pos == 0:\n' +
      '      _y_titulo, _y_ini, _y_fim = 0, 10, _altura - 1\n' +
      '    elif pos == 1:\n' +
      '      _y_titulo, _y_ini, _y_fim = 0, 10, _altura // 2 - 1\n' +
      '    else:\n' +
      '      _y_titulo, _y_ini, _y_fim = _altura // 2, _altura // 2 + 10, _altura - 1\n' +
      '    if _valor != _valor:\n' +
      '      if not _buf:\n' +
      '        oled.fill_rect(0, _y_titulo, 128, _y_fim - _y_titulo + 1, 0)\n' +
      '        oled.text("OBJ", 0, _y_titulo, 1)\n' +
      '        oled.show()\n' +
      '        return\n' +
      '      _valor = _buf[-1]\n' +
      '    _buf.append(_valor)\n' +
      '    _limite = 100 if _altura >= 128 else 60\n' +
      '    if len(_buf) > _limite:\n' +
      '      _buf.pop(0)\n' +
      '    oled.fill_rect(0, _y_titulo, 128, 8, 0)\n' +
      '    oled.text("Dist:" + str(round(_valor, 1)), 0, _y_titulo, 1)\n' +
      '    oled.fill_rect(0, _y_ini, 128, _y_fim - _y_ini + 1, 0)\n' +
      '    if len(_buf) < 2:\n' +
      '      oled.show()\n' +
      '      return\n' +
      '    _minimo, _maximo = min(_buf), max(_buf)\n' +
      '    if _maximo == _minimo:\n' +
      '      _margem = max(1.0, abs(_minimo) * 0.05)\n' +
      '      _minimo = max(0.0, _minimo - _margem)\n' +
      '      _maximo = _maximo + _margem\n' +
      '    _x_ini = 30\n' +
      '    _altura_grafico = _y_fim - _y_ini\n' +
      '    oled.hline(_x_ini, _y_fim, 128 - _x_ini, 1)\n' +
      '    for _i in range(len(_buf)):\n' +
      '      _x = _x_ini + int(_i * (127 - _x_ini) / (len(_buf) - 1))\n' +
      '      _y = _y_fim - int((_buf[_i] - _minimo) / (_maximo - _minimo) * _altura_grafico)\n' +
      '      _y = max(_y_ini, min(_y, _y_fim))\n' +
      '      if _i > 0:\n' +
      '        _xp = _x_ini + int((_i - 1) * (127 - _x_ini) / (len(_buf) - 1))\n' +
      '        _yp = _y_fim - int((_buf[_i - 1] - _minimo) / (_maximo - _minimo) * _altura_grafico)\n' +
      '        _yp = max(_y_ini, min(_yp, _y_fim))\n' +
      '        oled.line(_xp, _yp, _x, _y, 1)\n' +
      '    oled.text("{:.0f}".format(_maximo), 0, _y_ini, 1)\n' +
      '    oled.text("{:.0f}".format(_minimo), 0, max(_y_ini, _y_fim - 8), 1)\n' +
      '    oled.show()\n' +
      '  except Exception:\n' +
      '    pass\n';
  }

  Blockly.Python['ultrassonico_distancia'] = function(_block) {
    ensureUltrassonicoReadSupport();
    return ['_ultrassonico_valor()', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['ultrassonico_plotar'] = function(block) {
    var displayType = _getDisplayType(block);
    ensureUltrassonicoGraphSupport(displayType);

    var value = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_ATOMIC) || '450.0';
    var position = block.getFieldValue('POSICAO') || '0';
    var blockId = String(block.id || 'graph').replace(/[^a-zA-Z0-9_]/g, '_');
    var valueName = Blockly.Python.nameDB_.getDistinctName(
      'ultrassonico_graph_value',
      Blockly.VARIABLE_CATEGORY_NAME
    );

    return valueName + ' = (' + value + ')\n' +
      '_ultrassonico_grafico(' + Blockly.Python.quote_('ultrassonico_' + position + '_' + blockId) + ', ' +
      valueName + ', ' + Number(position) + ')\n';
  };

  console.log('[BitDogLab] Ultrasonic Python generators loaded.');
})(window);
