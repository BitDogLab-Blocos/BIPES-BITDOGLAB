'use strict';

var ROBO_SETAS_ICON_BASE = '../assets/icons/robot-arrows/';
var ROBO_SETAS_ICON_SIZE = 56;

function appendRoboSetasIcon(block, icon, alt) {
  block.appendDummyInput()
      .appendField(new Blockly.FieldImage(
          ROBO_SETAS_ICON_BASE + icon,
          ROBO_SETAS_ICON_SIZE,
          ROBO_SETAS_ICON_SIZE,
          alt));
}

function initRoboSetasMovementBlock(block, icon, alt, colour, tooltip) {
  appendRoboSetasIcon(block, icon, alt);
  block.setPreviousStatement(true, null);
  block.setNextStatement(true, null);
  block.setColour(colour);
  block.setTooltip(tooltip);
  block.setHelpUrl('');
}

Blockly.Blocks['robo_setas_iniciar'] = {
  init: function() {
    appendRoboSetasIcon(this, 'start.svg?ver=20260923purple1', '🚩');
    this.setNextStatement(true, null);
    this.setColour('#ffffff');
    this.setTooltip('Inicia o robô apontado para cima e prepara o sensor de giro.');
    this.setHelpUrl('');
    this.hat = 'cap';
  }
};

Blockly.Blocks['robo_setas_frente'] = {
  init: function() {
    initRoboSetasMovementBlock(this, 'up.svg', '⬆️', '#16a34a', 'Vai uma casa para cima no tapete.');
  }
};

Blockly.Blocks['robo_setas_esquerda'] = {
  init: function() {
    initRoboSetasMovementBlock(this, 'left.svg', '⬅️', '#dc2626', 'Vai uma casa para a esquerda no tapete.');
  }
};

Blockly.Blocks['robo_setas_direita'] = {
  init: function() {
    initRoboSetasMovementBlock(this, 'right.svg', '➡️', '#2563eb', 'Vai uma casa para a direita no tapete.');
  }
};

Blockly.Blocks['robo_setas_voltar'] = {
  init: function() {
    initRoboSetasMovementBlock(this, 'down.svg', '⬇️', '#eab308', 'Vai uma casa para baixo no tapete.');
  }
};

Blockly.Blocks['robo_setas_finalizar'] = {
  init: function() {
    appendRoboSetasIcon(this, 'finish.svg', '🏁');
    this.setPreviousStatement(true, null);
    this.setColour('#6b7280');
    this.setTooltip('Para o robô e finaliza a sequência.');
    this.setHelpUrl('');
  }
};

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
        .appendField("🔋 Tensão da bateria (V)");
    this.setOutput(true, "Number");
    this.setColour("#27ae60");
    this.setTooltip("Retorna a tensão da bateria do robô em volts. Use em Mostrar valor, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['robo_corrente_robo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚡ Corrente do robô (A)");
    this.setOutput(true, "Number");
    this.setColour("#27ae60");
    this.setTooltip("Retorna a corrente consumida pelo robô em amperes. Use em Mostrar valor, Matemática, Condicionais e comparações.");
    this.setHelpUrl("");
  }
};
