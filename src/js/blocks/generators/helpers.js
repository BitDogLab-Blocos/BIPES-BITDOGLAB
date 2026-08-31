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

function _getGeneratorWorkspace() {
  try {
    return Blockly.getMainWorkspace();
  } catch (_error) {
    return null;
  }
}

function _resolveSharedExternalI2cPolicy() {
  return BitdogLabI2cPolicy.resolveSharedDisplayBus(
    BitdogLabConfig,
    _getGeneratorWorkspace()
  );
}

function _setupSharedExternalI2c(busPolicy) {
  busPolicy = busPolicy || _resolveSharedExternalI2cPolicy();

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['setup_external_i2c'] =
    'i2c = I2C(' + busPolicy.bus +
    ', scl=Pin(' + busPolicy.scl +
    '), sda=Pin(' + busPolicy.sda +
    '), freq=' + busPolicy.frequency + ')';

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
