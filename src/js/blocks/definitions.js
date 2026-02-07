// ==========================================
// REPETITION BLOCKS
// ==========================================

// Repeat N times block
Blockly.Blocks['controls_repeat_simple'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir")
        .appendField(new Blockly.FieldNumber(10, 1), "TIMES")
        .appendField("vezes");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete as ações um número específico de vezes. Funciona com todos os blocos, incluindo os que têm loops infinitos!");
    this.setHelpUrl("");
  }
};

// Repeat forever block
Blockly.Blocks['controls_repeat_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir para sempre");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete continuamente até o programa ser parado (loop infinito)");
    this.setHelpUrl("");
  }
};

console.log('[BitdogLab] Basic repetition blocks loaded successfully!');

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

// Bloco de número
Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "NUM");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Um número");
    this.setHelpUrl("");
  }
};

// Bloco de texto
Blockly.Blocks['text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "TEXT");
    this.setOutput(true, "String");
    this.setColour(160);
    this.setTooltip("Uma cadeia de texto");
    this.setHelpUrl("");
  }
};

// Bloco de verdadeiro/falso
Blockly.Blocks['logic_boolean'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["verdadeiro", "TRUE"],
          ["falso", "FALSE"]
        ]), "BOOL");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("Retorna verdadeiro ou falso");
    this.setHelpUrl("");
  }
};

console.log('[BitdogLab] Blocos básicos carregados: math_number, text, logic_boolean');

// ==========================================
// Category: Mathematics
// ==========================================

// Arithmetic operations block
Blockly.Blocks['math_arithmetic'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["+", "ADD"],
          ["-", "MINUS"],
          ["×", "MULTIPLY"],
          ["÷", "DIVIDE"],
          ["^", "POWER"]
        ]), "OP");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Operações matemáticas básicas");
    this.setHelpUrl("");
  }
};

// Math round block
Blockly.Blocks['math_round'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([
          ["arredondar", "ROUND"],
          ["arredondar para cima", "ROUNDUP"],
          ["arredondar para baixo", "ROUNDDOWN"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Arredonda um número");
    this.setHelpUrl("");
  }
};

// Math modulo block
Blockly.Blocks['math_modulo'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number")
        .appendField("resto de");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("÷");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Retorna o resto da divisão de dois números");
    this.setHelpUrl("");
  }
};

// Math constrain block
Blockly.Blocks['math_constrain'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("limitar");
    this.appendValueInput("LOW")
        .setCheck("Number")
        .appendField("entre");
    this.appendValueInput("HIGH")
        .setCheck("Number")
        .appendField("e");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Limita um número entre um valor mínimo e máximo");
    this.setHelpUrl("");
  }
};

// Math random integer block
Blockly.Blocks['math_random_int'] = {
  init: function() {
    this.appendValueInput("FROM")
        .setCheck("Number")
        .appendField("número aleatório entre");
    this.appendValueInput("TO")
        .setCheck("Number")
        .appendField("e");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Retorna um número inteiro aleatório entre os valores especificados");
    this.setHelpUrl("");
  }
};

// Mathematical function block for single operations like square root, absolute value, etc.
Blockly.Blocks['math_single'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["Raiz quadrada (√)", "ROOT"],
            ["Valor absoluto (sempre positivo)", "ABS"],
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
    this.setColour(230);
    this.setTooltip("Aplica uma função matemática a um número");
    this.setHelpUrl("");
  }
};
// Trigonometric function block for operations like sine, cosine, etc.
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
    this.setColour(230);
    this.setTooltip("Aplica uma função trigonométrica a um ângulo");
    this.setHelpUrl("");
  }
};
// Mathematical constants block for values like Pi, Euler's number, etc.
Blockly.Blocks['math_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Constantes")
        .appendField(new Blockly.FieldDropdown([
            ["Pi (π)", "PI"],
            ["Euler (e)", "E"],
            ["Phi - Razão áurea (φ)", "GOLDEN_RATIO"],
            ["Raiz quadrada de 2 (√2)", "SQRT2"],
            ["Raiz quadrada de ½ (√½)", "SQRT1_2"],
            ["Infinito (∞)", "INFINITY"]
        ]), "CONSTANT");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Retorna uma constante matemática importante");
    this.setHelpUrl("");
  }
};
// Number property check block for testing if a number is even, odd, positive, or negative
Blockly.Blocks['math_number_property'] = {
  init: function() {
    this.appendValueInput("NUMBER_TO_CHECK")
        .setCheck("Number")
        .appendField("Verificar se número");
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
    this.setColour(230);
    this.setTooltip("Verifica se um número tem a propriedade selecionada (par, ímpar, positivo ou negativo). Retorna verdadeiro ou falso.");
    this.setHelpUrl("");
  }
};
// Divisibility check block to test if one number is divisible by another
Blockly.Blocks['math_is_divisible_by'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number")
        .appendField("Número");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("é divisível por");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("Verifica se o primeiro número pode ser dividido pelo segundo sem deixar resto.");
    this.setHelpUrl("");
  }
};
// Decimal rounding block to round numbers to specified decimal places
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
    this.setColour(230);
    this.setTooltip("Arredonda um número para o número especificado de casas decimais.");
    this.setHelpUrl("");
  }
};
// List operations block for performing calculations on lists of numbers
Blockly.Blocks['math_on_list'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("Calcular")
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
    this.setColour(230);
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
// Random float generator block for generating random decimal numbers
Blockly.Blocks['math_random_float'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Decimal aleatório entre");
    this.appendValueInput("FROM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("e");
    this.appendValueInput("TO")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Retorna um número decimal aleatório entre os valores especificados.");
    this.setHelpUrl("");
  }
};

// Print/Show value block - displays a value in the console
Blockly.Blocks['math_print_value'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .appendField("Mostrar resultado na aba de mensagens:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Mostra o resultado do cálculo na aba de mensagens (console serial)");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Text
// ==========================================
// Text substring block for extracting a portion of text
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
    this.setTooltip("Obtém uma parte do texto, de uma posição a outra.");
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
    var descriptiveText = (n == 1) ? "de" : "para";
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
// Text case change block for converting text to uppercase or lowercase
Blockly.Blocks['text_changeCase'] = {
  init: function() {
    // Simplified case change options
    var options = [
        ["MAIÚSCULAS", "UPPERCASE"],
        ["minúsculas", "LOWERCASE"]
    ];
    this.setHelpUrl("%{BKY_TEXT_CHANGECASE_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Transformar texto");

    this.appendDummyInput()
        .appendField("para")
        .appendField(new Blockly.FieldDropdown(options), "CASE");

    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setTooltip("Transforma o texto para maiúsculas ou minúsculas.");
  }
};
// Text print block for sending messages to the console
Blockly.Blocks['text_print'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("Enviar mensagem");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_TEXTS_HUE}");
    this.setTooltip("Envía qualquer texto, número ou valor de variável para a aba 'Mensagens'. É a melhor maneira de ver o que seu programa está fazendo!");
    this.setHelpUrl("%{BKY_TEXT_PRINT_HELPURL}");
  }
};
// Multiple text print block for joining and sending multiple values
Blockly.Blocks['text_print_multiple'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['text_create_join_item']));
    this.setTooltip("Envía uma mensagem juntando texto e variáveis. Clique na engrenagem para adicionar mais itens.");
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
// Container block for text join mutator
Blockly.Blocks['text_create_join_container'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("juntar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar, remover ou reordenar seções para reconfigurar este bloco.");
    this.contextMenu = false;
  }
};
// Item block for text join mutator
Blockly.Blocks['text_create_join_item'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("item");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar um item para juntar.");
    this.contextMenu = false;
  }
};
// ==========================================
// Category: Time
// ==========================================
// Wait seconds block for pausing execution
Blockly.Blocks['esperar_segundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Aguardar");
    this.appendDummyInput()
        .appendField("segundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pausa a execução por alguns segundos");
    this.setHelpUrl("");
  }
};
// Wait milliseconds block for short pauses
Blockly.Blocks['esperar_milisegundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Aguardar");
    this.appendDummyInput()
        .appendField("milissegundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pausa a execução por alguns milissegundos");
    this.setHelpUrl("");
  }
};
// Time value block for seconds
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
// Time value block for milliseconds
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
// Time value block for minutes
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
// Time value block for hours
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

// Bloco que RETORNA o tempo ligado em segundos (para usar em comparações)
Blockly.Blocks['tempo_ligado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️ tempo ligado");
    this.setOutput(true, "Number");
    this.setColour(190);
    this.setTooltip("Retorna há quantos segundos a BitDogLab está ligada");
    this.setHelpUrl("");
  }
};

// Debug: Confirm time blocks are loaded
console.log('[BitdogLab] Blocos de tempo carregados:', {
  esperar_segundos: typeof Blockly.Blocks['esperar_segundos'] !== 'undefined',
  esperar_milisegundos: typeof Blockly.Blocks['esperar_milisegundos'] !== 'undefined',
  tempo_segundos: typeof Blockly.Blocks['tempo_segundos'] !== 'undefined',
  tempo_milisegundos: typeof Blockly.Blocks['tempo_milisegundos'] !== 'undefined',
  tempo_minutos: typeof Blockly.Blocks['tempo_minutos'] !== 'undefined',
  tempo_horas: typeof Blockly.Blocks['tempo_horas'] !== 'undefined',
  tempo_ligado: typeof Blockly.Blocks['tempo_ligado'] !== 'undefined'
});

// ==========================================
// Category: Colors
// ==========================================
// Red color block
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
// Green color block
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
// Blue color block
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
// Yellow color block
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
// Cyan color block
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
// Magenta color block
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
// White color block
Blockly.Blocks['colour_white'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚪ Branco");
    this.setOutput(true, "Colour");
    this.setColour("#707070"); // Dark gray for better contrast
    this.setTooltip("Cor branca (todas as cores)");
    this.setHelpUrl("");
  }
};
// Orange color block
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
// Pink color block
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
// Lime color block
Blockly.Blocks['colour_lime'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💚 Verde-Limão");
    this.setOutput(true, "Colour");
    this.setColour(90);
    this.setTooltip("Cor verde-limão (verde forte + vermelho fraco)");
    this.setHelpUrl("");
  }
};
// Sky blue color block
Blockly.Blocks['colour_skyblue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💙 Azul Celeste");
    this.setOutput(true, "Colour");
    this.setColour(200);
    this.setTooltip("Cor azul celeste (azul forte + verde fraco)");
    this.setHelpUrl("");
  }
};
// Turquoise color block
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
// Container block for color mix mutator
Blockly.Blocks['mix_colours_container'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("misturar");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover cores para misturar");
    this.contextMenu = false;
  }
};
// Item block for color mix mutator
Blockly.Blocks['mix_colours_item'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("cor");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma cor à mistura");
    this.contextMenu = false;
  }
};
// Color mix block for combining multiple colors
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
    this.setTooltip("Mistura várias cores de LED");
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
// Category: Musical Notes
// ==========================================
// Do note block for musical notes
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
// Re note block for musical notes
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
// Mi note block for musical notes
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
// Fa note block for musical notes
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
// Sol note block for musical notes
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
// La note block for musical notes
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
// Si note block for musical notes
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
// Play musical note block
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
        ]), "OCTAVE")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%")
        .appendField("por")
        .appendField(new Blockly.FieldNumber(500, 0, 10000), "DURATION")
        .appendField("ms");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma nota musical no buzzer (GPIO21)");
    this.setHelpUrl("");
  }
};
// Play high sound block
Blockly.Blocks['tocar_som_agudo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔔 Tocar som agudo")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%")
        .appendField("por")
        .appendField(new Blockly.FieldNumber(500, 0, 10000), "DURATION")
        .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som agudo de teste (1000 Hz)");
    this.setHelpUrl("");
  }
};
// Stop sound block
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
// Play repeatedly block
Blockly.Blocks['tocar_repetidamente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔁 Tocar repetidamente");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca os sons dentro deste bloco repetidamente em um loop infinito");
    this.setHelpUrl("");
  }
};
// Short beep block
Blockly.Blocks['bipe_curto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Bipe curto")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um bipe curto");
    this.setHelpUrl("");
  }
};
// Double beep block
Blockly.Blocks['bipe_duplo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📌 Bipe duplo")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca dois bipes rápidos");
    this.setHelpUrl("");
  }
};
// Intermittent alert block
Blockly.Blocks['alerta_intermitente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚨 Alerta intermitente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um alerta intermitente");
    this.setHelpUrl("");
  }
};
// Call sound block
Blockly.Blocks['chamada'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📞 Chamada")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de chamada");
    this.setHelpUrl("");
  }
};
// Coin sound block
Blockly.Blocks['som_de_moeda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪙 Som de moeda")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de moeda");
    this.setHelpUrl("");
  }
};
// Success sound block
Blockly.Blocks['som_de_sucesso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✅ Som de sucesso")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de sucesso com notas ascendentes");
    this.setHelpUrl("");
  }
};
// Failure sound block
Blockly.Blocks['som_de_falha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❌ Som de falha")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de falha com notas descendentes");
    this.setHelpUrl("");
  }
};
// Laser sound block
Blockly.Blocks['som_de_laser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔫 Som de laser")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de laser");
    this.setHelpUrl("");
  }
};
// Police siren block
Blockly.Blocks['sirene_policial'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚓 Sirene policial")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma sirene policial");
    this.setHelpUrl("");
  }
};
// Ascending musical scale block
Blockly.Blocks['escala_musical_sobe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📈 Escala musical ascendente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical ascendente");
    this.setHelpUrl("");
  }
};
// Descending musical scale block
Blockly.Blocks['escala_musical_desce'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📉 Escala musical descendente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical descendente");
    this.setHelpUrl("");
  }
};
// Twinkle Twinkle Little Star melody block
Blockly.Blocks['brilha_brilha_estrelinha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ Brilha Brilha Estrelinha")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca a melodia de Brilha Brilha Estrelinha");
    this.setHelpUrl("");
  }
};
// Christmas song: Jingle Bells
Blockly.Blocks['natal_jingle_bells'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Jingle Bells")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Jingle Bells. Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Silent Night (Noite Feliz)
Blockly.Blocks['natal_noite_feliz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Noite Feliz")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Noite Feliz (Silent Night). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Deck the Halls (Bate o Sino)
Blockly.Blocks['natal_bate_sino'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Bate o Sino")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Bate o Sino (Deck the Halls). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: We Wish You a Merry Christmas (Noel)
Blockly.Blocks['natal_noel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Feliz Natal")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca We Wish You a Merry Christmas. Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Adeste Fideles (Ó Vinde)
Blockly.Blocks['natal_o_vinde'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Ó Vinde")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Ó Vinde (Adeste Fideles). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
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
          ["C", "C"]
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
Blockly.Blocks['criar_melodia_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("melodia");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover notas da melodia.");
    this.contextMenu = false;
  }
};
// Note step block for melody mutator
Blockly.Blocks['criar_melodia_note_step'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("nota");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma nota à melodia.");
    this.contextMenu = false;
  }
};
// Create melody block
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
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
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
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
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
            .appendField((i + 1) + '. Tocar nota:');
        this.appendValueInput('TEMPO' + i)
            .setCheck("Time")
            .appendField('   por:');
      }
    }
  }
};
// Container block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("trilha sonora");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover passos da trilha sonora.");
    this.contextMenu = false;
  }
};
// Action block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_action'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("som");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma ação de som (tocar nota, bipe, melodia, etc).");
    this.contextMenu = false;
  }
};
// Wait block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_wait'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("pausa");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma pausa (silêncio por um tempo).");
    this.contextMenu = false;
  }
};
// Create soundtrack block
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
// Category: Buttons
// ==========================================
// While button pressed block
Blockly.Blocks['botao_enquanto_apertado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 Enquanto pressionar o botão")
        .appendField(new Blockly.FieldDropdown([["🔴 A (Vermelho)", "A"], ["🔵 B (Azul)", "B"], ["🟢 C (Verde)", "C"]]), "BOTAO")
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
        .appendField(new Blockly.FieldDropdown([["🔴 A (Vermelho)", "A"], ["🔵 B (Azul)", "B"], ["🟢 C (Verde)", "C"]]), "BOTAO")
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
// Category: Joystick
// ==========================================
// Base block: Read X axis
Blockly.Blocks['joystick_ler_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Posição X do joystick");
    this.setOutput(true, "Number");
    this.setColour("#e67e22");
    this.setTooltip("Lê o eixo X (horizontal) do joystick. Retorna um valor de 0 a 65535. Centro ≈ 32768.");
  }
};
// Base block: Read Y axis
Blockly.Blocks['joystick_ler_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Posição Y do joystick");
    this.setOutput(true, "Number");
    this.setColour("#e67e22");
    this.setTooltip("Lê o eixo Y (vertical) do joystick. Retorna um valor de 0 a 65535. Centro ≈ 32768.");
  }
};
// Base block: Read button
Blockly.Blocks['joystick_ler_botao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Botão do joystick pressionado?");
    this.setOutput(true, "Boolean");
    this.setColour("#e67e22");
    this.setTooltip("Verifica se o botão central do joystick está pressionado. Retorna verdadeiro ou falso.");
  }
};
// Base block: Get direction
Blockly.Blocks['joystick_direcao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Direção do joystick");
    this.setOutput(true, "String");
    this.setColour("#e67e22");
    this.setTooltip("Retorna a direção do joystick: 'cima', 'baixo', 'esquerda', 'direita' ou 'centro'.");
  }
};
// Base block: Map value to range
Blockly.Blocks['joystick_mapear'] = {
  init: function() {
    this.appendValueInput("VALOR")
        .setCheck("Number")
        .appendField("🕹️ Mapear");
    this.appendDummyInput()
        .appendField("de 0-65535 para");
    this.appendValueInput("MIN_OUT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("até");
    this.appendValueInput("MAX_OUT")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("#e67e22");
    this.setTooltip("Converte o valor do joystick (0-65535) para outro intervalo. Ex: 0-128 para display, 0-4 para matriz.");
  }
};
// Project block: Zoom Interativo
Blockly.Blocks['joystick_zoom_interativo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔍 Zoom interativo no display");
    this.appendDummyInput()
        .appendField("  Tamanho base:")
        .appendField(new Blockly.FieldDropdown([["10px", "10"], ["15px", "15"], ["20px", "20"]]), "TAMANHO")
        .appendField("  Mostrar fator na linha")
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]]), "LINHA");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Mova o joystick para cima/baixo para aumentar/diminuir o zoom de um objeto no display OLED.");
  }
};
// Project block: Mover Player
Blockly.Blocks['joystick_mover_player'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🕹️ Mover player no display");
    this.appendDummyInput()
        .appendField("  Tamanho:")
        .appendField(new Blockly.FieldDropdown([["4px", "4"], ["6px", "6"], ["8px", "8"], ["10px", "10"]]), "TAMANHO")
        .appendField("  Velocidade:")
        .appendField(new Blockly.FieldDropdown([["Lenta", "1"], ["Normal", "2"], ["Rápida", "3"]]), "VELOCIDADE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Controle um quadrado na tela do display OLED usando o joystick. O player não sai das bordas!");
  }
};
// Project block: Lousa Mágica
Blockly.Blocks['joystick_lousa_magica'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✍️ Lousa Mágica (Etch A Sketch)");
    this.appendDummyInput()
        .appendField("  Espessura do traço:")
        .appendField(new Blockly.FieldDropdown([["Fina (1px)", "1"], ["Média (2px)", "2"], ["Grossa (3px)", "3"]]), "ESPESSURA");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Desenhe livremente no display OLED movendo o joystick. Pressione o botão do joystick para apagar tudo!");
  }
};
// Project block: Seletor de Emoji
Blockly.Blocks['joystick_seletor_emoji'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎭 Seletor de emoji sincronizado");
    this.appendDummyInput()
        .appendField("  Mostrar nome na linha")
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]]), "LINHA")
        .appendField("  Brilho:")
        .appendField(new Blockly.FieldDropdown([["Baixo", "20"], ["Médio", "50"], ["Alto", "80"]]), "BRILHO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Mova o joystick para cima/baixo para navegar entre emojis. Mostra o nome no Display e o desenho na Matriz!");
  }
};
// Project block: Theremin Digital
Blockly.Blocks['joystick_theremin'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎛️ Theremin digital");
    this.appendDummyInput()
        .appendField("  Freq. mínima:")
        .appendField(new Blockly.FieldNumber(200, 100, 1000), "FREQ_MIN")
        .appendField("Hz  Freq. máxima:")
        .appendField(new Blockly.FieldNumber(2000, 500, 5000), "FREQ_MAX")
        .appendField("Hz");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Instrumento musical! Eixo Y controla a frequência (notas), eixo X controla o volume. Barra visual no display.");
  }
};
// Project block: Cursor Matriz 5x5
Blockly.Blocks['joystick_cursor_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💡 Cursor na Matriz 5x5");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("  Cor:");
    this.appendDummyInput()
        .appendField("  Brilho:")
        .appendField(new Blockly.FieldDropdown([["Baixo", "20"], ["Médio", "50"], ["Alto", "80"], ["Máximo", "100"]]), "BRILHO");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Mova um LED pela Matriz 5x5 usando o joystick. O joystick analógico é convertido em posições discretas (0-4).");
  }
};
// Project block: Snake Game
Blockly.Blocks['joystick_snake'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐍 Jogo da Cobrinha na Matriz");
    this.appendDummyInput()
        .appendField("  Velocidade:")
        .appendField(new Blockly.FieldDropdown([["Lenta", "500"], ["Normal", "300"], ["Rápida", "150"]]), "VELOCIDADE")
        .appendField("  Cor cobra:")
        .appendField(new Blockly.FieldDropdown([["Verde", "GREEN"], ["Azul", "BLUE"], ["Branco", "WHITE"]]), "COR_COBRA");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Jogo da cobrinha clássico na Matriz 5x5! Controle com joystick, coma a comida para crescer. Game over se bater na borda!");
  }
};
// Project block: Pintar Matriz
Blockly.Blocks['joystick_pintar_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎨 Pintar na Matriz 5x5");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("  Cor do pincel:");
    this.appendDummyInput()
        .appendField("  Brilho:")
        .appendField(new Blockly.FieldDropdown([["Baixo", "20"], ["Médio", "50"], ["Alto", "80"]]), "BRILHO");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#e67e22");
    this.setTooltip("Pinte na Matriz 5x5! Mova com joystick, pressione o botão para alternar entre pintar e mover. Os pixels pintados ficam acesos!");
  }
};
// ==========================================
// Category: Condicionais (Conditionals)
// ==========================================
// Bloco "Se" (If) - estrutura condicional genérica
Blockly.Blocks['controls_if'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("Se");
    this.appendStatementInput("DO0")
        .appendField("então");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("Se a condição for verdadeira, executa os blocos dentro.");
    this.setHelpUrl("");
  }
};

// Bloco "Se/Senão" (If/Else) - estrutura condicional com alternativa
Blockly.Blocks['controls_ifelse'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("Se");
    this.appendStatementInput("DO0")
        .appendField("então");
    this.appendStatementInput("ELSE")
        .appendField("senão");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("Se a condição for verdadeira, executa o primeiro bloco. Caso contrário, executa o bloco 'senão'.");
    this.setHelpUrl("");
  }
};

// Bloco de comparação - =, ≠, <, >, ≤, ≥
Blockly.Blocks['logic_compare'] = {
  init: function() {
    this.appendValueInput("A");
    this.appendValueInput("B")
        .appendField(new Blockly.FieldDropdown([
          ["=", "EQ"],
          ["≠", "NEQ"],
          ["<", "LT"],
          ["≤", "LTE"],
          [">", "GT"],
          ["≥", "GTE"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(270);
    this.setTooltip("Compara dois valores e retorna verdadeiro ou falso.");
    this.setHelpUrl("");
  }
};

// Bloco de operação lógica - E, OU
Blockly.Blocks['logic_operation'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendValueInput("B")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldDropdown([
          ["E", "AND"],
          ["OU", "OR"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(270);
    this.setTooltip("Combina duas condições com 'E' ou 'OU'.");
    this.setHelpUrl("");
  }
};

// Bloco de negação - NÃO
Blockly.Blocks['logic_negate'] = {
  init: function() {
    this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("NÃO");
    this.setOutput(true, "Boolean");
    this.setColour(270);
    this.setTooltip("Inverte uma condição: verdadeiro vira falso e vice-versa.");
    this.setHelpUrl("");
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
