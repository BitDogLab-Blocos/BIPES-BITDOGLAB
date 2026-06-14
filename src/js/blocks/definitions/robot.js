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

Blockly.Blocks['robo_giro_valor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧭 Giro do robô");
    this.setOutput(true, "Number");
    this.setColour("#8e44ad");
    this.setTooltip("Retorna o giro atual do robô em graus, medido pelo eixo Z do MPU6050. Use em Display, Matemática, Condicionais e comparações, por exemplo: giro do robô > 45.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_aceleracao_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("↔️ Aceleração X");
    this.setOutput(true, "Number");
    this.setColour("#8e44ad");
    this.setTooltip("Retorna a aceleração do robô no eixo X, em metros por segundo ao quadrado (m/s²), usando o MPU6050. Use em Display, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_aceleracao_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("↕️ Aceleração Y");
    this.setOutput(true, "Number");
    this.setColour("#8e44ad");
    this.setTooltip("Retorna a aceleração do robô no eixo Y, em metros por segundo ao quadrado (m/s²), usando o MPU6050. Use em Display, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_aceleracao_z'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬆️ Aceleração Z");
    this.setOutput(true, "Number");
    this.setColour("#8e44ad");
    this.setTooltip("Retorna a aceleração do robô no eixo Z, em metros por segundo ao quadrado (m/s²), usando o MPU6050. Use em Display, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_transferidor_360'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧭 Transferidor 360° no display");
    appendDisplayTypeInput(this);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Mostra no display um transferidor de 360 graus com um ponteiro indicando o giro atual do robô. Use Inicializar robô antes deste bloco.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_tensao_bateria'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔋 Tensão da bateria");
    this.setOutput(true, "Number");
    this.setColour("#27ae60");
    this.setTooltip("Retorna a tensão da bateria do robô em volts. Use em Mostrar valor, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};
