// ==========================================
// Basic Blocks - Code Generators
// Python code generators for repetition blocks
// ==========================================

console.log('[BitdogLab] Loading basic code generators...');

// ==========================================
// REPETITION GENERATORS
// ==========================================

// Repeat N times generator
Blockly.Python['controls_repeat_simple'] = function(block) {
  var times = block.getFieldValue('TIMES');
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  // Simple for loop - no counter needed!
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

// Repeat forever generator
Blockly.Python['controls_repeat_forever'] = function(block) {
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

// Repeat until generator
/*
Blockly.Python['controls_repeat_until'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
                  Blockly.Python.ORDER_NONE) || 'False';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  // Use LOOP markers to prevent automatic while True wrapper
  var code = '# LOOP_BLOCK_START\n';
  code += 'while not (' + condition + '):\n';

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

  code += '# LOOP_BLOCK_END\n';
  return code;
};
*/

console.log('[BitdogLab] Basic code generators loaded successfully!');
