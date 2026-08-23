'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function runScripts(files, sandbox) {
  vm.createContext(sandbox);
  files.forEach((file) => {
    vm.runInContext(source(file), sandbox, { filename: file });
  });
  return sandbox;
}

function makeFieldDropdown(options) {
  return { kind: 'dropdown', options };
}

function makeBlock() {
  const block = {
    inputs: [],
    fields: {},
    setOutput(value, check) { this.output = { value, check }; },
    setPreviousStatement() {},
    setNextStatement() {},
    setColour(colour) { this.colour = colour; },
    setTooltip(tooltip) { this.tooltip = tooltip; },
    setHelpUrl() {},
    setInputsInline(value) { this.inline = value; },
    appendDummyInput() {
      const input = {
        fields: [],
        appendField: (field, name) => {
          input.fields.push({ field, name });
          if (name) block.fields[name] = field;
          return input;
        }
      };
      block.inputs.push(input);
      return input;
    },
    appendValueInput(name) {
      const input = block.appendDummyInput();
      input.name = name;
      input.setCheck = () => input;
      return input;
    }
  };
  return block;
}

function ultrasonicProfile() {
  return {
    VERSION: 'v7',
    PINS: { I2C_SDA: 2, I2C_SCL: 3, I2C0_SDA: 0, I2C0_SCL: 1 },
    DISPLAY: { I2C_BUS: 1, I2C_FREQ: 400000, WIDTH: 128, HEIGHT: 64 },
    SENSOR: { I2C_BUS: 0, I2C_BUS_ALT: 1, I2C_FREQ: 400000 },
    EXTERNAL: {
      DIG_PINS: { '0': 0, '1': 1, '2': 2, '3': 3 },
      ULTRASSONICO: {
        I2C_BUS: 1,
        I2C_FREQ: 400000,
        I2C_SDA: 2,
        I2C_SCL: 3,
        TRIG_CONNECTION: '3',
        ECHO_CONNECTION: '2'
      }
    },
    MARKERS: { SETUP_START: '# SETUP_BLOCK_START', SETUP_END: '# SETUP_BLOCK_END' }
  };
}

test('ultrasonic blocks expose only the fixed TRIG/SCL and ECHO/SDA connections', () => {
  const Blockly = {
    Blocks: {},
    FieldDropdown: makeFieldDropdown
  };
  const sandbox = { console, window: null, Blockly, Code: { LANG: 'pt-br' }, BitdogLabConfig: ultrasonicProfile() };
  sandbox.window = sandbox;
  runScripts(['src/js/blocks/definitions/ultrassonico.js'], sandbox);

  for (const type of ['ultrassonico_distancia', 'ultrassonico_mostrar_distancia']) {
    const block = makeBlock();
    Blockly.Blocks[type].init.call(block);
    assert.deepEqual(JSON.parse(JSON.stringify(block.fields.TRIG.options)), [['Conexão 3', '3']]);
    assert.deepEqual(JSON.parse(JSON.stringify(block.fields.ECHO.options)), [['Conexão 2', '2']]);
  }
});

test('ultrasonic generators create reading, display, and graph code', () => {
  const Blockly = {
    Python: {
      definitions_: {},
      ORDER_FUNCTION_CALL: 2,
      ORDER_ATOMIC: 0,
      VARIABLE_CATEGORY_NAME: 'VARIABLE',
      valueToCode: () => '_ultrassonico_valor()',
      quote_: (value) => JSON.stringify(value),
      nameDB_: { getDistinctName: (name) => name }
    }
  };
  const profile = ultrasonicProfile();
  const sandbox = {
    console: { log() {}, warn() {} },
    window: null,
    Blockly,
    BitdogLabConfig: profile,
    SensorLibs: { Ultrassonico: 'class SensorUltrassonico: pass' },
    _getDisplayType: () => 'SMALL',
    _setupDisplayDefinitions: () => {}
  };
  sandbox.window = sandbox;
  runScripts([
    'src/js/blocks/generators/sensor.js',
    'src/js/blocks/generators/ultrassonico.js'
  ], sandbox);

  const valueCode = Blockly.Python.ultrassonico_distancia({});
  const displayCode = Blockly.Python.ultrassonico_mostrar_distancia({});
  const graphCode = Blockly.Python.ultrassonico_plotar({
    id: 'graph-1',
    getFieldValue: () => '1'
  });
  const definitions = Blockly.Python.definitions_;

  assert.deepEqual(Array.from(valueCode), ['_ultrassonico_valor()', 2]);
  assert.match(displayCode, /_ultrassonico_mostrar\(\)/);
  assert.match(graphCode, /_ultrassonico_grafico/);
  assert.match(definitions.setup_ultrassonico, /I2C\(1, sda=Pin\(2\), scl=Pin\(3\)/);
  assert.match(definitions.func_ultrassonico_valor, /450\.0 if _cm is None/);
  assert.match(definitions.func_ultrassonico_grafico, /oled\.line/);
});

test('ultrasonic I2C claims use GPIO 2 and GPIO 3', () => {
  const sandbox = { console, window: null, Code: { LANG: 'pt-br' } };
  sandbox.window = sandbox;
  runScripts(['src/js/blocks/contracts/external_resources.js'], sandbox);
  const block = { type: 'ultrassonico_distancia', getFieldValue: () => '3' };
  const claims = sandbox.Code.ExternalResources.getClaims(block, ultrasonicProfile());
  assert.deepEqual(Array.from(claims.map((claim) => claim.pin)).sort((a, b) => a - b), [2, 3]);
  assert.ok(claims.every((claim) => claim.internalI2c));
});

test('validator blocks manually changed ultrasonic connections', () => {
  const invalidBlock = {
    id: 'invalid',
    type: 'ultrassonico_distancia',
    getFieldValue: (field) => field === 'TRIG' ? '0' : '1',
    setWarningText(text) { this.warning = text; }
  };
  const validBlock = {
    id: 'valid',
    type: 'ultrassonico_distancia',
    getFieldValue: (field) => field === 'TRIG' ? '3' : '2',
    setWarningText(text) { this.warning = text; }
  };
  const Code = {
    LANG: 'pt-br',
    BlockTypeDomains: { get: () => [], getOutputWarning: () => '' },
    ExternalResources: null
  };
  const Blockly = {};
  const sandbox = { console, window: null, Code, Blockly, BitdogLabConfig: ultrasonicProfile() };
  sandbox.window = sandbox;
  runScripts([
    'src/js/blocks/contracts/external_resources.js',
    'src/js/blocks/contracts/registry.js',
    'src/js/blocks/contracts/validator.js'
  ], sandbox);

  const invalidReport = Code.BlockContractValidator.getReport({
    getAllBlocks: () => [invalidBlock]
  });
  assert.equal(invalidReport.valid, false);
  assert.match(invalidBlock.warning, /TRIG\/SCL.*Conexão 3.*ECHO\/SDA.*Conexão 2/);

  const validReport = Code.BlockContractValidator.getReport({
    getAllBlocks: () => [validBlock]
  });
  assert.equal(validReport.valid, true);
});
