// ==========================================
// Basic Blocks - Control and Logic
// Simple blocks for repetition and logic
// ==========================================

console.log('[BitdogLab] Loading basic control and logic blocks...');

// ==========================================
// REPETITION BLOCKS
// ==========================================

// Repeat N times block
Blockly.Blocks['controls_repeat_simple'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir")
        .appendField(new Blockly.FieldNumber(10, 1), "TIMES")
        .appendField("vezes");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete as ações um número específico de vezes");
    this.setHelpUrl("");
  }
};

// While loop block
Blockly.Blocks['controls_while_simple'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Repetir enquanto");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete as ações enquanto a condição for verdadeira");
    this.setHelpUrl("");
  }
};

// For loop with variable
Blockly.Blocks['controls_for_simple'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Para")
        .appendField(new Blockly.FieldVariable("i"), "VAR")
        .appendField("de");
    this.appendValueInput("FROM")
        .setCheck("Number");
    this.appendValueInput("TO")
        .setCheck("Number")
        .appendField("até");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Conta de um número até outro");
    this.setHelpUrl("");
  }
};

// Repeat forever block
Blockly.Blocks['controls_repeat_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir para sempre");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete continuamente até o programa ser parado (loop infinito)");
    this.setHelpUrl("");
  }
};

// Repeat until condition block
Blockly.Blocks['controls_repeat_until'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Repetir até");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete até que a condição seja verdadeira (oposto de 'enquanto')");
    this.setHelpUrl("");
  }
};

// For loop with step
Blockly.Blocks['controls_for_step'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Para")
        .appendField(new Blockly.FieldVariable("i"), "VAR")
        .appendField("de");
    this.appendValueInput("FROM")
        .setCheck("Number");
    this.appendValueInput("TO")
        .setCheck("Number")
        .appendField("até");
    this.appendValueInput("STEP")
        .setCheck("Number")
        .appendField("pulando de");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Conta com passo customizado (ex: de 2 em 2, ou de trás pra frente com -1)");
    this.setHelpUrl("");
  }
};

// ==========================================
// LOGIC BLOCKS
// ==========================================

// If block
Blockly.Blocks['controls_if_simple'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Se");
    this.appendStatementInput("DO")
        .appendField("então");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Se a condição for verdadeira, executa as ações");
    this.setHelpUrl("");
  }
};

// If-else block
Blockly.Blocks['controls_if_else_simple'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Se");
    this.appendStatementInput("DO")
        .appendField("então");
    this.appendStatementInput("ELSE")
        .appendField("senão");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Se a condição for verdadeira, executa uma ação, senão executa outra");
    this.setHelpUrl("");
  }
};

// ==========================================
// COMPARISON BLOCKS
// ==========================================

// Comparison operators
Blockly.Blocks['logic_compare_simple'] = {
  init: function() {
    this.appendValueInput("A");
    this.appendValueInput("B")
        .appendField(new Blockly.FieldDropdown([
          ["=", "EQ"],
          ["≠", "NEQ"],
          ["<", "LT"],
          ["≤", "LTE"],
          [">", "GT"],
          ["≥", "GTE"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("Compara dois valores");
    this.setHelpUrl("");
  }
};

// ==========================================
// LOGICAL OPERATORS
// ==========================================

// AND / OR operator
Blockly.Blocks['logic_operation_simple'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendValueInput("B")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldDropdown([
          ["e", "AND"],
          ["ou", "OR"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("Combina duas condições com 'e' ou 'ou'");
    this.setHelpUrl("");
  }
};

// NOT operator
Blockly.Blocks['logic_not_simple'] = {
  init: function() {
    this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("não");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("Inverte o valor: verdadeiro vira falso e vice-versa");
    this.setHelpUrl("");
  }
};

// ==========================================
// DELAY BLOCK
// ==========================================

// Wait/Delay block
Blockly.Blocks['time_delay_simple'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Aguardar")
        .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
        .appendField("segundo(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Pausa a execução por um tempo em segundos");
    this.setHelpUrl("");
  }
};

console.log('[BitdogLab] Basic control and logic blocks loaded successfully!');
