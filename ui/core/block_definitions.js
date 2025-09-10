// LED RGB Control Blocks for BitDogLab
// SVG ícones de LEDs coloridos
const svg_red_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjRUY1MzUwIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiNFMzUzNSIvPjwvc3ZnPg==";
const svg_green_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNjZCQTZBIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiM0Q0FGNTAiLz48L3N2Zz4=";
const svg_blue_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjNDJBNUY1Ii8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiMyMTk2RjMiLz48L3N2Zz4=";
const svg_off_icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjE0IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzYxNjE2MSIvPjxyZWN0IHg9IjYiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI0JEQkRCRCIvPjxwYXRoIGQ9Ik02IDE0IFY4IEM2IDQuNjg2IDguNjg2IDIgMTIgMiBDMTUuMzE0IDIgMTggNC42ODYgMTggOCBWMTQgSDZaIiBmaWxsPSIjOUU5RTlFIi8+PHBhdGggZD0iTTE0IDE0IFY4IEMxNCA2LjMgMTMuMiA0LjggMTIgNCBDMTQuMiA0LjggMTYgNi44IDE2IDggVjE0IEgxNFoiIGZpbGw9IiM3NTc1NzUiLz48L3N2Zz4=";
const led_rgb_svg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJnYkdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmYwMDAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZjAwO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODBmZjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSJ1cmwoI3JnYkdyYWRpZW50KSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=";

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