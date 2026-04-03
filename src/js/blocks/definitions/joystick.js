// ==========================================
// Category: Joystick
// ==========================================
// Bloco 1: Controla LED + atualiza a variável _intensidade_joy
Blockly.Blocks['joystick_controlar_led'] = {
  init: function() {
    var DIR_SOBE = [["↑ Cima", "UP"], ["↓ Baixo", "DOWN"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    var DIR_DESCE = [["↓ Baixo", "DOWN"], ["↑ Cima", "UP"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    this.appendDummyInput()
        .appendField("🕹️ Joystick controla LED");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("cor:");
    this.appendDummyInput()
        .appendField("início:")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "INTENSIDADE_INICIAL")
        .appendField("%");
    this.appendDummyInput()
        .appendField("sobe ao mover:")
        .appendField(new Blockly.FieldDropdown(DIR_SOBE), "DIR_AUMENTAR");
    this.appendDummyInput()
        .appendField("desce ao mover:")
        .appendField(new Blockly.FieldDropdown(DIR_DESCE), "DIR_DIMINUIR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Controla o brilho do LED com o joystick. Escolha a cor, o brilho inicial e as direções. Para mostrar o valor no display, use o bloco '🕹️ intensidade atual %'.");
    this.setHelpUrl("");
  }
};

// Bloco 2: Retorna a intensidade atual como valor (para display, LED, etc.)
Blockly.Blocks['joystick_intensidade_atual'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Intensidade LED %");
    this.setOutput(true, "Number");
    this.setColour("#1565c0");
    this.setTooltip("Retorna o valor atual da intensidade do LED controlado pelo joystick (0 a 100%).");
    this.setHelpUrl("");
  }
};

// Bloco 3: Controla a frequência do buzzer com o joystick
Blockly.Blocks['joystick_controlar_buzzer'] = {
  init: function() {
    var DIR_SOBE = [["↑ Cima", "UP"], ["↓ Baixo", "DOWN"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    var DIR_DESCE = [["↓ Baixo", "DOWN"], ["↑ Cima", "UP"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    this.appendDummyInput()
        .appendField("🕹️ Joystick controla Buzzer");
    this.appendDummyInput()
        .appendField("frequência inicial:")
        .appendField(new Blockly.FieldNumber(1000, 200, 4000), "FREQ_INICIAL")
        .appendField("Hz  (intervalo: 200 – 4000 Hz)");
    this.appendDummyInput()
        .appendField("volume:")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "VOLUME")
        .appendField("%  (0 = mudo, 100 = máximo)");
    this.appendDummyInput()
        .appendField("sobe ao mover:")
        .appendField(new Blockly.FieldDropdown(DIR_SOBE), "DIR_AUMENTAR");
    this.appendDummyInput()
        .appendField("desce ao mover:")
        .appendField(new Blockly.FieldDropdown(DIR_DESCE), "DIR_DIMINUIR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Controla a frequência do buzzer com o joystick.\nIntervalo de frequência: 200–4000 Hz\nVolume: 0–100%\nPara mostrar o valor no display, use o bloco '🕹️ Frequência Buzzer Hz'.");
    this.setHelpUrl("");
  }
};

// Bloco 4: Retorna a frequência atual do buzzer como valor
Blockly.Blocks['joystick_frequencia_atual'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Frequência Buzzer Hz");
    this.setOutput(true, "Number");
    this.setColour("#1565c0");
    this.setTooltip("Retorna a frequência atual do buzzer controlado pelo joystick (200 a 4000 Hz).");
    this.setHelpUrl("");
  }
};

// Bloco 5: Mover player no display com joystick
Blockly.Blocks['joystick_mover_player'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Joystick mover no Display");
    this.appendDummyInput()
        .appendField("tamanho do player:")
        .appendField(new Blockly.FieldNumber(5, 2, 20), "TAMANHO")
        .appendField("px");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Move um quadrado pela tela OLED usando o joystick. O player bate nas bordas e não sai da tela.");
    this.setHelpUrl("");
  }
};

// Bloco 5b: Lousa Mágica no Display
Blockly.Blocks['joystick_lousa_magica'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎨 Lousa Mágica no Display");
    this.appendDummyInput()
        .appendField("tamanho da caneta:")
        .appendField(new Blockly.FieldNumber(2, 1, 10), "TAMANHO")
        .appendField("px");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Desenha no display OLED com o joystick. Quanto mais longe do centro, mais rápido o cursor move. Use um bloco de limpar display para apagar o desenho.");
    this.setHelpUrl("");
  }
};

// Bloco 6: Retorna a posição X do player
Blockly.Blocks['joystick_posicao_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Posição X");
    this.setOutput(true, "Number");
    this.setColour("#1565c0");
    this.setTooltip("Retorna a posição X atual do player no display (0 a 128).");
    this.setHelpUrl("");
  }
};

// Bloco 7: Retorna a posição Y do player
Blockly.Blocks['joystick_posicao_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Posição Y");
    this.setOutput(true, "Number");
    this.setColour("#1565c0");
    this.setTooltip("Retorna a posição Y atual do player no display (0 a 64).");
    this.setHelpUrl("");
  }
};

// Bloco 8: Cursor de LED na Matriz 5x5 com joystick
Blockly.Blocks['joystick_cursor_matriz'] = {
  init: function() {
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("🕹️ Mover ponto de luz na Matriz de LED  brilho:")
        .appendField(new Blockly.FieldNumber(30, 1, 100), "BRILHO")
        .appendField("%  cor:");
    this.appendDummyInput()
        .appendField("linha inicial:")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA_INICIAL")
        .appendField("  coluna inicial:")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA_INICIAL");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Move um LED pela grade 5x5 com o joystick. Pressionar o botão do joystick apaga tudo.");
    this.setHelpUrl("");
  }
};

// Bloco 9: Seletor de opções com joystick (container)
Blockly.Blocks['joystick_seletor'] = {
  init: function() {
    var DIR_NEXT = [["↑ Cima", "UP"], ["↓ Baixo", "DOWN"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    var DIR_PREV = [["↓ Baixo", "DOWN"], ["↑ Cima", "UP"], ["← Esquerda", "LEFT"], ["→ Direita", "RIGHT"]];
    this.appendDummyInput()
        .appendField("🕹️ Trocar emoji na Matriz de LED")
        .appendField("  próximo:")
        .appendField(new Blockly.FieldDropdown(DIR_NEXT), "DIR_PROXIMO")
        .appendField("  anterior:")
        .appendField(new Blockly.FieldDropdown(DIR_PREV), "DIR_ANTERIOR");
    this.appendStatementInput("OPCOES")
        .setCheck(null)
        .appendField("opções:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#1565c0");
    this.setTooltip("Encaixe blocos como opções. O joystick navega entre elas (muda a cada 500ms). Só o bloco selecionado executa.");
    this.setHelpUrl("");
  }
};
