// Python generators for external contact blocks.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for external contact blocks.');
    return;
  }

  function contactConfig() {
    var profile = global.BitdogLabConfig || {};
    var external = profile.EXTERNAL || {};
    return external.EXTERNAL_CONTACT || {};
  }

  function digPins() {
    var profile = global.BitdogLabConfig || {};
    var external = profile.EXTERNAL || {};
    return external.DIG_PINS || {};
  }

  function allowedConnections() {
    var config = contactConfig();
    return (config.ALLOWED_DIG || Object.keys(digPins())).map(String);
  }

  function pythonDigMap() {
    var pins = digPins();
    return '{' + allowedConnections().map(function(dig) {
      return String(Number(dig)) + ': ' + String(pins[dig]);
    }).join(', ') + '}';
  }

  function selectedCommonMode() {
    var config = contactConfig();
    var fallback = config.DEFAULT_COMMON === '3V3' ? '3V3' : 'GND';
    var workspace = Blockly.getMainWorkspace && Blockly.getMainWorkspace();
    if (!workspace || !workspace.getAllBlocks) return fallback;

    var blocks = workspace.getAllBlocks(false);
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.type !== 'external_contact_prepare' || !block.getFieldValue) continue;
      if (block.isEnabled && !block.isEnabled()) continue;
      return block.getFieldValue('COMMON') === '3V3' ? '3V3' : 'GND';
    }
    return fallback;
  }

  function setupContactRuntime() {
    var config = contactConfig();
    var common = selectedCommonMode();
    var debounce = Math.max(1, Number(config.DEBOUNCE_MS) || 50);
    var pull = common === '3V3' ? 'Pin.PULL_DOWN' : 'Pin.PULL_UP';
    var activeLevel = common === '3V3' ? 1 : 0;

    Blockly.Python.definitions_.import_external_contact_pin = 'from machine import Pin';
    Blockly.Python.definitions_.import_external_contact_time = 'import time';
    Blockly.Python.definitions_.external_contact_state =
      '_contact_pin_numbers = ' + pythonDigMap() + '\n' +
      '_contact_common = ' + JSON.stringify(common) + '\n' +
      '_contact_pull = ' + pull + '\n' +
      '_contact_active_level = ' + String(activeLevel) + '\n' +
      '_contact_debounce_ms = ' + String(debounce) + '\n' +
      '_contact_pins = {}\n' +
      '_contact_states = {}\n' +
      '_contact_event_seen = {}';
    Blockly.Python.definitions_.external_contact_helpers =
      'def _contact_get(dig):\n' +
      '  dig = int(dig)\n' +
      '  if dig not in _contact_pin_numbers:\n' +
      '    raise ValueError("Unknown external contact Connection: %s" % dig)\n' +
      '  if dig not in _contact_pins:\n' +
      '    pin = Pin(_contact_pin_numbers[dig], Pin.IN, _contact_pull)\n' +
      '    raw = pin.value()\n' +
      '    _contact_pins[dig] = pin\n' +
      '    _contact_states[dig] = {"raw": raw, "stable": raw, "changed": time.ticks_ms(), "event": 0}\n' +
      '  return _contact_pins[dig]\n' +
      '\n' +
      'def _contact_update(dig):\n' +
      '  dig = int(dig)\n' +
      '  pin = _contact_get(dig)\n' +
      '  state = _contact_states[dig]\n' +
      '  raw = pin.value()\n' +
      '  now = time.ticks_ms()\n' +
      '  if raw != state["raw"]:\n' +
      '    state["raw"] = raw\n' +
      '    state["changed"] = now\n' +
      '  elif raw != state["stable"] and time.ticks_diff(now, state["changed"]) >= _contact_debounce_ms:\n' +
      '    was_contact = state["stable"] == _contact_active_level\n' +
      '    state["stable"] = raw\n' +
      '    has_contact = raw == _contact_active_level\n' +
      '    if has_contact and not was_contact:\n' +
      '      state["event"] += 1\n' +
      '  return state["stable"] == _contact_active_level\n' +
      '\n' +
      'def _contact_is_closed(dig):\n' +
      '  return _contact_update(dig)\n' +
      '\n' +
      'def _contact_take_event(dig, event_key):\n' +
      '  dig = int(dig)\n' +
      '  _contact_update(dig)\n' +
      '  state = _contact_states[dig]\n' +
      '  last_event = _contact_event_seen.get(event_key, 0)\n' +
      '  if state["event"] != last_event:\n' +
      '    _contact_event_seen[event_key] = state["event"]\n' +
      '    return True\n' +
      '  return False';
  }

  function digValue(block) {
    var dig = String(block.getFieldValue('DIG') || '0');
    return allowedConnections().indexOf(dig) === -1 ? '0' : String(Number(dig));
  }

  Blockly.Python.external_contact_prepare = function() {
    setupContactRuntime();
    return '';
  };

  Blockly.Python.external_contact_when_closed = function(block) {
    setupContactRuntime();
    var branch = Blockly.Python.statementToCode(block, 'DO');
    if (!branch) branch = Blockly.Python.INDENT + 'pass\n';
    var eventKey = JSON.stringify('contact_' + String(block.id || 'event'));
    return 'if _contact_take_event(' + digValue(block) + ', ' + eventKey + '):\n' + branch;
  };

  Blockly.Python.external_contact_is_closed = function(block) {
    setupContactRuntime();
    return ['_contact_is_closed(' + digValue(block) + ')', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python.external_contact_test_matrix = function() {
    setupContactRuntime();
    var profile = global.BitdogLabConfig || {};
    var pins = profile.PINS || {};
    var matrixConfig = profile.NEOPIXEL || {};
    var matrix = matrixConfig.MATRIX || [
      [24, 23, 22, 21, 20],
      [15, 16, 17, 18, 19],
      [14, 13, 12, 11, 10],
      [5, 6, 7, 8, 9],
      [4, 3, 2, 1, 0]
    ];
    var brightness = Math.max(8, Math.round(45 * (Number(matrixConfig.BRIGHTNESS) || 0.3)));
    var blue = Math.max(4, Math.round(brightness * 0.65));

    Blockly.Python.definitions_.import_external_contact_neopixel = 'import neopixel';
    Blockly.Python.definitions_.external_contact_matrix_setup =
      '_contact_matrix = neopixel.NeoPixel(Pin(' + String(pins.NEOPIXEL) + '), ' + String(matrixConfig.COUNT || 25) + ')\n' +
      '_contact_matrix_map = ' + JSON.stringify(matrix) + '\n' +
      '_contact_test_button = Pin(' + String(pins.BUTTON_A) + ', Pin.IN, Pin.PULL_UP)';

    var columns = [0, 1, 3, 4];
    var pairs = allowedConnections().slice(0, 4).map(function(dig, index) {
      return '(' + String(Number(dig)) + ', ' + String(columns[index]) + ')';
    }).join(', ');
    var code = 'while _contact_test_button.value() != 0:\n';
    code += '  for _contact_led in range(' + String(matrixConfig.COUNT || 25) + '):\n';
    code += '    _contact_matrix[_contact_led] = (0, 0, 0)\n';
    code += '  for _contact_dig, _contact_column in (' + pairs + '):\n';
    code += '    if _contact_is_closed(_contact_dig):\n';
    code += '      for _contact_row in range(5):\n';
    code += '        _contact_index = _contact_matrix_map[_contact_row][_contact_column]\n';
    code += '        _contact_matrix[_contact_index] = (0, ' + String(brightness) + ', ' + String(blue) + ')\n';
    code += '  _contact_matrix.write()\n';
    code += '  time.sleep_ms(20)\n';
    code += 'while _contact_test_button.value() == 0:\n';
    code += '  time.sleep_ms(20)\n';
    code += 'for _contact_led in range(' + String(matrixConfig.COUNT || 25) + '):\n';
    code += '  _contact_matrix[_contact_led] = (0, 0, 0)\n';
    code += '_contact_matrix.write()\n';
    return code;
  };

  console.log('[BitDogLab] External contact generators loaded.');
})(window);
