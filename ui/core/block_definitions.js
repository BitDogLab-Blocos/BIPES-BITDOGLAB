// LED RGB Control Blocks for BitDogLab
// SVG ícones de LEDs coloridos
const svg_red_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjRUY1MzUwIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiNFMzUzNSIvPjwvc3ZnPg==";
const svg_green_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNjZCQTZBIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiM0Q0FGNTAiLz48L3N2Zz4=";
const svg_blue_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNDJBNUY1Ii8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiMyMTk2RjMiLz48L3N2Zz4=";
const svg_off_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjOUU5RTlFIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiM3NTc1NzUiLz48L3N2Zz4=";
const led_rgb_svg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJnYkdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmYwMDAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZjAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODBmZjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSJ1cmwoI3JnYkdyYWRpZW50KSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=";
const svg_decision_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZBNTAwIj48cGF0aCBkPSJNMTIgMkwyMiAxMiAxMiAyMiAyIDEyeiIvPjwvc3ZnPg==";

Blockly.Blocks['led_red_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ligar LED Vermelho")
        .appendField(new Blockly.FieldImage(svg_red_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Liga o LED vermelho (GPIO 13)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_green_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ligar LED Verde")
        .appendField(new Blockly.FieldImage(svg_green_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Liga o LED verde (GPIO 11)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_blue_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ligar LED Azul")
        .appendField(new Blockly.FieldImage(svg_blue_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Liga o LED azul (GPIO 12)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_red_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Desligar LED Vermelho")
        .appendField(new Blockly.FieldImage(svg_red_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Desliga o LED vermelho (GPIO 13)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_green_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Desligar LED Verde")
        .appendField(new Blockly.FieldImage(svg_green_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Desliga o LED verde (GPIO 11)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_blue_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Desligar LED Azul")
        .appendField(new Blockly.FieldImage(svg_blue_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Desliga o LED azul (GPIO 12)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['led_all_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Desligar Todos os LEDs")
        .appendField(new Blockly.FieldImage(svg_off_icon, 20, 20, "*"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Desliga todos os LEDs RGB (GPIO 13, 11, 12)");
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

// Override logic_boolean blocks with visual icons
Blockly.Blocks['logic_boolean'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["✔️ Verdadeiro", "TRUE"],
            ["❌ Falso", "FALSE"]
        ]), "BOOL");
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_LOGIC_HUE}");
    this.setTooltip("Retorna verdadeiro ou falso");
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