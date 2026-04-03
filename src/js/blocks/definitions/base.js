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
        .appendField("⏱️ Tempo ligado BitDogLab");
    this.setOutput(true, "Number");
    this.setColour(190);
    this.setTooltip("Retorna há quantos segundos a BitDogLab está ligada");
    this.setHelpUrl("");
  }
};

// Bloco que RETORNA o tempo do cronômetro em segundos (para usar em comparações)
Blockly.Blocks['tempo_cronometro'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️ Tempo cronômetro");
    this.appendDummyInput()
        .appendField("Nome")
        .appendField(new Blockly.FieldTextInput("crono1"), "NAME");
    this.setOutput(true, "Number");
    this.setColour(190);
    this.setTooltip("Retorna quantos segundos se passaram no cronômetro especificado");
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
    this.appendValueInput("A");
    this.appendValueInput("B")
        .appendField(new Blockly.FieldDropdown([
          ["E", "AND"],
          ["OU", "OR"]
        ]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(270);
    this.setTooltip("Combina duas condições com 'E' ou 'OU'. Aceita comparações, verdadeiro/falso e outras expressões lógicas.");
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
