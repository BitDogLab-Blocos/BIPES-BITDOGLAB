'use strict';

Blockly.Blocks['robo_inicializar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🤖 Inicializar robô")
        .appendField("esperar")
        .appendField(new Blockly.FieldNumber(5, 0, 30, 1), "ESPERA")
        .appendField("segundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Prepara os motores e o sensor de giro do robô. Espera alguns segundos para colocar o robô no chão e calibra o MPU6050 antes da missão.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_frente'] = {
  init: function() {
    this.appendValueInput("TEMPO")
        .setCheck("Number")
        .appendField("⬆️ Andar para frente");
    this.appendDummyInput()
        .appendField("segundos");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Faz o robô andar para frente pelo tempo escolhido em segundos e depois parar.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_tras'] = {
  init: function() {
    this.appendValueInput("TEMPO")
        .setCheck("Number")
        .appendField("⬇️ Andar para trás");
    this.appendDummyInput()
        .appendField("segundos");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Faz o robô andar de ré pelo tempo escolhido em segundos e depois parar.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_girar'] = {
  init: function() {
    this.appendValueInput("GRAUS")
        .setCheck("Number")
        .appendField("↪️ Girar robô");
    this.appendDummyInput()
        .appendField("graus para")
        .appendField(new Blockly.FieldDropdown([
          ["esquerda", "L"],
          ["direita", "R"]
        ]), "DIRECAO");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Gira o robô pelo número de graus escolhido usando o giroscópio MPU6050. Exemplo: 45 graus para a esquerda.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_parar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏹️ Parar robô");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Para imediatamente os motores do robô.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_joystick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Controlar robô com joystick");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Controla o robô continuamente pelo joystick: frente, ré, giro para esquerda/direita e parado no centro.");
    this.setHelpUrl("");
  }
};
