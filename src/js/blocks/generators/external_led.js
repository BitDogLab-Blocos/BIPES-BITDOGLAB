// Python generators for external LEDs.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) return;

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

  function ensurePin(block) {
    var connection = dig(block);
    var pin = pins()[connection];
    if (pin === undefined || pin === null) pin = connection;
    var key = 'external_led_pin_' + connection;
    Blockly.Python.definitions_['import_external_led_pin'] = 'from machine import Pin';
    Blockly.Python.definitions_['import_external_led_pwm'] = 'from machine import PWM';
    Blockly.Python.definitions_[key] =
      'external_led_' + connection + ' = PWM(Pin(' + String(pin) + '), freq=' + String(pwmFrequency()) + ')';
    Blockly.Python.definitions_['external_led_off_' + connection] =
      'external_led_' + connection + '.duty_u16(' + String(dutyForLevel(inactiveLevel())) + ')';
    return 'external_led_' + connection;
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
        code += Blockly.Python.statementToCode(block, 'STEP' + i);
      } else {
        var duration = Blockly.Python.valueToCode(block, 'TIME' + i, Blockly.Python.ORDER_ATOMIC) || '0';
        code += 'time.sleep_ms(int(' + duration + '))\n';
      }
    }
    return code;
  };
})(window);
