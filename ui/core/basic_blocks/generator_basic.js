// ==========================================
// Basic Blocks - Code Generators
// Python code generators for control and logic blocks
// ==========================================

console.log('[BitdogLab] Loading basic code generators...');

// ==========================================
// REPETITION GENERATORS
// ==========================================

// Repeat N times generator
Blockly.Python['controls_repeat_simple'] = function(block) {
  var times = block.getFieldValue('TIMES');
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'for _i in range(' + times + '):\n' +
             (statements || '  pass\n');
  return code;
};

// While loop generator
Blockly.Python['controls_while_simple'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
                  Blockly.Python.ORDER_NONE) || 'False';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'while ' + condition + ':\n' +
             (statements || '  pass\n');
  return code;
};

// For loop generator
Blockly.Python['controls_for_simple'] = function(block) {
  var variable = Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  var from = Blockly.Python.valueToCode(block, 'FROM',
             Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO',
           Blockly.Python.ORDER_NONE) || '10';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'for ' + variable + ' in range(' + from + ', ' + to + ' + 1):\n' +
             (statements || '  pass\n');
  return code;
};

// Repeat forever generator
Blockly.Python['controls_repeat_forever'] = function(block) {
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'while True:\n' +
             (statements || '  pass\n');
  return code;
};

// Repeat until generator
Blockly.Python['controls_repeat_until'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
                  Blockly.Python.ORDER_NONE) || 'False';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'while not (' + condition + '):\n' +
             (statements || '  pass\n');
  return code;
};

// For loop with step generator
Blockly.Python['controls_for_step'] = function(block) {
  var variable = Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  var from = Blockly.Python.valueToCode(block, 'FROM',
             Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO',
           Blockly.Python.ORDER_NONE) || '10';
  var step = Blockly.Python.valueToCode(block, 'STEP',
             Blockly.Python.ORDER_NONE) || '1';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'for ' + variable + ' in range(' + from + ', ' + to + ' + 1, ' + step + '):\n' +
             (statements || '  pass\n');
  return code;
};

// ==========================================
// LOGIC GENERATORS
// ==========================================

// If block generator
Blockly.Python['controls_if_simple'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
                  Blockly.Python.ORDER_NONE) || 'False';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var code = 'if ' + condition + ':\n' +
             (statements || '  pass\n');
  return code;
};

// If-else block generator
Blockly.Python['controls_if_else_simple'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
                  Blockly.Python.ORDER_NONE) || 'False';
  var doStatements = Blockly.Python.statementToCode(block, 'DO');
  var elseStatements = Blockly.Python.statementToCode(block, 'ELSE');

  var code = 'if ' + condition + ':\n' +
             (doStatements || '  pass\n') +
             'else:\n' +
             (elseStatements || '  pass\n');
  return code;
};

// ==========================================
// COMPARISON GENERATORS
// ==========================================

// Comparison operators generator
Blockly.Python['logic_compare_simple'] = function(block) {
  var operators = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = operators[block.getFieldValue('OP')];
  var order = Blockly.Python.ORDER_RELATIONAL;
  var a = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var b = Blockly.Python.valueToCode(block, 'B', order) || '0';

  var code = a + ' ' + operator + ' ' + b;
  return [code, order];
};

// ==========================================
// LOGICAL OPERATORS GENERATORS
// ==========================================

// AND / OR operator generator
Blockly.Python['logic_operation_simple'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Python.ORDER_LOGICAL_AND :
                                     Blockly.Python.ORDER_LOGICAL_OR;
  var a = Blockly.Python.valueToCode(block, 'A', order) || 'False';
  var b = Blockly.Python.valueToCode(block, 'B', order) || 'False';

  var code = a + ' ' + operator + ' ' + b;
  return [code, order];
};

// NOT operator generator
Blockly.Python['logic_not_simple'] = function(block) {
  var order = Blockly.Python.ORDER_LOGICAL_NOT;
  var value = Blockly.Python.valueToCode(block, 'BOOL', order) || 'False';

  var code = 'not ' + value;
  return [code, order];
};

// ==========================================
// DELAY GENERATOR
// ==========================================

// Wait/Delay generator
Blockly.Python['time_delay_simple'] = function(block) {
  var seconds = block.getFieldValue('SECONDS');

  // Add import for time module
  Blockly.Python.definitions_['import_time'] = 'import time';

  var code = 'time.sleep(' + seconds + ')\n';
  return code;
};

console.log('[BitdogLab] Basic code generators loaded successfully!');
