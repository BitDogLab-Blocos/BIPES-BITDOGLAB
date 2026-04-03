// Auto-extracted from legacy generators.js into base.js
'use strict';

let UPythonClass = {};

Blockly.Blocks['text_eval'] = {
  init: function() {
    this.setColour(45);
    this.setInputsInline(true);
    this.appendDummyInput()
        .appendField("eval")
        .appendField(new Blockly.FieldTextInput(""), "text");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('direct python eval');
  }
};

Blockly.Python["controls_repeat_simple"] = function(block) {
  var times = block.getFieldValue('TIMES');
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  // CRITICAL FIX: Replace 'while True:' with limited iterations
  // This allows infinite-loop blocks to work inside "Repeat X times"
  if (statements && statements.includes('while True:')) {
    // Replace while True: with for loop limited to X times
    statements = statements.replace(/while True:/g, 'for _inner_rep in range(' + times + '):');

    // Since we already handle the repetition inside, we don't need outer loop
    var code = '';
    if (statements && statements.trim()) {
      code += statements;
    } else {
      code += 'pass\n';
    }
    return code;
  }

  // Normal case: Simple for loop
  var code = 'for _rep in range(' + times + '):\n';

  if (statements && statements.trim()) {
    // Add indentation line by line
    var lines = statements.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        code += '  ' + lines[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }

  return code;
};

Blockly.Python["controls_repeat_forever"] = function(block) {
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  var code = 'while True:\n';

  if (statements && statements.trim()) {
    // Add indentation line by line
    var lines = statements.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        code += '  ' + lines[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }

  return code;
};

Blockly.Python["math_number"] = function(block) {
  var number = block.getFieldValue('NUM');
  var code = String(number);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["text"] = function(block) {
  var text = block.getFieldValue('TEXT');
  var code = Blockly.Python.quote_(text);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["logic_boolean"] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_red"] = function(block) {
  return ['(255, 0, 0)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_green"] = function(block) {
  return ['(0, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_blue"] = function(block) {
  return ['(0, 0, 255)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_yellow"] = function(block) {
  return ['(255, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_cyan"] = function(block) {
  return ['(0, 255, 255)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_magenta"] = function(block) {
  return ['(255, 0, 255)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_white"] = function(block) {
  return ['(255, 255, 255)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_orange"] = function(block) {
  return ['(255, 128, 0)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_pink"] = function(block) {
  return ['(255, 64, 128)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_lime"] = function(block) {
  return ['(128, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_skyblue"] = function(block) {
  return ['(64, 196, 255)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["colour_turquoise"] = function(block) {
  return ['(64, 224, 208)', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["mix_colours"] = function(block) {
  var colors = [];
  for (var i = 0; i < block.itemCount_; i++) {
    var color = Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) || '(0, 0, 0)';
    colors.push(color);
  }
  if (colors.length === 0) {
    return ['(0, 0, 0)', Blockly.Python.ORDER_ATOMIC];
  }
  var code = '(';
  code += 'int(sum([' + colors.join('[0], ') + '[0]])/' + colors.length + '), ';
  code += 'int(sum([' + colors.join('[1], ') + '[1]])/' + colors.length + '), ';
  code += 'int(sum([' + colors.join('[2], ') + '[2]])/' + colors.length + ')';
  code += ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_segundos"] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 1000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_milisegundos"] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_minutos"] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 60000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_horas"] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 3600000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_ligado"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = '(time.ticks_ms() // 1000)';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tempo_cronometro"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  // Get chronometer name from block field
  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  // Initialize chronometer variables if not already defined
  Blockly.Python.definitions_['init_' + varName] = varName + '_start = 0\n' + varName + '_paused = 0\n' + varName + '_running = False';

  // Return elapsed time in seconds
  var code = '(time.ticks_diff(time.ticks_ms(), ' + varName + '_start) // 1000 if ' + varName + '_running else ' + varName + '_paused // 1000)';
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

Blockly.Python["esperar_segundos"] = function(block) {
  // Skip if already consumed by an animation block (timed mode)
  if (block._animConsumed) {
    block._animConsumed = false;
    return '';
  }
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

Blockly.Python["esperar_milisegundos"] = function(block) {
  // Skip if already consumed by an animation block (timed mode)
  if (block._animConsumed) {
    block._animConsumed = false;
    return '';
  }
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

Blockly.Python["delay_ms"] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

Blockly.Python["delay_us"] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_us(' + value_time + ')\n';
  return code;
};

Blockly.Python["ticks_ms"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.ticks_ms()\n';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["ticks_diff"] = function(block) {
  var value_start = Blockly.Python.valueToCode(block, 'start', Blockly.Python.ORDER_ATOMIC);
  var value_end = Blockly.Python.valueToCode(block, 'end', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  value_start = value_start.split('\n').join('');
  value_end = value_end.split('\n').join('');
  var code = 'time.ticks_diff(' + value_end + ',' + value_start + ')\n';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["delay"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var value_time = block.getFieldValue('TIME');
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

Blockly.Python["delay_seconds"] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

Blockly.Python["delay_milliseconds"] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

Blockly.Python["pwm"] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_ATOMIC);
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.check([value_frequency, value_duty], value_pin);
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\npwm${value_pin}.freq(${value_frequency})\npwm${value_pin}.duty(${value_duty})\n`;
  return code;
};

Blockly.Python["pwm_pico"] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_ATOMIC);
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.check([value_frequency, value_duty], value_pin);
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\npwm${value_pin}.freq(${value_frequency})\npwm${value_pin}.duty_u16(${value_duty})\n`;
  return code;
};

Blockly.Python["pwm.init"] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\n`;
  return code;
};

Blockly.Python["pwm.freq"] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.freq(${value_frequency})\n`;
  this.check(value_frequency, number_id);
  return code;
};

Blockly.Python["pwm.duty"] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.duty(${value_duty})\n`;
  this.check(value_duty, number_id);
  return code;
};

Blockly.Python["pwm.duty_pico"] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.duty_u16(${value_duty})\n`;
  this.check(value_duty, number_id);
  return code;
};

Blockly.Python["pwm.deinit"] = function(block) {
  var number_id = block.getFieldValue('ID');
  var code = `pwm${number_id}.deinit()\n`;
  return code;
};

Blockly.Python["stop_timer"] = function(block) {
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  var tn = Blockly.Python.valueToCode(block, 'timerNumber', Blockly.Python.ORDER_ATOMIC);
  var code = 'tim' + tn + '.deinit()\n';
  return code;
};

Blockly.Python["timer"] = function(block) {
  var interval = block.getFieldValue('interval');
  var timerNumber = block.getFieldValue('timerNumber');
  var statements_name = Blockly.Python.statementToCode(block, 'statements');
  var dropdown_mode = block.getFieldValue('MODE');
  var globals = [];
  var workspace = block.workspace;
  var variables = Blockly.Variables.allUsedVarModels(workspace) || [];
  for (var i = 0, variable; (variable = variables[i]); i++) {
    var varName = variable.name;
    if (block.getVars().indexOf(varName) == -1) {
      globals.push(Blockly.Python.nameDB_.getName(varName, Blockly.VARIABLE_CATEGORY_NAME));
    }
  }
  globals = globals.length ? Blockly.Python.INDENT + 'global ' + globals.join(', ') + '\n' : '';
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  Blockly.Python.definitions_[`import_timer_start${timerNumber}`] = `tim${timerNumber} = Timer(${timerNumber})`;
  Blockly.Python.definitions_[`import_timer_callback${timerNumber}`] = `\n#Timer Function Callback\ndef timerFunc${timerNumber}(t):\n${globals}${statements_name}\n\n`;
  var code = `tim${timerNumber}.init(period=${interval}, mode=Timer.${dropdown_mode}, callback=timerFunc${timerNumber})\n`;
  return code
};

Blockly.Python["pico_timer"] = function(block) {
  var interval = block.getFieldValue('interval');
  var timerNumber = block.getFieldValue('timerNumber');
  var statements_name = Blockly.Python.statementToCode(block, 'statements');
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  Blockly.Python.definitions_['import_timer_start'] = 'tim=Timer()';
  Blockly.Python.definitions_['import_timer_callback'] = '\n#Timer Function Callback\ndef timerFunc(t):\n' + statements_name + '\n\n';
  var code = 'tim.init(period=' + interval + ', mode=Timer.PERIODIC, callback=timerFunc)\n';
  return code;
};

Blockly.Python["math_min"] = function(block) {
  var value1 = Blockly.Python.valueToCode(block, 'VALUE1', Blockly.Python.ORDER_ATOMIC);
  var value2 = Blockly.Python.valueToCode(block, 'VALUE2', Blockly.Python.ORDER_ATOMIC);
  var code = 'min(' + value1 + ', ' + value2 + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_max"] = function(block) {
  var value1 = Blockly.Python.valueToCode(block, 'VALUE1', Blockly.Python.ORDER_ATOMIC);
  var value2 = Blockly.Python.valueToCode(block, 'VALUE2', Blockly.Python.ORDER_ATOMIC);
  var code = 'max(' + value1 + ', ' + value2 + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_number_property"] = function(block) {
  var number = Blockly.Python.valueToCode(block, 'NUMBER_TO_CHECK', Blockly.Python.ORDER_ATOMIC);
  var property = block.getFieldValue('PROPERTY');
  var code;
  switch (property) {
    case 'EVEN':
      code = number + ' % 2 == 0';
      break;
    case 'ODD':
      code = number + ' % 2 == 1';
      break;
    case 'POSITIVE':
      code = number + ' > 0';
      break;
    case 'NEGATIVE':
      code = number + ' < 0';
      break;
    default:
      throw Error('Unknown property: ' + property);
  }
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

Blockly.Python["math_is_divisible_by"] = function(block) {
  var dividend = Blockly.Python.valueToCode(block, 'DIVIDEND', Blockly.Python.ORDER_ATOMIC);
  var divisor = Blockly.Python.valueToCode(block, 'DIVISOR', Blockly.Python.ORDER_ATOMIC);
  var code = dividend + ' % ' + divisor + ' == 0';
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

Blockly.Python["math_round_to_decimal"] = function(block) {
  var number_to_round = Blockly.Python.valueToCode(block, 'NUMBER_TO_ROUND', Blockly.Python.ORDER_ATOMIC) || '0';
  var decimal_places = block.getFieldValue('DECIMAL_PLACES');
  var code = 'round(' + number_to_round + ', ' + decimal_places + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_on_list"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_NONE) || '[]';
  var operation = block.getFieldValue('OP');
  var code;
  switch (operation) {
    case 'SUM':
      code = 'sum(' + list + ')';
      break;
    case 'MIN':
      code = 'min(' + list + ')';
      break;
    case 'MAX':
      code = 'max(' + list + ')';
      break;
    case 'AVERAGE':
      Blockly.Python.definitions_['import_statistics'] = 'import statistics';
      code = 'statistics.mean(' + list + ')';
      break;
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      code = 'random.choice(' + list + ')';
      break;
    default:
      throw Error('Unknown operation: ' + operation);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_arithmetic"] = function(block) {
  var OPERATORS = {
    'ADD': [' + ', Blockly.Python.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.Python.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'POWER': [' ** ', Blockly.Python.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Python["math_single"] = function(block) {
  var operator = block.getFieldValue('OP');
  var code;
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';

  switch (operator) {
    case 'ROOT':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.sqrt(' + arg + ')';
      break;
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'LN':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.log(' + arg + ')';
      break;
    case 'LOG10':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.log10(' + arg + ')';
      break;
    case 'EXP':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = '10 ** ' + arg;
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_trig"] = function(block) {
  var operator = block.getFieldValue('OP');
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';
  Blockly.Python.definitions_['import_math'] = 'import math';

  var code;
  switch (operator) {
    case 'SIN':
      code = 'math.sin(' + arg + ')';
      break;
    case 'COS':
      code = 'math.cos(' + arg + ')';
      break;
    case 'TAN':
      code = 'math.tan(' + arg + ')';
      break;
    case 'ASIN':
      code = 'math.asin(' + arg + ')';
      break;
    case 'ACOS':
      code = 'math.acos(' + arg + ')';
      break;
    case 'ATAN':
      code = 'math.atan(' + arg + ')';
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_constant"] = function(block) {
  var constant = block.getFieldValue('CONSTANT');
  Blockly.Python.definitions_['import_math'] = 'import math';

  var code;
  switch (constant) {
    case 'PI':
      code = 'math.pi';
      break;
    case 'E':
      code = 'math.e';
      break;
    case 'GOLDEN_RATIO':
      code = '1.618033988749895';
      break;
    case 'SQRT2':
      code = 'math.sqrt(2)';
      break;
    case 'SQRT1_2':
      code = 'math.sqrt(0.5)';
      break;
    case 'INFINITY':
      code = 'float("inf")';
      break;
    default:
      throw Error('Unknown constant: ' + constant);
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["math_round"] = function(block) {
  var operator = block.getFieldValue('OP');
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';

  var code;
  switch (operator) {
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.floor(' + arg + ')';
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_modulo"] = function(block) {
  var dividend = Blockly.Python.valueToCode(block, 'DIVIDEND', Blockly.Python.ORDER_MULTIPLICATIVE) || '0';
  var divisor = Blockly.Python.valueToCode(block, 'DIVISOR', Blockly.Python.ORDER_MULTIPLICATIVE) || '0';
  var code = dividend + ' % ' + divisor;
  return [code, Blockly.Python.ORDER_MULTIPLICATIVE];
};

Blockly.Python["math_constrain"] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
  var low = Blockly.Python.valueToCode(block, 'LOW', Blockly.Python.ORDER_NONE) || '0';
  var high = Blockly.Python.valueToCode(block, 'HIGH', Blockly.Python.ORDER_NONE) || '0';
  var code = 'min(max(' + value + ', ' + low + '), ' + high + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_random_int"] = function(block) {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_NONE) || '0';
  var code = 'random.randint(' + from + ', ' + to + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_random_float"] = function(block) {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_NONE) || '1';
  var code = 'random.uniform(' + from + ', ' + to + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["math_print_value"] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
  var code = 'print(' + value + ')\n';
  return code;
};

Blockly.Python["logic_compare"] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  // Em Python, todas as comparações têm a mesma precedência
  // Usar ORDER_RELATIONAL para todas evita problemas de precedência
  var order = Blockly.Python.ORDER_RELATIONAL;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Python["logic_operation"] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Python.ORDER_LOGICAL_AND : Blockly.Python.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order);
  var argument1 = Blockly.Python.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    argument0 = '"False"';
    argument1 = '"False"';
  } else {
    argument0 = argument0 || 'False';
    argument1 = argument1 || 'False';
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

Blockly.Python["logic_negate"] = function(block) {
  var argument0 = Blockly.Python.valueToCode(block, 'BOOL', Blockly.Python.ORDER_LOGICAL_NOT) || 'False';
  var code = 'not ' + argument0;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

Blockly.Python["controls_if"] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'IF0', Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'DO0');
  branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
  var code = 'if ' + condition + ':\n' + branch;
  return code;
};

Blockly.Python["controls_ifelse"] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'IF0', Blockly.Python.ORDER_NONE) || 'False';
  var branchIf = Blockly.Python.statementToCode(block, 'DO0');
  branchIf = Blockly.Python.addLoopTrap(branchIf, block) || Blockly.Python.PASS;
  var branchElse = Blockly.Python.statementToCode(block, 'ELSE');
  branchElse = Blockly.Python.addLoopTrap(branchElse, block) || Blockly.Python.PASS;
  var code = 'if ' + condition + ':\n' + branchIf + 'else:\n' + branchElse;
  return code;
};

Blockly.Python["list_get_item_simple"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  switch (where) {
    case 'FIRST':
      return [list + '[0]', Blockly.Python.ORDER_MEMBER];
    case 'LAST':
      return [list + '[-1]', Blockly.Python.ORDER_MEMBER];
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return [list + '[' + at + '-1]', Blockly.Python.ORDER_MEMBER];
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      return ['random.choice(' + list + ')', Blockly.Python.ORDER_FUNCTION_CALL];
  }
};

Blockly.Python["list_remove_item_simple"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  switch (where) {
    case 'FIRST':
      return list + '.pop(0)\n';
    case 'LAST':
      return list + '.pop()\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '.pop(' + at + '-1)\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      return list + '.pop(random.randint(0, len(' + list + ')-1))\n';
  }
};

Blockly.Python["list_replace_item"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  switch (where) {
    case 'FIRST':
      return list + '[0] = ' + value + '\n';
    case 'LAST':
      return list + '[-1] = ' + value + '\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '[' + at + '-1] = ' + value + '\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      var randomVar = Blockly.Python.nameDB_.getDistinctName('random_index', Blockly.VARIABLE_CATEGORY_NAME);
      return randomVar + ' = random.randint(0, len(' + list + ')-1)\n' + list + '[' + randomVar + '] = ' + value + '\n';
  }
};

Blockly.Python["list_insert_item"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  switch (where) {
    case 'FIRST':
      return list + '.insert(0, ' + value + ')\n';
    case 'LAST':
      return list + '.append(' + value + ')\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '.insert(' + at + '-1, ' + value + ')\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      var randomVar = Blockly.Python.nameDB_.getDistinctName('random_index', Blockly.VARIABLE_CATEGORY_NAME);
      return randomVar + ' = random.randint(0, len(' + list + '))\n' + list + '.insert(' + randomVar + ', ' + value + ')\n';
  }
};

Blockly.Python["lists_getSublist"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var start_index, end_index;
  switch (where1) {
    case 'FIRST':
      start_index = '';
      break;
    case 'FROM_START':
      var at1 = Blockly.Python.valueToCode(block, 'AT1', Blockly.Python.ORDER_ADDITIVE) || '1';
      start_index = Blockly.Python.getAdjustedInt(block, 'AT1');
      if (start_index === '0') {
        start_index = '';
      }
      break;
    default:
      throw Error("Unhandled start option (lists_getSublist): " + where1);
  }
  switch (where2) {
    case 'LAST':
      end_index = '';
      break;
    case 'FROM_START':
      var at2 = Blockly.Python.valueToCode(block, 'AT2', Blockly.Python.ORDER_ADDITIVE) || '1';
      end_index = at2;
      break;
    default:
      throw Error("Unhandled end option (lists_getSublist): " + where2);
  }
  var slice_notation = start_index + ':' + end_index;
  return [list + '[' + slice_notation + ']', Blockly.Python.ORDER_MEMBER];
};

Blockly.Python["text_split_simple"] = function(block) {
  var text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_NONE) || '""';
  var separator = Blockly.Python.valueToCode(block, 'SEPARATOR', Blockly.Python.ORDER_NONE) || '","';
  return [text + '.split(' + separator + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["lists_sort"] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_NONE) || '[]';
  var sortType = block.getFieldValue('TYPE');
  var direction = block.getFieldValue('DIRECTION');
  var reverse = (direction === 'DESC') ? 'True' : 'False';
  return [Blockly.Python.provideFunction_('organizar_lista', [
    'def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(lista, tipo, reverso):',
    '    def processar_numero(item):',
    '        try:',
    '            return float(item)',
    '        except:',
    '            return 0',
    '    ',
    '    def processar_texto(item):',
    '        return str(item)',
    '    ',
    '    def processar_texto_ignorar_maiusculas(item):',
    '        return str(item).lower()',
    '    ',
    '    processadores = {',
    '        "NUMERIC": processar_numero,',
    '        "TEXT": processar_texto,',
    '        "IGNORE_CASE": processar_texto_ignorar_maiusculas',
    '    }',
    '    ',
    '    processar = processadores[tipo]',
    '    lista_copia = list(lista)',
    '    return sorted(lista_copia, key=processar, reverse=reverso)'
  ]) + '(' + list + ', "' + sortType + '", ' + reverse + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["lists_create_with"] = function(block) {
  if (block.itemCount_ == 0) {
    return ['[]', Blockly.Python.ORDER_ATOMIC];
  }
  var elements = [];
  var hasAnyRealValue = false;
  for (var i = 0; i < block.itemCount_; i++) {
    var value = Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE);
    if (value && value !== '' && value !== 'None' && value !== "''" && value !== '""') {
      elements.push(value);
      hasAnyRealValue = true;
    } else {
      elements.push('None');
    }
  }
  if (!hasAnyRealValue) {
    return ['[]', Blockly.Python.ORDER_ATOMIC];
  }
  var code = '[' + elements.join(', ') + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["lists_indexOf"] = function(block) {
  var find = Blockly.Python.valueToCode(block, 'FIND', Blockly.Python.ORDER_NONE) || '[]';
  var list = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || "''";
  if (block.getFieldValue('END') == 'FIRST') {
    var functionName = Blockly.Python.provideFunction_(
      'first_index',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(my_list, elem):',
       '    try:',
       '        return my_list.index(elem)',
       '    except:',
       '        return "Not in list"']
    );
  } else {
    var functionName = Blockly.Python.provideFunction_(
      'last_index',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(my_list, elem):',
       '    try:',
       '        return len(my_list) - my_list[::-1].index(elem) - 1',
       '    except:',
       '        return "Not in list"']
    );
  }
  return [functionName + '(' + list + ', ' + find + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["lists_getIndex"] = function(block) {
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var list = Blockly.Python.valueToCode(block, 'VALUE',
    where == 'RANDOM' ? Blockly.Python.ORDER_NONE :
    Blockly.Python.ORDER_MEMBER) || '[]';
  switch (where) {
    case 'FIRST':
      if (mode == 'GET') {
        return [list + '[0]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(0)', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(0)\n';
      }
      break;
    case 'LAST':
      if (mode == 'GET') {
        return [list + '[-1]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop()', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop()\n';
      }
      break;
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_NONE) || '0';
      if (mode == 'GET') {
        return [list + '[' + at + ']', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(' + at + ')', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(' + at + ')\n';
      }
      break;
    case 'FROM_END':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_NONE) || '0';
      if (mode == 'GET') {
        return [list + '[-(' + at + ' + 1)]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(-(' + at + ' + 1))', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(-(' + at + ' + 1))\n';
      }
      break;
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      if (mode == 'GET') {
        return ['random.choice(' + list + ')', Blockly.Python.ORDER_FUNCTION_CALL];
      } else {
        var functionName = Blockly.Python.provideFunction_(
          'lists_remove_random_item',
          ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
           '    x = int(random.random() * len(myList))',
           '    return myList.pop(x)']);
        var code = functionName + '(' + list + ')';
        if (mode == 'GET_REMOVE') {
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        } else if (mode == 'REMOVE') {
          return code + '\n';
        }
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

Blockly.Python["text_to_str"] = function(block) {
  var variable = Blockly.Python.valueToCode(block, 'var', Blockly.Python.ORDER_ATOMIC);
  var code = 'str(' + variable + ')';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["text_eval"] = function(block) {
  var c = block.getFieldValue('text');
  var code = c + "\n";
  return code;
};

Blockly.Python["project_metadata"] = function(block) {
  var value_project_author = Blockly.Python.valueToCode(block, 'project_author', Blockly.Python.ORDER_ATOMIC);
  var value_project_iot_id = Blockly.Python.valueToCode(block, 'project_iot_id', Blockly.Python.ORDER_ATOMIC);
  var value_project_description = Blockly.Python.valueToCode(block, 'project_description', Blockly.Python.ORDER_ATOMIC);
  var code = '#Code automatically generated by BIPES (http://www.bipes.net.br)';
  code += '\n#Author: ' + value_project_author;
  code += '\n#IOT ID: ' + value_project_iot_id;
  code += '\n#Description: ' + value_project_description + '\n';
  return code;
};

Blockly.Python["snek_uptime"] = function(block) {
  var code = "time.monotonic()";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["controls_while_true"] = function(block) {
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
  branch = Blockly.Python.prefixLines(branch, Blockly.Python.INDENT);
  return 'while True:\n' + branch;
};
