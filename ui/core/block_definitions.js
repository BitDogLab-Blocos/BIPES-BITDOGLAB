
// Variável global para controlar se a mensagem de instrução já foi mostrada
var matrixAnimationTipShown = false;

// Função para mostrar a dica de animação da matriz (apenas uma vez)
function showMatrixAnimationTip() {
  if (!matrixAnimationTipShown) {
    matrixAnimationTipShown = true;
    setTimeout(function() {
      alert("💡 Dica: Coloque um bloco da Matriz de LEDs (como 'Mostrar emoji' ou 'Mostrar número') dentro deste bloco de animação!");
    }, 100);
  }
}

// ==========================================
// Category: Mathematics
// ==========================================

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
    // Add dice icon for random option
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

// ==========================================
// Category: Text
// ==========================================

Blockly.Blocks['text_getSubstring'] = {
  init: function() {
    // Start position dropdown options
    this.WHERE_OPTIONS_1 = [
        ["Primeira letra", "FIRST"],
        ["Letra nº", "FROM_START"]
    ];

    // End position dropdown options
    this.WHERE_OPTIONS_2 = [
        ["Última letra", "LAST"],
        ["Letra nº", "FROM_START"]
    ];

    this.setHelpUrl("%{BKY_TEXT_GET_SUBSTRING_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");

    // Main text input
    this.appendValueInput("STRING")
        .setCheck("String")
        .appendField("No texto");


    // "FROM" section will be added by updateAt_
    this.appendDummyInput("AT1");

    // "TO" section will be added by updateAt_
    this.appendDummyInput("AT2");

    // Optional tail
    if ("%{BKY_TEXT_GET_SUBSTRING_TAIL}") {
      this.appendDummyInput("TAIL")
          .appendField("%{BKY_TEXT_GET_SUBSTRING_TAIL}");
    }
    
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.updateAt_(1, false); // Initialize first dropdown
    this.updateAt_(2, false); // Initialize second dropdown
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

    // Define descriptive text for each position
    var descriptiveText = (n == 1) ? "pegar trecho a partir de" : "até";


    if (isAt) {
      // Add value input for number
      this.appendValueInput("AT" + n)
          .setCheck("Number")
          .appendField(descriptiveText);
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      // Add dummy input with dropdown
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

Blockly.Blocks['text_changeCase'] = {
  init: function() {
    // Simplified case change options
    var options = [
        ["MAIÚSCULAS", "UPPERCASE"],
        ["Minúsculas", "LOWERCASE"]
    ];

    this.setHelpUrl("%{BKY_TEXT_CHANGECASE_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");

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

Blockly.Blocks['text_print_multiple'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.itemCount_ = 2;
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

    // Add new inputs
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

    // Remove excess inputs
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

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

// ==========================================
// Category: Time
// ==========================================

Blockly.Blocks['esperar_segundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Esperar");
    this.appendDummyInput()
        .appendField("segundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pausa a execução por um número de segundos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['esperar_milisegundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Esperar");
    this.appendDummyInput()
        .appendField("milissegundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pausa a execução por um número de milissegundos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tempo_segundos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("segundos");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Retorna um valor de tempo em segundos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tempo_milisegundos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(500, 0), "NUM")
        .appendField("milissegundos");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Retorna um valor de tempo em milissegundos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tempo_minutos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("minutos");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Retorna um valor de tempo em minutos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tempo_horas'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("horas");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Retorna um valor de tempo em horas");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Colors
// ==========================================

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
    this.setColour("#707070"); // Cinza escuro para melhor contraste
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
    this.setTooltip("Mixes multiple LED colors");
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

// ==========================================
// Category: LEDs
// ==========================================

Blockly.Blocks['bloco_ligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💡 Ligar LED de cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Liga o LED da cor selecionada");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_desligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔦 Desligar LED de cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Desliga o LED da cor selecionada");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_desligar_todos_leds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔦 Desligar Todos os LEDs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Desliga todos os LEDs");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_acender_led_brilho'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔆 Acender LED de cor");
    this.appendDummyInput()
        .appendField("com brilho de")
        .appendField(new Blockly.FieldNumber(100, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Acende o LED com o brilho que você escolher, de 0% a 100%");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_piscar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("⚡ Piscar LED de cor");
    this.appendDummyInput()
        .appendField("rapidamente");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Pisca o LED rapidamente (200ms ligado, 200ms desligado)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['piscar_led_lento'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🐌 Piscar LED de cor");
    this.appendDummyInput()
        .appendField("lentamente");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Pisca o LED lentamente (1s ligado, 1s desligado)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_animar_led_coracao'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💓 Animar LED de cor");
    this.appendDummyInput()
        .appendField("batida de coração");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Simula uma batida de coração com dois pulsos rápidos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_sinalizar_led_sos'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🆘 Sinalizar LED de cor");
    this.appendDummyInput()
        .appendField("socorro (SOS)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Emite o sinal de socorro S.O.S. em código Morse (... --- ...)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_animar_led_brilhar'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("✨ Animar LED de cor");
    this.appendDummyInput()
        .appendField("brilhar e sumir");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Efeito de fade-in e fade-out com a cor selecionada");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_alternar_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("alternar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova cores para alternar.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['bloco_alternar_led_item'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("cor");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma cor à alternância.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['bloco_alternar_led'] = {
  init: function() {
    this.setColour(45);
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_alternar_led_item']));
    this.setTooltip("Alterna entre múltiplas cores de LED. Use a engrenagem para adicionar mais cores!");
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
            .appendField("🔄 Alternar LED de cor");
      } else {
        this.appendValueInput('COLOUR' + i)
            .setCheck("Colour")
            .appendField("com cor");
      }
    }
  }
};

Blockly.Blocks['bloco_transicao_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("🌈 Transição LED de cor");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("para cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Faz uma transição suave entre duas cores usando PWM");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_batalhar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("⚔️ Batalhar LED de cor");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("com cor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Cria um efeito de batalha entre duas cores");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bloco_criar_animacao_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("animação");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova passos da animação.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['bloco_criar_animacao_led_action'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("ação");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma ação (ligar/desligar LED).");
    this.contextMenu = false;
  }
};

Blockly.Blocks['bloco_criar_animacao_led_wait'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("tempo");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione um tempo (ficar assim por...).");
    this.contextMenu = false;
  }
};

Blockly.Blocks['bloco_criar_animacao_led'] = {
  init: function() {
    this.setColour(45);
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_criar_animacao_led_action', 'bloco_criar_animacao_led_wait']));
    this.setTooltip("Cria uma animação personalizada de LED. Use a engrenagem para adicionar mais ações e esperas!");
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

    // Add step inputs
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

// ==========================================
// Category: LED Matrix
// ==========================================

Blockly.Blocks['preencher_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Ligar matriz de LED de cor");
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
    this.setTooltip("Liga toda a matriz de LEDs 5x5 com a cor e intensidade especificadas");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['desligar_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Desligar matriz de LED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Desliga toda a matriz de LEDs 5x5");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['acender_led_posicao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Acender LED na linha")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA")
        .appendField("coluna")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Acende um LED específico na matriz 5x5 (linha: 0-4, coluna: 0-4)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['acender_linha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Acender linha")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Acende uma linha horizontal completa na matriz 5x5 (linha: 0-4)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['acender_coluna'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Acender coluna")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("com cor");
    this.appendDummyInput()
        .appendField("e brilho de")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Acende uma coluna vertical completa na matriz 5x5 (coluna: 0-4)");
    this.setHelpUrl("");
  }
};

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
    this.setTooltip("Mostra um número na matriz de LEDs 5x5 com cor e brilho especificados");
    this.setHelpUrl("");
  }
};

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
    this.setTooltip("Mostra um emoji na matriz de LEDs 5x5 com cor e brilho especificados");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Matrix Numbers
// ==========================================

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

// ==========================================
// Category: Musical Notes
// ==========================================

Blockly.Blocks['nota_do'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎵 Dó");
    this.setOutput(true, "Note");
    this.setColour("#EA2027");
    this.setTooltip("Nota Dó");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_re'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👑 Ré");
    this.setOutput(true, "Note");
    this.setColour("#EE5A24");
    this.setTooltip("Nota Ré");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_mi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐱 Mi");
    this.setOutput(true, "Note");
    this.setColour("#FFC312");
    this.setTooltip("Nota Mi");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_fa'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧚‍♀️ Fá");
    this.setOutput(true, "Note");
    this.setColour("#C4E538");
    this.setTooltip("Nota Fá");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_sol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("☀️ Sol");
    this.setOutput(true, "Note");
    this.setColour("#12CBC4");
    this.setTooltip("Nota Sol");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_la'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ Lá");
    this.setOutput(true, "Note");
    this.setColour("#833471");
    this.setTooltip("Nota Lá");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['nota_si'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👍 Si");
    this.setOutput(true, "Note");
    this.setColour("#FD7272");
    this.setTooltip("Nota Si");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Sound
// ==========================================

Blockly.Blocks['tocar_nota'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎵 Tocar nota");
    this.appendValueInput("NOTA")
        .setCheck("Note");
    this.appendDummyInput()
        .appendField("na oitava")
        .appendField(new Blockly.FieldDropdown([
            ["4", "4"],
            ["5", "5"],
            ["6", "6"]
        ]), "OCTAVE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma nota musical no buzzer (GPIO10)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tocar_som_agudo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔔 Tocar som agudo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som agudo de teste (1000 Hz por 0.5s)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['parar_som'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔇 Parar som");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Para o som do buzzer");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tocar_repetidamente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔁 Tocar repetidamente");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca os sons dentro deste bloco repetidamente em loop infinito");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bipe_curto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Bipe Curto");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um bipe curto");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['bipe_duplo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📌 Bipe Duplo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca dois bipes rápidos");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['alerta_intermitente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚨 Alerta Intermitente");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um alerta intermitente");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['chamada'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📞 Chamada");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de chamada");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['som_de_moeda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪙 Som de Moeda");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de moeda");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['som_de_sucesso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✅ Som de Sucesso");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de sucesso com notas ascendentes");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['som_de_falha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❌ Som de Falha");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de falha com notas descendentes");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['som_de_laser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔫 Som de Laser");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de laser");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['sirene_policial'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚓 Sirene Policial");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma sirene policial");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['escala_musical_sobe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📈 Escala Musical Sobe");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical ascendente");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['escala_musical_desce'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📉 Escala Musical Desce");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical descendente");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['brilha_brilha_estrelinha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ Brilha Brilha Estrelinha");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca a melodia de Brilha Brilha Estrelinha");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['criar_melodia_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("melodia");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova notas da melodia.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['criar_melodia_note_step'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("nota");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma nota à melodia.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['criar_melodia'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.noteSteps_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_melodia_note_step']));
    this.setTooltip("Cria uma melodia personalizada. Use a engrenagem para adicionar mais notas!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('note_steps', this.noteSteps_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.noteSteps_ = parseInt(xmlElement.getAttribute('note_steps'), 10) || 0;
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_melodia_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.noteSteps_; i++) {
      var itemBlock = workspace.newBlock('criar_melodia_note_step');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];

    // Collect existing connections
    while (itemBlock) {
      connections.push(itemBlock.noteConnection_);
      connections.push(itemBlock.timeConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    // Disconnect old connections
    for (var i = 0; i < this.noteSteps_; i++) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      if (noteInput) {
        var noteConn = noteInput.connection.targetConnection;
        if (noteConn && connections.indexOf(noteConn) == -1) {
          noteConn.disconnect();
        }
      }
      if (tempoInput) {
        var tempoConn = tempoInput.connection.targetConnection;
        if (tempoConn && connections.indexOf(tempoConn) == -1) {
          tempoConn.disconnect();
        }
      }
    }

    this.noteSteps_ = connections.length / 2;

    this.updateShape_();
    // Reconnect blocks
    for (var i = 0; i < this.noteSteps_; i++) {
      if (connections[i * 2]) {
        Blockly.Mutator.reconnect(connections[i * 2], this, 'NOTA' + i);
      }
      if (connections[i * 2 + 1]) {
        Blockly.Mutator.reconnect(connections[i * 2 + 1], this, 'TEMPO' + i);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      itemBlock.noteConnection_ = noteInput && noteInput.connection.targetConnection;
      itemBlock.timeConnection_ = tempoInput && tempoInput.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('NOTA' + i) || this.getInput('TEMPO' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('NOTA' + i)) this.removeInput('NOTA' + i);
      if (this.getInput('TEMPO' + i)) this.removeInput('TEMPO' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    // Add inputs for each step
    if (this.noteSteps_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎼 Criar Melodia");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.noteSteps_; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎼 Criar Melodia");
        }

        this.appendValueInput('NOTA' + i)
            .setCheck("Note")
            .appendField((i + 1) + '. Tocar a nota:');

        this.appendValueInput('TEMPO' + i)
            .setCheck("Time")
            .appendField('   por:');
      }
    }
  }
};

Blockly.Blocks['criar_trilha_sonora_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("trilha sonora");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicione ou remova passos da trilha sonora.");
    this.contextMenu = false;
  }
};

Blockly.Blocks['criar_trilha_sonora_action'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("som");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma ação de som (tocar nota, bipe, melodia, etc).");
    this.contextMenu = false;
  }
};

Blockly.Blocks['criar_trilha_sonora_wait'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("pausa");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicione uma pausa (silêncio por um tempo).");
    this.contextMenu = false;
  }
};

Blockly.Blocks['criar_trilha_sonora'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_trilha_sonora_action', 'criar_trilha_sonora_wait']));
    this.setTooltip("Cria uma trilha sonora personalizada. Use a engrenagem para adicionar sons e pausas!");
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
    var containerBlock = workspace.newBlock('criar_trilha_sonora_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.steps_.length; i++) {
      var blockType = this.steps_[i] === 'action' ? 'criar_trilha_sonora_action' : 'criar_trilha_sonora_wait';
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
      if (itemBlock.type === 'criar_trilha_sonora_action') {
        newSteps.push('action');
        connections.push(itemBlock.stepConnection_);
      } else if (itemBlock.type === 'criar_trilha_sonora_wait') {
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
          .appendField("🎵 Criar Trilha Sonora");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.steps_.length; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎵 Criar Trilha Sonora");
        }

        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
              .setCheck(null)
              .appendField('🔊 Tocar:');
        } else {
          this.appendValueInput('STEP' + i)
              .setCheck("Time")
              .appendField('🔇 Pausar por:');
        }
      }
    }
  }
};

// ==========================================
// Category: Matrix Animations
// ==========================================

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

Blockly.Blocks['matriz_piscar_lento'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐌 Fazer Piscar Lentamente");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco piscar lentamente na matriz");
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

Blockly.Blocks['matriz_aparecer_sumir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✨ Fazer Aparecer e Sumir");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco aparecer e sumir gradualmente");
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

Blockly.Blocks['matriz_deslizar_esquerda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬅️ Fazer Deslizar para Esquerda");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para esquerda na matriz");
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

Blockly.Blocks['matriz_deslizar_direita'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("➡️ Fazer Deslizar para Direita");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Faz o conteúdo dentro deste bloco deslizar para direita na matriz");
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

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
    this.setHelpUrl("");

    // Mostra a dica quando o bloco é criado no workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

