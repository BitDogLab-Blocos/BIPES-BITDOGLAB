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
  var useSoftI2c = _shouldUseSoftI2cForMpuLargeDisplay();
  if (useSoftI2c) {
    Blockly.Python.definitions_['import_soft_i2c'] = 'from machine import SoftI2C';
  } else {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  }
  var setupCode = useSoftI2c
    ? 'i2c = SoftI2C(scl=Pin(' + busPolicy.scl + '), sda=Pin(' + busPolicy.sda +
      '), freq=' + busPolicy.frequency + ', timeout=100000)'
    : 'i2c = I2C(' + busPolicy.bus + ', scl=Pin(' + busPolicy.scl +
      '), sda=Pin(' + busPolicy.sda + '), freq=' + busPolicy.frequency + ')';
  var workspace = _getGeneratorWorkspace();
  var hasRobotStartup = workspace && workspace.getAllBlocks &&
    workspace.getAllBlocks(false).some(function(block) {
      return block.type === 'robo_inicializar' || block.type === 'robo_setas_iniciar';
    });
  Blockly.Python.definitions_['setup_external_i2c'] = hasRobotStartup
    ? BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      'i2c = None\ntry:\n  ' + setupCode +
      '\nexcept Exception as exc:\n  print("I2C do display indisponivel:", exc)\n' +
      BitdogLabConfig.MARKERS.SETUP_END
    : setupCode;

  return 'i2c';
}

function _shouldUseSoftI2cForMpuLargeDisplay() {
  var workspace = _getGeneratorWorkspace();
  if (!workspace || typeof workspace.getAllBlocks !== 'function') return false;
  var blocks = workspace.getAllBlocks(false);
  var usesMpu6050 = blocks.some(function(block) {
    return block.type === 'mpu6050_inclinacao' ||
      block.type === 'mpu6050_aceleracao' ||
      block.type === 'mpu6050_foi_movimentado' ||
      block.type === 'mpu6050_bolinha_display';
  });
  var usesLargeDisplay = blocks.some(function(block) {
    return block.getFieldValue && block.getFieldValue('DISPLAY_TYPE') === 'LARGE';
  });
  return usesMpu6050 && usesLargeDisplay;
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
