// Shared generator helpers.
'use strict';

// Shared helpers for the modular block generators.

var DEFAULT_DISPLAY_TYPE = 'SMALL';

function _getDisplayType(block) {
  if (!block || !block.getFieldValue) {
    return DEFAULT_DISPLAY_TYPE;
  }
  return block.getFieldValue('DISPLAY_TYPE') || DEFAULT_DISPLAY_TYPE;
}

function _setupDisplayForBlock(block) {
  var displayType = _getDisplayType(block);
  _setupDisplayDefinitions(displayType);
  return displayType;
}

function _setupDisplayForConfig(displayConfig) {
  var displayType = (displayConfig && displayConfig.displayType) || DEFAULT_DISPLAY_TYPE;
  _setupDisplayDefinitions(displayType);
  return displayType;
}

function _usesUltrasonicOnSharedDisplayI2c() {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  var ultrasonic = BitdogLabConfig.EXTERNAL && BitdogLabConfig.EXTERNAL.ULTRASSONICO;

  if (!ultrasonic ||
      ultrasonic.I2C_BUS !== display.I2C_BUS ||
      ultrasonic.I2C_SDA !== pins.I2C_SDA ||
      ultrasonic.I2C_SCL !== pins.I2C_SCL) return false;

  try {
    var workspace = Blockly.getMainWorkspace();
    return Boolean(workspace && workspace.getAllBlocks(false).some(function(block) {
      return block.type === 'ultrassonico_distancia' || block.type === 'ultrassonico_plotar';
    }));
  } catch (_error) {
    return false;
  }
}

function _getSharedExternalI2cFrequency() {
  var display = BitdogLabConfig.DISPLAY;
  var ultrasonic = BitdogLabConfig.EXTERNAL && BitdogLabConfig.EXTERNAL.ULTRASSONICO;
  if (_usesUltrasonicOnSharedDisplayI2c()) {
    return Math.min(Number(display.I2C_FREQ), Number(ultrasonic.I2C_FREQ));
  }
  return display.I2C_FREQ;
}

function _setupSharedExternalI2c() {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  var frequency = _getSharedExternalI2cFrequency();

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['setup_external_i2c'] =
    'i2c = I2C(' + display.I2C_BUS +
    ', scl=Pin(' + pins.I2C_SCL +
    '), sda=Pin(' + pins.I2C_SDA +
    '), freq=' + frequency + ')';

  return 'i2c';
}

function _getBuzzerDisplayConfig() {
  if (Blockly.Python.buzzerDisplayConfig) {
    return Blockly.Python.buzzerDisplayConfig;
  }
  try {
    var ws = Blockly.getMainWorkspace();
    if (!ws) return null;
    var blocks = ws.getAllBlocks();
    var yPos = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
    for (var _bi = 0; _bi < blocks.length; _bi++) {
      if (blocks[_bi].type === 'display_mostrar_status_buzzer') {
        Blockly.Python.buzzerDisplayConfig = {
          line: yPos[blocks[_bi].getFieldValue('LINHA')],
          freqLine: yPos[blocks[_bi].getFieldValue('LINHA_FREQ')],
          showFreq: blocks[_bi].getFieldValue('MOSTRAR_FREQUENCIA') === 'TRUE',
          displayType: _getDisplayType(blocks[_bi])
        };
        return Blockly.Python.buzzerDisplayConfig;
      }
    }
  } catch (e) {}
  return null;
}
