// ==========================================
// Category: Buttons
// ==========================================
// While button pressed block
Blockly.Blocks['botao_enquanto_apertado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 Enquanto pressionar o botão")
        .appendField(new Blockly.FieldDropdown([["🔴 A (Vermelho)", "A"], ["🔵 B (Azul)", "B"], ["🟢 C (Verde)", "C"], ["🕹️ Joystick", "JOYSTICK"]]), "BOTAO")
        .appendField("😊 fazer:");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("😕 Quando soltar:");
    this.appendStatementInput("ELSE")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5a24");
    this.setTooltip("Enquanto você segurar o botão, faz uma coisa. Quando soltar, faz outra!");
  }
};
// If button pressed block
Blockly.Blocks['botao_se_apertado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 Se o botão for pressionado")
        .appendField(new Blockly.FieldDropdown([["🔴 A (Vermelho)", "A"], ["🔵 B (Azul)", "B"], ["🟢 C (Verde)", "C"], ["🕹️ Joystick", "JOYSTICK"]]), "BOTAO")
        .appendField("Ação acontece:");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5a24");
    this.setTooltip("Quando você pressionar o botão, acontece uma vez!");
  }
};

// ==========================================
// Category: Microfone
// ==========================================
// Bloco 0: Testar Microfone no Display
Blockly.Blocks['microfone_testar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎙️ Testar Microfone no Display");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Mostra no display OLED o valor raw do ADC, o nível do sinal e se o microfone está respondendo. Use para verificar se o GPIO28 está correto.");
    this.setHelpUrl("");
  }
};
// Bloco 1: VU Meter na Matriz
Blockly.Blocks['microfone_vu_meter'] = {
  init: function() {
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("🎙️ Medidor de barulho na Matriz  brilho:")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "BRILHO")
        .appendField("%  cor:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Quanto mais barulho você fizer, mais LEDs da matriz acendem! Fale, bata palma ou assopre perto do microfone. Para mostrar o nível como número no display, use o bloco '🎙️ Nível do som'.");
    this.setHelpUrl("");
  }
};

// Getter: retorna o nível atual do som (0 a 5)
Blockly.Blocks['microfone_nivel_atual'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎙️ Nível do som");
    this.setOutput(true, "Number");
    this.setColour("#e74c3c");
    this.setTooltip("Retorna o nível atual do som captado pelo microfone (0 = silêncio, 5 = barulho máximo). Use dentro do bloco 'Mostrar valor' do display.");
    this.setHelpUrl("");
  }
};

// Bloco 2 — barra horizontal de volume no OLED
Blockly.Blocks['microfone_barra_display'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🖥️ Medidor de barulho no Display  linha:")
        .appendField(new Blockly.FieldNumber(3, 1, 5), "LINHA");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Desenha uma barra horizontal no display OLED que cresce conforme o barulho aumenta. Use o bloco '🖥️ Força do barulho (%)' para ler a porcentagem.");
    this.setHelpUrl("");
  }
};

// Bloco 3 — Contador de palmas
Blockly.Blocks['microfone_contar_palmas'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🖐️ Contar palmas  linha:")
        .appendField(new Blockly.FieldNumber(1, 1, 5), "LINHA");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Detecta palmas e conta uma por uma. Cada palma só é contada quando o som para e começa de novo — sem contar duas vezes a mesma. Mostra o total no display. Use o bloco '🖐️ Total de palmas' para usar o número no programa.");
    this.setHelpUrl("");
  }
};

// Getter: total de palmas detectadas
Blockly.Blocks['microfone_total_palmas'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🖐️ Total de palmas");
    this.setOutput(true, "Number");
    this.setColour("#e74c3c");
    this.setTooltip("Retorna quantas palmas foram detectadas até agora. Use dentro de 'Mostrar valor' para ver o número, ou em condições como 'se total de palmas = 3'.");
    this.setHelpUrl("");
  }
};

// Getter: retorna a força do barulho em porcentagem (0–100)
Blockly.Blocks['microfone_barra_pct'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎙️ Intensidade do barulho (%)");
    this.setOutput(true, "Number");
    this.setColour("#e74c3c");
    this.setTooltip("Retorna a intensidade do barulho como porcentagem (0 = silêncio, 100 = barulho máximo). Use dentro do bloco 'Mostrar valor' do display.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['microfone_controlar_led'] = {
  init: function() {
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("💡 Controlar LED com a Voz  cor:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Controla o brilho do LED RGB com o volume do microfone. Encaixe um bloco de cor. Falar mais alto = LED mais brilhante.");
    this.setHelpUrl("");
  }
};
