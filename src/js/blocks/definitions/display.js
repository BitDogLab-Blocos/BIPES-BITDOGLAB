// ==========================================
// DISPLAY BLOCKS
// ==========================================
// Display Christmas message block
Blockly.Blocks['display_natal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Natal");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Exibe 'FELIZ NATAL!' com arte bonita no display SSD1306");
    this.setHelpUrl("");
  }
};

// Display border block
Blockly.Blocks['display_criar_borda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🖼️ Desenhar moldura");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Desenha uma moldura retangular ao redor do display");
    this.setHelpUrl("");
  }
};

// Display clear border block
Blockly.Blocks['display_limpar_borda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧹 Apagar moldura");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Apaga a moldura do display");
    this.setHelpUrl("");
  }
};

// Display update container block
Blockly.Blocks['display_atualizar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Atualizar display");
    this.appendStatementInput("COMANDOS")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e74c3c");
    this.setTooltip("Container para atualizar o display OLED. Coloque blocos de comandos (texto, formas, bordas, etc.) dentro deste bloco.");
    this.setHelpUrl("");
  }
};

// Display test connection block
Blockly.Blocks['display_testar_conexao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔍 Testar se display funciona");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Testa se o display OLED está conectado e funcionando");
    this.setHelpUrl("");
  }
};

// Display test SH1107 block
Blockly.Blocks['display_testar_sh1107'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Testar display SH1107");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Testa o display SH1107 usando a mesma pinagem I2C do OLED SSD1306 e envia a biblioteca junto no codigo.");
    this.setHelpUrl("");
  }
};

// Display show block (simple - just calls oled.show())
Blockly.Blocks['display_show'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎨 Atualizar Display");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Atualiza o display OLED mostrando tudo que foi escrito no buffer (chama oled.show())");
    this.setHelpUrl("");
  }
};

// Display show block (container)
Blockly.Blocks['display_mostrar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📺 Mostrar no display");
    this.appendStatementInput("COMANDOS")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Container para comandos do display. Executa os comandos dentro e depois mostra no display (oled.show()). NÃO limpa o display antes.");
    this.setHelpUrl("");
  }
};

// Display text block
Blockly.Blocks['display_texto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✏️ Escrever")
        .appendField(new Blockly.FieldTextInput("Olá!"), "TEXTO")
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Escreve texto no display OLED em uma das 5 linhas");
    this.setHelpUrl("");
  }
};

// Display blink text (animation block - includes show() calls)
Blockly.Blocks['display_piscar_texto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💫 Piscar texto")
        .appendField(new Blockly.FieldTextInput("Olá!"), "TEXTO");
    this.appendDummyInput()
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.appendDummyInput()
        .appendField("Tempo ligado")
        .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "TEMPO_LIGADO")
        .appendField("seg");
    this.appendDummyInput()
        .appendField("Tempo apagado")
        .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "TEMPO_APAGADO")
        .appendField("seg");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Faz o texto piscar (aparecer e sumir) - já atualiza o display automaticamente!");
    this.setHelpUrl("");
  }
};

// Display calculation result block
Blockly.Blocks['display_mostrar_calculo'] = {
  init: function() {
    this.appendValueInput("VALOR")
        .setCheck("Number")
        .appendField("🔢 Mostrar resultado da conta");
    this.appendDummyInput()
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra o resultado de uma conta (da categoria Matemática) no display");
    this.setHelpUrl("");
  }
};

// Display value block - generic version to show any numeric value
Blockly.Blocks['display_mostrar_valor'] = {
  init: function() {
    this.appendValueInput("VALOR")
        .setCheck("Number")
        .appendField("📊 Mostrar valor");
    this.appendDummyInput()
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra qualquer valor numérico no display (tempo ligado, sensores, etc)");
    this.setHelpUrl("");
  }
};

// Display LED state block
Blockly.Blocks['display_mostrar_estado_led'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💡 Mostrar se LED");
    this.appendValueInput("COLOUR")
        .setCheck("Colour");
    this.appendDummyInput()
        .appendField("está ligado linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra no display se o LED de uma cor está ligado ou desligado");
    this.setHelpUrl("");
  }
};

// Display clear block
Blockly.Blocks['display_limpar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧹 Apagar display");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Apaga tudo que está no display OLED");
    this.setHelpUrl("");
  }
};

// Display reset button counter block
Blockly.Blocks['display_resetar_contagem'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Zerar contador do botão")
        .appendField(new Blockly.FieldDropdown([
          ["A", "A"],
          ["B", "B"],
          ["C", "C"],
          ["Todos", "ALL"]
        ]), "BOTAO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Zera o contador de vezes que o botão foi apertado");
    this.setHelpUrl("");
  }
};

// Display button state block
Blockly.Blocks['display_mostrar_estado_botao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 Mostrar se botão")
        .appendField(new Blockly.FieldDropdown([
          ["A", "A"],
          ["B", "B"],
          ["C", "C"],
          ["Joystick", "JOYSTICK"]
        ]), "BOTAO")
        .appendField("foi apertado")
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.appendDummyInput()
        .appendField("📊 Contar quantas vezes:")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "MOSTRAR_CONTAGEM")
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA_CONTAGEM")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO_CONTAGEM");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra no display se o botão está apertado e quantas vezes foi clicado");
    this.setHelpUrl("");
  }
};

// Display buzzer status block
Blockly.Blocks['display_mostrar_status_buzzer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔊 Mostrar status do buzzer")
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO");
    this.appendDummyInput()
        .appendField("🎵 Mostrar frequência:")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "MOSTRAR_FREQUENCIA")
        .appendField("linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"]
        ]), "LINHA_FREQ")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALINHAMENTO_FREQ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra no display se o buzzer está tocando e a frequência atual");
    this.setHelpUrl("");
  }
};

// Dashboard complete matrix information block
Blockly.Blocks['display_dashboard_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📊 Monitor da Matriz");
    this.appendDummyInput()
        .appendField("Linha 1:")
        .appendField(new Blockly.FieldDropdown([
          ["(vazio)", "NONE"],
          ["Status ON/OFF", "STATUS"],
          ["Nome do Desenho", "DESENHO"],
          ["Cor RGB", "COR_RGB"],
          ["Nome da Cor", "COR_NOME"],
          ["Brilho %", "BRILHO"],
          ["LEDs Acesos", "LEDS_ACESOS"]
        ]), "INFO_LINHA1")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN_1");
    this.appendDummyInput()
        .appendField("Linha 2:")
        .appendField(new Blockly.FieldDropdown([
          ["(vazio)", "NONE"],
          ["Status ON/OFF", "STATUS"],
          ["Nome do Desenho", "DESENHO"],
          ["Cor RGB", "COR_RGB"],
          ["Nome da Cor", "COR_NOME"],
          ["Brilho %", "BRILHO"],
          ["LEDs Acesos", "LEDS_ACESOS"]
        ]), "INFO_LINHA2")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN_2");
    this.appendDummyInput()
        .appendField("Linha 3:")
        .appendField(new Blockly.FieldDropdown([
          ["(vazio)", "NONE"],
          ["Status ON/OFF", "STATUS"],
          ["Nome do Desenho", "DESENHO"],
          ["Cor RGB", "COR_RGB"],
          ["Nome da Cor", "COR_NOME"],
          ["Brilho %", "BRILHO"],
          ["LEDs Acesos", "LEDS_ACESOS"]
        ]), "INFO_LINHA3")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN_3");
    this.appendDummyInput()
        .appendField("Linha 4:")
        .appendField(new Blockly.FieldDropdown([
          ["(vazio)", "NONE"],
          ["Status ON/OFF", "STATUS"],
          ["Nome do Desenho", "DESENHO"],
          ["Cor RGB", "COR_RGB"],
          ["Nome da Cor", "COR_NOME"],
          ["Brilho %", "BRILHO"],
          ["LEDs Acesos", "LEDS_ACESOS"]
        ]), "INFO_LINHA4")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN_4");
    this.appendDummyInput()
        .appendField("Linha 5:")
        .appendField(new Blockly.FieldDropdown([
          ["(vazio)", "NONE"],
          ["Status ON/OFF", "STATUS"],
          ["Nome do Desenho", "DESENHO"],
          ["Cor RGB", "COR_RGB"],
          ["Nome da Cor", "COR_NOME"],
          ["Brilho %", "BRILHO"],
          ["LEDs Acesos", "LEDS_ACESOS"]
        ]), "INFO_LINHA5")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN_5");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#16a085");
    this.setTooltip("Mostra informações da matriz de LEDs no display OLED");
    this.setHelpUrl("");
  }
};

// ========== BLOCOS DE TEMPO E RELÓGIO ==========

Blockly.Blocks['display_mostrar_tempo_ligado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔌 Tempo BitDogLab ligada");
    this.appendDummyInput()
        .appendField("Linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "0"],
          ["2", "1"],
          ["3", "2"],
          ["4", "3"],
          ["5", "4"]
        ]), "LINE")
        .appendField("Alinhamento")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN");
    this.appendDummyInput()
        .appendField("Formato")
        .appendField(new Blockly.FieldDropdown([
          ["HH:MM:SS", "HMS"],
          ["MM:SS", "MS"],
          ["Segundos totais", "SECONDS"],
          ["Milissegundos", "MILLISECONDS"]
        ]), "FORMAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Mostra há quanto tempo a BitDogLab está ligada (não pode pausar!)");
  }
};

Blockly.Blocks['cronometro_iniciar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🏁 Iniciar/Retomar Cronômetro")
        .appendField(new Blockly.FieldTextInput("crono1"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Inicia o cronômetro ou retoma de onde pausou");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['cronometro_parar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏸️ Pausar Cronômetro")
        .appendField(new Blockly.FieldTextInput("crono1"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pausa o cronômetro (pode ser retomado depois)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['cronometro_reiniciar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Reiniciar Cronômetro")
        .appendField(new Blockly.FieldTextInput("crono1"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Reinicia o cronômetro zerando o tempo (volta para 00:00:00)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['cronometro_mostrar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📊 Mostrar Cronômetro");
    this.appendDummyInput()
        .appendField("Nome")
        .appendField(new Blockly.FieldTextInput("crono1"), "NAME");
    this.appendDummyInput()
        .appendField("Linha")
        .appendField(new Blockly.FieldDropdown([
          ["1", "0"],
          ["2", "1"],
          ["3", "2"],
          ["4", "3"],
          ["5", "4"]
        ]), "LINE")
        .appendField("Alinhamento")
        .appendField(new Blockly.FieldDropdown([
          ["À esquerda", "LEFT"],
          ["Ao centro", "CENTER"],
          ["À direita", "RIGHT"]
        ]), "ALIGN");
    this.appendDummyInput()
        .appendField("Formato")
        .appendField(new Blockly.FieldDropdown([
          ["HH:MM:SS", "HMS"],
          ["MM:SS.ms", "MS_MILLI"],
          ["Segundos.ms", "S_MILLI"],
          ["Segundos totais", "SECONDS"]
        ]), "FORMAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Mostra o tempo decorrido do cronômetro no display OLED com rótulo opcional");
    this.setHelpUrl("");
  }
};

// Container block for melody mutator
