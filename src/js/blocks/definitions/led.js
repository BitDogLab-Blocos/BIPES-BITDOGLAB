// ==========================================
// Category: LEDs
// ==========================================
// Turn on LED block
Blockly.Blocks['bloco_ligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💡 Ligar LED da cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Liga o LED da cor selecionada");
    this.setHelpUrl("");
  }
};
// Turn off LED block
Blockly.Blocks['bloco_desligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔦 Desligar LED da cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Desliga o LED da cor selecionada");
    this.setHelpUrl("");
  }
};
// Turn off all LEDs block
Blockly.Blocks['bloco_desligar_todos_leds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔦 Desligar todos os LEDs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Desliga todos os LEDs");
    this.setHelpUrl("");
  }
};
// Turn on LED with brightness block
Blockly.Blocks['bloco_acender_led_brilho'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔆 Ligar LED da cor");
    this.appendDummyInput()
        .appendField("com brilho de")
        .appendField(new Blockly.FieldNumber(100, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Liga o LED com o brilho que você escolher, de 0% a 100%");
    this.setHelpUrl("");
  }
};
// Blink LED quickly block
Blockly.Blocks['bloco_piscar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("⚡ Piscar LED da cor");
    this.appendDummyInput()
        .appendField("rapidamente");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Faz o LED piscar rapidamente (200ms ligado, 200ms desligado)");
    this.setHelpUrl("");
  }
};
// Blink LED slowly block
Blockly.Blocks['piscar_led_lento'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🐌 Piscar LED da cor");
    this.appendDummyInput()
        .appendField("devagar");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Faz o LED piscar lentamente (1s ligado, 1s desligado)");
    this.setHelpUrl("");
  }
};
// Heartbeat LED animation block
Blockly.Blocks['bloco_animar_led_coracao'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💓 Animar LED da cor");
    this.appendDummyInput()
        .appendField("batimento cardíaco");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Simula um batimento cardíaco com dois pulsos rápidos");
    this.setHelpUrl("");
  }
};
// SOS signal LED block
Blockly.Blocks['bloco_sinalizar_led_sos'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🆘 Sinalizar LED da cor");
    this.appendDummyInput()
        .appendField("ajuda (SOS)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Emite o sinal de socorro S.O.S. em código Morse (... --- ...)");
    this.setHelpUrl("");
  }
};
// Fade LED animation block
Blockly.Blocks['bloco_animar_led_brilhar'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("✨ Animar LED da cor");
    this.appendDummyInput()
        .appendField("brilhar e desaparecer");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Efeito de aparecimento e desaparecimento gradual com a cor selecionada");
    this.setHelpUrl("");
  }
};
// Container block for LED alternate mutator
Blockly.Blocks['bloco_alternar_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("alternar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover cores para alternar.");
    this.contextMenu = false;
  }
};
// Item block for LED alternate mutator
Blockly.Blocks['bloco_alternar_led_item'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("cor");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma cor à alternância.");
    this.contextMenu = false;
  }
};
// Alternate LED colors block
Blockly.Blocks['bloco_alternar_led'] = {
  init: function() {
    this.setColour(45);
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_alternar_led_item']));
    this.setTooltip("Alterna entre várias cores de LED. Use a engrenagem para adicionar mais cores!");
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
    var containerBlock = workspace.newBlock('bloco_alternar_led_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('bloco_alternar_led_item');
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
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('COLOUR' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'COLOUR' + i);
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('COLOUR' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Remove all existing color inputs
    var i = 0;
    while (this.getInput('COLOUR' + i)) {
      this.removeInput('COLOUR' + i);
      i++;
    }
    // Add color inputs
    for (var i = 0; i < this.itemCount_; i++) {
      if (i == 0) {
        this.appendValueInput('COLOUR' + i)
            .setCheck("Colour")
            .appendField("🔄 Alternar LED da cor");
      } else {
        this.appendValueInput('COLOUR' + i)
            .setCheck("Colour")
            .appendField("com a cor");
      }
    }
  }
};
// LED color transition block
Blockly.Blocks['bloco_transicao_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("🌈 Transição de LED da cor");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("para a cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Faz uma transição suave entre duas cores usando PWM");
    this.setHelpUrl("");
  }
};
// LED color battle block
Blockly.Blocks['bloco_batalhar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("⚔️ Batalhar LED da cor");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("com a cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Cria um efeito de batalha entre duas cores");
    this.setHelpUrl("");
  }
};
// Container block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("animação");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover passos de animação.");
    this.contextMenu = false;
  }
};
// Action item block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_action'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("ação");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma ação (ligar/desligar LED).");
    this.contextMenu = false;
  }
};
// Wait item block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_wait'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("tempo");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar um tempo (ficar assim por...).");
    this.contextMenu = false;
  }
};
// Create LED animation block
Blockly.Blocks['bloco_criar_animacao_led'] = {
  init: function() {
    this.setColour(45);
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_criar_animacao_led_action', 'bloco_criar_animacao_led_wait']));
    this.setTooltip("Cria uma animação personalizada de LED. Use a engrenagem para adicionar mais ações e tempos!");
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('steps', JSON.stringify(this.steps_));
    return container;
  },
  domToMutation: function(xmlElement) {
    var stepsStr = xmlElement.getAttribute('steps');
    this.steps_ = stepsStr ? JSON.parse(stepsStr) : [];
    this.updateShape_();
  },
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('bloco_criar_animacao_led_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.steps_.length; i++) {
      var blockType = this.steps_[i] === 'action' ? 'bloco_criar_animacao_led_action' : 'bloco_criar_animacao_led_wait';
      var itemBlock = workspace.newBlock(blockType);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var newSteps = [];
    var connections = [];
    // Collect types and connections
    while (itemBlock) {
      if (itemBlock.type === 'bloco_criar_animacao_led_action') {
        newSteps.push('action');
        connections.push(itemBlock.stepConnection_);
      } else if (itemBlock.type === 'bloco_criar_animacao_led_wait') {
        newSteps.push('wait');
        connections.push(itemBlock.stepConnection_);
      }
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect old connections
    for (var i = 0; i < this.steps_.length; i++) {
      var input = this.getInput('STEP' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
    }
    this.steps_ = newSteps;
    this.updateShape_();
    // Reconnect blocks
    for (var i = 0; i < this.steps_.length; i++) {
      if (connections[i]) {
        Blockly.Mutator.reconnect(connections[i], this, 'STEP' + i);
      }
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('STEP' + i);
      itemBlock.stepConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('STEP' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('STEP' + i)) this.removeInput('STEP' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }
    // Add inputs for each step
    if (this.steps_.length === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎬 Criar Animação de LED");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      for (var i = 0; i < this.steps_.length; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎬 Criar Animação de LED");
        }
        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
              .setCheck(null)
              .appendField('O que fazer:');
        } else {
          this.appendValueInput('STEP' + i)
              .setCheck("Time")
              .appendField('Ficar assim por:');
        }
      }
    }
  }
};
