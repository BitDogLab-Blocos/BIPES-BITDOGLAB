// Python generators for external LEDs.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) return;

  var COMMAND_TYPES = [
    'led_externo_ligar',
    'led_externo_desligar',
    'led_externo_piscar_rapido',
    'led_externo_piscar_lento'
  ];

  function profile() {
    return global.BitdogLabConfig || {};
  }

  function pins() {
    var external = profile().EXTERNAL || {};
    return external.DIG_PINS || {};
  }

  function activeLevel() {
    var config = (profile().EXTERNAL || {}).EXTERNAL_LED || {};
    return config.ACTIVE_LEVEL === undefined ? 1 : config.ACTIVE_LEVEL;
  }

  function inactiveLevel() {
    var config = (profile().EXTERNAL || {}).EXTERNAL_LED || {};
    return config.INACTIVE_LEVEL === undefined ? 0 : config.INACTIVE_LEVEL;
  }

  function pwmFrequency() {
    var config = (profile().EXTERNAL || {}).EXTERNAL_LED || {};
    return Number(config.PWM_FREQ || 1000);
  }

  function dutyForLevel(level) {
    return Number(level) ? 65535 : 0;
  }

  function dig(block) {
    return String(block.getFieldValue('DIG') || '0');
  }

  function channelComment(block) {
    var labels = {
      R: 'R (vermelho)',
      G: 'G (verde)',
      B: 'B (azul)'
    };
    var channel = String(block.getFieldValue('CHANNEL') || 'R');
    return '# KY-016 ' + (labels[channel] || channel) + ' - Conexao ' + dig(block) + '\n';
  }

  function ensurePinForConnection(connection) {
    connection = String(connection || '0');
    var pin = pins()[connection];
    if (pin === undefined || pin === null) pin = connection;
    var key = 'external_led_pin_' + connection;
    Blockly.Python.definitions_['import_external_led_pin'] = 'from machine import Pin';
    Blockly.Python.definitions_['import_external_led_pwm'] = 'from machine import PWM';
    Blockly.Python.definitions_[key] =
      'external_led_' + connection + ' = PWM(Pin(' + String(pin) + '), freq=' + String(pwmFrequency()) + ')';
    // The safe initial state belongs to setup. If emitted as a regular
    // definition line, the organizer places it at the start of every loop
    // and button-driven LED states cannot persist.
    var markers = profile().MARKERS || {};
    var setupStart = markers.SETUP_START || '# SETUP_BLOCK_START';
    var setupEnd = markers.SETUP_END || '# SETUP_BLOCK_END';
    Blockly.Python.definitions_['external_led_off_' + connection] =
      setupStart + '\n' +
      'external_led_' + connection + '.duty_u16(' + String(dutyForLevel(inactiveLevel())) + ')\n' +
      setupEnd;
    return 'external_led_' + connection;
  }

  function ensurePin(block) {
    return ensurePinForConnection(dig(block));
  }

  function allExternalLedConnections() {
    var config = (profile().EXTERNAL || {}).EXTERNAL_LED || {};
    var allowed = config.ALLOWED_DIG || Object.keys(pins());
    return allowed.map(String).sort();
  }

  function ensureSleep() {
    Blockly.Python.definitions_['import_external_led_time'] = 'import time';
  }

  function commandCode(block, value) {
    var pin = ensurePin(block);
    return channelComment(block) + pin + '.duty_u16(' + String(dutyForLevel(value)) + ')\n';
  }

  Blockly.Python['led_externo_ligar'] = function(block) {
    return commandCode(block, activeLevel());
  };

  Blockly.Python['led_externo_desligar'] = function(block) {
    return commandCode(block, inactiveLevel());
  };

  Blockly.Python['led_externo_desligar_todos'] = function(block) {
    // This block must also work when it is the only external-LED block.
    // The validator prevents using it together with another peripheral on
    // any DIG, so touching all external DIG connections is safe here.
    var connections = allExternalLedConnections();
    var code = '# Desligar todos os LEDs externos usados\n';
    for (var i = 0; i < connections.length; i++) {
      code += ensurePinForConnection(connections[i]) +
        '.duty_u16(' + String(dutyForLevel(inactiveLevel())) + ')\n';
    }
    return code;
  };

  function blink(block, milliseconds) {
    var pin = ensurePin(block);
    ensureSleep();
    return channelComment(block) + pin + '.duty_u16(' + String(dutyForLevel(activeLevel())) + ')\n' +
      'time.sleep_ms(' + String(milliseconds) + ')\n' +
      pin + '.duty_u16(' + String(dutyForLevel(inactiveLevel())) + ')\n' +
      'time.sleep_ms(' + String(milliseconds) + ')\n';
  }

  Blockly.Python['led_externo_piscar_rapido'] = function(block) {
    return blink(block, 200);
  };

  Blockly.Python['led_externo_piscar_lento'] = function(block) {
    return blink(block, 1000);
  };

  Blockly.Python['led_externo_criar_animacao'] = function(block) {
    ensureSleep();
    var code = '';
    var steps = block.steps_ || [];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] === 'action') {
        // `statementToCode` indents a statement because it normally lives
        // inside a parent control block. Animation steps are emitted at the
        // same level as the animation itself, so remove that helper indent.
        var actionCode = Blockly.Python.statementToCode(block, 'STEP' + i);
        code += actionCode ? actionCode.replace(/^  /gm, '') : '';
      } else {
        var duration = Blockly.Python.valueToCode(block, 'TIME' + i, Blockly.Python.ORDER_ATOMIC) || '0';
        // Time reporters use milliseconds internally; this block presents
        // seconds to the learner, so convert before calling time.sleep().
        code += 'time.sleep(float(' + duration + ') / 1000)\n';
      }
    }
    return code;
  };
})(window);
