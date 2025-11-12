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

// Repeat forever block
/*
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
*/

// Repeat until condition block
/*
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
*/

console.log('[BitdogLab] Basic repetition blocks loaded successfully!');
