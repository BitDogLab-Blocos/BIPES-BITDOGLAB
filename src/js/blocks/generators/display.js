// Auto-extracted from legacy generators.js into display.js
'use strict';

Blockly.Python["display_natal"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = '';
  code += '# Limpar display\n';
  code += 'oled.fill(0)\n';
  code += '# Desenhar borda simples\n';
  code += 'oled.rect(0, 0, ' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', 1)\n';
  code += '# Texto centralizado - FELIZ NATAL\n';
  code += 'oled.text("FELIZ NATAL", 25, 28, 1)\n';
  code += '# Atualizar display\n';
  code += 'oled.show()\n';

  return code;
};

Blockly.Python["display_criar_borda"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.rect(0, 0, ' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

Blockly.Python["display_limpar_borda"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.rect(0, 0, ' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', 0)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

Blockly.Python["display_atualizar"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.fill(0)\n';

  // Get the statements/commands inside the container
  var statements = Blockly.Python.statementToCode(block, 'COMANDOS');
  if (statements) {
    // Remove the default 2-space indentation that Blockly adds
    code += statements.replace(/^  /gm, '');
  }

  code += 'oled.show()\n';

  return code;
};

Blockly.Python["display_testar_conexao"] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var code = '';
  code += 'oled.fill(0)\n';
  code += 'oled.text("Display OK!", 15, 20, 1)\n';
  code += 'oled.text("SCL:' + pins.I2C_SCL + ' SDA:' + pins.I2C_SDA + '", 10, 36, 1)\n';
  code += 'oled.show()\n';

  return code;
};

Blockly.Python["display_show"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  return 'oled.show()\n';
};

Blockly.Python["display_mostrar"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = '';

  // Get the statements/commands inside the container
  var statements = Blockly.Python.statementToCode(block, 'COMANDOS');
  if (statements) {
    // Remove the default 2-space indentation that Blockly adds
    var cleanStatements = statements.replace(/^  /gm, '');

    // Split by lines and add oled.show() after each non-empty line
    var lines = cleanStatements.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        code += lines[i] + '\n';
        // Add show() after each command (except time.sleep commands)
        if (lines[i].indexOf('time.sleep') === -1 && lines[i].indexOf('#') !== 0) {
          code += 'oled.show()\n';
        }
      }
    }
  }

  return code;
};

Blockly.Python["display_texto"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var texto = block.getFieldValue('TEXTO');
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');

  // Calcular posição Y baseado na linha (considerando borda de 1 pixel no topo)
  // Linhas em: Y = 8, 18, 28, 38, 48 (espaçamento de 10 pixels, começando após a borda)
  var yPositions = {
    '1': 8,
    '2': 18,
    '3': 28,
    '4': 38,
    '5': 48
  };
  var y = yPositions[linha];

  // Calcular posição X baseado no alinhamento
  // Display: 128 pixels de largura, borda de 1 pixel de cada lado = 126 pixels úteis
  // Cada caractere: 8 pixels de largura
  // Área útil para texto: de X=2 até X=125 (para evitar sobrepor a borda)
  var textLength = texto.length;
  var textWidth = textLength * 8;
  var usableWidth = 124; // 126 - 2 pixels de margem interna
  var x;

  if (alinhamento === 'LEFT') {
    x = 3; // 1 pixel de borda + 2 pixels de margem
  } else if (alinhamento === 'CENTER') {
    x = Math.max(3, Math.floor((128 - textWidth) / 2));
  } else { // RIGHT
    x = Math.max(3, 125 - textWidth);
  }

  var code = 'oled.text("' + texto + '", ' + x + ', ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve colocar um bloco "Atualizar Display" no final
  return code;
};

Blockly.Python["display_piscar_texto"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var texto = block.getFieldValue('TEXTO');
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');
  var tempoLigado = block.getFieldValue('TEMPO_LIGADO');
  var tempoApagado = block.getFieldValue('TEMPO_APAGADO');

  // Y positions for 5 lines
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];

  var code = '';

  // Estado 1: Mostrar texto
  code += '# Piscar texto\n';
  code += 'oled.fill_rect(0, ' + y + ', 128, 8, 0)\n';

  // Calculate X position based on alignment
  if (alinhamento === 'LEFT') {
    code += 'oled.text("' + texto + '", 3, ' + y + ', 1)\n';
  } else if (alinhamento === 'CENTER') {
    code += '_blink_x = max(0, (128 - len("' + texto + '") * 8) // 2)\n';
    code += 'oled.text("' + texto + '", _blink_x, ' + y + ', 1)\n';
  } else { // RIGHT
    code += '_blink_x = max(0, 128 - len("' + texto + '") * 8 - 3)\n';
    code += 'oled.text("' + texto + '", _blink_x, ' + y + ', 1)\n';
  }

  code += 'oled.show()\n';
  code += 'time.sleep(' + tempoLigado + ')\n';

  // Estado 2: Apagar texto
  code += 'oled.fill_rect(0, ' + y + ', 128, 8, 0)\n';
  code += 'oled.show()\n';
  code += 'time.sleep(' + tempoApagado + ')\n';

  return code;
};

Blockly.Python["display_mostrar_calculo"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var valor = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_NONE) || '0';
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');

  // Calcular posição Y baseado na linha
  var yPositions = {
    '1': 8,
    '2': 18,
    '3': 28,
    '4': 38,
    '5': 48
  };
  var y = yPositions[linha];

  // Gerar código que cria a variável temporária e calcula posição
  var code = '';

  // Criar variável temporária para armazenar o resultado
  code += '_calc_result = str(' + valor + ')\n';

  // Calcular posição X baseado no alinhamento e tamanho do texto
  if (alinhamento === 'LEFT') {
    code += '_calc_x = 3\n';
  } else if (alinhamento === 'CENTER') {
    code += '_calc_x = max(3, (128 - len(_calc_result) * 8) // 2)\n';
  } else { // RIGHT
    code += '_calc_x = max(3, 125 - len(_calc_result) * 8)\n';
  }

  // Mostrar o resultado no display
  code += 'oled.text(_calc_result, _calc_x, ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["display_mostrar_valor"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var valor = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_NONE) || '0';
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');

  // Calcular posição Y baseado na linha
  var yPositions = {
    '1': 8,
    '2': 18,
    '3': 28,
    '4': 38,
    '5': 48
  };
  var y = yPositions[linha];

  // Gerar código que cria a variável temporária e calcula posição
  var code = '';

  // Criar variável temporária para armazenar o valor
  code += '_display_value = str(' + valor + ')\n';

  // Calcular posição X baseado no alinhamento e tamanho do texto
  if (alinhamento === 'LEFT') {
    code += '_display_x = 3\n';
    code += '_display_x_clear = 3\n';
  } else if (alinhamento === 'CENTER') {
    code += '_display_x = max(3, (128 - len(_display_value) * 8) // 2)\n';
    code += '_display_x_clear = max(3, _display_x - 16)\n';
  } else { // RIGHT
    code += '_display_x = max(3, 125 - len(_display_value) * 8)\n';
    // 32px extras à esquerda: cobre transição de até 4 chars (ex: "100%" → "1%")
    code += '_display_x_clear = max(3, _display_x - 32)\n';
  }

  // Limpar área do valor antes de escrever (evita sobreposição de pixels antigos)
  code += 'oled.fill_rect(_display_x_clear, ' + y + ', 128 - _display_x_clear, 8, 0)\n';

  // Mostrar o valor no display
  code += 'oled.text(_display_value, _display_x, ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["display_mostrar_estado_led"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';

  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');

  // Y positions for 5 lines
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];

  var code = '';

  // Check LED state and determine color name
  code += '_led_r = led_vermelho.duty_u16()\n';
  code += '_led_g = led_verde.duty_u16()\n';
  code += '_led_b = led_azul.duty_u16()\n';
  code += '_led_color = ' + colour + '\n';
  code += '_led_state = "ON" if (_led_r > 0 or _led_g > 0 or _led_b > 0) else "OFF"\n';

  // Determine color name based on RGB values
  code += 'if _led_color == (255, 0, 0):\n';
  code += '  _color_name = "Verm"\n';
  code += 'elif _led_color == (0, 255, 0):\n';
  code += '  _color_name = "Verde"\n';
  code += 'elif _led_color == (0, 0, 255):\n';
  code += '  _color_name = "Azul"\n';
  code += 'elif _led_color == (255, 255, 0):\n';
  code += '  _color_name = "Amar"\n';
  code += 'elif _led_color == (0, 255, 255):\n';
  code += '  _color_name = "Ciano"\n';
  code += 'elif _led_color == (255, 0, 255):\n';
  code += '  _color_name = "Magent"\n';
  code += 'elif _led_color == (255, 255, 255):\n';
  code += '  _color_name = "Branco"\n';
  code += 'elif _led_color == (255, 165, 0):\n';
  code += '  _color_name = "Laran"\n';
  code += 'elif _led_color == (255, 192, 203):\n';
  code += '  _color_name = "Rosa"\n';
  code += 'elif _led_color == (128, 255, 0):\n';
  code += '  _color_name = "Lima"\n';
  code += 'elif _led_color == (64, 196, 255):\n';
  code += '  _color_name = "ACeu"\n';
  code += 'elif _led_color == (64, 224, 208):\n';
  code += '  _color_name = "Turq"\n';
  code += 'else:\n';
  code += '  _color_name = "Cor"\n';

  code += '_led_text = "LED(" + _color_name + "):" + _led_state\n';

  // Clear the line before writing (fix for blink updates)
  code += 'oled.fill_rect(0, ' + y + ', 128, 8, 0)\n';

  // Calculate X position based on alignment
  if (alinhamento === 'LEFT') {
    code += '_led_x = 3\n';
  } else if (alinhamento === 'CENTER') {
    code += '_led_x = max(3, (128 - len(_led_text) * 8) // 2)\n';
  } else { // RIGHT
    code += '_led_x = max(3, 125 - len(_led_text) * 8)\n';
  }

  code += 'oled.text(_led_text, _led_x, ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["display_limpar"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.fill(0)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

Blockly.Python["display_mostrar_estado_botao"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['setup_botoes'] =
    'botao_esquerda = Pin(' + BitdogLabConfig.PINS.BUTTON_A + ', Pin.IN, Pin.PULL_UP)\n' +
    'botao_direita = Pin(' + BitdogLabConfig.PINS.BUTTON_B + ', Pin.IN, Pin.PULL_UP)\n' +
    (BitdogLabConfig.PINS.BUTTON_C !== null ? 'botao_centro = Pin(' + BitdogLabConfig.PINS.BUTTON_C + ', Pin.IN, Pin.PULL_UP)\n' : '') +
    'botao_joystick = Pin(' + BitdogLabConfig.PINS.JOYSTICK_SW + ', Pin.IN, Pin.PULL_UP)';

  var botao = block.getFieldValue('BOTAO');
  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');
  var mostrarContagem = block.getFieldValue('MOSTRAR_CONTAGEM') === 'TRUE';
  var linhaContagem = block.getFieldValue('LINHA_CONTAGEM');
  var alinhamentoContagem = block.getFieldValue('ALINHAMENTO_CONTAGEM');

  // Y positions for 5 lines
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];
  var yContagem = yPositions[linhaContagem];

  // Determine button variable and name
  var variavel_botao;
  var nome_botao;
  var contador_var;

  switch (botao) {
    case 'A':
      variavel_botao = 'botao_esquerda';
      nome_botao = 'A';
      contador_var = '_btn_a_count';
      break;
    case 'B':
      variavel_botao = 'botao_direita';
      nome_botao = 'B';
      contador_var = '_btn_b_count';
      break;
    case 'C':
      variavel_botao = 'botao_centro';
      nome_botao = 'C';
      contador_var = '_btn_c_count';
      break;
    case 'JOYSTICK':
      variavel_botao = 'botao_joystick';
      nome_botao = 'Joystick';
      contador_var = '_btn_joystick_count';
      break;
  }

  var code = '';

  // Initialize IRQ system only once using definitions (setup section)
  if (mostrarContagem) {
    // Variables initialization (MUST be in setup, NOT in loop)
    Blockly.Python.definitions_['btn_counter_vars'] =
      '_btn_a_count = 0\n' +
      '_btn_b_count = 0\n' +
      '_btn_c_count = 0\n' +
      '_btn_joystick_count = 0\n' +
      '_btn_a_last_time = 0\n' +
      '_btn_b_last_time = 0\n' +
      '_btn_c_last_time = 0\n' +
      '_btn_joystick_last_time = 0\n' +
      '_debounce_ms = 300';

    // Handler functions (setup section)
    Blockly.Python.definitions_['btn_a_handler'] =
      'def _btn_a_handler(pin):\n' +
      '  global _btn_a_count, _btn_a_last_time\n' +
      '  current_time = time.ticks_ms()\n' +
      '  if time.ticks_diff(current_time, _btn_a_last_time) > _debounce_ms:\n' +
      '    _btn_a_count += 1\n' +
      '    _btn_a_last_time = current_time';

    Blockly.Python.definitions_['btn_b_handler'] =
      'def _btn_b_handler(pin):\n' +
      '  global _btn_b_count, _btn_b_last_time\n' +
      '  current_time = time.ticks_ms()\n' +
      '  if time.ticks_diff(current_time, _btn_b_last_time) > _debounce_ms:\n' +
      '    _btn_b_count += 1\n' +
      '    _btn_b_last_time = current_time';

    Blockly.Python.definitions_['btn_c_handler'] =
      'def _btn_c_handler(pin):\n' +
      '  global _btn_c_count, _btn_c_last_time\n' +
      '  current_time = time.ticks_ms()\n' +
      '  if time.ticks_diff(current_time, _btn_c_last_time) > _debounce_ms:\n' +
      '    _btn_c_count += 1\n' +
      '    _btn_c_last_time = current_time';

    Blockly.Python.definitions_['btn_joystick_handler'] =
      'def _btn_joystick_handler(pin):\n' +
      '  global _btn_joystick_count, _btn_joystick_last_time\n' +
      '  current_time = time.ticks_ms()\n' +
      '  if time.ticks_diff(current_time, _btn_joystick_last_time) > _debounce_ms:\n' +
      '    _btn_joystick_count += 1\n' +
      '    _btn_joystick_last_time = current_time';

    // IRQ setup (setup section)
    Blockly.Python.definitions_['btn_irq_setup'] =
      'botao_esquerda.irq(trigger=Pin.IRQ_FALLING, handler=_btn_a_handler)\n' +
      'botao_direita.irq(trigger=Pin.IRQ_FALLING, handler=_btn_b_handler)\n' +
      (BitdogLabConfig.PINS.BUTTON_C !== null ? 'botao_centro.irq(trigger=Pin.IRQ_FALLING, handler=_btn_c_handler)\n' : '') +
      'botao_joystick.irq(trigger=Pin.IRQ_FALLING, handler=_btn_joystick_handler)';
  }

  // Read button state once
  code += '_btn_current = ' + variavel_botao + '.value()\n';

  // Show button state
  code += '_btn_state = "Press" if _btn_current == 0 else "Solto"\n';
  code += '_btn_text = "BTN ' + nome_botao + ':" + _btn_state\n';

  // Clear the specific line before writing (fill_rect to erase old text)
  code += 'oled.fill_rect(0, ' + y + ', 128, 8, 0)\n';

  // Calculate X position for state based on alignment
  if (alinhamento === 'LEFT') {
    code += '_btn_x = 3\n';
  } else if (alinhamento === 'CENTER') {
    code += '_btn_x = max(3, (128 - len(_btn_text) * 8) // 2)\n';
  } else { // RIGHT
    code += '_btn_x = max(3, 125 - len(_btn_text) * 8)\n';
  }

  code += 'oled.text(_btn_text, _btn_x, ' + y + ', 1)\n';

  // Show count if enabled
  if (mostrarContagem) {
    code += '_btn_count_text = "Clicks:" + str(' + contador_var + ')\n';

    // Clear the count line before writing
    code += 'oled.fill_rect(0, ' + yContagem + ', 128, 8, 0)\n';

    // Calculate X position for count based on alignment
    if (alinhamentoContagem === 'LEFT') {
      code += '_btn_count_x = 3\n';
    } else if (alinhamentoContagem === 'CENTER') {
      code += '_btn_count_x = max(3, (128 - len(_btn_count_text) * 8) // 2)\n';
    } else { // RIGHT
      code += '_btn_count_x = max(3, 125 - len(_btn_count_text) * 8)\n';
    }

    code += 'oled.text(_btn_count_text, _btn_count_x, ' + yContagem + ', 1)\n';
  }

  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["display_mostrar_status_buzzer"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  var linha = block.getFieldValue('LINHA');
  var alinhamento = block.getFieldValue('ALINHAMENTO');
  var mostrarFrequencia = block.getFieldValue('MOSTRAR_FREQUENCIA') === 'TRUE';
  var linhaFreq = block.getFieldValue('LINHA_FREQ');
  var alinhamentoFreq = block.getFieldValue('ALINHAMENTO_FREQ');

  // Y positions for 5 lines
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];
  var yFreq = yPositions[linhaFreq];

  // Store configuration globally so sound blocks can access it
  // Always update config to use the latest block settings
  Blockly.Python.buzzerDisplayConfig = {
    line: y,
    freqLine: yFreq,
    showFreq: mostrarFrequencia
  };

  return '';
};

Blockly.Python["display_dashboard_matriz"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')';

  // Initialize matrix tracking variables
  Blockly.Python.definitions_['matriz_tracking'] = '# Matrix tracking variables\n_matriz_status = "OFF"\n_matriz_desenho = ""\n_matriz_cor = (0, 0, 0)\n_matriz_brilho = 0\n_matriz_leds_count = 0';

  // Y positions for 5 lines
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};

  var code = '';

  // Helper function to get color name from RGB
  code += '# Display matrix dashboard\n';
  code += 'def _get_color_name(r, g, b):\n';
  code += '  if r > 200 and g < 50 and b < 50: return "Vermelho"\n';
  code += '  if r < 50 and g > 200 and b < 50: return "Verde"\n';
  code += '  if r < 50 and g < 50 and b > 200: return "Azul"\n';
  code += '  if r > 200 and g > 200 and b < 50: return "Amarelo"\n';
  code += '  if r > 200 and g < 50 and b > 200: return "Magenta"\n';
  code += '  if r < 50 and g > 200 and b > 200: return "Ciano"\n';
  code += '  if r > 200 and g > 200 and b > 200: return "Branco"\n';
  code += '  if r < 50 and g < 50 and b < 50: return "Preto"\n';
  code += '  return "Misto"\n\n';

  // Process each line
  for (var i = 1; i <= 5; i++) {
    var info = block.getFieldValue('INFO_LINHA' + i);
    var align = block.getFieldValue('ALIGN_' + i);
    var y = yPositions[i.toString()];

    if (info !== 'NONE') {
      code += '# Line ' + i + '\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + y + ', 128, 8, 0)\n';

      // Generate text based on info type
      var textVar = '_text_l' + i;
      code += '  ' + textVar + ' = ""\n';

      switch(info) {
        case 'STATUS':
          code += '  ' + textVar + ' = "Matriz: " + _matriz_status\n';
          break;
        case 'DESENHO':
          code += '  ' + textVar + ' = _matriz_desenho if _matriz_desenho else "---"\n';
          break;
        case 'COR_RGB':
          code += '  ' + textVar + ' = "RGB:%d,%d,%d" % _matriz_cor\n';
          break;
        case 'COR_NOME':
          code += '  ' + textVar + ' = _get_color_name(_matriz_cor[0], _matriz_cor[1], _matriz_cor[2])\n';
          break;
        case 'BRILHO':
          code += '  ' + textVar + ' = "Brilho: %d%%" % _matriz_brilho\n';
          break;
        case 'LEDS_ACESOS':
          code += '  ' + textVar + ' = "LEDs: %d/25" % _matriz_leds_count\n';
          break;
      }

      // Calculate X position based on alignment
      switch(align) {
        case 'LEFT':
          code += '  _x_l' + i + ' = 3\n';
          break;
        case 'CENTER':
          code += '  _x_l' + i + ' = max(0, (128 - len(' + textVar + ') * 8) // 2)\n';
          break;
        case 'RIGHT':
          code += '  _x_l' + i + ' = max(0, 128 - len(' + textVar + ') * 8 - 3)\n';
          break;
      }

      code += '  oled.text(' + textVar + ', _x_l' + i + ', ' + y + ', 1)\n';
      code += 'except:\n';
      code += '  pass\n';
    }
  }

  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["display_mostrar_tempo_ligado"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var line = block.getFieldValue('LINE');
  var align = block.getFieldValue('ALIGN');
  var format = block.getFieldValue('FORMAT');

  // Y positions igual aos outros blocos de display (8, 18, 28, 38, 48)
  var yPositions = {'0': 8, '1': 18, '2': 28, '3': 38, '4': 48};
  var y = yPositions[line];

  var code = '';
  code += '_uptime_ms = time.ticks_ms()\n';
  code += '_uptime_s = _uptime_ms // 1000\n';

  // Formatar tempo baseado na opção escolhida
  switch(format) {
    case 'HMS':
      code += '_hours = _uptime_s // 3600\n';
      code += '_mins = (_uptime_s % 3600) // 60\n';
      code += '_secs = _uptime_s % 60\n';
      code += '_uptime_str = "{:02d}:{:02d}:{:02d}".format(_hours, _mins, _secs)\n';
      break;
    case 'MS':
      code += '_mins = _uptime_s // 60\n';
      code += '_secs = _uptime_s % 60\n';
      code += '_uptime_str = "{:02d}:{:02d}".format(_mins, _secs)\n';
      break;
    case 'SECONDS':
      code += '_uptime_str = "{}s".format(_uptime_s)\n';
      break;
    case 'MILLISECONDS':
      code += '_uptime_str = "{}ms".format(_uptime_ms)\n';
      break;
  }

  // Calcular largura do texto
  code += '_uptime_width = len(_uptime_str) * 8\n';

  // Alinhamento
  switch(align) {
    case 'LEFT':
      code += '_x_uptime = 0\n';
      break;
    case 'CENTER':
      code += '_x_uptime = max(0, (128 - _uptime_width) // 2)\n';
      break;
    case 'RIGHT':
      code += '_x_uptime = max(0, 128 - _uptime_width)\n';
      break;
  }

  // Limpa APENAS a área onde o número será escrito (não apaga texto fixo)
  code += 'oled.fill_rect(_x_uptime, ' + y + ', _uptime_width, 8, 0)\n';
  code += 'oled.text(_uptime_str, _x_uptime, ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

Blockly.Python["cronometro_iniciar"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  // Inicializar variáveis no setup (antes do loop)
  Blockly.Python.definitions_['crono_' + name] = '# Cronometro ' + name + '\n' + varName + '_start = 0\n' + varName + '_paused = 0\n' + varName + '_running = False';

  var code = '';
  code += 'if not ' + varName + '_running:\n';
  code += '  if ' + varName + '_paused > 0:\n';
  code += '    ' + varName + '_start = time.ticks_ms() - ' + varName + '_paused\n';
  code += '  else:\n';
  code += '    ' + varName + '_start = time.ticks_ms()\n';
  code += '  ' + varName + '_running = True\n';

  return code;
};

Blockly.Python["cronometro_parar"] = function(block) {
  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  var code = '';
  code += 'if ' + varName + '_running:\n';
  code += '  ' + varName + '_paused = time.ticks_diff(time.ticks_ms(), ' + varName + '_start)\n';
  code += '  ' + varName + '_running = False\n';

  return code;
};

Blockly.Python["cronometro_reiniciar"] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  // Inicializa as variáveis do cronômetro (caso ainda não existam)
  Blockly.Python.definitions_['crono_' + name] = '# Cronometro ' + name + '\n' +
    varName + '_start = 0\n' +
    varName + '_paused = 0\n' +
    varName + '_running = False';

  var code = '';
  // Reinicia o cronômetro corretamente usando tempo atual
  code += varName + '_start = time.ticks_ms()\n';
  code += varName + '_paused = 0\n';
  code += varName + '_running = False\n';

  return code;
};

Blockly.Python["cronometro_mostrar"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var name = block.getFieldValue('NAME');
  var line = block.getFieldValue('LINE');
  var align = block.getFieldValue('ALIGN');
  var format = block.getFieldValue('FORMAT');

  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  // Y positions igual aos outros blocos de display (8, 18, 28, 38, 48)
  var yPositions = {'0': 8, '1': 18, '2': 28, '3': 38, '4': 48};
  var y = yPositions[line];

  var code = '';
  code += 'if ' + varName + '_running:\n';
  code += '  _elapsed_ms = time.ticks_diff(time.ticks_ms(), ' + varName + '_start)\n';
  code += 'else:\n';
  code += '  _elapsed_ms = ' + varName + '_paused\n';
  code += '_elapsed_s = _elapsed_ms // 1000\n';

  // Formatar tempo baseado na opção escolhida
  switch(format) {
    case 'HMS':
      code += '_hours = _elapsed_s // 3600\n';
      code += '_mins = (_elapsed_s % 3600) // 60\n';
      code += '_secs = _elapsed_s % 60\n';
      code += '_crono_str = "{:02d}:{:02d}:{:02d}".format(_hours, _mins, _secs)\n';
      break;
    case 'MS_MILLI':
      code += '_mins = _elapsed_s // 60\n';
      code += '_secs = _elapsed_s % 60\n';
      code += '_millis = (_elapsed_ms % 1000) // 10\n';
      code += '_crono_str = "{:02d}:{:02d}.{:02d}".format(_mins, _secs, _millis)\n';
      break;
    case 'S_MILLI':
      code += '_millis = (_elapsed_ms % 1000) // 10\n';
      code += '_crono_str = "{}.{:02d}s".format(_elapsed_s, _millis)\n';
      break;
    case 'SECONDS':
      code += '_crono_str = "{}s".format(_elapsed_s)\n';
      break;
  }

  // Calcula largura e posição do cronômetro
  code += '_crono_width = len(_crono_str) * 8\n';

  // Calcula posição X baseado no alinhamento
  switch(align) {
    case 'LEFT':
      code += '_x_crono = 0\n';
      // Apaga área fixa para LEFT (até 10 caracteres = 80 pixels)
      code += 'oled.fill_rect(_x_crono, ' + y + ', 80, 8, 0)\n';
      break;
    case 'CENTER':
      code += '_x_crono = max(0, (128 - _crono_width) // 2)\n';
      // Apaga do centro com largura fixa (área de 10 caracteres centralizada)
      code += 'oled.fill_rect(24, ' + y + ', 80, 8, 0)\n';
      break;
    case 'RIGHT':
      code += '_x_crono = max(0, 128 - _crono_width)\n';
      // Apaga área fixa para RIGHT (últimos 80 pixels)
      code += 'oled.fill_rect(48, ' + y + ', 80, 8, 0)\n';
      break;
  }

  // Escreve o cronômetro (sem chamar oled.show())
  code += 'oled.text(_crono_str, _x_crono, ' + y + ', 1)\n';

  return code;
};

Blockly.Python["display_resetar_contagem"] = function(block) {
  var botao = block.getFieldValue('BOTAO');

  var code = '';

  if (botao === 'ALL') {
    // Reset all counters
    code += 'try:\n';
    code += '  _btn_a_count = 0\n';
    code += '  _btn_b_count = 0\n';
    code += '  _btn_c_count = 0\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    // Reset specific counter
    var contador_var;
    switch (botao) {
      case 'A':
        contador_var = '_btn_a_count';
        break;
      case 'B':
        contador_var = '_btn_b_count';
        break;
      case 'C':
        contador_var = '_btn_c_count';
        break;
    }
    code += 'try:\n';
    code += '  ' + contador_var + ' = 0\n';
    code += 'except:\n';
    code += '  pass\n';
  }

  return code;
};
