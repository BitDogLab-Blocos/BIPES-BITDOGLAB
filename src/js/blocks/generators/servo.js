// Generators for external servo motor blocks.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for servo blocks.');
    return;
  }

  function servoConfig() {
    return global.BitdogLabConfig.EXTERNAL.SERVO;
  }

  function digPins() {
    return global.BitdogLabConfig.EXTERNAL.DIG_PINS;
  }

  function pythonDigMap() {
    var pins = digPins();
    return '{' + Object.keys(pins).map(function(dig) {
      return String(Number(dig)) + ': ' + String(pins[dig]);
    }).join(', ') + '}';
  }

  function ensureServoSupport() {
    var config = servoConfig();

    Blockly.Python.definitions_['import_servo_machine'] = 'from machine import Pin, PWM';
    Blockly.Python.definitions_['setup_servo_state'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '_servo_pins = ' + pythonDigMap() + '\n' +
      '_servo_pwms = {}\n' +
      '_servo_angles = {}\n' +
      '_servo_joystick_started = {}\n' +
      BitdogLabConfig.MARKERS.SETUP_END;

    Blockly.Python.definitions_['servo_helpers'] =
      'def _servo_get(dig):\n' +
      '  dig = int(dig)\n' +
      '  if dig not in _servo_pins:\n' +
      '    raise ValueError("Invalid external DIG")\n' +
      '  if dig not in _servo_pwms:\n' +
      '    _servo_pwms[dig] = PWM(Pin(_servo_pins[dig]))\n' +
      '    _servo_pwms[dig].freq(' + config.PWM_FREQ + ')\n' +
      '    _servo_angles[dig] = 0\n' +
      '  return _servo_pwms[dig]\n' +
      '\n' +
      'def _servo_move(dig, degrees):\n' +
      '  dig = int(dig)\n' +
      '  degrees = max(' + config.MIN_ANGLE + ', min(' + config.MAX_ANGLE + ', degrees))\n' +
      '  pulse = ' + config.MIN_PULSE_NS + ' + int(((' + config.MAX_PULSE_NS + ' - ' + config.MIN_PULSE_NS + ') * degrees) // ' + (config.MAX_ANGLE - config.MIN_ANGLE) + ')\n' +
      '  _servo_get(dig).duty_ns(pulse)\n' +
      '  _servo_angles[dig] = degrees\n' +
      '  return degrees\n' +
      '\n' +
      'def _servo_current_angle(dig):\n' +
      '  return _servo_angles.get(int(dig), 0)';
  }

  function numberFieldCode(block, fieldName, fallback) {
    var value = block.getFieldValue(fieldName);
    return value === null || value === '' ? fallback : String(value);
  }

  function distinctName(baseName) {
    return Blockly.Python.nameDB_.getDistinctName(baseName, Blockly.VARIABLE_CATEGORY_NAME);
  }

  function indentOrPass(code) {
    return code && code.trim() ? code : '  pass\n';
  }

  function indentCode(code) {
    if (!code || !code.trim()) return '';
    return code.split('\n').map(function(line) {
      return line ? '  ' + line : '';
    }).join('\n').replace(/\n*$/, '\n');
  }

  function sequentialAngleDisplayCode(block, dig) {
    var nextBlock = block.getNextBlock && block.getNextBlock();
    if (!nextBlock || nextBlock.type !== 'display_mostrar_valor') return '';

    var valueBlock = nextBlock.getInputTargetBlock && nextBlock.getInputTargetBlock('VALOR');
    if (!valueBlock || valueBlock.type !== 'servo_angulo_atual') return '';
    if (Number(valueBlock.getFieldValue('DIG')) !== dig) return '';

    var generator = Blockly.Python[nextBlock.type];
    if (typeof generator !== 'function') return '';
    var code = generator.call(Blockly.Python, nextBlock);
    return typeof code === 'string' ? indentCode(code) : '';
  }

  function joystickCondition(physicalDirection) {
    var joystick = BitdogLabConfig.JOYSTICK;
    var center = joystick.CENTER_VALUE;
    var deadzone = joystick.DEADZONE;
    var invertX = joystick.INVERT_X === true;
    var invertY = joystick.INVERT_Y === true;

    var conditions = {
      RIGHT: invertX
        ? '_servo_joy_x_value > ' + (center + deadzone)
        : '_servo_joy_x_value < ' + (center - deadzone),
      LEFT: invertX
        ? '_servo_joy_x_value < ' + (center - deadzone)
        : '_servo_joy_x_value > ' + (center + deadzone),
      UP: invertY
        ? '_servo_joy_y_value > ' + (center + deadzone)
        : '_servo_joy_y_value < ' + (center - deadzone),
      DOWN: invertY
        ? '_servo_joy_y_value < ' + (center - deadzone)
        : '_servo_joy_y_value > ' + (center + deadzone)
    };

    return conditions[physicalDirection] || conditions.UP;
  }

  Blockly.Python['servo_mover'] = function(block) {
    ensureServoSupport();
    var dig = Number(block.getFieldValue('DIG'));
    var angle = numberFieldCode(block, 'ANGLE', '90');
    return '_servo_move(' + dig + ', ' + angle + ')\n';
  };

  Blockly.Python['servo_angulo_atual'] = function(block) {
    ensureServoSupport();
    var dig = Number(block.getFieldValue('DIG'));
    return ['_servo_current_angle(' + dig + ')', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['servo_joystick_controlar'] = function(block) {
    ensureServoSupport();
    Blockly.Python.definitions_['import_servo_adc'] = 'from machine import ADC';

    var pins = BitdogLabConfig.PINS;
    var dig = Number(block.getFieldValue('DIG'));
    var increaseDirection = block.getFieldValue('DIR_INCREASE') || 'UP';
    var decreaseDirection = block.getFieldValue('DIR_DECREASE') || 'DOWN';
    var initialAngle = numberFieldCode(block, 'INITIAL_ANGLE', '90');
    var step = numberFieldCode(block, 'STEP', '2');

    Blockly.Python.definitions_['setup_servo_joystick_x'] =
      '_servo_joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
    Blockly.Python.definitions_['setup_servo_joystick_y'] =
      '_servo_joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';

    var code = '';
    code += 'if ' + dig + ' not in _servo_joystick_started:\n';
    code += '  _servo_move(' + dig + ', ' + initialAngle + ')\n';
    code += '  _servo_joystick_started[' + dig + '] = True\n';
    code += '_servo_joy_x_value = _servo_joy_x.read_u16()\n';
    code += '_servo_joy_y_value = _servo_joy_y.read_u16()\n';
    code += '_servo_joy_step = max(1, abs(' + step + '))\n';
    code += 'if ' + joystickCondition(increaseDirection) + ':\n';
    code += '  _servo_move(' + dig + ', _servo_current_angle(' + dig + ') + _servo_joy_step)\n';
    code += 'elif ' + joystickCondition(decreaseDirection) + ':\n';
    code += '  _servo_move(' + dig + ', _servo_current_angle(' + dig + ') - _servo_joy_step)\n';
    return code;
  };

  function gradualCode(block, ascending) {
    ensureServoSupport();
    Blockly.Python.definitions_['import_servo_time'] = 'import time';

    var config = servoConfig();
    var dig = Number(block.getFieldValue('DIG'));
    var targetExpression = numberFieldCode(block, 'TARGET', '90');
    var stepExpression = numberFieldCode(block, 'STEP', '10');
    var pauseExpression = numberFieldCode(block, 'PAUSE', '3');
    var eachStep = Blockly.Python.statementToCode(block, 'EACH_STEP');
    var sequentialDisplay = sequentialAngleDisplayCode(block, dig);
    var stepActions = indentOrPass((eachStep || '') + sequentialDisplay);
    var targetName = distinctName('servo_target');
    var stepName = distinctName('servo_step');
    var pauseName = distinctName('servo_pause');
    var angleName = distinctName('servo_angle');
    var startAngle = ascending ? config.MIN_ANGLE : config.MAX_ANGLE;
    var comparison = ascending ? '<' : '>';
    var advance = ascending
      ? 'min(' + angleName + ' + ' + stepName + ', ' + targetName + ')'
      : 'max(' + angleName + ' - ' + stepName + ', ' + targetName + ')';

    var code = '';
    code += targetName + ' = max(' + config.MIN_ANGLE + ', min(' + config.MAX_ANGLE + ', ' + targetExpression + '))\n';
    code += stepName + ' = max(1, abs(' + stepExpression + '))\n';
    code += pauseName + ' = max(0, ' + pauseExpression + ')\n';
    code += angleName + ' = ' + startAngle + '\n';
    code += 'while True:\n';
    code += '  _servo_move(' + dig + ', ' + angleName + ')\n';
    code += stepActions;
    code += '  if not (' + angleName + ' ' + comparison + ' ' + targetName + '):\n';
    code += '    break\n';
    code += '  time.sleep(' + pauseName + ')\n';
    code += '  ' + angleName + ' = ' + advance + '\n';
    return code;
  }

  Blockly.Python['servo_subir_gradualmente'] = function(block) {
    return gradualCode(block, true);
  };

  Blockly.Python['servo_descer_gradualmente'] = function(block) {
    return gradualCode(block, false);
  };

  console.log('[BitDogLab] External servo generators loaded.');
})(window);
