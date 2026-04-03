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
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Experimento Efeito Estufa: divide o display OLED ao meio. Lado esquerdo mostra temperatura e umidade do Sensor 1 (I2C1), lado direito mostra do Sensor 2 (I2C0). Basta arrastar e rodar!");
    this.setHelpUrl("");
  }
};

// Bloco: Mostrar/Ocultar medição do Sensor 1 (esquerda)
Blockly.Blocks['estufa_toggle_sensor1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌱 Mostrar/Ocultar medição Sensor 1");
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
        .appendField("🌡️ Temperatura Sensor 1");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Valor da temperatura do Sensor 1 em graus Celsius. Encaixe no bloco Plotar ou em blocos de matemática!");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Umidade do Sensor 1
Blockly.Blocks['estufa_umid_sensor1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💧 Umidade Sensor 1");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Valor da umidade do Sensor 1 em porcentagem. Encaixe no bloco Plotar ou em blocos de matemática!");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Temperatura do Sensor 2
Blockly.Blocks['estufa_temp_sensor2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌡️ Temperatura Sensor 2");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Valor da temperatura do Sensor 2 em graus Celsius. Encaixe no bloco Plotar ou em blocos de matemática!");
    this.setHelpUrl("");
  }
};

// Bloco de valor: Umidade do Sensor 2
Blockly.Blocks['estufa_umid_sensor2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💧 Umidade Sensor 2");
    this.setOutput(true, "Number");
    this.setColour("#2980b9");
    this.setTooltip("Valor da umidade do Sensor 2 em porcentagem. Encaixe no bloco Plotar ou em blocos de matemática!");
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
        .appendField("tipo")
        .appendField(new Blockly.FieldDropdown([
            ["Temperatura 1", "Temp1"],
            ["Temperatura 2", "Temp2"],
            ["Umidade 1", "Umid1"],
            ["Umidade 2", "Umid2"],
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
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980b9");
    this.setTooltip("Mostra um gráfico no display. Escolha o tipo e onde mostrar. Use blocos de Matemática para combinar sensores!");
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
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#607d8b");
    this.setTooltip("Verifica quais sensores estão conectados na placa e mostra o resultado no display.");
    this.setHelpUrl("");
  }
};
