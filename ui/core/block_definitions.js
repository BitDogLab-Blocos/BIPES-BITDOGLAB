// LED RGB Control Blocks for BitDogLab
// SVG ícones de LEDs coloridos
const svg_red_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjRUY1MzUwIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiNFMzUzNSIvPjwvc3ZnPg==";
const svg_green_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNjZCQTZBIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiM0Q0FGNTAiLz48L3N2Zz4=";
const svg_blue_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNDJBNUY1Ii8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiMyMTk2RjMiLz48L3N2Zz4=";
const svg_off_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjOUU5RTlFIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE4IEgxNFoiIGZpbGw9IiM3NTc1NzUiLz48L3N2Zz4=";
const led_rgb_svg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJnYkdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmYwMDAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZjAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODBmZjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSJ1cmwoI3JnYkdyYWRpZW50KSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=";
const svg_decision_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZBNTAwIj48cGF0aCBkPSJNMTIgMkwyMiAxMiAxMiAyMiAyIDEyeiIvPjwvc3ZnPg==";

// Console icon from Material Symbols (free to use)
const svg_console_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMCAzSDQtMS45OSAyIDV2MTRjMCAxLjEgLjg5IDIgMS45OSAybDE2LjAyYzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINGwtLjAxLTEwSDIwVjE5em0tOS04bDItMi01LTV2M2gtNnYyaDZ2M2w1LTV6Ii8+PC9zdmc+";





// ==========================================
// DYNAMIC LIST CREATION BLOCK WITH MUTATOR
// ==========================================

// PRIMEIRO: Defina os blocos auxiliares do mutator (OBRIGATÓRIO ANTES DO BLOCO PRINCIPAL)
// Isso corrige o erro "getMutator is not a function"

// Bloco container para o mutator
Blockly.Blocks['lists_create_with_container'] = {
  init: function() {
    this.setColour("%{BKY_LISTS_HUE}");
    this.appendDummyInput()
        .appendField("lista");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione, remova, ou reordene os itens para reconfigurar este bloco.");
    this.contextMenu = false;
  }
};

// Bloco item para o mutator
Blockly.Blocks['lists_create_with_item'] = {
  init: function() {
    this.setColour("%{BKY_LISTS_HUE}");
    this.appendDummyInput()
        .appendField("item");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione um item à lista.");
    this.contextMenu = false;
  }
};

// SEGUNDO: Agora defina o bloco principal (com mutator configurado corretamente)
// Override the default lists_create_with block with Portuguese version and dynamic mutator
Blockly.Blocks['lists_create_with'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
    this.setColour("%{BKY_LISTS_HUE}");
    this.itemCount_ = 3; // Começa com 3 itens por padrão
    this.updateShape_();
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
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
    var containerBlock = workspace.newBlock('lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Conta quantos itens o utilizador deixou na interface do mutator.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Remove os itens antigos.
    for (var i = 0; i < this.itemCount_; i++) {
      this.removeInput('ADD' + i);
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Adiciona as novas conexões.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        connections[i].reconnect(this, 'ADD' + i);
      }
    }
  },
  // ... (outras funções como saveConnections)
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField("Criar lista vazia"); // Texto para quando a lista não tem itens
    }
    // Adiciona as entradas para os itens
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField("Criar lista com");
        }
      }
    }
    // Remove as entradas extras se o número de itens diminuir
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

// NOTA: Blocos auxiliares já foram definidos ANTES do bloco principal para evitar erros

// Blocos de Cores - 12 cores completas
Blockly.Blocks['colour_red'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔴 Vermelho");
    this.setOutput(true, "Colour");
    this.setColour(0);
    this.setTooltip("Cor vermelha");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_green'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟢 Verde");
    this.setOutput(true, "Colour");
    this.setColour(120);
    this.setTooltip("Cor verde");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_blue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔵 Azul");
    this.setOutput(true, "Colour");
    this.setColour(230);
    this.setTooltip("Cor azul");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_yellow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟡 Amarelo");
    this.setOutput(true, "Colour");
    this.setColour(60);
    this.setTooltip("Cor amarela (vermelho + verde)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_cyan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩵 Ciano");
    this.setOutput(true, "Colour");
    this.setColour(180);
    this.setTooltip("Cor ciano (verde + azul)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_magenta'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩷 Magenta");
    this.setOutput(true, "Colour");
    this.setColour(300);
    this.setTooltip("Cor magenta (vermelho + azul)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_white'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚪ Branco");
    this.setOutput(true, "Colour");
    this.setColour("#FFFFFF");
    this.setTooltip("Cor branca (todas as cores)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_orange'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟠 Laranja");
    this.setOutput(true, "Colour");
    this.setColour(30);
    this.setTooltip("Cor laranja (vermelho forte + verde fraco)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_pink'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💗 Rosa");
    this.setOutput(true, "Colour");
    this.setColour(330);
    this.setTooltip("Cor rosa (vermelho + azul fraco)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_lime'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💚 Lima");
    this.setOutput(true, "Colour");
    this.setColour(90);
    this.setTooltip("Cor lima (verde forte + vermelho fraco)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_skyblue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💙 Azul Céu");
    this.setOutput(true, "Colour");
    this.setColour(200);
    this.setTooltip("Cor azul céu (azul forte + verde fraco)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['colour_turquoise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩵 Turquesa");
    this.setOutput(true, "Colour");
    this.setColour(165);
    this.setTooltip("Cor turquesa (verde + azul médio)");
    this.setHelpUrl("");
  }
};

// Blocos auxiliares para o mutator de mix_colours
Blockly.Blocks['mix_colours_container'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("misturar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova cores para misturar.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['mix_colours_item'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("cor");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma cor à mistura.");
    this.contextMenu = false;
  }
};

// Bloco de mistura de cores com mutator
Blockly.Blocks['mix_colours'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("🎨 Misturar");
    this.appendValueInput('ADD0')
        .setCheck("Colour");
    this.appendValueInput('ADD1')
        .setCheck("Colour");
    this.setOutput(true, "Colour");
    this.setMutator(new Blockly.Mutator(['mix_colours_item']));
    this.setTooltip("Mistura múltiplas cores de LED");
    this.itemCount_ = 2;
  },

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('mix_colours_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('mix_colours_item');
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
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    if (this.itemCount_ && this.getInput('ADD0')) {
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i)
              .setCheck("Colour");
        }
      }
    } else if (!this.itemCount_) {
      this.itemCount_ = 2;
    }
    while (this.getInput('ADD' + this.itemCount_)) {
      this.removeInput('ADD' + this.itemCount_);
      this.itemCount_++;
    }
  }
};

// Blocos de LED refatorados
Blockly.Blocks['led_turn_on'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("Ligar LED");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Liga o LED da cor selecionada");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_turn_off_all'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Desligar Todos os LEDs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Desliga todos os LEDs");
    this.setHelpUrl("");
  }
};

// Override logic_compare block with descriptive text for children
Blockly.Blocks['logic_compare'] = {
  init: function() {
    this.appendValueInput("A");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["For Igual a", "EQ"],
            ["For Diferente de", "NEQ"],
            ["For Menor que", "LT"],
            ["For Menor ou Igual a", "LTE"],
            ["For Maior que", "GT"],
            ["For Maior ou Igual a", "GTE"]
        ]), "OP");
    this.appendValueInput("B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Compara dois valores");
    this.setHelpUrl("");
  }
};

// Override controls_if block with diamond icon
Blockly.Blocks['controls_if'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldImage(svg_decision_icon, 15, 15, "♦"))
        .appendField("Se acontecer");
    this.appendStatementInput("DO0")
        .appendField("então faça");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Se a condição for verdadeira, executa as ações");
    this.setHelpUrl("");
    this.setMutator(new Blockly.Mutator(['controls_if_elseif', 'controls_if_else']));
  }
};

// Override logic_ternary block with diamond icon
Blockly.Blocks['logic_ternary'] = {
  init: function() {
    this.appendValueInput("IF")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldImage(svg_decision_icon, 15, 15, "♦"))
        .appendField("Se");
    this.appendValueInput("THEN")
        .appendField("então faça");
    this.appendValueInput("ELSE")
        .appendField("senão faça");
    this.setOutput(true);
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Se a condição for verdadeira, retorna o primeiro valor, senão retorna o segundo");
    this.setHelpUrl("");
  }
};

// Override logic_boolean blocks with Portuguese text (without emojis)
Blockly.Blocks['logic_boolean'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["Verdadeiro", "TRUE"],
            ["Falso", "FALSE"]
        ]), "BOOL");
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Devolve ou Verdadeiro ou Falso.");
    this.setHelpUrl("");
  }
};

// Override logic_operation block
Blockly.Blocks['logic_operation'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["E também", "AND"],
            ["Ou", "OR"]
        ]), "OP");
    this.appendValueInput("B")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Operação lógica entre duas condições");
    this.setHelpUrl("");
  }
};

// Override logic_negate block
Blockly.Blocks['logic_negate'] = {
  init: function() {
    this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("O contrário de");
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Retorna o oposto do valor: verdadeiro vira falso, falso vira verdadeiro");
    this.setHelpUrl("");
  }
};

// Isolated "Repita para sempre" block - Phase 2 testing
Blockly.Blocks['controls_while_true'] = {
  init: function() {
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("Repita para sempre");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_LOOPS_HUE}");
    this.setTooltip("Executa as ações dentro do bloco repetidamente, para sempre.");
    this.setHelpUrl("");
  }
};

// Temporização
Blockly.Blocks['delay_seconds'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("delay seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['delay_milliseconds'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("delay milliseconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Override math_single block with child-friendly explanations
Blockly.Blocks['math_single'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["Raiz quadrada (√)", "ROOT"],
            ["Número absoluto (sempre positivo)", "ABS"],
            ["Logaritmo natural (ln)", "LN"],
            ["Logaritmo base 10 (log10)", "LOG10"],
            ["Exponencial (e^)", "EXP"],
            ["Potência de 10 (10^)", "POW10"]
        ]), "OP", function(option) {
          this.getSourceBlock().updateShape_(option);
        });
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Aplica uma função matemática a um número");
    this.setHelpUrl("%{BKY_MATH_SINGLE_HELPURL}");
  }
};

// Override math_trig block with "trigonometria" prefix and child-friendly explanations
Blockly.Blocks['math_trig'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Trigonometria")
        .appendField(new Blockly.FieldDropdown([
            ["Seno (sin)", "SIN"],
            ["Cosseno (cos)", "COS"],
            ["Tangente (tan)", "TAN"],
            ["Arco seno (asin)", "ASIN"],
            ["Arco cosseno (acos)", "ACOS"],
            ["Arco tangente (atan)", "ATAN"]
        ]), "OP");
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Aplica uma função trigonométrica a um ângulo");
    this.setHelpUrl("%{BKY_MATH_TRIG_HELPURL}");
  }
};

// Override math_constant block with "Constantes" prefix and child-friendly explanations
Blockly.Blocks['math_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Constantes")
        .appendField(new Blockly.FieldDropdown([
            ["Pi (π)", "PI"],
            ["Euler (e)", "E"],
            ["Phi - Proporção áurea (φ)", "GOLDEN_RATIO"],
            ["Raiz de 2 (√2)", "SQRT2"],
            ["Raiz de meio (√½)", "SQRT1_2"],
            ["Infinito (∞)", "INFINITY"]
        ]), "CONSTANT");
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Retorna uma constante matemática importante");
    this.setHelpUrl("%{BKY_MATH_CONSTANT_HELPURL}");
  }
};

// Máquina e Pinos
Blockly.Blocks['gpio_set'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("Number")
        .appendField("set gpio");
    this.appendValueInput("value")
        .setCheck("Boolean")
        .appendField("to");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['gpio_get'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("Number")
        .appendField("get gpio");
    this.setOutput(true, "Boolean");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pinout'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("pin")
        .appendField(new Blockly.FieldTextInput("0"), "PIN");
    this.setOutput(true, "Number");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['adc'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("Number")
        .appendField("read adc");
    this.setOutput(true, "Number");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("Number")
        .appendField("pwm");
    this.appendValueInput("frequency")
        .setCheck("Number")
        .appendField("frequency");
    this.appendValueInput("duty")
        .setCheck("Number")
        .appendField("duty");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm.deinit'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("Number")
        .appendField("deinit pwm");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_freq'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get frequency");
    this.setOutput(true, "Number");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['set_freq'] = {
  init: function() {
    this.appendValueInput("freq")
        .setCheck("Number")
        .appendField("set frequency");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['reset'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("reset");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['machine_unique_id'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("unique id");
    this.setOutput(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['machine_reset_cause'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("reset cause");
    this.setOutput(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Magnifying glass icon for math property verification
const svg_magnifying_glass = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNDA3MUY0Ij48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QTE2LjUgMTYuNSAwIDAwMTggMTAuNWE2LjUgNi41IDAgMTAtNi41IDYuNWMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBoLTYuNWEyLjUgMi41IDAgMTEwLTV2NUExIDEgMCAwMTkuNSA5eiIvPjwvc3ZnPg==";

// Override math_number_property block for simplified child-friendly interface
Blockly.Blocks['math_number_property'] = {
  init: function() {
    this.appendValueInput("NUMBER_TO_CHECK")
        .setCheck("Number")
        .appendField("Verificar se o número");
    this.appendDummyInput()
        .appendField("é")
        .appendField(new Blockly.FieldDropdown([
            ["par", "EVEN"],
            ["ímpar", "ODD"],
            ["positivo", "POSITIVE"],
            ["negativo", "NEGATIVE"]
        ]), "PROPERTY");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Verifica se um número tem a propriedade selecionada (par, ímpar, positivo ou negativo). Retorna verdadeiro ou falso.");
    this.setHelpUrl("");
  }
};

// New dedicated block for divisibility checking
Blockly.Blocks['math_is_divisible_by'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number")
        .appendField("O número");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("é divisível por");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Verifica se o primeiro número pode ser dividido pelo segundo sem deixar sobras.");
    this.setHelpUrl("");
  }
};

// New block for rounding to specific decimal places
Blockly.Blocks['math_round_to_decimal'] = {
  init: function() {
    this.appendValueInput("NUMBER_TO_ROUND")
        .setCheck("Number")
        .appendField("Arredondar");
    this.appendDummyInput()
        .appendField("para")
        .appendField(new Blockly.FieldNumber(2, 0), "DECIMAL_PLACES")
        .appendField("casas decimais");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Arredonda um número para o número de casas decimais especificado.");
    this.setHelpUrl("");
  }
};

// Dice icon for random list operation
const svg_dice_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNDA3MUY0Ij48cGF0aCBkPSJNNSAzaDE0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yem0wIDJhMSAxIDAgMCAwLTEgMXYxNGExIDEgMCAwIDAgMSAxaDE0YTEgMSAwIDAgMCAxLTFWNmExIDEgMCAwIDAtMS0xSDV6bTMgM2ExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMS0wLTJ6bTggMGExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMS0wLTJ6bTAgOGExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMS0wLTJ6bS04IDBhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEtMC0yem00LTRhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEtMC0yeiIvPjwvc3ZnPg==";

// Override math_on_list block for simplified child-friendly interface
Blockly.Blocks['math_on_list'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("Calcular a")
        .appendField(new Blockly.FieldDropdown([
            ["Soma", "SUM"],
            ["Menor número", "MIN"], 
            ["Maior número", "MAX"],
            ["Média", "AVERAGE"],
            ["Um item aleatório", "RANDOM"]
        ]), "OP", function(option) {
          this.getSourceBlock().updateShape_(option);
        })
        .appendField("da lista");
    this.setOutput(true);
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Realiza operações simples com listas de números.");
    this.setHelpUrl("");
  },
  
  updateShape_: function(option) {
    // Add dice icon when random option is selected
    var iconField = this.getField('DICE_ICON');
    if (option === 'RANDOM') {
      if (!iconField) {
        this.getInput('LIST').insertFieldAt(3, new Blockly.FieldImage(svg_dice_icon, 15, 15, "*"), 'DICE_ICON');
      }
    } else {
      if (iconField) {
        this.getInput('LIST').removeField('DICE_ICON');
      }
    }
  }
};

// Custom math_random_float block with interval parameters
Blockly.Blocks['math_random_float'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sortear um número decimal entre");
    this.appendValueInput("FROM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("e");
    this.appendValueInput("TO")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip(Blockly.Msg["MATH_RANDOM_FLOAT_TOOLTIP"]);
    this.setHelpUrl(Blockly.Msg["MATH_RANDOM_FLOAT_HELPURL"]);
  }
};

// Override text_charAt block with dynamic interface - shows number input only when needed
Blockly.Blocks['text_charAt'] = {
  init: function() {
    // Main text input
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField('No texto');
    
    // Create the dropdown menu with callback function
    var menu = new Blockly.FieldDropdown([
      ['Letra nº', 'FROM_START'],
      ['Primeira letra', 'FIRST'],
      ['Última letra', 'LAST'],
      ['Letra aleatória', 'RANDOM']
    ], function(option) {
      // This function is called when the menu changes
      this.getSourceBlock().updateShape_(option);
    });

    // Dropdown input with "pegar a" text
    this.appendDummyInput('DROPDOWN')
        .appendField("pegar a")
        .appendField(menu, 'WHERE');
        
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour("%{BKY_TEXTS_HUE}");
    this.setTooltip("Pega uma letra específica de um texto.");
    this.setHelpUrl("%{BKY_TEXT_CHARAT_HELPURL}");
    
    // Initial call to ensure the block starts with the correct shape
    this.updateShape_('FROM_START');
  },

  /**
   * Function that adds or removes the number input based on the menu option.
   * @param {string} option The selected option in the menu ('FROM_START', 'FIRST', etc.).
   * @this {Blockly.Block}
   */
  updateShape_: function(option) {
    // Check if the number input already exists
    var inputExists = this.getInput('AT_VALUE');

    if (option === 'FROM_START') {
      // If the option is "Letra nº" and the number input doesn't exist, create it
      if (!inputExists) {
        this.appendValueInput('AT_VALUE')
            .setCheck('Number');
        // Move the input to the correct position (after the dropdown)
        this.moveInputBefore('AT_VALUE', null);
      }
    } else {
      // For any other option, if the number input exists, remove it
      if (inputExists) {
        this.removeInput('AT_VALUE');
      }
    }
  }
};

// Override text_getSubstring block for simplified child-friendly interface
Blockly.Blocks['text_getSubstring'] = {
  init: function() {
    // Start dropdown options - simplified for children
    this.WHERE_OPTIONS_1 = [
        ["Primeira letra", "FIRST"],
        ["Letra nº", "FROM_START"]
    ];
    
    // End dropdown options - simplified for children
    this.WHERE_OPTIONS_2 = [
        ["Última letra", "LAST"],
        ["Letra nº", "FROM_START"]
    ];

    this.setHelpUrl("%{BKY_TEXT_GET_SUBSTRING_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");
    
    // Main text input with child-friendly language
    this.appendValueInput("STRING")
        .setCheck("String")
        .appendField("No texto");
    
    // "FROM" section - "pegar trecho a partir de" will be added by updateAt_
    this.appendDummyInput("AT1");
    
    // "TO" section - "até" will be added by updateAt_  
    this.appendDummyInput("AT2");
    
    // Optional tail (usually empty in Portuguese)
    if ("%{BKY_TEXT_GET_SUBSTRING_TAIL}") {
      this.appendDummyInput("TAIL")
          .appendField("%{BKY_TEXT_GET_SUBSTRING_TAIL}");
    }
    
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.updateAt_(1, false); // Initialize first dropdown with "Primeira letra"
    this.updateAt_(2, false); // Initialize second dropdown with "Última letra"
    this.setTooltip("Pega um trecho do texto, a partir de uma posição até outra posição.");
  },

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement("mutation");
    var isAt1 = this.getInput("AT1").type == Blockly.INPUT_VALUE;
    container.setAttribute("at1", isAt1);
    var isAt2 = this.getInput("AT2").type == Blockly.INPUT_VALUE;
    container.setAttribute("at2", isAt2);
    return container;
  },

  domToMutation: function(xmlElement) {
    var isAt1 = ("true" == xmlElement.getAttribute("at1"));
    var isAt2 = ("true" == xmlElement.getAttribute("at2"));
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },

  updateAt_: function(n, isAt) {
    // Remove existing input
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    
    // Define the descriptive text for each position
    var descriptiveText = (n == 1) ? "pegar trecho a partir de" : "até";
    
    if (isAt) {
      // Add value input for number with descriptive text
      this.appendValueInput("AT" + n)
          .setCheck("Number")
          .appendField(descriptiveText);
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      // Add dummy input with dropdown and descriptive text
      this.appendDummyInput("AT" + n)
          .appendField(descriptiveText);
    }
    
    // Add appropriate dropdown
    var options = this["WHERE_OPTIONS_" + n];
    var dropdown = new Blockly.FieldDropdown(options, function(value) {
      var newAt = (value == "FROM_START");
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(n, newAt);
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
    });
    
    this.getInput("AT" + n).appendField(dropdown, "WHERE" + n);
    
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
  }
};

// Override text_changeCase block for simplified child-friendly interface
Blockly.Blocks['text_changeCase'] = {
  init: function() {
    // Simplified options - remove complex "Titlecase" option for children
    var options = [
        ["MAIÚSCULAS", "UPPERCASE"],
        ["Minúsculas", "LOWERCASE"]
    ];

    this.setHelpUrl("%{BKY_TEXT_CHANGECASE_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");
    
    // New structure: "Transformar o texto [abc] em [MAIÚSCULAS ▼]"
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Transformar o texto");
    
    this.appendDummyInput()
        .appendField("em")
        .appendField(new Blockly.FieldDropdown(options), "CASE");
    
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setTooltip("%{BKY_TEXT_CHANGECASE_TOOLTIP}");
  }
};

// Override text_print block with clean design and final text
Blockly.Blocks['text_print'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("Enviar mensagem");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_TEXTS_HUE}");
    this.setTooltip("Envia qualquer texto, número ou valor de variável para a aba 'Mensagens'. É a melhor forma de ver o que o seu programa está a fazer!");
    this.setHelpUrl("%{BKY_TEXT_PRINT_HELPURL}");
  }
};

// New simple list blocks for child-friendly interface

// Block for getting an item from a list (with output connector)
Blockly.Blocks['list_get_item_simple'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Na lista');
    
    var menu = new Blockly.FieldDropdown([
      ['Primeiro', 'FIRST'],
      ['Último', 'LAST'],
      ['Aleatório', 'RANDOM'],
      ['De número', 'FROM_START']
    ], function(option) {
      this.sourceBlock_.updateAt_(option === 'FROM_START');
    });

    this.appendDummyInput('MODE')
        .appendField("pegar o item")
        .appendField(menu, 'WHERE');
        
    this.setOutput(true, null); // Importante: Este bloco devolve um valor
    this.setColour("%{BKY_LISTS_HUE}");
    this.setTooltip("Pega um item específico da lista sem mudá-la");
    this.setHelpUrl("");
    this.updateAt_(this.getFieldValue('WHERE') === 'FROM_START');
  },
  
  updateAt_: function(needsAt) {
    if (this.getInput('AT')) {
      this.removeInput('AT');
    }
    if (needsAt) {
      this.appendValueInput('AT').setCheck('Number');
    }
  }
};

// Block for removing an item from a list (statement block)
Blockly.Blocks['list_remove_item_simple'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Na lista');
    
    var menu = new Blockly.FieldDropdown([
      ['Primeiro', 'FIRST'],
      ['Último', 'LAST'],
      ['Aleatório', 'RANDOM'],
      ['De número', 'FROM_START']
    ], function(option) {
      this.sourceBlock_.updateAt_(option === 'FROM_START');
    });

    this.appendDummyInput('MODE')
        .appendField("remover o item")
        .appendField(menu, 'WHERE');
        
    this.setPreviousStatement(true, null); // Importante: Este é um bloco de comando
    this.setNextStatement(true, null);      
    this.setColour("%{BKY_LISTS_HUE}");
    this.setTooltip("Remove um item específico da lista");
    this.setHelpUrl("");
    this.updateAt_(this.getFieldValue('WHERE') === 'FROM_START');
  },
  
  updateAt_: function(needsAt) {
    if (this.getInput('AT')) {
      this.removeInput('AT');
    }
    if (needsAt) {
      this.appendValueInput('AT').setCheck('Number');
    }
  }
};

// New "Trocar item" block for replacing items in lists
Blockly.Blocks['list_replace_item'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Na lista');
    
    var menu = new Blockly.FieldDropdown([
      ['Primeiro', 'FIRST'],
      ['Último', 'LAST'],
      ['Aleatório', 'RANDOM'],
      ['De número', 'FROM_START']
    ], function(option) {
      this.sourceBlock_.updateAt_(option === 'FROM_START');
    });

    this.appendDummyInput('MODE')
        .appendField("trocar o item")
        .appendField(menu, 'WHERE');
        
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('por');
        
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);      
    this.setColour("%{BKY_LISTS_HUE}");
    this.setTooltip("Substitui um item específico da lista por um novo valor");
    this.setHelpUrl("");
    this.updateAt_(this.getFieldValue('WHERE') === 'FROM_START');
  },
  
  updateAt_: function(needsAt) {
    if (this.getInput('AT')) {
      this.removeInput('AT');
    }
    if (needsAt) {
      this.appendValueInput('AT').setCheck('Number');
      this.moveInputBefore('AT', 'VALUE');
    }
  }
};

// New "Inserir item" block for inserting items into lists
Blockly.Blocks['list_insert_item'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Na lista');
        
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('inserir');
    
    var menu = new Blockly.FieldDropdown([
      ['Primeira', 'FIRST'],
      ['Última', 'LAST'],
      ['Aleatória', 'RANDOM'],
      ['De número', 'FROM_START']
    ], function(option) {
      this.sourceBlock_.updateAt_(option === 'FROM_START');
    });

    this.appendDummyInput('MODE')
        .appendField("na posição")
        .appendField(menu, 'WHERE');
        
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);      
    this.setColour("%{BKY_LISTS_HUE}");
    this.setTooltip("Insere um novo item na lista numa posição específica");
    this.setHelpUrl("");
    this.updateAt_(this.getFieldValue('WHERE') === 'FROM_START');
  },
  
  updateAt_: function(needsAt) {
    if (this.getInput('AT')) {
      this.removeInput('AT');
    }
    if (needsAt) {
      this.appendValueInput('AT').setCheck('Number');
    }
  }
};

// Override lists_getSublist block for child-friendly interface
Blockly.Blocks['lists_getSublist'] = {
  init: function() {
    // Start dropdown options - simplified for children (removed FROM_END)
    this.WHERE_OPTIONS_1 = [
        ["Do primeiro", "FIRST"],
        ["De número", "FROM_START"]
    ];
    
    // End dropdown options - simplified for children (removed FROM_END and redundant "Até")
    this.WHERE_OPTIONS_2 = [
        ["Último", "LAST"],
        ["Número", "FROM_START"]
    ];

    this.setHelpUrl("%{BKY_LISTS_GET_SUBLIST_HELPURL}");
    this.setStyle("list_blocks");
    this.setColour("%{BKY_LISTS_HUE}");
    
    // Main text input with child-friendly language
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("Da lista");
    
    // "FROM" section - "pegar o pedaço do item" will be added by updateAt_
    this.appendDummyInput("AT1");
    
    // "TO" section - "até o" will be added by updateAt_  
    this.appendDummyInput("AT2");
    
    
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.updateAt_(1, false); // Initialize first dropdown with "Do primeiro"
    this.updateAt_(2, false); // Initialize second dropdown with "o último"
    this.setTooltip("Pega um pedaço de uma lista e cria uma nova lista (uma Sublista) apenas com esses itens.");
  },

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement("mutation");
    var isAt1 = this.getInput("AT1").type == Blockly.INPUT_VALUE;
    container.setAttribute("at1", isAt1);
    var isAt2 = this.getInput("AT2").type == Blockly.INPUT_VALUE;
    container.setAttribute("at2", isAt2);
    return container;
  },

  domToMutation: function(xmlElement) {
    var isAt1 = ("true" == xmlElement.getAttribute("at1"));
    var isAt2 = ("true" == xmlElement.getAttribute("at2"));
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },

  updateAt_: function(n, isAt) {
    // Remove existing input
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    
    // Define the descriptive text for each position
    var descriptiveText = (n == 1) ? "pegar o pedaço do item" : "até";
    
    if (isAt) {
      // Add value input for number with descriptive text
      this.appendValueInput("AT" + n)
          .setCheck("Number")
          .appendField(descriptiveText);
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      // Add dummy input with dropdown and descriptive text
      this.appendDummyInput("AT" + n)
          .appendField(descriptiveText);
    }
    
    // Add appropriate dropdown
    var options = this["WHERE_OPTIONS_" + n];
    var dropdown = new Blockly.FieldDropdown(options, function(value) {
      var newAt = (value == "FROM_START");
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(n, newAt);
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
    });
    
    this.getInput("AT" + n).appendField(dropdown, "WHERE" + n);
    
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
  }
};// New simplified "Separar texto em uma lista" block
Blockly.Blocks['text_split_simple'] = {
  init: function() {
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('Separar o texto');
        
    this.appendValueInput('SEPARATOR')
        .setCheck('String')
        .appendField('em uma lista, usando');
        
    this.appendDummyInput()
        .appendField('como separador');
    
    this.setOutput(true, 'Array');
    this.setColour('%{BKY_LISTS_HUE}');
    this.setTooltip('Transforma um texto em uma lista, dividindo-o usando um separador (ex: vírgula)');
    this.setHelpUrl('');
    this.setInputsInline(true);
  }
};

// Override lists_sort block for child-friendly interface with dynamic visual hints
Blockly.Blocks['lists_sort'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Organizar a lista');
    
    // First dropdown for sort type
    var typeDropdown = new Blockly.FieldDropdown([
        ['Numérica', 'NUMERIC'],
        ['Alfabética', 'TEXT'],
        ['Alfabética (ignorar maiúsculas)', 'IGNORE_CASE']
    ], function(newValue) {
      this.getSourceBlock().updateDirectionOptions_(newValue);
    });
    
    this.appendDummyInput('TYPE')
        .appendField('usando a ordem')
        .appendField(typeDropdown, 'TYPE');
    
    // Second dropdown for sort direction (will be updated dynamically)
    this.appendDummyInput('DIRECTION');
    
    this.setOutput(true, 'Array');
    this.setColour('%{BKY_LISTS_HUE}');
    this.setTooltip('Coloca os itens de uma lista em ordem. Pode organizar por números ou por ordem alfabética.');
    this.setHelpUrl('');
    this.setInputsInline(true);
    
    // Initialize with default options
    this.updateDirectionOptions_('NUMERIC');
  },
  
  updateDirectionOptions_: function(sortType) {
    // Remove existing direction dropdown
    if (this.getInput('DIRECTION')) {
      this.removeInput('DIRECTION');
    }
    
    // Create appropriate options based on sort type
    var directionOptions;
    if (sortType === 'NUMERIC') {
      directionOptions = [
        ['Crescente (1-9)', 'ASC'],
        ['Decrescente (9-1)', 'DESC']
      ];
    } else {
      // Both TEXT and IGNORE_CASE use the same visual hints
      directionOptions = [
        ['Crescente (A-Z)', 'ASC'],
        ['Decrescente (Z-A)', 'DESC']
      ];
    }
    
    // Add the new dropdown with updated options
    this.appendDummyInput('DIRECTION')
        .appendField(new Blockly.FieldDropdown(directionOptions), 'DIRECTION');
  }
};

// =============================================================================
// NOVO BLOCO: Enviar mensagem com... (substituindo text_join)
// =============================================================================

// Bloco container para o mutator do texto
Blockly.Blocks['text_create_join_container'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("juntar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione, remova, ou reordene secções para reconfigurar este bloco.");
    this.contextMenu = false;
  }
};

// Bloco item para o mutator do texto
Blockly.Blocks['text_create_join_item'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("item");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione um item para juntar.");
    this.contextMenu = false;
  }
};

// Bloco principal: Enviar mensagem com...
Blockly.Blocks['text_print_multiple'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.itemCount_ = 2; // Começa com 2 itens por padrão
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['text_create_join_item']));
    this.setTooltip("Envia uma mensagem juntando texto e variáveis. Clique na engrenagem para adicionar mais itens.");
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
    var containerBlock = workspace.newBlock('text_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('text_create_join_item');
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
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField("Enviar mensagem");
    }

    // Adiciona inputs para cada item
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        if (i == 0) {
          this.appendValueInput('ADD' + i)
              .appendField("Enviar mensagem com");
        } else {
          this.appendValueInput('ADD' + i);
        }
      }
    }

    // Remove inputs extras
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

// ==========================================
// NOVOS BLOCOS DE FUNÇÃO PARA CRIANÇAS
// ==========================================

// 1. FUNÇÃO QUE PERGUNTA
Blockly.Blocks['function_ask'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❓ Criar função")
        .appendField(new Blockly.FieldTextInput("Perguntar"), "FUNC_NAME")
        .appendField("que pergunta");
    this.appendValueInput("QUESTION")
        .setCheck("String")
        .appendField("a pergunta:");
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("então faça:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Cria uma função que faz uma pergunta e depois executa ações!");
  }
};

// ==========================================
// MUTATOR BLOCKS FOR DYNAMIC FUNCTION CALLS
// ==========================================

// Container block for function call parameters mutator
Blockly.Blocks['function_call_mutatorcontainer'] = {
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendField("parâmetros");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova parâmetros para esta chamada de função.");
    this.contextMenu = false;
  }
};

// Item block for function call parameters mutator
Blockly.Blocks['function_call_mutatorarg'] = {
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendField("parâmetro");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Arraste para adicionar ou remover um parâmetro.");
    this.contextMenu = false;
  }
};

// 2. USAR FUNÇÃO SIMPLES (NOW WITH DYNAMIC PARAMETERS)
Blockly.Blocks['function_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Usar função")
        .appendField(new Blockly.FieldTextInput("MinhaFuncao"), "FUNC_NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Chama uma função. Use a engrenagem para adicionar parâmetros!");
    this.setMutator(new Blockly.Mutator(['function_call_mutatorarg']));
    this.parameterCount_ = 0;
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('parameters', this.parameterCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.parameterCount_ = parseInt(xmlElement.getAttribute('parameters'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('function_call_mutatorcontainer');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.parameterCount_; i++) {
      var itemBlock = workspace.newBlock('function_call_mutatorarg');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that shouldn't be there.
    for (var i = 0; i < this.parameterCount_; i++) {
      var connection = this.getInput('ARG' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.parameterCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.parameterCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ARG' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ARG' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Delete everything.
    var i = 0;
    while (this.getInput('ARG' + i)) {
      this.removeInput('ARG' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 0; i < this.parameterCount_; i++) {
      var input = this.appendValueInput('ARG' + i)
                      .setAlign(Blockly.ALIGN_RIGHT);
      if (i == 0 && this.parameterCount_ > 0) {
        input.appendField('com');
      }
      input.appendField('Parâmetro ' + (i + 1) + ':');
    }
  }
};

// 3. FUNÇÃO QUE RECEBE INFORMAÇÃO
Blockly.Blocks['function_with_param'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Criar função")
        .appendField(new Blockly.FieldTextInput("MinhaFuncao"), "FUNC_NAME")
        .appendField("que recebe")
        .appendField(new Blockly.FieldTextInput("Informacao"), "PARAM_NAME");
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("faça:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Cria uma função que recebe uma informação. Como uma receita que você pode personalizar!");
  }
};

// 4. FUNÇÃO QUE RESPONDE
Blockly.Blocks['function_answer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💬 Criar função")
        .appendField(new Blockly.FieldTextInput("Responder"), "FUNC_NAME")
        .appendField("que responde");
    this.appendValueInput("ANSWER")
        .setCheck(null)
        .appendField("a resposta:");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("Cria uma função que sempre dá uma resposta específica!");
  }
};

// 5. OBTER RESPOSTA DA FUNÇÃO
Blockly.Blocks['function_get_answer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📤 Obter resposta da função")
        .appendField(new Blockly.FieldTextInput("MinhaFuncao"), "FUNC_NAME");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("Pega a resposta que uma função devolve!");
  }
};

// ==========================================
// GERADORES PYTHON PARA OS NOVOS BLOCOS
// ==========================================

// Gerador para função que pergunta
Blockly.Python['function_ask'] = function(block) {
  var funcName = block.getFieldValue('FUNC_NAME') || 'perguntar';
  var question = Blockly.Python.valueToCode(block, 'QUESTION', Blockly.Python.ORDER_NONE) || '"Qual é sua pergunta?"';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var cleanFuncName = funcName.replace(/\s+/g, '_');

  var code = 'def ' + cleanFuncName + '():\n';
  code += '    resposta = input(' + question + ')\n';
  code += statements || '    pass\n';
  code += '\n';
  return code;
};

// Gerador para usar função com parâmetros dinâmicos
Blockly.Python['function_call'] = function(block) {
  var funcName = block.getFieldValue('FUNC_NAME') || 'minha_funcao';
  var cleanName = funcName.replace(/\s+/g, '_');

  // Collect all parameter values
  var args = [];
  for (var i = 0; i < block.parameterCount_; i++) {
    var arg = Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE) || 'None';
    args.push(arg);
  }

  var code = cleanName + '(' + args.join(', ') + ')\n';
  return code;
};

// Gerador para função com parâmetro
Blockly.Python['function_with_param'] = function(block) {
  var funcName = block.getFieldValue('FUNC_NAME') || 'minha_funcao';
  var paramName = block.getFieldValue('PARAM_NAME') || 'informacao';
  var statements = Blockly.Python.statementToCode(block, 'DO');

  var cleanFuncName = funcName.replace(/\s+/g, '_');
  var cleanParamName = paramName.replace(/\s+/g, '_');

  var code = 'def ' + cleanFuncName + '(' + cleanParamName + '):\n';
  code += statements || '    pass\n';
  code += '\n';
  return code;
};

// Gerador para função que responde
Blockly.Python['function_answer'] = function(block) {
  var funcName = block.getFieldValue('FUNC_NAME') || 'responder';
  var answer = Blockly.Python.valueToCode(block, 'ANSWER', Blockly.Python.ORDER_NONE) || '"Minha resposta"';

  var cleanFuncName = funcName.replace(/\s+/g, '_');

  var code = 'def ' + cleanFuncName + '():\n';
  code += '    return ' + answer + '\n\n';
  return code;
};

// Gerador para obter resposta da função
Blockly.Python['function_get_answer'] = function(block) {
  var funcName = block.getFieldValue('FUNC_NAME') || 'minha_funcao';
  var cleanFuncName = funcName.replace(/\s+/g, '_');
  var code = cleanFuncName + '()';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};