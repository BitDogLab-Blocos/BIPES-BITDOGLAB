Blockly.Blocks['sensor_temperatura'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌡️ Temperatura (°C)");
    this.setOutput(true, "Number");
    this.setColour("#16a085");
    this.setTooltip("Mede a temperatura em graus Celsius usando o sensor AHT20. Use dentro do bloco '📊 Mostrar valor' do display para exibir a temperatura.");
    this.setHelpUrl("");
  }
};

// Bloco: Medir umidade (%) — retorna valor numérico
Blockly.Blocks['sensor_umidade'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💧 Umidade (%)");
    this.setOutput(true, "Number");
    this.setColour("#16a085");
    this.setTooltip("Mede a umidade relativa do ar em porcentagem usando o sensor AHT20. Use dentro do bloco '📊 Mostrar valor' do display para exibir a umidade.");
    this.setHelpUrl("");
  }
};

// Bloco: Experimento Efeito Estufa — tela dividida com 2 sensores
Blockly.Blocks['sensor_estufa_comparar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌱 Efeito Estufa — Comparar 2 sensores");
    this.appendDummyInput()
        .appendField("Esquerda: Sensor 1  |  Direita: Sensor 2");
    appendDisplayTypeInput(this);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Experimento Efeito Estufa: divide o display ao meio. Escolha display pequeno ou grande. Lado esquerdo mostra temperatura e umidade do Sensor 1 (I2C1), lado direito mostra do Sensor 2 (I2C0).");
    this.setHelpUrl("");
  }
};

// Bloco: Mostrar/Ocultar medição do Sensor 1 (esquerda)
Blockly.Blocks['estufa_toggle_sensor1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌱 Mostrar/Ocultar medição Sensor 1");
    appendDisplayTypeInput(this);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Liga ou desliga a exibição da medição do Sensor 1 (lado esquerdo) no experimento Efeito Estufa. Use dentro de um bloco de botão!");
    this.setHelpUrl("");
  }
};

// Bloco: Mostrar/Ocultar medição do Sensor 2 (direita)
Blockly.Blocks['estufa_toggle_sensor2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌱 Mostrar/Ocultar medição Sensor 2");
    appendDisplayTypeInput(this);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Liga ou desliga a exibição da medição do Sensor 2 (lado direito) no experimento Efeito Estufa. Use dentro de um bloco de botão!");
    this.setHelpUrl("");
  }
};

// =============================================
// BLOCOS DE GRÁFICOS (Projeto Estufa)
// =============================================

// Bloco de valor: Temperatura do Sensor 1
Blockly.Blocks['estufa_temp_sensor1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌡️ Temperatura 1 (I2C1)");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Temperatura em graus Celsius do sensor ligado à entrada I2C1 da BitDogLab. Encaixe no bloco Mostrar Gráfico ou em Matemática.");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Umidade do Sensor 1
Blockly.Blocks['estufa_umid_sensor1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💧 Umidade 1 (I2C1)");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Umidade em porcentagem do sensor ligado à entrada I2C1 da BitDogLab. Encaixe no bloco Mostrar Gráfico ou em Matemática.");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Temperatura do Sensor 2
Blockly.Blocks['estufa_temp_sensor2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌡️ Temperatura 0 (I2C0)");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Temperatura em graus Celsius do sensor ligado à entrada I2C0 da BitDogLab. Encaixe no bloco Mostrar Gráfico ou em Matemática.");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Umidade do Sensor 2
Blockly.Blocks['estufa_umid_sensor2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💧 Umidade 0 (I2C0)");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Umidade em porcentagem do sensor ligado à entrada I2C0 da BitDogLab. Encaixe no bloco Mostrar Gráfico ou em Matemática.");
    this.setHelpUrl("");
  }
};

// Bloco statement: Plotar gráfico no display
Blockly.Blocks['estufa_plotar'] = {
  init: function() {
    this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField("📊 Mostrar Gráfico");
    this.appendDummyInput()
        .appendField("rótulo")
        .appendField(new Blockly.FieldDropdown([
            ["Temperatura 0 (I2C0)", "Temp2"],
            ["Umidade 0 (I2C0)", "Umid2"],
            ["Temperatura 1 (I2C1)", "Temp1"],
            ["Umidade 1 (I2C1)", "Umid1"],
            ["Soma Temperatura", "SomaTemp"],
            ["Soma Umidade", "SomaUmid"],
            ["Subtração Temperatura", "SubTemp"],
            ["Subtração Umidade", "SubUmid"],
            ["Multiplicação Temperatura", "MultTemp"],
            ["Multiplicação Umidade", "MultUmid"],
            ["Divisão Temperatura", "DivTemp"],
            ["Divisão Umidade", "DivUmid"]
        ]), "ROTULO");
    this.appendDummyInput()
        .appendField("na")
        .appendField(new Blockly.FieldDropdown([
            ["Metade de Cima", "1"],
            ["Metade de Baixo", "2"],
            ["Tela Toda", "0"]
        ]), "POSICAO");
    appendDisplayTypeInput(this);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980b9");
    this.setTooltip("Mostra um gráfico no display. O bloco encaixado escolhe o valor e a entrada I2C lida; o rótulo só dá nome ao gráfico. Use Matemática para combinar sensores.");
    this.setHelpUrl("");
  }
};

// ==========================================
// VERIFICAÇÃO DE SENSORES
// ==========================================

Blockly.Blocks['verificar_conexao_sensor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔎 Verificar qual sensor está conectado");
    appendDisplayTypeInput(this);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#607d8b");
    this.setTooltip("Verifica quais sensores estão conectados na placa e mostra o resultado no display.");
    this.setHelpUrl("");
  }
};
