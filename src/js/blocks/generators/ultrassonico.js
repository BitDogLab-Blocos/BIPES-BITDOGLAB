// Python generators for the external ultrasonic distance sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for ultrasonic blocks.');
    return;
  }

  function ensureUltrassonicoReadSupport() {
    _setupUltrassonicoDefinitions();
    Blockly.Python.definitions_['func_ultrassonico_valor'] =
      'def _ultrassonico_valor():\n' +
      '  _cm = _ultrassonico.ler()\n' +
      '  return 450.0 if _cm is None else _cm\n';
  }

  function ensureUltrassonicoDisplaySupport(displayType) {
    ensureUltrassonicoReadSupport();
    _setupDisplayDefinitions(displayType);
    Blockly.Python.definitions_['func_ultrassonico_mostrar'] =
      'def _ultrassonico_mostrar():\n' +
      '  _cm = _ultrassonico.ler()\n' +
      '  oled.fill(0)\n' +
      '  oled.text("Distancia:", 0, 8, 1)\n' +
      '  if _cm is None:\n' +
      '    oled.text("Sem eco", 0, 28, 1)\n' +
      '  else:\n' +
      '    oled.text("{:.1f} cm".format(_cm), 0, 28, 1)\n' +
      '  oled.show()\n';
  }

  function ensureUltrassonicoGraphSupport(displayType) {
    ensureUltrassonicoDisplaySupport(displayType);
    Blockly.Python.definitions_['func_ultrassonico_grafico'] =
      '_ultrassonico_graficos = {}\n' +
      'def _ultrassonico_grafico(buf_id, valor, pos):\n' +
      '  try:\n' +
      '    _valor = float(valor)\n' +
      '    if buf_id not in _ultrassonico_graficos:\n' +
      '      _ultrassonico_graficos[buf_id] = []\n' +
      '    _buf = _ultrassonico_graficos[buf_id]\n' +
      '    _buf.append(_valor)\n' +
      '    _altura = getattr(oled, "height", 64)\n' +
      '    if pos == 0:\n' +
      '      _y_titulo, _y_ini, _y_fim = 0, 10, _altura - 1\n' +
      '    elif pos == 1:\n' +
      '      _y_titulo, _y_ini, _y_fim = 0, 10, _altura // 2 - 1\n' +
      '    else:\n' +
      '      _y_titulo, _y_ini, _y_fim = _altura // 2, _altura // 2 + 10, _altura - 1\n' +
      '    _limite = 100 if _altura >= 128 else 60\n' +
      '    if len(_buf) > _limite:\n' +
      '      _buf.pop(0)\n' +
      '    oled.fill_rect(0, _y_titulo, 128, 8, 0)\n' +
      '    oled.text("Dist cm", 0, _y_titulo, 1)\n' +
      '    oled.fill_rect(0, _y_ini, 128, _y_fim - _y_ini + 1, 0)\n' +
      '    if len(_buf) < 2:\n' +
      '      oled.show()\n' +
      '      return\n' +
      '    _minimo, _maximo = min(_buf), max(_buf)\n' +
      '    if _maximo == _minimo:\n' +
      '      _maximo = _minimo + 1\n' +
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

  Blockly.Python['ultrassonico_mostrar_distancia'] = function(block) {
    var displayType = _getDisplayType(block);
    ensureUltrassonicoDisplaySupport(displayType);
    return '_ultrassonico_mostrar()\n';
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
