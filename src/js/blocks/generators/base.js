// Generators for the base Blockly blocks.
'use strict';

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

function _isWaitConnectedToRobotBlock(block) {
  function isRobotBlock(candidate) {
    return candidate && typeof candidate.type === 'string' && candidate.type.indexOf('robo_') === 0;
  }
  var previous = block && block.getPreviousBlock ? block.getPreviousBlock() : null;
  var next = block && block.getNextBlock ? block.getNextBlock() : null;
  return isRobotBlock(previous) || isRobotBlock(next);
}

Blockly.Python["esperar_segundos"] = function(block) {
  // Skip if already consumed by an animation block (timed mode)
  if (block._animConsumed) {
    block._animConsumed = false;
    return '';
  }
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  // Reporters de duração (segundos, minutos e horas) já entregam milissegundos.
  // Convertemos explicitamente para segundos antes de chamar sleep(), evitando
  // interpretar 5000 ms como 5000 s quando o bloco mostra "5 segundos".
  var timeBlock = block.getInputTargetBlock && block.getInputTargetBlock('TIME');
  var durationReporter = timeBlock && [
    'tempo_segundos',
    'tempo_milisegundos',
    'tempo_minutos',
    'tempo_horas'
  ].indexOf(timeBlock.type) !== -1;
  var code = durationReporter
    ? 'time.sleep(' + value_time + ' / 1000)\n'
    : 'time.sleep(' + value_time + ')\n';
  if (_isWaitConnectedToRobotBlock(block)) {
    return BitdogLabConfig.MARKERS.SETUP_START + '\n' + code + BitdogLabConfig.MARKERS.SETUP_END + '\n';
  }
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
  if (_isWaitConnectedToRobotBlock(block)) {
    return BitdogLabConfig.MARKERS.SETUP_START + '\n' + code + BitdogLabConfig.MARKERS.SETUP_END + '\n';
  }
  return code;
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
