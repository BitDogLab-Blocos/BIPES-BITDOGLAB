// ==========================================
// Global variable to control if the instruction message has been shown
var matrixAnimationTipShown = false;
// Function to show the matrix animation tip (only once)
function showMatrixAnimationTip() {
  if (!matrixAnimationTipShown) {
    matrixAnimationTipShown = true;
    setTimeout(function() {
      alert("💡 Dica: Coloque um bloco de LED da matriz (como 'Mostrar emoji' ou 'Mostrar número') dentro deste bloco de animação!");
    }, 100);
  }
}


// ==========================================
// Blocos Básicos do Blockly (substituem blocks_compressed.js)

// ==========================================
// Category: LED Matrix
// ==========================================
// Fill LED matrix block
Blockly.Blocks['preencher_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Ligar matriz de LED da cor");
    this.appendValueInput("COLOUR")
        .setCheck("Colour");
    this.appendDummyInput()
        .appendField("com brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Liga toda a matriz 5x5 de LED com a cor e intensidade especificadas");
    this.setHelpUrl("");
  }
};
// Turn off LED matrix block
Blockly.Blocks['desligar_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Desligar matriz de LED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Desliga toda a matriz 5x5 de LED");
    this.setHelpUrl("");
  }
};
// Turn on LED at position block
Blockly.Blocks['acender_led_posicao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Ligar LED na linha")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA")
        .appendField("coluna")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com a cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Liga um LED específico na matriz 5x5 (linha: 0-4, coluna: 0-4)");
    this.setHelpUrl("");
  }
};
// Turn on row block
Blockly.Blocks['acender_linha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Ligar linha")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com a cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Liga uma linha horizontal completa na matriz 5x5 (linha: 0-4)");
    this.setHelpUrl("");
  }
};
// Turn on column block
Blockly.Blocks['acender_coluna'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Ligar coluna")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com a cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Liga uma coluna vertical completa na matriz 5x5 (coluna: 0-4)");
    this.setHelpUrl("");
  }
};
// Show number on matrix block
Blockly.Blocks['mostrar_numero_matriz'] = {
  init: function() {
    this.appendValueInput("NUMERO")
        .setCheck("MatrixNumber")
        .appendField("🔢 Mostrar número");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("com a cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "BRILHO")
        .appendField("%");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Mostra um número na matriz 5x5 de LED com a cor e brilho especificados");
    this.setHelpUrl("");
  }
};
// Show emoji on matrix block
Blockly.Blocks['mostrar_emoji'] = {
  init: function() {
    this.appendValueInput("EMOJI")
        .setCheck("MatrixEmoji")
        .appendField("😊 Mostrar emoji");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("com a cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "BRILHO")
        .appendField("%");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Mostra um emoji na matriz 5x5 de LED com a cor e brilho especificados");
    this.setHelpUrl("");
  }
};
// ==========================================
// Category: Matrix Numbers
// ==========================================
// Number 0 block for matrix display
Blockly.Blocks['numero_matriz_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("0️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 0");
    this.setHelpUrl("");
  }
};
// Number 1 block for matrix display
Blockly.Blocks['numero_matriz_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("1️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 1");
    this.setHelpUrl("");
  }
};
// Number 2 block for matrix display
Blockly.Blocks['numero_matriz_2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("2️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 2");
    this.setHelpUrl("");
  }
};
// Number 3 block for matrix display
Blockly.Blocks['numero_matriz_3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("3️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 3");
    this.setHelpUrl("");
  }
};
// Number 4 block for matrix display
Blockly.Blocks['numero_matriz_4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("4️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 4");
    this.setHelpUrl("");
  }
};
// Number 5 block for matrix display
Blockly.Blocks['numero_matriz_5'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("5️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 5");
    this.setHelpUrl("");
  }
};
// Number 6 block for matrix display
Blockly.Blocks['numero_matriz_6'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("6️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 6");
    this.setHelpUrl("");
  }
};
// Number 7 block for matrix display
Blockly.Blocks['numero_matriz_7'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("7️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 7");
    this.setHelpUrl("");
  }
};
// Number 8 block for matrix display
Blockly.Blocks['numero_matriz_8'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("8️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 8");
    this.setHelpUrl("");
  }
};
// Number 9 block for matrix display
Blockly.Blocks['numero_matriz_9'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("9️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Número 9");
    this.setHelpUrl("");
  }
};
// ==========================================
// Category: Matrix Emojis
// ==========================================
// Happy face emoji block for matrix display
Blockly.Blocks['emoji_rosto_feliz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😊 Rosto Feliz");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de rosto feliz");
    this.setHelpUrl("");
  }
};
// Sad face emoji block for matrix display
Blockly.Blocks['emoji_rosto_triste'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😢 Rosto Triste");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de rosto triste");
    this.setHelpUrl("");
  }
};
// Surprised face emoji block for matrix display
Blockly.Blocks['emoji_rosto_surpreso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😮 Rosto Surpreso");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de rosto surpreso");
    this.setHelpUrl("");
  }
};
// Heart emoji block for matrix display
Blockly.Blocks['emoji_coracao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❤️ Coração");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de coração");
    this.setHelpUrl("");
  }
};
// Up arrow emoji block for matrix display
Blockly.Blocks['emoji_seta_cima'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬆️ Seta para Cima");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de seta para cima");
    this.setHelpUrl("");
  }
};
// Down arrow emoji block for matrix display
Blockly.Blocks['emoji_seta_baixo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬇️ Seta para Baixo");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de seta para baixo");
    this.setHelpUrl("");
  }
};
// Sun emoji block for matrix display
Blockly.Blocks['emoji_sol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("☀️ Sol");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de sol");
    this.setHelpUrl("");
  }
};
// Rain emoji block for matrix display
Blockly.Blocks['emoji_chuva'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌧️ Chuva");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de chuva");
    this.setHelpUrl("");
  }
};
// Flower emoji block for matrix display
Blockly.Blocks['emoji_flor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌸 Flor");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de flor");
    this.setHelpUrl("");
  }
};
// Ghost emoji block for matrix display
Blockly.Blocks['emoji_fantasma'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👻 Fantasma");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de fantasma");
    this.setHelpUrl("");
  }
};
// Christmas tree emoji block for matrix display
Blockly.Blocks['emoji_arvore_natal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Árvore de Natal");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de árvore de Natal");
    this.setHelpUrl("");
  }
};
// Snowflake emoji block for matrix display
Blockly.Blocks['emoji_floco_neve'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❄️ Floco de Neve");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de floco de neve");
    this.setHelpUrl("");
  }
};
// Gift emoji block for matrix display
Blockly.Blocks['emoji_presente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎁 Presente");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de presente de Natal");
    this.setHelpUrl("");
  }
};
// Christmas bell emoji block for matrix display
Blockly.Blocks['emoji_sino_natal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔔 Sino de Natal");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Emoji de sino de Natal");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Matrix Animations
// ==========================================
// Fast blink animation block
Blockly.Blocks['matriz_piscar_rapido'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚡ Fazer Piscar Rápido");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco piscar rapidamente na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Slow blink animation block
Blockly.Blocks['matriz_piscar_lento'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐌 Fazer Piscar Devagar");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco piscar lentamente na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Appear and disappear animation block
Blockly.Blocks['matriz_aparecer_sumir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✨ Fazer Aparecer e Sumir");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco aparecer e desaparecer gradualmente");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Pulse brightness animation block
Blockly.Blocks['matriz_pulsar_brilho'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💫 Fazer Pulsar Brilho");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco pulsar com variação de brilho");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Slide up animation block
Blockly.Blocks['matriz_deslizar_cima'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬆️ Fazer Deslizar para Cima");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para cima na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Slide left animation block
Blockly.Blocks['matriz_deslizar_esquerda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬅️ Fazer Deslizar para Esquerda");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para a esquerda na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Slide down animation block
Blockly.Blocks['matriz_deslizar_baixo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬇️ Fazer Deslizar para Baixo");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para baixo na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Slide right animation block
Blockly.Blocks['matriz_deslizar_direita'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("➡️ Fazer Deslizar para Direita");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para a direita na matriz");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Swing animation block
Blockly.Blocks['matriz_balancar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Fazer Balançar");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco balançar de um lado para o outro");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Contraction animation block
Blockly.Blocks['matriz_contracao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔻 Fazer Contração");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco ter um efeito de contração");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};
// Flash animation block
Blockly.Blocks['matriz_dar_flash'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚡ Dar um Flash de Cor");
    this.appendValueInput("COR")
        .setCheck("Colour");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Exibe o conteúdo dentro deste bloco e depois dá um flash com a cor especificada");
    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// ==========================================
// Category: Matrix Drawing
// ==========================================
// Container block for matrix drawing mutator
Blockly.Blocks['criar_desenho_matriz_container'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.appendDummyInput()
        .appendField("desenho");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover blocos de desenho para criar sua imagem.");
    this.contextMenu = false;
  }
};
// Item block for matrix drawing mutator
Blockly.Blocks['criar_desenho_matriz_item'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.appendDummyInput()
        .appendField("bloco de desenho");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar um bloco de desenho (ligar LED, linha, coluna, etc).");
    this.contextMenu = false;
  }
};
// Create drawing on matrix block
Blockly.Blocks['criar_desenho_na_matriz'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_desenho_matriz_item']));
    this.setTooltip("Cria uma tela de desenho para a matriz de LED. Combine blocos de desenho dentro dela!");
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_desenho_matriz_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('criar_desenho_matriz_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.drawingConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('DESENHO' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'DESENHO' + i);
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('DESENHO' + i);
      itemBlock.drawingConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('DESENHO' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('DESENHO' + i)) this.removeInput('DESENHO' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }
    // Add drawing inputs
    if (this.itemCount_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎨 Criar Desenho na Matriz");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      for (var i = 0; i < this.itemCount_; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎨 Criar Desenho na Matriz");
        }
        this.appendStatementInput('DESENHO' + i)
            .setCheck(null)
            .appendField('Desenho ' + (i + 1) + ':');
      }
    }
  }
};

// =============================================
// BLOCOS DE MEDIÇÃO (Sensores - Projeto Estufa)
// =============================================

// Bloco: Medir temperatura (°C) — retorna valor numérico
