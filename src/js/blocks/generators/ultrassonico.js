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

  Blockly.Python['ultrassonico_distancia'] = function(_block) {
    ensureUltrassonicoReadSupport();
    return ['_ultrassonico_valor()', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['ultrassonico_mostrar_distancia'] = function(block) {
    var displayType = _getDisplayType(block);
    ensureUltrassonicoDisplaySupport(displayType);
    return '_ultrassonico_mostrar()\n';
  };

  console.log('[BitDogLab] Ultrasonic Python generators loaded.');
})(window);
