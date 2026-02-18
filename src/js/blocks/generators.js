// ==========================================
// Basic Blocks - Code Generators
// Python code generators for repetition blocks
// ==========================================

console.log('[BitdogLab] Loading basic code generators...');

// Helper: get buzzer display config, scanning workspace as fallback if not yet set
// This ensures sound blocks work regardless of whether display_mostrar_status_buzzer
// is placed above or below them in the workspace
function _getBuzzerDisplayConfig() {
  if (Blockly.Python.buzzerDisplayConfig) {
    return Blockly.Python.buzzerDisplayConfig;
  }
  // Lazy scan: look for display_mostrar_status_buzzer block in the workspace
  try {
    var ws = Blockly.getMainWorkspace();
    if (!ws) return null;
    var blocks = ws.getAllBlocks();
    var yPos = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
    for (var _bi = 0; _bi < blocks.length; _bi++) {
      if (blocks[_bi].type === 'display_mostrar_status_buzzer') {
        Blockly.Python.buzzerDisplayConfig = {
          line:     yPos[blocks[_bi].getFieldValue('LINHA')],
          freqLine: yPos[blocks[_bi].getFieldValue('LINHA_FREQ')],
          showFreq: blocks[_bi].getFieldValue('MOSTRAR_FREQUENCIA') === 'TRUE'
        };
        return Blockly.Python.buzzerDisplayConfig;
      }
    }
  } catch(e) {}
  return null;
}

// ==========================================
// REPETITION GENERATORS
// ==========================================

// Repeat N times generator
Blockly.Python['controls_repeat_simple'] = function(block) {
  var times = block.getFieldValue('TIMES');
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  // CRITICAL FIX: Replace 'while True:' with limited iterations
  // This allows infinite-loop blocks to work inside "Repeat X times"
  if (statements && statements.includes('while True:')) {
    // Replace while True: with for loop limited to X times
    statements = statements.replace(/while True:/g, 'for _inner_rep in range(' + times + '):');

    // Since we already handle the repetition inside, we don't need outer loop
    var code = '';
    if (statements && statements.trim()) {
      code += statements;
    } else {
      code += 'pass\n';
    }
    return code;
  }

  // Normal case: Simple for loop
  var code = 'for _rep in range(' + times + '):\n';

  if (statements && statements.trim()) {
    // Add indentation line by line
    var lines = statements.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        code += '  ' + lines[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }

  return code;
};

// Repeat forever generator
Blockly.Python['controls_repeat_forever'] = function(block) {
  var statements = Blockly.Python.statementToCode(block, 'DO');

  // Remove initial indentation (Blockly adds 2 spaces)
  if (statements) {
    statements = statements.replace(/^  /gm, '');
  }

  // Remove sound block markers
  statements = statements.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  var code = 'while True:\n';

  if (statements && statements.trim()) {
    // Add indentation line by line
    var lines = statements.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        code += '  ' + lines[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }

  return code;
};

console.log('[BitdogLab] Basic code generators loaded successfully!');

// ==========================================

let UPythonClass = {};

/*
*****************************************************************
* BASIC BLOCKS (substituem blocks_compressed.js)
* Generators for basic Blockly blocks
*****************************************************************
*/

// Number block generator
Blockly.Python['math_number'] = function(block) {
  var number = block.getFieldValue('NUM');
  var code = String(number);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Text block generator
Blockly.Python['text'] = function(block) {
  var text = block.getFieldValue('TEXT');
  var code = Blockly.Python.quote_(text);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Boolean block generator
Blockly.Python['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') === 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

console.log('[BitdogLab] Geradores básicos carregados: math_number, text, logic_boolean');

/*
*****************************************************************
* COLOR BLOCKS
* Generators for predefined RGB color tuples.
*****************************************************************
*/

// Red color generator
Blockly.Python['colour_red'] = function(block) {
  return ['(255, 0, 0)', Blockly.Python.ORDER_ATOMIC];
};

// Green color generator
Blockly.Python['colour_green'] = function(block) {
  return ['(0, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

// Blue color generator
Blockly.Python['colour_blue'] = function(block) {
  return ['(0, 0, 255)', Blockly.Python.ORDER_ATOMIC];
};

// Yellow color generator
Blockly.Python['colour_yellow'] = function(block) {
  return ['(255, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

// Cyan color generator
Blockly.Python['colour_cyan'] = function(block) {
  return ['(0, 255, 255)', Blockly.Python.ORDER_ATOMIC];
};

// Magenta color generator
Blockly.Python['colour_magenta'] = function(block) {
  return ['(255, 0, 255)', Blockly.Python.ORDER_ATOMIC];
};

// White color generator
Blockly.Python['colour_white'] = function(block) {
  return ['(255, 255, 255)', Blockly.Python.ORDER_ATOMIC];
};

// Orange color generator
Blockly.Python['colour_orange'] = function(block) {
  return ['(255, 128, 0)', Blockly.Python.ORDER_ATOMIC];
};

// Pink color generator
Blockly.Python['colour_pink'] = function(block) {
  return ['(255, 64, 128)', Blockly.Python.ORDER_ATOMIC];
};

// Lime color generator
Blockly.Python['colour_lime'] = function(block) {
  return ['(128, 255, 0)', Blockly.Python.ORDER_ATOMIC];
};

// Sky blue color generator
Blockly.Python['colour_skyblue'] = function(block) {
  return ['(64, 196, 255)', Blockly.Python.ORDER_ATOMIC];
};

// Turquoise color generator
Blockly.Python['colour_turquoise'] = function(block) {
  return ['(64, 224, 208)', Blockly.Python.ORDER_ATOMIC];
};

// Color mixer generator
Blockly.Python['mix_colours'] = function(block) {
  var colors = [];
  for (var i = 0; i < block.itemCount_; i++) {
    var color = Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) || '(0, 0, 0)';
    colors.push(color);
  }
  if (colors.length === 0) {
    return ['(0, 0, 0)', Blockly.Python.ORDER_ATOMIC];
  }
  var code = '(';
  code += 'int(sum([' + colors.join('[0], ') + '[0]])/' + colors.length + '), ';
  code += 'int(sum([' + colors.join('[1], ') + '[1]])/' + colors.length + '), ';
  code += 'int(sum([' + colors.join('[2], ') + '[2]])/' + colors.length + ')';
  code += ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

/*
*****************************************************************
* LED RGB CONTROL BLOCKS 
* Generators for controlling RGB LEDs and LED matrix.
*****************************************************************
*/

// Fill LED matrix generator
Blockly.Python['preencher_matriz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'for i in range(25):\n';
  code += '    np[i] = (int(' + colour + '[0] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[1] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[2] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = "Toda Matriz"\n';
  code += '_matriz_cor = ' + colour + '\n';
  code += '_matriz_brilho = ' + intensity + '\n';
  code += '_matriz_leds_count = 25\n';
  return code;
};

// Turn off LED matrix generator
Blockly.Python['desligar_matriz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var code = 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "OFF"\n';
  code += '_matriz_desenho = ""\n';
  code += '_matriz_cor = (0, 0, 0)\n';
  code += '_matriz_brilho = 0\n';
  code += '_matriz_leds_count = 0\n';
  return code;
};

// Turn on LED at specific position generator
Blockly.Python['acender_led_posicao'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var linha = block.getFieldValue('LINHA');
  var coluna = block.getFieldValue('COLUNA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  // Clear matrix first
  var code = 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'if 0 <= ' + linha + ' <= 4 and 0 <= ' + coluna + ' <= 4:\n';
  code += '    led_index = LED_MATRIX[4 - ' + linha + '][' + coluna + ']\n';
  code += '    np[led_index] = (int(' + colour + '[0] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[1] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[2] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = "LED (%d,%d)" % (' + linha + ', ' + coluna + ')\n';
  code += '_matriz_cor = ' + colour + '\n';
  code += '_matriz_brilho = ' + intensity + '\n';
  code += '_matriz_leds_count = sum(1 for i in range(25) if np[i] != (0, 0, 0))\n';
  return code;
};

// Turn on horizontal line generator
Blockly.Python['acender_linha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var linha = block.getFieldValue('LINHA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  // Clear matrix first
  var code = 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'if 0 <= ' + linha + ' <= 4:\n';
  code += '    for x in range(5):\n';
  code += '        led_index = LED_MATRIX[4 - ' + linha + '][x]\n';
  code += '        np[led_index] = (int(' + colour + '[0] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[1] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(' + colour + '[2] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = "Linha " + str(' + linha + ')\n';
  code += '_matriz_cor = ' + colour + '\n';
  code += '_matriz_brilho = ' + intensity + '\n';
  code += '_matriz_leds_count = sum(1 for i in range(25) if np[i] != (0, 0, 0))\n';
  return code;
};

// Turn on vertical column generator
Blockly.Python['acender_coluna'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var coluna = block.getFieldValue('COLUNA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  // Clear matrix first
  var code = 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'if 0 <= ' + coluna + ' <= 4:\n';
  code += '    for y in range(5):\n';
  code += '        led_index = LED_MATRIX[y][' + coluna + ']\n';
  code += '        r = int(' + colour + '[0] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100)\n';
  code += '        g = int(' + colour + '[1] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100)\n';
  code += '        b = int(' + colour + '[2] * ' + intensity + ' * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100)\n';
  code += '        np[led_index] = (r, g, b)\n';
  code += 'np.write()\n';
  code += 'time.sleep_ms(10)\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = "Coluna " + str(' + coluna + ')\n';
  code += '_matriz_cor = ' + colour + '\n';
  code += '_matriz_brilho = ' + intensity + '\n';
  code += '_matriz_leds_count = sum(1 for i in range(25) if np[i] != (0, 0, 0))\n';
  return code;
};

// Turn on LED with color generator
Blockly.Python['bloco_ligar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  return code;
};

// Turn off LED of specific color generator
Blockly.Python['bloco_desligar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'if ' + colour + '[0] > 0:\n';
  code += '    led_vermelho.duty_u16(0)\n';
  code += 'if ' + colour + '[1] > 0:\n';
  code += '    led_verde.duty_u16(0)\n';
  code += 'if ' + colour + '[2] > 0:\n';
  code += '    led_azul.duty_u16(0)\n';
  return code;
};

// Turn off all LEDs generator
Blockly.Python['bloco_desligar_todos_leds'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var code = 'led_vermelho.duty_u16(0)\n';
  code += 'led_verde.duty_u16(0)\n';
  code += 'led_azul.duty_u16(0)\n';
  return code;
};

// Control LED intensity generator
Blockly.Python['bloco_acender_led_brilho'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'led_vermelho.duty_u16(int(' + colour + '[0] * 257 * ' + intensity + ' / 100))\n';
  code += 'led_verde.duty_u16(int(' + colour + '[1] * 257 * ' + intensity + ' / 100))\n';
  code += 'led_azul.duty_u16(int(' + colour + '[2] * 257 * ' + intensity + ' / 100))\n';
  return code;
};

/*
*****************************************************************
* LED ANIMATION BLOCKS 
* Generators for LED animations and effects.
*****************************************************************
*/

// Blink LED animation generator
Blockly.Python['bloco_piscar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '    led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '    led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '    time.sleep_ms(200)\n';
  code += '    led_vermelho.duty_u16(0)\n';
  code += '    led_verde.duty_u16(0)\n';
  code += '    led_azul.duty_u16(0)\n';
  code += '    time.sleep_ms(200)\n';
  return code;
};

// Slow blink LED animation generator
Blockly.Python['piscar_led_lento'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '    led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '    led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '    time.sleep_ms(1000)\n';
  code += '    led_vermelho.duty_u16(0)\n';
  code += '    led_verde.duty_u16(0)\n';
  code += '    led_azul.duty_u16(0)\n';
  code += '    time.sleep_ms(1000)\n';
  return code;
};

// Heartbeat LED animation generator
Blockly.Python['bloco_animar_led_coracao'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '    led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '    led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '    time.sleep_ms(100)\n';
  code += '    led_vermelho.duty_u16(0)\n';
  code += '    led_verde.duty_u16(0)\n';
  code += '    led_azul.duty_u16(0)\n';
  code += '    time.sleep_ms(100)\n';
  code += '    led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '    led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '    led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '    time.sleep_ms(100)\n';
  code += '    led_vermelho.duty_u16(0)\n';
  code += '    led_verde.duty_u16(0)\n';
  code += '    led_azul.duty_u16(0)\n';
  code += '    time.sleep_ms(700)\n';
  return code;
};

// SOS signal LED animation generator
Blockly.Python['bloco_sinalizar_led_sos'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    for _ in range(3):\n';
  code += '        led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '        led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '        led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '        time.sleep_ms(150)\n';
  code += '        led_vermelho.duty_u16(0)\n';
  code += '        led_verde.duty_u16(0)\n';
  code += '        led_azul.duty_u16(0)\n';
  code += '        time.sleep_ms(150)\n';
  code += '    time.sleep_ms(400)\n';
  code += '    for _ in range(3):\n';
  code += '        led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '        led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '        led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '        time.sleep_ms(500)\n';
  code += '        led_vermelho.duty_u16(0)\n';
  code += '        led_verde.duty_u16(0)\n';
  code += '        led_azul.duty_u16(0)\n';
  code += '        time.sleep_ms(150)\n';
  code += '    time.sleep_ms(400)\n';
  code += '    for _ in range(3):\n';
  code += '        led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += '        led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += '        led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += '        time.sleep_ms(150)\n';
  code += '        led_vermelho.duty_u16(0)\n';
  code += '        led_verde.duty_u16(0)\n';
  code += '        led_azul.duty_u16(0)\n';
  code += '        time.sleep_ms(150)\n';
  code += '    time.sleep_ms(800)\n';
  return code;
};

// Random blink LED animation generator
Blockly.Python['piscar_led_aleatorio'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_urandom'] = 'import urandom';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    intensidade = urandom.randint(0, 1)\n';
  code += '    led_vermelho.duty_u16(' + colour + '[0] * 257 * intensidade)\n';
  code += '    led_verde.duty_u16(' + colour + '[1] * 257 * intensidade)\n';
  code += '    led_azul.duty_u16(' + colour + '[2] * 257 * intensidade)\n';
  code += '    time.sleep_ms(urandom.randint(50, 500))\n';
  return code;
};

// Alternate colors LED animation generator
Blockly.Python['bloco_alternar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colours = [];
  var i = 0;
  while (block.getInput('COLOUR' + i)) {
    var colour = Blockly.Python.valueToCode(block, 'COLOUR' + i, Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
    colours.push(colour);
    i++;
  }
  if (colours.length === 0) {
    colours = ['(0, 0, 0)', '(0, 0, 0)'];
  }
  var code = '';
  for (var j = 0; j < colours.length; j++) {
    code += 'led_vermelho.duty_u16(' + colours[j] + '[0] * 257)\n';
    code += 'led_verde.duty_u16(' + colours[j] + '[1] * 257)\n';
    code += 'led_azul.duty_u16(' + colours[j] + '[2] * 257)\n';
    code += 'time.sleep_ms(500)\n';
  }
  return code;
};

// Transition between colors LED animation generator
Blockly.Python['bloco_transicao_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var colour2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    for i in range(50):\n';  // Increased from 10 to 50 steps for smoother transition
  code += '        led_vermelho.duty_u16(int(' + colour1 + '[0] * 257 * (50-i)/50 + ' + colour2 + '[0] * 257 * i/50))\n';
  code += '        led_verde.duty_u16(int(' + colour1 + '[1] * 257 * (50-i)/50 + ' + colour2 + '[1] * 257 * i/50))\n';
  code += '        led_azul.duty_u16(int(' + colour1 + '[2] * 257 * (50-i)/50 + ' + colour2 + '[2] * 257 * i/50))\n';
  code += '        time.sleep_ms(100)\n';  // Increased from 50ms to 100ms for slower transition
  code += '    time.sleep_ms(1000)\n';  // Increased pause from 500ms to 1000ms
  return code;
};

// Battle colors LED animation generator
Blockly.Python['bloco_batalhar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_urandom'] = 'import urandom';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var colour2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    if urandom.randint(0, 1) == 0:\n';
  code += '        led_vermelho.duty_u16(' + colour1 + '[0] * 257)\n';
  code += '        led_verde.duty_u16(' + colour1 + '[1] * 257)\n';
  code += '        led_azul.duty_u16(' + colour1 + '[2] * 257)\n';
  code += '    else:\n';
  code += '        led_vermelho.duty_u16(' + colour2 + '[0] * 257)\n';
  code += '        led_verde.duty_u16(' + colour2 + '[1] * 257)\n';
  code += '        led_azul.duty_u16(' + colour2 + '[2] * 257)\n';
  code += '    time.sleep_ms(urandom.randint(100, 300))\n';
  return code;
};

// Brightness animation LED generator
Blockly.Python['bloco_animar_led_brilhar'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    for i in range(10):\n';
  code += '        led_vermelho.duty_u16(int(' + colour + '[0] * 257 * i/10))\n';
  code += '        led_verde.duty_u16(int(' + colour + '[1] * 257 * i/10))\n';
  code += '        led_azul.duty_u16(int(' + colour + '[2] * 257 * i/10))\n';
  code += '        time.sleep_ms(50)\n';
  code += '    for i in range(10, 0, -1):\n';
  code += '        led_vermelho.duty_u16(int(' + colour + '[0] * 257 * i/10))\n';
  code += '        led_verde.duty_u16(int(' + colour + '[1] * 257 * i/10))\n';
  code += '        led_azul.duty_u16(int(' + colour + '[2] * 257 * i/10))\n';
  code += '        time.sleep_ms(50)\n';
  code += '    time.sleep_ms(200)\n';
  return code;
};

// Custom LED animation generator
Blockly.Python['bloco_criar_animacao_led'] = function(block) {
  if (!block.steps_ || block.steps_.length === 0) {
    return '';
  }
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = '';
  var i = 0;
  while (i < block.steps_.length) {
    if (block.steps_[i] === 'action') {
      var stepCode = Blockly.Python.statementToCode(block, 'STEP' + i);
      var actionCode = stepCode ? stepCode.replace(/^  /gm, '') : '';
      // Check if the action generates an infinite loop (e.g. bloco_piscar_led)
      // and the next step is a timed wait — if so, convert to time-bounded loop
      var nextIsWait = (i + 1 < block.steps_.length && block.steps_[i + 1] === 'wait');
      var whileTrueMatch = actionCode.match(/^while True:\n([\s\S]*)$/);
      if (whileTrueMatch && nextIsWait) {
        Blockly.Python.definitions_['import_utime'] = 'import utime';
        var timeValue = Blockly.Python.valueToCode(block, 'STEP' + (i + 1), Blockly.Python.ORDER_ATOMIC) || '0';
        code += '_anim_end = utime.ticks_add(utime.ticks_ms(), ' + timeValue + ')\n';
        code += 'while utime.ticks_diff(_anim_end, utime.ticks_ms()) > 0:\n';
        code += whileTrueMatch[1]; // inner body already has correct indentation
        i += 2; // consumed the wait step too
      } else {
        code += actionCode;
        i += 1;
      }
    } else if (block.steps_[i] === 'wait') {
      var timeValue = Blockly.Python.valueToCode(block, 'STEP' + i, Blockly.Python.ORDER_ATOMIC) || '0';
      code += 'time.sleep_ms(' + timeValue + ')\n';
      i += 1;
    } else {
      i += 1;
    }
  }
  return code;
};

/*
*****************************************************************
* MUSICAL NOTES BLOCKS 
* Generators for musical note values.
*****************************************************************
*/

// Do note generator
Blockly.Python['nota_do'] = function(block) {
  return ['C', Blockly.Python.ORDER_ATOMIC];
};

// Re note generator
Blockly.Python['nota_re'] = function(block) {
  return ['D', Blockly.Python.ORDER_ATOMIC];
};

// Mi note generator
Blockly.Python['nota_mi'] = function(block) {
  return ['E', Blockly.Python.ORDER_ATOMIC];
};

// Fa note generator
Blockly.Python['nota_fa'] = function(block) {
  return ['F', Blockly.Python.ORDER_ATOMIC];
};

// Sol note generator
Blockly.Python['nota_sol'] = function(block) {
  return ['G', Blockly.Python.ORDER_ATOMIC];
};

// La note generator
Blockly.Python['nota_la'] = function(block) {
  return ['A', Blockly.Python.ORDER_ATOMIC];
};

// Si note generator
Blockly.Python['nota_si'] = function(block) {
  return ['B', Blockly.Python.ORDER_ATOMIC];
};

/*
*****************************************************************
* TIME BLOCKS 
* Generators for time-related operations.
*****************************************************************
*/

// Seconds to milliseconds converter
Blockly.Python['tempo_segundos'] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 1000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Milliseconds value generator
Blockly.Python['tempo_milisegundos'] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Minutes to milliseconds converter
Blockly.Python['tempo_minutos'] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 60000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Hours to milliseconds converter
Blockly.Python['tempo_horas'] = function(block) {
  var num = block.getFieldValue('NUM');
  var code = String(num * 3600000);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Block that RETURNS uptime in seconds
Blockly.Python['tempo_ligado'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = '(time.ticks_ms() // 1000)';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Block that RETURNS chronometer time in seconds
Blockly.Python['tempo_cronometro'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  // Get chronometer name from block field
  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  // Initialize chronometer variables if not already defined
  Blockly.Python.definitions_['init_' + varName] = varName + '_start = 0\n' + varName + '_paused = 0\n' + varName + '_running = False';

  // Return elapsed time in seconds
  var code = '(time.ticks_diff(time.ticks_ms(), ' + varName + '_start) // 1000 if ' + varName + '_running else ' + varName + '_paused // 1000)';
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

// Wait seconds block
Blockly.Python['esperar_segundos'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

// Wait milliseconds block
Blockly.Python['esperar_milisegundos'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

// Debug: Confirm time generators are loaded
console.log('[BitdogLab] Geradores de tempo carregados:', {
  esperar_segundos: typeof Blockly.Python['esperar_segundos'] !== 'undefined',
  esperar_milisegundos: typeof Blockly.Python['esperar_milisegundos'] !== 'undefined',
  tempo_segundos: typeof Blockly.Python['tempo_segundos'] !== 'undefined',
  tempo_milisegundos: typeof Blockly.Python['tempo_milisegundos'] !== 'undefined',
  tempo_minutos: typeof Blockly.Python['tempo_minutos'] !== 'undefined',
  tempo_horas: typeof Blockly.Python['tempo_horas'] !== 'undefined'
});

// Delay milliseconds block
Blockly.Python['delay_ms'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

// Delay microseconds block
Blockly.Python['delay_us'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_us(' + value_time + ')\n';
  return code;
};

// Get current time in milliseconds
Blockly.Python['ticks_ms'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.ticks_ms()\n';
  return [code, Blockly.Python.ORDER_NONE];
};

// Calculate time difference
Blockly.Python['ticks_diff'] = function(block) {
  var value_start = Blockly.Python.valueToCode(block, 'start', Blockly.Python.ORDER_ATOMIC);
  var value_end = Blockly.Python.valueToCode(block, 'end', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  value_start = value_start.split('\n').join('');
  value_end = value_end.split('\n').join('');
  var code = 'time.ticks_diff(' + value_end + ',' + value_start + ')\n';
  return [code, Blockly.Python.ORDER_NONE];
};

// Delay seconds block
Blockly.Python['delay'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var value_time = block.getFieldValue('TIME');
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

// Delay seconds (alias for compatibility)
Blockly.Python['delay_seconds'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep(' + value_time + ')\n';
  return code;
};

// Delay milliseconds (alias for delay_ms)
Blockly.Python['delay_milliseconds'] = function(block) {
  var value_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep_ms(' + value_time + ')\n';
  return code;
};

/*
*****************************************************************
* LED RGB CONTROL BLOCKS
* Generators for BitdogLab RGB LED control (Pins 11, 12, 13)
*****************************************************************
*/

// LED RGB Turn On - converts RGB tuple to PWM
Blockly.Python['led_turn_on'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';

  // Setup LED pins with PWM
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';

  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';

  var code = 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += 'led_azul.duty_u16(' + colour + '[2] * 257)\n';

  return code;
};

// LED RGB Turn Off - turns off only selected color components
Blockly.Python['led_turn_off'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';

  // Setup LED pins with PWM
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';

  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';

  // Turn off only RGB components that are in selected color
  var code = 'if ' + colour + '[0] > 0:\n';
  code += '  led_vermelho.duty_u16(0)\n';
  code += 'if ' + colour + '[1] > 0:\n';
  code += '  led_verde.duty_u16(0)\n';
  code += 'if ' + colour + '[2] > 0:\n';
  code += '  led_azul.duty_u16(0)\n';

  return code;
};

// LED RGB Turn Off All - turns off all LEDs
Blockly.Python['led_turn_off_all'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';

  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';

  return 'led_vermelho.duty_u16(0)\nled_verde.duty_u16(0)\nled_azul.duty_u16(0)\n';
};

/*
*****************************************************************
* SOUND BLOCKS
* Generators for sound and music operations.
*****************************************************************
*/

// Note frequencies mapping
const NOTE_FREQUENCIES = {
  'C4': 262, 'D4': 294, 'E4': 330, 'F4': 349, 'G4': 392, 'A4': 440, 'B4': 494,
  'C5': 523, 'D5': 587, 'E5': 659, 'F5': 698, 'G5': 784, 'A5': 880, 'B5': 988,
  'C6': 1047, 'D6': 1175, 'E6': 1319, 'F6': 1397, 'G6': 1568, 'A6': 1760, 'B6': 1976
};

// Play musical note
Blockly.Python['tocar_nota'] = function(block) {
  var note = Blockly.Python.valueToCode(block, 'NOTA', Blockly.Python.ORDER_ATOMIC);
  if (!note) {
    return '';
  }
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var octave = block.getFieldValue('OCTAVE');
  var volume = block.getFieldValue('VOLUME');
  var duration = block.getFieldValue('DURATION') || 500;
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  note = note.replace(/['"]/g, '').trim();
  var noteKey = note + octave;
  var frequency = NOTE_FREQUENCIES[noteKey];
  if (!frequency) {
    return '';
  }

  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(0)\n';  // Stop buzzer first (prevent glitches between notes)
  code += 'buzzer.freq(' + frequency + ')\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Update display while playing (if buzzer display is configured)
  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    // Calculate iterations based on duration (100ms per iteration)
    var iterations = Math.max(1, Math.floor(duration / 100));
    code += 'for _i in range(' + iterations + '):\n';
    code += '  try:\n';
    code += '    _buzzer_duty = buzzer.duty_u16()\n';
    code += '    if _buzzer_duty > 0:\n';
    code += '      oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '      oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '      oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '      oled.text(str(buzzer.freq()) + "Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';

    code += 'buzzer.duty_u16(0)\n';

    // Update display one more time to show MUDO after sound stops
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '    pass\n';
  } else {
    // No display configured, just play sound normally
    code += 'time.sleep_ms(' + duration + ')\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Play high pitch sound
Blockly.Python['tocar_som_agudo'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';

  var volume = block.getFieldValue('VOLUME');
  var duration = block.getFieldValue('DURATION') || 500;
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(0)\n';  // Stop first
  code += 'buzzer.freq(1000)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Update display while playing (if buzzer display is configured)
  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    // Calculate iterations based on duration (100ms per iteration)
    var iterations = Math.max(1, Math.floor(duration / 100));
    code += 'for _i in range(' + iterations + '):\n';
    code += '  try:\n';
    code += '    _buzzer_duty = buzzer.duty_u16()\n';
    code += '    if _buzzer_duty > 0:\n';
    code += '      oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '      oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '      oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '      oled.text(str(buzzer.freq()) + "Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';

    code += 'buzzer.duty_u16(0)\n';

    // Update display one more time to show MUDO after sound stops
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '    pass\n';
  } else {
    // No display configured, just play sound normally
    code += 'time.sleep_ms(' + duration + ')\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Stop sound
Blockly.Python['parar_som'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';

  var code = '';
  code += 'buzzer.duty_u16(0)  # silencia o buzzer\n';
  code += '_buzzer_mudo = True  # impede som nas próximas iterações (quando há botões)\n';
  return code;
};

// Play repeatedly
Blockly.Python['tocar_repetidamente'] = function(block) {
  var statements_do = Blockly.Python.statementToCode(block, 'DO');
  if (!statements_do || statements_do.trim() === '') {
    return '';
  }
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var code = '# LOOP_BLOCK_START\n';
  code += 'try:\n';
  code += '    while True:\n';
  var indentedCode = statements_do.replace(/^/gm, '  ');
  code += indentedCode;
  if (!indentedCode.endsWith('\n')) {
    code += '\n';
  }
  code += 'finally:\n';
  code += '    buzzer.duty_u16(0)  # Turn off buzzer when stopping\n';
  code += '# LOOP_BLOCK_END\n';
  return code;
};

// Short beep sound
Blockly.Python['bipe_curto'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(0)\n';
  code += 'time.sleep_ms(50)\n';
  code += 'buzzer.freq(1500)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Update display during playback (if buzzer display is configured)
  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    code += 'for _i in range(1):\n';
    code += '  try:\n';
    code += '    _buzzer_duty = buzzer.duty_u16()\n';
    code += '    if _buzzer_duty > 0:\n';
    code += '      oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '      oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '      oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '      oled.text(str(buzzer.freq()) + "Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';

    code += 'buzzer.duty_u16(0)\n';

    // Update display one more time to show MUDO after sound stops
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '    pass\n';
  } else {
    // No display configured, just play sound normally
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Double beep sound
Blockly.Python['bipe_duplo'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {

    // First beep
    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.freq(1500)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("1500Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';

    // Pause between beeps
    code += 'time.sleep_ms(50)\n';

    // Second beep
    code += 'buzzer.freq(1500)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("1500Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';

    // Show MUDO after sound stops
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    // No display configured
    code += 'buzzer.freq(1500)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Intermittent alert sound
Blockly.Python['alerta_intermitente'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.freq(2000)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'for _i in range(2):\n';  // Update twice during 200ms
    code += '  try:\n';
    code += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '    oled.text("2000Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
    code += 'time.sleep_ms(800)\n';
  } else {
    code += 'buzzer.freq(2000)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(200)\n';
    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(800)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Call sound
Blockly.Python['chamada'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [440, 523];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(150)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.freq(440)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(150)\n';
    code += 'buzzer.freq(523)\n';
    code += 'time.sleep_ms(150)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Coin sound
Blockly.Python['som_de_moeda'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    // First tone
    code += 'buzzer.freq(494)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("494Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
    code += 'time.sleep_ms(100)\n';

    // Second tone
    code += 'buzzer.freq(659)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("659Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
    code += 'time.sleep_ms(150)\n';

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.freq(494)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.freq(659)\n';
    code += 'time.sleep_ms(150)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Success sound
Blockly.Python['som_de_sucesso'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [392, 440, 494, 523];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    // Play each note with display update
    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(100)\n';
    }

    code += 'buzzer.duty_u16(0)\n';

    // Show MUDO after sound stops
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    // No display configured
    code += 'buzzer.freq(392)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.freq(440)\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.freq(494)\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.freq(523)\n';
    code += 'time.sleep_ms(100)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Failure sound
Blockly.Python['som_de_falha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [392, 370, 349];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(200)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.freq(392)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(200)\n';
    code += 'buzzer.freq(370)\n';
    code += 'time.sleep_ms(200)\n';
    code += 'buzzer.freq(349)\n';
    code += 'time.sleep_ms(200)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Laser sound
Blockly.Python['som_de_laser'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [2000, 1000, 500];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(50)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.freq(2000)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.freq(1000)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.freq(500)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Police siren sound
Blockly.Python['sirene_policial'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    // First siren tone
    code += 'buzzer.freq(698)\n';
    code += 'for _i in range(4):\n';
    code += '  try:\n';
    code += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '    oled.text("698Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';

    // Second siren tone
    code += 'buzzer.freq(587)\n';
    code += 'for _i in range(4):\n';
    code += '  try:\n';
    code += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '    oled.text("587Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '    oled.show()\n';
    code += '  except:\n';
    code += '    pass\n';
    code += '  time.sleep_ms(100)\n';

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.freq(698)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(587)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Musical scale up
Blockly.Python['escala_musical_sobe'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [262, 294, 330, 349, 392, 440, 494, 523];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(150)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'buzzer.freq(262)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(294)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(330)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(349)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(392)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(440)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(494)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(523)\ntime.sleep_ms(150)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Musical scale down
Blockly.Python['escala_musical_desce'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var frequencies = [523, 494, 440, 392, 349, 330, 294, 262];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < frequencies.length; i++) {
      code += 'buzzer.freq(' + frequencies[i] + ')\n';
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequencies[i] + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
      code += 'time.sleep_ms(150)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'buzzer.freq(523)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(494)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(440)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(392)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(349)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(330)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(294)\ntime.sleep_ms(150)\n';
    code += 'buzzer.freq(262)\ntime.sleep_ms(150)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Twinkle twinkle little star melody
Blockly.Python['brilha_brilha_estrelinha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  var cfg = _getBuzzerDisplayConfig();
  if (cfg) {
    var notes = [
      {freq: 392, duration: 400},
      {freq: 392, duration: 400},
      {freq: 294, duration: 400},
      {freq: 294, duration: 400},
      {freq: 330, duration: 400},
      {freq: 330, duration: 400},
      {freq: 294, duration: 800},
      {freq: 262, duration: 400},
      {freq: 262, duration: 400},
      {freq: 494, duration: 400},
      {freq: 494, duration: 400},
      {freq: 440, duration: 400},
      {freq: 440, duration: 400},
      {freq: 392, duration: 800}
    ];

    code += 'buzzer.duty_u16(0)\n';
    code += 'time.sleep_ms(50)\n';
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      code += 'buzzer.freq(' + note.freq + ')\n';

      // Update display multiple times during longer notes
      var updates = Math.ceil(note.duration / 100);
      code += 'for _i in range(' + updates + '):\n';
      code += '  try:\n';
      code += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '    oled.text("' + note.freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '    oled.show()\n';
      code += '  except:\n';
      code += '    pass\n';
      code += '  time.sleep_ms(100)\n';
    }

    code += 'buzzer.duty_u16(0)\n';
    code += 'try:\n';
    code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
    code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
    if (cfg.showFreq) {
      code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
      code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
    }
    code += '  oled.show()\n';
    code += 'except:\n';
    code += '  pass\n';
  } else {
    code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
    code += 'buzzer.freq(392)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(392)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(294)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(294)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(330)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(330)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(294)\n';
    code += 'time.sleep_ms(800)\n';
    code += 'buzzer.freq(262)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(262)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(494)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(494)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(440)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(440)\n';
    code += 'time.sleep_ms(400)\n';
    code += 'buzzer.freq(392)\n';
    code += 'time.sleep_ms(800)\n';
    code += 'buzzer.duty_u16(0)\n';
  }

  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Jingle Bells
Blockly.Python['natal_jingle_bells'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Helper function to play note with display update
  var playNote = function(freq, duration) {
    var noteCode = 'buzzer.freq(' + freq + ')\n';
    if (hasDisplay) {
      var cfg = hasDisplay;
      var iterations = Math.max(1, Math.floor(duration / 100));
      noteCode += 'for _i in range(' + iterations + '):\n';
      noteCode += '  try:\n';
      noteCode += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      noteCode += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        noteCode += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        noteCode += '    oled.text("' + freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      noteCode += '    oled.show()\n';
      noteCode += '  except:\n';
      noteCode += '    pass\n';
      noteCode += '  time.sleep_ms(100)\n';
    } else {
      noteCode += 'time.sleep_ms(' + duration + ')\n';
    }
    return noteCode;
  };

  // E E E (Jingle bells)
  code += playNote(659, 200);
  code += playNote(659, 200);
  code += playNote(659, 400);
  // E E E (Jingle bells)
  code += playNote(659, 200);
  code += playNote(659, 200);
  code += playNote(659, 400);
  // E G C D E (Jingle all the way)
  code += playNote(659, 200);
  code += playNote(784, 200);
  code += playNote(523, 300);
  code += playNote(587, 100);
  code += playNote(659, 800);

  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Silent Night (Noite Feliz)
Blockly.Python['natal_noite_feliz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Helper function to play note with display update
  var playNote = function(freq, duration) {
    var noteCode = 'buzzer.freq(' + freq + ')\n';
    if (hasDisplay) {
      var cfg = hasDisplay;
      var iterations = Math.max(1, Math.floor(duration / 100));
      noteCode += 'for _i in range(' + iterations + '):\n';
      noteCode += '  try:\n';
      noteCode += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      noteCode += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        noteCode += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        noteCode += '    oled.text("' + freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      noteCode += '    oled.show()\n';
      noteCode += '  except:\n';
      noteCode += '    pass\n';
      noteCode += '  time.sleep_ms(100)\n';
    } else {
      noteCode += 'time.sleep_ms(' + duration + ')\n';
    }
    return noteCode;
  };

  // G A G E (Noite feliz)
  code += playNote(392, 400);
  code += playNote(440, 200);
  code += playNote(392, 600);
  code += playNote(330, 800);
  // G A G E (Noite feliz)
  code += playNote(392, 400);
  code += playNote(440, 200);
  code += playNote(392, 600);
  code += playNote(330, 800);
  // D D B (Ó Senhor)
  code += playNote(587, 600);
  code += playNote(587, 200);
  code += playNote(494, 800);
  // C C G (de amor)
  code += playNote(523, 600);
  code += playNote(523, 200);
  code += playNote(392, 800);

  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Deck the Halls (Bate o Sino)
Blockly.Python['natal_bate_sino'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Helper function to play note with display update
  var playNote = function(freq, duration) {
    var noteCode = 'buzzer.freq(' + freq + ')\n';
    if (hasDisplay) {
      var cfg = hasDisplay;
      var iterations = Math.max(1, Math.floor(duration / 100));
      noteCode += 'for _i in range(' + iterations + '):\n';
      noteCode += '  try:\n';
      noteCode += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      noteCode += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        noteCode += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        noteCode += '    oled.text("' + freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      noteCode += '    oled.show()\n';
      noteCode += '  except:\n';
      noteCode += '    pass\n';
      noteCode += '  time.sleep_ms(100)\n';
    } else {
      noteCode += 'time.sleep_ms(' + duration + ')\n';
    }
    return noteCode;
  };

  // D C B A G A B G (Deck the halls with boughs of holly)
  code += playNote(587, 200);
  code += playNote(523, 200);
  code += playNote(494, 200);
  code += playNote(440, 200);
  code += playNote(392, 300);
  code += playNote(440, 100);
  code += playNote(494, 400);
  code += playNote(392, 400);
  // A B C A B (Fa la la la la)
  code += playNote(440, 200);
  code += playNote(494, 200);
  code += playNote(523, 200);
  code += playNote(440, 200);
  code += playNote(494, 600);

  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: We Wish You a Merry Christmas (Noel)
Blockly.Python['natal_noel'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Helper function to play note with display update
  var playNote = function(freq, duration) {
    var noteCode = 'buzzer.freq(' + freq + ')\n';
    if (hasDisplay) {
      var cfg = hasDisplay;
      var iterations = Math.max(1, Math.floor(duration / 100));
      noteCode += 'for _i in range(' + iterations + '):\n';
      noteCode += '  try:\n';
      noteCode += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      noteCode += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        noteCode += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        noteCode += '    oled.text("' + freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      noteCode += '    oled.show()\n';
      noteCode += '  except:\n';
      noteCode += '    pass\n';
      noteCode += '  time.sleep_ms(100)\n';
    } else {
      noteCode += 'time.sleep_ms(' + duration + ')\n';
    }
    return noteCode;
  };

  // C F F G F E D (We wish you a merry)
  code += playNote(262, 200);
  code += playNote(349, 200);
  code += playNote(349, 200);
  code += playNote(392, 200);
  code += playNote(349, 200);
  code += playNote(330, 200);
  code += playNote(294, 400);
  // C C G G A G F E C (Christmas and a happy new year)
  code += playNote(262, 200);
  code += playNote(262, 200);
  code += playNote(392, 200);
  code += playNote(392, 200);
  code += playNote(440, 200);
  code += playNote(392, 200);
  code += playNote(349, 200);
  code += playNote(330, 200);
  code += playNote(262, 600);

  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Adeste Fideles (Ó Vinde)
Blockly.Python['natal_o_vinde'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';

  // Helper function to play note with display update
  var playNote = function(freq, duration) {
    var noteCode = 'buzzer.freq(' + freq + ')\n';
    if (hasDisplay) {
      var cfg = hasDisplay;
      var iterations = Math.max(1, Math.floor(duration / 100));
      noteCode += 'for _i in range(' + iterations + '):\n';
      noteCode += '  try:\n';
      noteCode += '    oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      noteCode += '    oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        noteCode += '    oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        noteCode += '    oled.text("' + freq + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      noteCode += '    oled.show()\n';
      noteCode += '  except:\n';
      noteCode += '    pass\n';
      noteCode += '  time.sleep_ms(100)\n';
    } else {
      noteCode += 'time.sleep_ms(' + duration + ')\n';
    }
    return noteCode;
  };

  // G G D C B A G (Adeste fideles)
  code += playNote(392, 400);
  code += playNote(392, 400);
  code += playNote(587, 400);
  code += playNote(523, 200);
  code += playNote(494, 200);
  code += playNote(440, 400);
  code += playNote(392, 600);
  // D E D C D (Laeti triumphantes)
  code += playNote(587, 400);
  code += playNote(659, 200);
  code += playNote(587, 200);
  code += playNote(523, 200);
  code += playNote(587, 800);

  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// ==========================================
// DISPLAY BLOCKS
// ==========================================

// Display Christmas message
Blockly.Python['display_natal'] = function(block) {
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

// Display create border
Blockly.Python['display_criar_borda'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.rect(0, 0, ' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

// Display clear border
Blockly.Python['display_limpar_borda'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.rect(0, 0, ' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', 0)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

// Display update container
Blockly.Python['display_atualizar'] = function(block) {
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

// Display test connection
Blockly.Python['display_testar_conexao'] = function(block) {
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

// Display show (container - does NOT clear display)
// Simple display show - just calls oled.show()
Blockly.Python['display_show'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  return 'oled.show()\n';
};

Blockly.Python['display_mostrar'] = function(block) {
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

// Display text
Blockly.Python['display_texto'] = function(block) {
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

// Display blink text generator (animation with automatic show() calls)
Blockly.Python['display_piscar_texto'] = function(block) {
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

// Display calculation result
Blockly.Python['display_mostrar_calculo'] = function(block) {
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

// Display value - generic version to show any numeric value
Blockly.Python['display_mostrar_valor'] = function(block) {
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
  } else if (alinhamento === 'CENTER') {
    code += '_display_x = max(3, (128 - len(_display_value) * 8) // 2)\n';
  } else { // RIGHT
    code += '_display_x = max(3, 125 - len(_display_value) * 8)\n';
  }

  // Mostrar o valor no display
  code += 'oled.text(_display_value, _display_x, ' + y + ', 1)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"

  return code;
};

// Display LED state generator
Blockly.Python['display_mostrar_estado_led'] = function(block) {
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

// Display clear generator
Blockly.Python['display_limpar'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var code = 'oled.fill(0)\n';
  // NÃO chama oled.show() - o usuário deve usar o bloco "Atualizar Display"
  return code;
};

// Display button state generator
Blockly.Python['display_mostrar_estado_botao'] = function(block) {
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

// Display buzzer status generator
Blockly.Python['display_mostrar_status_buzzer'] = function(block) {
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

// Display matrix dashboard generator
Blockly.Python['display_dashboard_matriz'] = function(block) {
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

// ========== GERADORES DE TEMPO E RELÓGIO ==========

Blockly.Python['display_mostrar_tempo_ligado'] = function(block) {
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

Blockly.Python['cronometro_iniciar'] = function(block) {
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

Blockly.Python['cronometro_parar'] = function(block) {
  var name = block.getFieldValue('NAME');
  var varName = '_crono_' + name.replace(/[^a-zA-Z0-9]/g, '_');

  var code = '';
  code += 'if ' + varName + '_running:\n';
  code += '  ' + varName + '_paused = time.ticks_diff(time.ticks_ms(), ' + varName + '_start)\n';
  code += '  ' + varName + '_running = False\n';

  return code;
};

Blockly.Python['cronometro_reiniciar'] = function(block) {
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

Blockly.Python['cronometro_mostrar'] = function(block) {
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

// Display reset button counter generator
Blockly.Python['display_resetar_contagem'] = function(block) {
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

// Create melody
Blockly.Python['criar_melodia'] = function(block) {
  if (!block.noteSteps_ || block.noteSteps_ === 0) {
    return '';
  }
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';
  var code = '# SOUND_BLOCK_START\n';

  // Check if buzzer display is configured
  var hasDisplay = _getBuzzerDisplayConfig();
  if (hasDisplay) {
    Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
    Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
    Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';
  }

  for (var i = 0; i < block.noteSteps_; i++) {
    var note = Blockly.Python.valueToCode(block, 'NOTA' + i, Blockly.Python.ORDER_ATOMIC);
    var tempo = Blockly.Python.valueToCode(block, 'TEMPO' + i, Blockly.Python.ORDER_ATOMIC);
    if (!note || !tempo) {
      continue;
    }
    note = note.replace(/['"]/g, '');
    var noteKey = note + '4';
    var frequency = NOTE_FREQUENCIES[noteKey];
    if (!frequency) {
      frequency = 440;
    }
    code += '# Note: ' + note + '\n';
    code += 'buzzer.freq(' + frequency + ')\n';
    code += 'buzzer.duty_u16(32768)\n';

    // Update display if configured
    if (hasDisplay) {
      var cfg = hasDisplay;
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: TOCANDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("' + frequency + 'Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
    }

    code += 'time.sleep_ms(' + tempo + ')\n';
    code += 'buzzer.duty_u16(0)\n';

    // Update display to show MUDO between notes
    if (hasDisplay && i < block.noteSteps_ - 1) {
      var cfg = hasDisplay;
      code += 'try:\n';
      code += '  oled.fill_rect(0, ' + cfg.line + ', 128, 8, 0)\n';
      code += '  oled.text("Som: MUDO", 3, ' + cfg.line + ', 1)\n';
      if (cfg.showFreq) {
        code += '  oled.fill_rect(0, ' + cfg.freqLine + ', 128, 8, 0)\n';
        code += '  oled.text("0Hz", 3, ' + cfg.freqLine + ', 1)\n';
      }
      code += '  oled.show()\n';
      code += 'except:\n';
      code += '  pass\n';
    }

    if (i < block.noteSteps_ - 1) {
      code += 'time.sleep_ms(50)\n';
    }
  }
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Create soundtrack
Blockly.Python['criar_trilha_sonora'] = function(block) {
  if (!block.steps_ || block.steps_.length === 0) {
    return '';
  }
  var code = '';
  for (var i = 0; i < block.steps_.length; i++) {
    if (block.steps_[i] === 'action') {
      var stepCode = Blockly.Python.statementToCode(block, 'STEP' + i);
      if (stepCode) {
        code += stepCode.replace(/^  /gm, '');
      }
    } else {
      var tempo = Blockly.Python.valueToCode(block, 'STEP' + i, Blockly.Python.ORDER_ATOMIC);
      if (tempo) {
        Blockly.Python.definitions_['import_time'] = 'import time';
        code += '# SOUND_BLOCK_START\n';
        code += 'time.sleep_ms(' + tempo + ')\n';
        code += '# SOUND_BLOCK_END\n';
      }
    }
  }
  return code;
};

/*
*****************************************************************
* PWM BLOCKS 
* Generators for PWM (Pulse Width Modulation) operations.
*****************************************************************
*/

// PWM setup
Blockly.Python['pwm'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_ATOMIC);
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.check([value_frequency, value_duty], value_pin);
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\npwm${value_pin}.freq(${value_frequency})\npwm${value_pin}.duty(${value_duty})\n`;
  return code;
};

// PWM setup for Pico
Blockly.Python['pwm_pico'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_ATOMIC);
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.check([value_frequency, value_duty], value_pin);
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\npwm${value_pin}.freq(${value_frequency})\npwm${value_pin}.duty_u16(${value_duty})\n`;
  return code;
};

// PWM initialization
Blockly.Python['pwm.init'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  this.setID(value_pin)
  var code = `pwm${value_pin} = PWM(Pin(${value_pin}))\n`;
  return code;
};

// PWM frequency setting
Blockly.Python['pwm.freq'] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.freq(${value_frequency})\n`;
  this.check(value_frequency, number_id);
  return code;
};

// PWM duty cycle setting
Blockly.Python['pwm.duty'] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.duty(${value_duty})\n`;
  this.check(value_duty, number_id);
  return code;
};

// PWM duty cycle setting for Pico
Blockly.Python['pwm.duty_pico'] = function(block) {
  var number_id = block.getFieldValue('ID');
  var value_duty = Blockly.Python.valueToCode(block, 'duty', Blockly.Python.ORDER_NONE);
  var code = `pwm${number_id}.duty_u16(${value_duty})\n`;
  this.check(value_duty, number_id);
  return code;
};

// PWM deinitialization
Blockly.Python['pwm.deinit'] = function(block) {
  var number_id = block.getFieldValue('ID');
  var code = `pwm${number_id}.deinit()\n`;
  return code;
};

// Play RTTTL song
Blockly.Python["rtttl_play"] = function(block) {
  var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
  var song = Blockly.Python.valueToCode(block, 'song', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_rtttl'] = 'import rtttl, songs';
  var code = 'play = rtttl.play(Pin(' + pin + ', Pin.OUT), songs.find(' + song + ')) \n';
  return code;
};

// Tone generator
Blockly.Python['tone'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
  var value_frequency = Blockly.Python.valueToCode(block, 'frequency', Blockly.Python.ORDER_ATOMIC);
  var d = Blockly.Python.valueToCode(block, 'duration', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  var x = value_pin.replace('(', '').replace(')', '');
  var code = 'pwm' + x + ' = PWM(Pin(' + x + '), freq=' + value_frequency + ', ' + ' duty=512)\n';
  var d1 = parseFloat(d);
  if (d1 == 0)
    code += '';
  else
    code += 'time.sleep(' + d + ')\npwm' + x + '.deinit()\n';
  return code;
};

// Note generator
Blockly.Python['note'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
  var value_frequency = Blockly.Python.valueToCode(block, 'note', Blockly.Python.ORDER_ATOMIC);
  var d = Blockly.Python.valueToCode(block, 'duration', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  var x = value_pin.replace('(', '').replace(')', '');
  var code = 'pwm' + x + ' = PWM(Pin(' + x + '), freq=' + value_frequency + ', ' + ' duty=512)\n';
  var d1 = parseFloat(d);
  if (d1 == 0)
    code += '';
  else
    code += 'time.sleep(' + d + ')\npwm' + x + '.deinit()\n';
  return code;
};

// Tone type selector
Blockly.Python['tone_type'] = function(block) {
  var dropdown_tone = block.getFieldValue('tone');
  var code = dropdown_tone;
  return [code, Blockly.Python.ORDER_NONE]; // Fixed: was Blockly.JavaScript.ORDER_NONE
};

/*
*****************************************************************
* TIMER BLOCKS 
* Generators for timer operations.
*****************************************************************
*/

// Stop timer
Blockly.Python['stop_timer'] = function(block) {
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  var tn = Blockly.Python.valueToCode(block, 'timerNumber', Blockly.Python.ORDER_ATOMIC);
  var code = 'tim' + tn + '.deinit()\n';
  return code;
};

// Timer setup
Blockly.Python['timer'] = function(block) {
  var interval = block.getFieldValue('interval');
  var timerNumber = block.getFieldValue('timerNumber');
  var statements_name = Blockly.Python.statementToCode(block, 'statements');
  var dropdown_mode = block.getFieldValue('MODE');
  var globals = [];
  var workspace = block.workspace;
  var variables = Blockly.Variables.allUsedVarModels(workspace) || [];
  for (var i = 0, variable; (variable = variables[i]); i++) {
    var varName = variable.name;
    if (block.getVars().indexOf(varName) == -1) {
      globals.push(Blockly.Python.nameDB_.getName(varName, Blockly.VARIABLE_CATEGORY_NAME));
    }
  }
  globals = globals.length ? Blockly.Python.INDENT + 'global ' + globals.join(', ') + '\n' : '';
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  Blockly.Python.definitions_[`import_timer_start${timerNumber}`] = `tim${timerNumber} = Timer(${timerNumber})`;
  Blockly.Python.definitions_[`import_timer_callback${timerNumber}`] = `\n#Timer Function Callback\ndef timerFunc${timerNumber}(t):\n${globals}${statements_name}\n\n`;
  var code = `tim${timerNumber}.init(period=${interval}, mode=Timer.${dropdown_mode}, callback=timerFunc${timerNumber})\n`;
  return code
};

// Pico timer setup
Blockly.Python['pico_timer'] = function(block) {
  var interval = block.getFieldValue('interval');
  var timerNumber = block.getFieldValue('timerNumber');
  var statements_name = Blockly.Python.statementToCode(block, 'statements');
  Blockly.Python.definitions_['import_timer'] = 'from machine import Timer';
  Blockly.Python.definitions_['import_timer_start'] = 'tim=Timer()';
  Blockly.Python.definitions_['import_timer_callback'] = '\n#Timer Function Callback\ndef timerFunc(t):\n' + statements_name + '\n\n';
  var code = 'tim.init(period=' + interval + ', mode=Timer.PERIODIC, callback=timerFunc)\n';
  return code;
};


/*
*****************************************************************
* MATH BLOCKS 
* Generators for mathematical operations.
*****************************************************************
*/

// Minimum value
Blockly.Python['math_min'] = function(block) {
  var value1 = Blockly.Python.valueToCode(block, 'VALUE1', Blockly.Python.ORDER_ATOMIC);
  var value2 = Blockly.Python.valueToCode(block, 'VALUE2', Blockly.Python.ORDER_ATOMIC);
  var code = 'min(' + value1 + ', ' + value2 + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Maximum value
Blockly.Python['math_max'] = function(block) {
  var value1 = Blockly.Python.valueToCode(block, 'VALUE1', Blockly.Python.ORDER_ATOMIC);
  var value2 = Blockly.Python.valueToCode(block, 'VALUE2', Blockly.Python.ORDER_ATOMIC);
  var code = 'max(' + value1 + ', ' + value2 + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Number property check
Blockly.Python['math_number_property'] = function(block) {
  var number = Blockly.Python.valueToCode(block, 'NUMBER_TO_CHECK', Blockly.Python.ORDER_ATOMIC);
  var property = block.getFieldValue('PROPERTY');
  var code;
  switch (property) {
    case 'EVEN':
      code = number + ' % 2 == 0';
      break;
    case 'ODD':
      code = number + ' % 2 == 1';
      break;
    case 'POSITIVE':
      code = number + ' > 0';
      break;
    case 'NEGATIVE':
      code = number + ' < 0';
      break;
    default:
      throw Error('Unknown property: ' + property);
  }
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

// Divisibility check
Blockly.Python['math_is_divisible_by'] = function(block) {
  var dividend = Blockly.Python.valueToCode(block, 'DIVIDEND', Blockly.Python.ORDER_ATOMIC);
  var divisor = Blockly.Python.valueToCode(block, 'DIVISOR', Blockly.Python.ORDER_ATOMIC);
  var code = dividend + ' % ' + divisor + ' == 0';
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

// Round to decimal places
Blockly.Python['math_round_to_decimal'] = function(block) {
  var number_to_round = Blockly.Python.valueToCode(block, 'NUMBER_TO_ROUND', Blockly.Python.ORDER_ATOMIC) || '0';
  var decimal_places = block.getFieldValue('DECIMAL_PLACES');
  var code = 'round(' + number_to_round + ', ' + decimal_places + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Math operation on list
Blockly.Python['math_on_list'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_NONE) || '[]';
  var operation = block.getFieldValue('OP');
  var code;
  switch (operation) {
    case 'SUM':
      code = 'sum(' + list + ')';
      break;
    case 'MIN':
      code = 'min(' + list + ')';
      break;
    case 'MAX':
      code = 'max(' + list + ')';
      break;
    case 'AVERAGE':
      Blockly.Python.definitions_['import_statistics'] = 'import statistics';
      code = 'statistics.mean(' + list + ')';
      break;
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      code = 'random.choice(' + list + ')';
      break;
    default:
      throw Error('Unknown operation: ' + operation);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Arithmetic operations (+, -, *, /, ^)
Blockly.Python['math_arithmetic'] = function(block) {
  var OPERATORS = {
    'ADD': [' + ', Blockly.Python.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.Python.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'POWER': [' ** ', Blockly.Python.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

// Math single operations (sqrt, abs, ln, etc)
Blockly.Python['math_single'] = function(block) {
  var operator = block.getFieldValue('OP');
  var code;
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';

  switch (operator) {
    case 'ROOT':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.sqrt(' + arg + ')';
      break;
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'LN':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.log(' + arg + ')';
      break;
    case 'LOG10':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.log10(' + arg + ')';
      break;
    case 'EXP':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = '10 ** ' + arg;
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Trigonometric functions
Blockly.Python['math_trig'] = function(block) {
  var operator = block.getFieldValue('OP');
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';
  Blockly.Python.definitions_['import_math'] = 'import math';

  var code;
  switch (operator) {
    case 'SIN':
      code = 'math.sin(' + arg + ')';
      break;
    case 'COS':
      code = 'math.cos(' + arg + ')';
      break;
    case 'TAN':
      code = 'math.tan(' + arg + ')';
      break;
    case 'ASIN':
      code = 'math.asin(' + arg + ')';
      break;
    case 'ACOS':
      code = 'math.acos(' + arg + ')';
      break;
    case 'ATAN':
      code = 'math.atan(' + arg + ')';
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Math constants
Blockly.Python['math_constant'] = function(block) {
  var constant = block.getFieldValue('CONSTANT');
  Blockly.Python.definitions_['import_math'] = 'import math';

  var code;
  switch (constant) {
    case 'PI':
      code = 'math.pi';
      break;
    case 'E':
      code = 'math.e';
      break;
    case 'GOLDEN_RATIO':
      code = '1.618033988749895';
      break;
    case 'SQRT2':
      code = 'math.sqrt(2)';
      break;
    case 'SQRT1_2':
      code = 'math.sqrt(0.5)';
      break;
    case 'INFINITY':
      code = 'float("inf")';
      break;
    default:
      throw Error('Unknown constant: ' + constant);
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Math round
Blockly.Python['math_round'] = function(block) {
  var operator = block.getFieldValue('OP');
  var arg = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';

  var code;
  switch (operator) {
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      Blockly.Python.definitions_['import_math'] = 'import math';
      code = 'math.floor(' + arg + ')';
      break;
    default:
      throw Error('Unknown operator: ' + operator);
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Math modulo (remainder)
Blockly.Python['math_modulo'] = function(block) {
  var dividend = Blockly.Python.valueToCode(block, 'DIVIDEND', Blockly.Python.ORDER_MULTIPLICATIVE) || '0';
  var divisor = Blockly.Python.valueToCode(block, 'DIVISOR', Blockly.Python.ORDER_MULTIPLICATIVE) || '0';
  var code = dividend + ' % ' + divisor;
  return [code, Blockly.Python.ORDER_MULTIPLICATIVE];
};

// Math constrain (limit between min and max)
Blockly.Python['math_constrain'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
  var low = Blockly.Python.valueToCode(block, 'LOW', Blockly.Python.ORDER_NONE) || '0';
  var high = Blockly.Python.valueToCode(block, 'HIGH', Blockly.Python.ORDER_NONE) || '0';
  var code = 'min(max(' + value + ', ' + low + '), ' + high + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Random integer
Blockly.Python['math_random_int'] = function(block) {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_NONE) || '0';
  var code = 'random.randint(' + from + ', ' + to + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Random float
Blockly.Python['math_random_float'] = function(block) {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_NONE) || '0';
  var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_NONE) || '1';
  var code = 'random.uniform(' + from + ', ' + to + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

// Print/Show value - prints the result to console
Blockly.Python['math_print_value'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
  var code = 'print(' + value + ')\n';
  return code;
};

/*
*****************************************************************
* LOGIC BLOCKS 
* Generators for logical operations.
*****************************************************************
*/

// Comparison operation
Blockly.Python['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  // Em Python, todas as comparações têm a mesma precedência
  // Usar ORDER_RELATIONAL para todas evita problemas de precedência
  var order = Blockly.Python.ORDER_RELATIONAL;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// Boolean value
Blockly.Python['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Logical operation
Blockly.Python['logic_operation'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Python.ORDER_LOGICAL_AND : Blockly.Python.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order);
  var argument1 = Blockly.Python.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    argument0 = '"False"';
    argument1 = '"False"';
  } else {
    argument0 = argument0 || 'False';
    argument1 = argument1 || 'False';
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

// Logical negation
Blockly.Python['logic_negate'] = function(block) {
  var argument0 = Blockly.Python.valueToCode(block, 'BOOL', Blockly.Python.ORDER_LOGICAL_NOT) || 'False';
  var code = 'not ' + argument0;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

// If block - estrutura "Se"
Blockly.Python['controls_if'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'IF0', Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'DO0');
  branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
  var code = 'if ' + condition + ':\n' + branch;
  return code;
};

// If/Else block - estrutura "Se/Senão"
Blockly.Python['controls_ifelse'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'IF0', Blockly.Python.ORDER_NONE) || 'False';
  var branchIf = Blockly.Python.statementToCode(block, 'DO0');
  branchIf = Blockly.Python.addLoopTrap(branchIf, block) || Blockly.Python.PASS;
  var branchElse = Blockly.Python.statementToCode(block, 'ELSE');
  branchElse = Blockly.Python.addLoopTrap(branchElse, block) || Blockly.Python.PASS;
  var code = 'if ' + condition + ':\n' + branchIf + 'else:\n' + branchElse;
  return code;
};

/*
*****************************************************************
* LIST BLOCKS
* Generators for list operations.
*****************************************************************
*/

// Get item from list
Blockly.Python['list_get_item_simple'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  switch (where) {
    case 'FIRST':
      return [list + '[0]', Blockly.Python.ORDER_MEMBER];
    case 'LAST':
      return [list + '[-1]', Blockly.Python.ORDER_MEMBER];
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return [list + '[' + at + '-1]', Blockly.Python.ORDER_MEMBER];
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      return ['random.choice(' + list + ')', Blockly.Python.ORDER_FUNCTION_CALL];
  }
};

// Remove item from list
Blockly.Python['list_remove_item_simple'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  switch (where) {
    case 'FIRST':
      return list + '.pop(0)\n';
    case 'LAST':
      return list + '.pop()\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '.pop(' + at + '-1)\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      return list + '.pop(random.randint(0, len(' + list + ')-1))\n';
  }
};

// Replace item in list
Blockly.Python['list_replace_item'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  switch (where) {
    case 'FIRST':
      return list + '[0] = ' + value + '\n';
    case 'LAST':
      return list + '[-1] = ' + value + '\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '[' + at + '-1] = ' + value + '\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      var randomVar = Blockly.Python.nameDB_.getDistinctName('random_index', Blockly.VARIABLE_CATEGORY_NAME);
      return randomVar + ' = random.randint(0, len(' + list + ')-1)\n' + list + '[' + randomVar + '] = ' + value + '\n';
  }
};

// Insert item in list
Blockly.Python['list_insert_item'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where = block.getFieldValue('WHERE');
  var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
  switch (where) {
    case 'FIRST':
      return list + '.insert(0, ' + value + ')\n';
    case 'LAST':
      return list + '.append(' + value + ')\n';
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_ADDITIVE) || '1';
      return list + '.insert(' + at + '-1, ' + value + ')\n';
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      var randomVar = Blockly.Python.nameDB_.getDistinctName('random_index', Blockly.VARIABLE_CATEGORY_NAME);
      return randomVar + ' = random.randint(0, len(' + list + '))\n' + list + '.insert(' + randomVar + ', ' + value + ')\n';
  }
};

// Get sublist
Blockly.Python['lists_getSublist'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER) || '[]';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var start_index, end_index;
  switch (where1) {
    case 'FIRST':
      start_index = '';
      break;
    case 'FROM_START':
      var at1 = Blockly.Python.valueToCode(block, 'AT1', Blockly.Python.ORDER_ADDITIVE) || '1';
      start_index = Blockly.Python.getAdjustedInt(block, 'AT1');
      if (start_index === '0') {
        start_index = '';
      }
      break;
    default:
      throw Error("Unhandled start option (lists_getSublist): " + where1);
  }
  switch (where2) {
    case 'LAST':
      end_index = '';
      break;
    case 'FROM_START':
      var at2 = Blockly.Python.valueToCode(block, 'AT2', Blockly.Python.ORDER_ADDITIVE) || '1';
      end_index = at2;
      break;
    default:
      throw Error("Unhandled end option (lists_getSublist): " + where2);
  }
  var slice_notation = start_index + ':' + end_index;
  return [list + '[' + slice_notation + ']', Blockly.Python.ORDER_MEMBER];
};

// Split text
Blockly.Python['text_split_simple'] = function(block) {
  var text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_NONE) || '""';
  var separator = Blockly.Python.valueToCode(block, 'SEPARATOR', Blockly.Python.ORDER_NONE) || '","';
  return [text + '.split(' + separator + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Sort list
Blockly.Python['lists_sort'] = function(block) {
  var list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_NONE) || '[]';
  var sortType = block.getFieldValue('TYPE');
  var direction = block.getFieldValue('DIRECTION');
  var reverse = (direction === 'DESC') ? 'True' : 'False';
  return [Blockly.Python.provideFunction_('organizar_lista', [
    'def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(lista, tipo, reverso):',
    '    def processar_numero(item):',
    '        try:',
    '            return float(item)',
    '        except:',
    '            return 0',
    '    ',
    '    def processar_texto(item):',
    '        return str(item)',
    '    ',
    '    def processar_texto_ignorar_maiusculas(item):',
    '        return str(item).lower()',
    '    ',
    '    processadores = {',
    '        "NUMERIC": processar_numero,',
    '        "TEXT": processar_texto,',
    '        "IGNORE_CASE": processar_texto_ignorar_maiusculas',
    '    }',
    '    ',
    '    processar = processadores[tipo]',
    '    lista_copia = list(lista)',
    '    return sorted(lista_copia, key=processar, reverse=reverso)'
  ]) + '(' + list + ', "' + sortType + '", ' + reverse + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Create list with items
Blockly.Python['lists_create_with'] = function(block) {
  if (block.itemCount_ == 0) {
    return ['[]', Blockly.Python.ORDER_ATOMIC];
  }
  var elements = [];
  var hasAnyRealValue = false;
  for (var i = 0; i < block.itemCount_; i++) {
    var value = Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE);
    if (value && value !== '' && value !== 'None' && value !== "''" && value !== '""') {
      elements.push(value);
      hasAnyRealValue = true;
    } else {
      elements.push('None');
    }
  }
  if (!hasAnyRealValue) {
    return ['[]', Blockly.Python.ORDER_ATOMIC];
  }
  var code = '[' + elements.join(', ') + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Find index of item in list
Blockly.Python['lists_indexOf'] = function(block) {
  var find = Blockly.Python.valueToCode(block, 'FIND', Blockly.Python.ORDER_NONE) || '[]';
  var list = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || "''";
  if (block.getFieldValue('END') == 'FIRST') {
    var functionName = Blockly.Python.provideFunction_(
      'first_index',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(my_list, elem):',
       '    try:',
       '        return my_list.index(elem)',
       '    except:',
       '        return "Not in list"']
    );
  } else {
    var functionName = Blockly.Python.provideFunction_(
      'last_index',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(my_list, elem):',
       '    try:',
       '        return len(my_list) - my_list[::-1].index(elem) - 1',
       '    except:',
       '        return "Not in list"']
    );
  }
  return [functionName + '(' + list + ', ' + find + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Get index from list
Blockly.Python['lists_getIndex'] = function(block) {
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var list = Blockly.Python.valueToCode(block, 'VALUE',
    where == 'RANDOM' ? Blockly.Python.ORDER_NONE :
    Blockly.Python.ORDER_MEMBER) || '[]';
  switch (where) {
    case 'FIRST':
      if (mode == 'GET') {
        return [list + '[0]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(0)', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(0)\n';
      }
      break;
    case 'LAST':
      if (mode == 'GET') {
        return [list + '[-1]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop()', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop()\n';
      }
      break;
    case 'FROM_START':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_NONE) || '0';
      if (mode == 'GET') {
        return [list + '[' + at + ']', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(' + at + ')', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(' + at + ')\n';
      }
      break;
    case 'FROM_END':
      var at = Blockly.Python.valueToCode(block, 'AT', Blockly.Python.ORDER_NONE) || '0';
      if (mode == 'GET') {
        return [list + '[-(' + at + ' + 1)]', Blockly.Python.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        return [list + '.pop(-(' + at + ' + 1))', Blockly.Python.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return list + '.pop(-(' + at + ' + 1))\n';
      }
      break;
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      if (mode == 'GET') {
        return ['random.choice(' + list + ')', Blockly.Python.ORDER_FUNCTION_CALL];
      } else {
        var functionName = Blockly.Python.provideFunction_(
          'lists_remove_random_item',
          ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
           '    x = int(random.random() * len(myList))',
           '    return myList.pop(x)']);
        var code = functionName + '(' + list + ')';
        if (mode == 'GET_REMOVE') {
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        } else if (mode == 'REMOVE') {
          return code + '\n';
        }
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

/*
*****************************************************************
* NUMBER MATRIX BLOCKS 
* Generators for number matrix operations.
*****************************************************************
*/

// Number 0 for matrix
Blockly.Python['numero_matriz_0'] = function(block) {
  return ['0', Blockly.Python.ORDER_ATOMIC];
};

// Number 1 for matrix
Blockly.Python['numero_matriz_1'] = function(block) {
  return ['1', Blockly.Python.ORDER_ATOMIC];
};

// Number 2 for matrix
Blockly.Python['numero_matriz_2'] = function(block) {
  return ['2', Blockly.Python.ORDER_ATOMIC];
};

// Number 3 for matrix
Blockly.Python['numero_matriz_3'] = function(block) {
  return ['3', Blockly.Python.ORDER_ATOMIC];
};

// Number 4 for matrix
Blockly.Python['numero_matriz_4'] = function(block) {
  return ['4', Blockly.Python.ORDER_ATOMIC];
};

// Number 5 for matrix
Blockly.Python['numero_matriz_5'] = function(block) {
  return ['5', Blockly.Python.ORDER_ATOMIC];
};

// Number 6 for matrix
Blockly.Python['numero_matriz_6'] = function(block) {
  return ['6', Blockly.Python.ORDER_ATOMIC];
};

// Number 7 for matrix
Blockly.Python['numero_matriz_7'] = function(block) {
  return ['7', Blockly.Python.ORDER_ATOMIC];
};

// Number 8 for matrix
Blockly.Python['numero_matriz_8'] = function(block) {
  return ['8', Blockly.Python.ORDER_ATOMIC];
};

// Number 9 for matrix
Blockly.Python['numero_matriz_9'] = function(block) {
  return ['9', Blockly.Python.ORDER_ATOMIC];
};

// Show number on matrix
Blockly.Python['mostrar_numero_matriz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  Blockly.Python.definitions_['numeros_matriz'] = 'NUMEROS_5X5 = {0: [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1], 1: [0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0], 2: [1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1], 3: [1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1], 4: [1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1], 5: [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1], 6: [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1], 7: [1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0], 8: [1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1], 9: [1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1]}';
  var numero = Blockly.Python.valueToCode(block, 'NUMERO', Blockly.Python.ORDER_ATOMIC) || '0';
  var cor_rgb = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = brilho * BitdogLabConfig.NEOPIXEL.BRIGHTNESS / 100;
  var code = '';
  code += 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'cor_ajustada = (int(' + cor_rgb + '[0] * ' + brilho_float + '), int(' + cor_rgb + '[1] * ' + brilho_float + '), int(' + cor_rgb + '[2] * ' + brilho_float + '))\n';
  code += 'if ' + numero + ' in NUMEROS_5X5:\n';
  code += '    padrao = NUMEROS_5X5[' + numero + ']\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if padrao[y * 5 + x] == 1:\n';
  code += '                np[LED_MATRIX[y][x]] = cor_ajustada\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = "Numero " + str(' + numero + ')\n';
  code += '_matriz_cor = ' + cor_rgb + '\n';
  code += '_matriz_brilho = ' + brilho + '\n';
  code += '_matriz_leds_count = sum(1 for i in range(25) if np[i] != (0, 0, 0))\n';
  return code;
};

/*
*****************************************************************
* EMOJI BLOCKS
* Generators for emoji values and display.
*****************************************************************
*/

// Happy face emoji
Blockly.Python['emoji_rosto_feliz'] = function(block) {
  return ['"happy"', Blockly.Python.ORDER_ATOMIC];
};

// Sad face emoji
Blockly.Python['emoji_rosto_triste'] = function(block) {
  return ['"sad"', Blockly.Python.ORDER_ATOMIC];
};

// Surprised face emoji
Blockly.Python['emoji_rosto_surpreso'] = function(block) {
  return ['"surprised"', Blockly.Python.ORDER_ATOMIC];
};

// Heart emoji
Blockly.Python['emoji_coracao'] = function(block) {
  return ['"heart"', Blockly.Python.ORDER_ATOMIC];
};

// Up arrow emoji
Blockly.Python['emoji_seta_cima'] = function(block) {
  return ['"arrow_up"', Blockly.Python.ORDER_ATOMIC];
};

// Down arrow emoji
Blockly.Python['emoji_seta_baixo'] = function(block) {
  return ['"arrow_down"', Blockly.Python.ORDER_ATOMIC];
};

// Sun emoji
Blockly.Python['emoji_sol'] = function(block) {
  return ['"sun"', Blockly.Python.ORDER_ATOMIC];
};

// Rain emoji
Blockly.Python['emoji_chuva'] = function(block) {
  return ['"rain"', Blockly.Python.ORDER_ATOMIC];
};

// Flower emoji
Blockly.Python['emoji_flor'] = function(block) {
  return ['"flower"', Blockly.Python.ORDER_ATOMIC];
};

// Ghost emoji
Blockly.Python['emoji_fantasma'] = function(block) {
  return ['"ghost"', Blockly.Python.ORDER_ATOMIC];
};

// Christmas tree emoji
Blockly.Python['emoji_arvore_natal'] = function(block) {
  return ['"christmas_tree"', Blockly.Python.ORDER_ATOMIC];
};

// Snowflake emoji
Blockly.Python['emoji_floco_neve'] = function(block) {
  return ['"snowflake"', Blockly.Python.ORDER_ATOMIC];
};

// Gift emoji
Blockly.Python['emoji_presente'] = function(block) {
  return ['"gift"', Blockly.Python.ORDER_ATOMIC];
};

// Christmas bell emoji
Blockly.Python['emoji_sino_natal'] = function(block) {
  return ['"bell"', Blockly.Python.ORDER_ATOMIC];
};

// Show emoji on matrix
Blockly.Python['mostrar_emoji'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  Blockly.Python.definitions_['emojis_matriz'] = 'EMOJIS_5X5 = {"happy": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0], "sad": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 1,0,0,0,1], "surprised": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 0,1,1,1,0], "heart": [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0], "arrow_up": [0,0,1,0,0, 0,1,1,1,0, 1,0,1,0,1, 0,0,1,0,0, 0,0,1,0,0], "arrow_down": [0,0,1,0,0, 0,0,1,0,0, 1,0,1,0,1, 0,1,1,1,0, 0,0,1,0,0], "sun": [0,0,0,0,0, 0,1,1,1,0, 0,1,1,1,0, 0,1,1,1,0, 0,0,0,0,0], "rain": [1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1], "flower": [0,1,0,1,0, 1,0,1,0,1, 0,1,1,1,0, 0,0,1,0,0, 0,0,1,0,0], "ghost": [0,1,1,1,0, 1,0,1,0,1, 1,1,1,1,1, 1,1,1,1,1, 1,0,1,0,1], "christmas_tree": [0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0, 1,1,1,1,1, 0,0,1,0,0], "snowflake": [1,0,1,0,1, 0,0,1,0,0, 1,1,1,1,1, 0,0,1,0,0, 1,0,1,0,1], "gift": [1,0,1,0,1, 0,1,1,1,0, 1,1,1,1,1, 1,0,1,0,1, 1,1,1,1,1], "bell": [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,1,0,0]}';
  Blockly.Python.definitions_['emoji_names_map'] = 'EMOJI_NAMES = {"happy": "Feliz", "sad": "Triste", "surprised": "Surpreso", "heart": "Coracao", "arrow_up": "Seta Cima", "arrow_down": "Seta Baixo", "sun": "Sol", "rain": "Chuva", "flower": "Flor", "ghost": "Fantasma", "christmas_tree": "Arvore Natal", "snowflake": "Floco Neve", "gift": "Presente", "bell": "Sino"}';

  var emoji = Blockly.Python.valueToCode(block, 'EMOJI', Blockly.Python.ORDER_ATOMIC) || '"happy"';
  var cor_rgb = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 0)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = brilho * BitdogLabConfig.NEOPIXEL.BRIGHTNESS / 100;
  var code = '';
  code += 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'cor_ajustada = (int(' + cor_rgb + '[0] * ' + brilho_float + '), int(' + cor_rgb + '[1] * ' + brilho_float + '), int(' + cor_rgb + '[2] * ' + brilho_float + '))\n';
  code += 'if ' + emoji + ' in EMOJIS_5X5:\n';
  code += '    padrao = EMOJIS_5X5[' + emoji + ']\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if padrao[y * 5 + x] == 1:\n';
  code += '                np[LED_MATRIX[y][x]] = cor_ajustada\n';
  code += 'np.write()\n';
  // Track matrix state
  code += '# Update matrix tracking\n';
  code += '_matriz_status = "ON"\n';
  code += '_matriz_desenho = EMOJI_NAMES.get(' + emoji + ', ' + emoji + ')\n';
  code += '_matriz_cor = ' + cor_rgb + '\n';
  code += '_matriz_brilho = ' + brilho + '\n';
  code += '_matriz_leds_count = sum(1 for i in range(25) if np[i] != (0, 0, 0))\n';
  return code;
};

/*
*****************************************************************
* MATRIX ANIMATION BLOCKS 
* Generators for LED matrix animations.
*****************************************************************
*/

// Fast blink animation
Blockly.Python['matriz_piscar_rapido'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '# Fast blink\n';
  code += '# Execute internal code once to capture state\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture matrix colors\n';
  code += '_cores_piscar = [np[i] for i in range(25)]\n';
  code += '# Blink 3 times\n';
  code += 'for _ciclo in range(3):\n';
  code += '    time.sleep_ms(200)\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(200)\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = _cores_piscar[i]\n';
  code += '    np.write()\n';
  return code;
};

// Slow blink animation
Blockly.Python['matriz_piscar_lento'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '# Slow blink\n';
  code += '# Execute internal code once to capture state\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture matrix colors\n';
  code += '_cores_piscar = [np[i] for i in range(25)]\n';
  code += '# Blink 3 times slowly\n';
  code += 'for _ciclo in range(3):\n';
  code += '    time.sleep_ms(1000)\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(1000)\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = _cores_piscar[i]\n';
  code += '    np.write()\n';
  return code;
};

// Appear and disappear animation
Blockly.Python['matriz_aparecer_sumir'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '# Appear and disappear\n';
  code += '# Save current matrix state\n';
  code += '_matriz_temp = [(0,0,0)] * 25\n';
  code += 'for i in range(25):\n';
  code += '    _matriz_temp[i] = np[i]\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture colors after executing internal code\n';
  code += '_cores_finais = [(0,0,0)] * 25\n';
  code += 'for i in range(25):\n';
  code += '    _cores_finais[i] = np[i]\n';
  code += '# Fade in\n';
  code += 'for brilho in range(0, 101, 10):\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = (int(_cores_finais[i][0] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_finais[i][1] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_finais[i][2] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(150)\n';
  code += '# Fade out\n';
  code += 'for brilho in range(100, -1, -10):\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = (int(_cores_finais[i][0] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_finais[i][1] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_finais[i][2] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(150)\n';
  return code;
};

// Pulse brightness animation
Blockly.Python['matriz_pulsar_brilho'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Pulse brightness\n';
  code += '# Execute internal code to set colors\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture colors\n';
  code += '_cores_pulsar = [(0,0,0)] * 25\n';
  code += 'for i in range(25):\n';
  code += '    _cores_pulsar[i] = np[i]\n';
  code += '# Pulse (increase and decrease brightness)\n';
  code += 'for ciclo in range(2):\n';
  code += '    # Increase brightness\n';
  code += '    for brilho in range(30, 101, 10):\n';
  code += '        for i in range(25):\n';
  code += '            np[i] = (int(_cores_pulsar[i][0] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_pulsar[i][1] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_pulsar[i][2] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += '        np.write()\n';
  code += '        time.sleep_ms(150)\n';
  code += '    # Decrease brightness\n';
  code += '    for brilho in range(100, 29, -10):\n';
  code += '        for i in range(25):\n';
  code += '            np[i] = (int(_cores_pulsar[i][0] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_pulsar[i][1] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100), int(_cores_pulsar[i][2] * brilho * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100))\n';
  code += '        np.write()\n';
  code += '        time.sleep_ms(150)\n';
  return code;
};

// Slide up animation
Blockly.Python['matriz_deslizar_cima'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Slide up\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture current matrix state\n';
  code += '_matriz_deslizar = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += '# Animate sliding up (5 steps to clear)\n';
  code += 'for passo in range(1, 6):\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if y + passo < 5:\n';
  code += '                np[LED_MATRIX[y][x]] = _matriz_deslizar[y + passo][x]\n';
  code += '            else:\n';
  code += '                np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(300)\n';
  return code;
};

// Slide left animation
Blockly.Python['matriz_deslizar_esquerda'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Slide left\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture current matrix state\n';
  code += '_matriz_deslizar = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += '# Animate sliding left (5 steps to clear)\n';
  code += 'for passo in range(1, 6):\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if x + passo < 5:\n';
  code += '                np[LED_MATRIX[y][x]] = _matriz_deslizar[y][x + passo]\n';
  code += '            else:\n';
  code += '                np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(300)\n';
  return code;
};

// Slide down animation
Blockly.Python['matriz_deslizar_baixo'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '_matriz_deslizar = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += 'for passo in range(1, 6):\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if y - passo >= 0:\n';
  code += '                np[LED_MATRIX[y][x]] = _matriz_deslizar[y - passo][x]\n';
  code += '            else:\n';
  code += '                np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(300)\n';
  return code;
};

// Slide right animation
Blockly.Python['matriz_deslizar_direita'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Slide right\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture current matrix state\n';
  code += '_matriz_deslizar = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += '# Animate sliding right (5 steps to clear)\n';
  code += 'for passo in range(1, 6):\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            if x - passo >= 0:\n';
  code += '                np[LED_MATRIX[y][x]] = _matriz_deslizar[y][x - passo]\n';
  code += '            else:\n';
  code += '                np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(300)\n';
  return code;
};

// Swing animation
Blockly.Python['matriz_balancar'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Swing\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture original state\n';
  code += '_matriz_original = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += '# Swing right and left\n';
  code += 'movimentos = [1, 2, 1, 0, -1, -2, -1, 0]\n';
  code += 'for deslocamento in movimentos:\n';
  code += '    for y in range(5):\n';
  code += '        for x in range(5):\n';
  code += '            x_original = x - deslocamento\n';
  code += '            if 0 <= x_original < 5:\n';
  code += '                np[LED_MATRIX[y][x]] = _matriz_original[y][x_original]\n';
  code += '            else:\n';
  code += '                np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(200)\n';
  code += '# Restore original position\n';
  code += 'for y in range(5):\n';
  code += '    for x in range(5):\n';
  code += '        np[LED_MATRIX[y][x]] = _matriz_original[y][x]\n';
  code += 'np.write()\n';
  return code;
};

// Contraction animation
Blockly.Python['matriz_contracao'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Contraction\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture colors\n';
  code += '_cores_contracao = [np[i] for i in range(25)]\n';
  code += '# Animate contraction from outside to center\n';
  code += 'camadas = [[(0,0),(0,1),(0,2),(0,3),(0,4),(1,0),(1,4),(2,0),(2,4),(3,0),(3,4),(4,0),(4,1),(4,2),(4,3),(4,4)], [(1,1),(1,2),(1,3),(2,1),(2,3),(3,1),(3,2),(3,3)], [(2,2)]]\n';
  code += 'for camada in camadas:\n';
  code += '    for y, x in camada:\n';
  code += '        np[LED_MATRIX[y][x]] = (0, 0, 0)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(400)\n';
  return code;
};

// Flash animation
Blockly.Python['matriz_dar_flash'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var cor_flash = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 255)';
  var code = '';
  code += '# Flash color\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += 'time.sleep_ms(1000)\n';
  code += '# Flash with the specified color (20% brightness)\n';
  code += 'for i in range(25):\n';
  code += '    np[i] = (int(' + cor_flash + '[0] * 0.14), int(' + cor_flash + '[1] * 0.14), int(' + cor_flash + '[2] * 0.14))\n';
  code += 'np.write()\n';
  code += 'time.sleep_ms(300)\n';
  code += '# Restore content\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  return code;
};

/*
*****************************************************************
* BUTTON BLOCKS 
* Generators for button operations.
*****************************************************************
*/

// Button while pressed
Blockly.Python['botao_enquanto_apertado'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['setup_botoes'] =
    'botao_esquerda = Pin(' + BitdogLabConfig.PINS.BUTTON_A + ', Pin.IN, Pin.PULL_UP)\n' +
    'botao_direita = Pin(' + BitdogLabConfig.PINS.BUTTON_B + ', Pin.IN, Pin.PULL_UP)\n' +
    (BitdogLabConfig.PINS.BUTTON_C !== null ? 'botao_centro = Pin(' + BitdogLabConfig.PINS.BUTTON_C + ', Pin.IN, Pin.PULL_UP)\n' : '') +
    'botao_joystick = Pin(' + BitdogLabConfig.PINS.JOYSTICK_SW + ', Pin.IN, Pin.PULL_UP)';
  var botao = block.getFieldValue('BOTAO');
  var variavel_botao;
  switch (botao) {
    case 'A':
      variavel_botao = 'botao_esquerda';
      break;
    case 'B':
      variavel_botao = 'botao_direita';
      break;
    case 'C':
      variavel_botao = 'botao_centro';
      break;
    case 'JOYSTICK':
      variavel_botao = 'botao_joystick';
      break;
    default:
      variavel_botao = 'botao_esquerda';
  }
  var codigo_do = Blockly.Python.statementToCode(block, 'DO');
  var codigo_else = Blockly.Python.statementToCode(block, 'ELSE');
  if (codigo_do) {
    codigo_do = codigo_do.replace(/^  /gm, '');
  }
  if (codigo_else) {
    codigo_else = codigo_else.replace(/^  /gm, '');
  }
  codigo_do = codigo_do.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');
  codigo_else = codigo_else.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');
  var code = '';
  code += 'if ' + variavel_botao + '.value() == 0:\n';
  if (codigo_do) {
    var linhas = codigo_do.split('\n');
    for (var i = 0; i < linhas.length; i++) {
      if (linhas[i].trim() !== '') {
        code += '  ' + linhas[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }
  code += 'else:\n';
  if (codigo_else) {
    var linhas = codigo_else.split('\n');
    for (var i = 0; i < linhas.length; i++) {
      if (linhas[i].trim() !== '') {
        code += '  ' + linhas[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }
  return code;
};

// Button if pressed
Blockly.Python['botao_se_apertado'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_botoes'] =
    'botao_esquerda = Pin(' + BitdogLabConfig.PINS.BUTTON_A + ', Pin.IN, Pin.PULL_UP)\n' +
    'botao_direita = Pin(' + BitdogLabConfig.PINS.BUTTON_B + ', Pin.IN, Pin.PULL_UP)\n' +
    (BitdogLabConfig.PINS.BUTTON_C !== null ? 'botao_centro = Pin(' + BitdogLabConfig.PINS.BUTTON_C + ', Pin.IN, Pin.PULL_UP)\n' : '') +
    'botao_joystick = Pin(' + BitdogLabConfig.PINS.JOYSTICK_SW + ', Pin.IN, Pin.PULL_UP)';

  var botao = block.getFieldValue('BOTAO');
  var variavel_botao;
  var nome_botao;
  switch (botao) {
    case 'A':
      variavel_botao = 'botao_esquerda';
      nome_botao = 'esquerda';
      break;
    case 'B':
      variavel_botao = 'botao_direita';
      nome_botao = 'direita';
      break;
    case 'C':
      variavel_botao = 'botao_centro';
      nome_botao = 'centro';
      break;
    case 'JOYSTICK':
      variavel_botao = 'botao_joystick';
      nome_botao = 'joystick';
      break;
    default:
      variavel_botao = 'botao_esquerda';
      nome_botao = 'esquerda';
  }

  var codigo_do = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_do) {
    codigo_do = codigo_do.replace(/^  /gm, '');
  }
  codigo_do = codigo_do.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');

  // Inicializa flags e timestamp para debounce
  Blockly.Python.definitions_['flag_' + nome_botao] = 'flag_botao_' + nome_botao + ' = False';
  Blockly.Python.definitions_['last_time_' + nome_botao] = 'last_time_' + nome_botao + ' = 0';

  // Cria função de callback IRQ para o botão
  var callback_code = 'def callback_' + nome_botao + '(pin):\n';
  callback_code += '  global flag_botao_' + nome_botao + ', last_time_' + nome_botao + '\n';
  callback_code += '  current_time = time.ticks_ms()\n';
  callback_code += '  if time.ticks_diff(current_time, last_time_' + nome_botao + ') > 200:\n';
  callback_code += '    flag_botao_' + nome_botao + ' = True\n';
  callback_code += '    last_time_' + nome_botao + ' = current_time\n';

  Blockly.Python.definitions_['callback_' + nome_botao] = callback_code;

  // Configura IRQ no setup
  Blockly.Python.definitions_['irq_' + nome_botao] = variavel_botao + '.irq(trigger=Pin.IRQ_FALLING, handler=callback_' + nome_botao + ')';

  // Código no loop: verifica flag e executa ação
  var code = '';
  code += '# IRQ-based button detection for ' + nome_botao + '\n';
  code += 'if flag_botao_' + nome_botao + ':\n';
  code += '  flag_botao_' + nome_botao + ' = False\n';
  if (codigo_do) {
    var linhas = codigo_do.split('\n');
    for (var i = 0; i < linhas.length; i++) {
      if (linhas[i].trim() !== '') {
        code += '  ' + linhas[i] + '\n';
      }
    }
  } else {
    code += '  pass\n';
  }

  return code;
};

/*
*****************************************************************
* TEXT BLOCKS 
* Generators for text operations.
*****************************************************************
*/

// Convert to string
Blockly.Python['text_to_str'] = function(block) {
  var variable = Blockly.Python.valueToCode(block, 'var', Blockly.Python.ORDER_ATOMIC);
  var code = 'str(' + variable + ')';
  return [code, Blockly.Python.ORDER_NONE];
};

// Eval text block
Blockly.Blocks['text_eval'] = {
  init: function() {
    this.setColour(45);
    this.setInputsInline(true);
    this.appendDummyInput()
        .appendField("eval")
        .appendField(new Blockly.FieldTextInput(""), "text");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('direct python eval');
  }
};

Blockly.Python['text_eval'] = function(block) {
  var c = block.getFieldValue('text');
  var code = c + "\n";
  return code;
};

/*
*****************************************************************
* SYSTEM BLOCKS 
* Generators for system-level operations.
*****************************************************************
*/

// Project metadata
Blockly.Python['project_metadata'] = function(block) {
  var value_project_author = Blockly.Python.valueToCode(block, 'project_author', Blockly.Python.ORDER_ATOMIC);
  var value_project_iot_id = Blockly.Python.valueToCode(block, 'project_iot_id', Blockly.Python.ORDER_ATOMIC);
  var value_project_description = Blockly.Python.valueToCode(block, 'project_description', Blockly.Python.ORDER_ATOMIC);
  var code = '#Code automatically generated by BIPES (http://www.bipes.net.br)';
  code += '\n#Author: ' + value_project_author;
  code += '\n#IOT ID: ' + value_project_iot_id;
  code += '\n#Description: ' + value_project_description + '\n';
  return code;
};

// Snek uptime
Blockly.Python["snek_uptime"] = function(block) {
  var code = "time.monotonic()";
  return [code, Blockly.Python.ORDER_NONE];
};

/*
*****************************************************************
* CONTROL BLOCKS 
* Generators for control flow operations.
*****************************************************************
*/

// While true loop
Blockly.Python['controls_while_true'] = function(block) {
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
  branch = Blockly.Python.prefixLines(branch, Blockly.Python.INDENT);
  return 'while True:\n' + branch;
};

// Alternate action between colors
Blockly.Python['alternar_acao_entre_cores'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  var pin1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '13';
  var pin2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '11';
  var statements_do = Blockly.Python.statementToCode(block, 'DO');
  var code = 'Pin(' + pin1 + ', Pin.OUT).on()\nPin(' + pin2 + ', Pin.OUT).off()\n' + statements_do;
  code += 'Pin(' + pin1 + ', Pin.OUT).off()\nPin(' + pin2 + ', Pin.OUT).on()\n' + statements_do;
  return code;
};

// Plotter data formatting
Blockly.Python['chamar_formatar_dados_plotter'] = function(block) {
  var code = 'formatar_dados_para_plotter()\n';
  return code;
};

/*
*****************************************************************
* MATRIX LED BLOCKS 
* Generators for LED matrix operations.
*****************************************************************
*/

// Create drawing on matrix
Blockly.Python['criar_desenho_na_matriz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX) + '';
  var code = '';
  code += '# Configure matrix without partial updates\n';
  code += 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)  # Clear all LEDs\n';
  for (var i = 0; i < block.itemCount_; i++) {
    var drawingCode = Blockly.Python.statementToCode(block, 'DESENHO' + i);
    if (drawingCode) {
      var lines = drawingCode.split('\n');
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        if (line.startsWith('  ')) {
          line = line.substring(2);
        }
        if (line.trim()) {
          line = line.replace(/np\.write\(\)/g, '# np.write() REMOVED');
          code += line + '\n';
        }
      }
    }
  }
  code += 'time.sleep_ms(10)  # Brief pause\n';
  code += 'np.write()  # SINGLE FINAL UPDATE\n';
  code += 'time.sleep_ms(100)  # Long pause for complete stabilization\n';
  code += '# FIXED_CONFIGURATION: Drawing configured, no need for loop\n';
  return code;
};

// ==========================================
// Joystick
// ==========================================
Blockly.Python['joystick_controlar_led'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var led = BitdogLabConfig.LED;
  var joy = BitdogLabConfig.JOYSTICK;

  Blockly.Python.definitions_['import_pin']   = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm']   = 'from machine import PWM';
  Blockly.Python.definitions_['import_adc']   = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c']   = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_joy_x']  = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y']  = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_led_red']   = led.VAR_RED   + ' = PWM(Pin(' + pins.LED_RED   + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_led_green'] = led.VAR_GREEN + ' = PWM(Pin(' + pins.LED_GREEN + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_led_blue']  = led.VAR_BLUE  + ' = PWM(Pin(' + pins.LED_BLUE  + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var intensidadeInicial = block.getFieldValue('INTENSIDADE_INICIAL') || '50';
  Blockly.Python.definitions_['setup_intensidade_joy'] = '_intensidade_joy = ' + intensidadeInicial;

  var cor = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 255)';
  var dirAumentar = block.getFieldValue('DIR_AUMENTAR');
  var dirDiminuir = block.getFieldValue('DIR_DIMINUIR');

  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var c = joy.CENTER_VALUE, dz = joy.DEADZONE;
  var COND = {
    'UP':    (invY ? '_jy > ' + (c + dz) : '_jy < ' + (c - dz)),
    'DOWN':  (invY ? '_jy < ' + (c - dz) : '_jy > ' + (c + dz)),
    'LEFT':  (invX ? '_jx < ' + (c - dz) : '_jx > ' + (c + dz)),
    'RIGHT': (invX ? '_jx > ' + (c + dz) : '_jx < ' + (c - dz)),
  };

  var code = '';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += 'if ' + COND[dirAumentar] + ':  # sobe intensidade\n';
  code += '  _intensidade_joy = min(100, _intensidade_joy + 2)\n';
  code += 'if ' + COND[dirDiminuir] + ':  # desce intensidade\n';
  code += '  _intensidade_joy = max(0, _intensidade_joy - 2)\n';
  code += led.VAR_RED   + '.duty_u16(int(' + cor + '[0] * 257 * _intensidade_joy / 100))\n';
  code += led.VAR_GREEN + '.duty_u16(int(' + cor + '[1] * 257 * _intensidade_joy / 100))\n';
  code += led.VAR_BLUE  + '.duty_u16(int(' + cor + '[2] * 257 * _intensidade_joy / 100))\n';
  code += 'oled.fill(0)\n';

  return code;
};

// Getter: retorna _intensidade_joy como valor (para display, LED, etc.)
Blockly.Python['joystick_intensidade_atual'] = function(_block) {
  Blockly.Python.definitions_['setup_intensidade_joy'] = Blockly.Python.definitions_['setup_intensidade_joy'] || '_intensidade_joy = 50';
  return ['_intensidade_joy', Blockly.Python.ORDER_ATOMIC];
};

// Bloco: Joystick controla buzzer (frequência)
Blockly.Python['joystick_controlar_buzzer'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var joy = BitdogLabConfig.JOYSTICK;

  Blockly.Python.definitions_['import_pin']     = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm']     = 'from machine import PWM';
  Blockly.Python.definitions_['import_adc']     = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c']     = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_joy_x']    = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y']    = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_buzzer']   = 'buzzer = PWM(Pin(' + pins.BUZZER + '))';
  Blockly.Python.definitions_['setup_display']  = 'i2c = I2C(' + BitdogLabConfig.DISPLAY.I2C_BUS + ', scl=Pin(' + BitdogLabConfig.PINS.I2C_SCL + '), sda=Pin(' + BitdogLabConfig.PINS.I2C_SDA + '), freq=' + BitdogLabConfig.DISPLAY.I2C_FREQ + ')\noled = SSD1306_I2C(' + BitdogLabConfig.DISPLAY.WIDTH + ', ' + BitdogLabConfig.DISPLAY.HEIGHT + ', i2c)';

  var freqInicial = block.getFieldValue('FREQ_INICIAL') || '1000';
  Blockly.Python.definitions_['setup_freq_joy'] = '_freq_joy = ' + freqInicial;
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';

  var volume = parseFloat(block.getFieldValue('VOLUME'));
  if (isNaN(volume)) volume = 30;
  var duty = Math.round(65535 * volume / 100);

  var dirAumentar = block.getFieldValue('DIR_AUMENTAR');
  var dirDiminuir = block.getFieldValue('DIR_DIMINUIR');

  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var c = joy.CENTER_VALUE, dz = joy.DEADZONE;
  var COND = {
    'UP':    (invY ? '_jy > ' + (c + dz) : '_jy < ' + (c - dz)),
    'DOWN':  (invY ? '_jy < ' + (c - dz) : '_jy > ' + (c + dz)),
    'LEFT':  (invX ? '_jx < ' + (c - dz) : '_jx > ' + (c + dz)),
    'RIGHT': (invX ? '_jx > ' + (c + dz) : '_jx < ' + (c - dz)),
  };

  var code = '';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += 'if ' + COND[dirAumentar] + ':  # sobe frequência\n';
  code += '  _freq_joy = min(4000, _freq_joy + 20)\n';
  code += 'if ' + COND[dirDiminuir] + ':  # desce frequência\n';
  code += '  _freq_joy = max(200, _freq_joy - 20)\n';
  code += 'if not _buzzer_mudo:  # só toca se não foi silenciado\n';
  code += '  buzzer.freq(_freq_joy)\n';
  code += '  buzzer.duty_u16(' + duty + ')  # volume ' + volume + '%\n';
  code += 'oled.fill(0)\n';

  return code;
};

// Getter: retorna _freq_joy como valor (para display, etc.)
Blockly.Python['joystick_frequencia_atual'] = function(_block) {
  Blockly.Python.definitions_['setup_freq_joy'] = Blockly.Python.definitions_['setup_freq_joy'] || '_freq_joy = 1000';
  return ['_freq_joy', Blockly.Python.ORDER_ATOMIC];
};

// Bloco: Joystick mover player no display
Blockly.Python['joystick_mover_player'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;

  Blockly.Python.definitions_['import_pin']     = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']     = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c']     = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_joy_x']    = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y']    = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_display']  = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var tamanho = block.getFieldValue('TAMANHO') || '5';
  Blockly.Python.definitions_['setup_player_size'] = '_player_size = ' + tamanho;
  Blockly.Python.definitions_['setup_px'] = '_px = 0';
  Blockly.Python.definitions_['setup_py'] = '_py = 0';

  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var exprPx = invX ? '_jx' : '(65535 - _jx)';
  var exprPy = invY ? '(65535 - _jy)' : '_jy';

  var code = '';
  code += 'oled.fill(0)\n';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += '_px = ' + exprPx + ' * (' + display.WIDTH + ' - _player_size) // 65535\n';
  code += '_py = ' + exprPy + ' * (' + display.HEIGHT + ' - _player_size) // 65535\n';
  code += 'oled.fill_rect(_px, _py, _player_size, _player_size, 1)\n';

  return code;
};

// Bloco: Lousa Mágica no Display
Blockly.Python['joystick_lousa_magica'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  var joy = BitdogLabConfig.JOYSTICK;

  Blockly.Python.definitions_['import_pin']     = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']     = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c']     = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_joy_x']    = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y']    = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_display']  = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var tamanho = block.getFieldValue('TAMANHO') || '2';
  Blockly.Python.definitions_['setup_pen_size'] = '_pen_size = ' + tamanho;
  Blockly.Python.definitions_['setup_lx'] = '_lx = ' + Math.floor(display.WIDTH / 2);
  Blockly.Python.definitions_['setup_ly'] = '_ly = ' + Math.floor(display.HEIGHT / 2);
  Blockly.Python.definitions_['setup_px'] = '_px = 0';
  Blockly.Python.definitions_['setup_py'] = '_py = 0';

  var c = joy.CENTER_VALUE, dz = joy.DEADZONE;
  // Divisor controls speed: smaller = faster. Range ~0..32767 each side → /4000 gives ~0..8 px/frame
  var divisor = 4000;

  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var exprDx = invX ? '(_jx - ' + c + ')' : '(' + c + ' - _jx)';
  var exprDy = invY ? '(' + c + ' - _jy)' : '(_jy - ' + c + ')';

  var code = '';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += 'if _jx < ' + (c - dz) + ' or _jx > ' + (c + dz) + ':\n';
  code += '  _lx = max(0, min(' + (display.WIDTH - 1) + ', _lx + ' + exprDx + ' // ' + divisor + '))\n';
  code += 'if _jy < ' + (c - dz) + ' or _jy > ' + (c + dz) + ':\n';
  code += '  _ly = max(0, min(' + (display.HEIGHT - 1) + ', _ly + ' + exprDy + ' // ' + divisor + '))\n';
  code += 'oled.fill_rect(_lx, _ly, _pen_size, _pen_size, 1)\n';
  code += '_px = _lx\n';
  code += '_py = _ly\n';

  return code;
};

// Getter: retorna posição X do player
Blockly.Python['joystick_posicao_x'] = function(_block) {
  Blockly.Python.definitions_['setup_px'] = Blockly.Python.definitions_['setup_px'] || '_px = 0';
  return ['_px', Blockly.Python.ORDER_ATOMIC];
};

// Getter: retorna posição Y do player
Blockly.Python['joystick_posicao_y'] = function(_block) {
  Blockly.Python.definitions_['setup_py'] = Blockly.Python.definitions_['setup_py'] || '_py = 0';
  return ['_py', Blockly.Python.ORDER_ATOMIC];
};

// Bloco 8: Cursor de LED na Matriz 5x5 com joystick
Blockly.Python['joystick_cursor_matriz'] = function(block) {
  var pins = BitdogLabConfig.PINS;

  Blockly.Python.definitions_['import_pin']      = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']      = 'from machine import ADC';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time']     = 'import time';
  Blockly.Python.definitions_['setup_joy_x']     = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y']     = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_matriz']    = 'np = neopixel.NeoPixel(Pin(' + pins.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')';
  Blockly.Python.definitions_['led_matrix']      = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX);
  var linhaInicial   = 4 - (parseInt(block.getFieldValue('LINHA_INICIAL')) || 0);
  var colunaInicial  = block.getFieldValue('COLUNA_INICIAL')  || '0';
  Blockly.Python.definitions_['setup_cursor']    = '_cursor_col = ' + colunaInicial + '\n_cursor_row = ' + linhaInicial + '\n_cursor_tempo = 0';

  var joy = BitdogLabConfig.JOYSTICK;
  var cor = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 255)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = (brilho * BitdogLabConfig.NEOPIXEL.BRIGHTNESS / 100).toFixed(4);

  // Extremity thresholds: outer ~25% of joystick range triggers movement
  var extLow  = 10000;
  var extHigh = 55000;
  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var condLeft  = invX ? '_jx < ' + extLow  : '_jx > ' + extHigh;
  var condRight = invX ? '_jx > ' + extHigh : '_jx < ' + extLow;
  var condUp    = invY ? '_jy > ' + extHigh : '_jy < ' + extLow;
  var condDown  = invY ? '_jy < ' + extLow  : '_jy > ' + extHigh;

  var code = '';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += '_agora_cur = time.ticks_ms()\n';
  code += '# Move apenas nas extremidades (D-pad): avança uma casa por vez\n';
  code += 'if time.ticks_diff(_agora_cur, _cursor_tempo) > 200:\n';
  code += '  if ' + condLeft + ':  # esquerda\n';
  code += '    _cursor_col = max(0, _cursor_col - 1)\n';
  code += '    _cursor_tempo = _agora_cur\n';
  code += '  elif ' + condRight + ':  # direita\n';
  code += '    _cursor_col = min(4, _cursor_col + 1)\n';
  code += '    _cursor_tempo = _agora_cur\n';
  code += '  elif ' + condUp + ':  # cima\n';
  code += '    _cursor_row = max(0, _cursor_row - 1)\n';
  code += '    _cursor_tempo = _agora_cur\n';
  code += '  elif ' + condDown + ':  # baixo\n';
  code += '    _cursor_row = min(4, _cursor_row + 1)\n';
  code += '    _cursor_tempo = _agora_cur\n';
  code += '_cor_cursor = (int(' + cor + '[0] * ' + brilho_float + '), int(' + cor + '[1] * ' + brilho_float + '), int(' + cor + '[2] * ' + brilho_float + '))\n';
  code += 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'np[LED_MATRIX[_cursor_row][_cursor_col]] = _cor_cursor\n';
  code += 'np.write()\n';

  return code;
};

// Bloco 9: Seletor de opções com joystick
Blockly.Python['joystick_seletor'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var joy = BitdogLabConfig.JOYSTICK;

  Blockly.Python.definitions_['import_pin']  = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']  = 'from machine import ADC';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_joy_x'] = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y'] = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_seletor'] = '_seletor_idx = 0\n_seletor_tempo = 0';

  var dirProximo  = block.getFieldValue('DIR_PROXIMO');
  var dirAnterior = block.getFieldValue('DIR_ANTERIOR');

  // Cross-axis guard: use 2x deadzone on the perpendicular axis to avoid
  // accidental triggers when moving diagonally (e.g. pushing left also moves Y slightly)
  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var c = joy.CENTER_VALUE;
  var dz = joy.DEADZONE;
  var cdz = dz * 2;
  var xNear = '_jx > ' + (c - cdz) + ' and _jx < ' + (c + cdz);
  var yNear = '_jy > ' + (c - cdz) + ' and _jy < ' + (c + cdz);
  var COND = {
    'UP':    (invY ? '_jy > ' + (c + dz) : '_jy < ' + (c - dz)) + ' and ' + xNear,
    'DOWN':  (invY ? '_jy < ' + (c - dz) : '_jy > ' + (c + dz)) + ' and ' + xNear,
    'LEFT':  (invX ? '_jx < ' + (c - dz) : '_jx > ' + (c + dz)) + ' and ' + yNear,
    'RIGHT': (invX ? '_jx > ' + (c + dz) : '_jx < ' + (c - dz)) + ' and ' + yNear,
  };

  // Count blocks in OPCOES
  var count = 0;
  var tempBlock = block.getInputTargetBlock('OPCOES');
  while (tempBlock) { count++; tempBlock = tempBlock.getNextBlock(); }

  if (count === 0) return '';

  var code = '';
  code += '_jx = joy_x.read_u16()\n';
  code += '_jy = joy_y.read_u16()\n';
  code += '_agora_sel = time.ticks_ms()\n';
  code += 'if time.ticks_diff(_agora_sel, _seletor_tempo) > 500:\n';
  code += '  if ' + COND[dirProximo] + ':\n';
  code += '    _seletor_idx = (_seletor_idx + 1) % ' + count + '\n';
  code += '    _seletor_tempo = _agora_sel\n';
  code += '  elif ' + COND[dirAnterior] + ':\n';
  code += '    _seletor_idx = (_seletor_idx - 1) % ' + count + '\n';
  code += '    _seletor_tempo = _agora_sel\n';

  // Generate code for each option block individually.
  // IMPORTANT: blockToCode() calls scrub_() which appends ALL subsequent blocks in the chain.
  // To get only THIS block's code, call the generator function directly (bypasses scrub_).
  var currentBlock = block.getInputTargetBlock('OPCOES');
  var idx = 0;
  while (currentBlock) {
    var genFn = Blockly.Python[currentBlock.type];
    var blockCode = genFn ? genFn.call(Blockly.Python, currentBlock) : '';
    if (blockCode && blockCode.trim()) {
      code += 'if _seletor_idx == ' + idx + ':\n';
      var lines = blockCode.replace(/\n$/, '').split('\n');
      for (var li = 0; li < lines.length; li++) {
        if (lines[li].trim()) code += '  ' + lines[li] + '\n';
      }
    }
    currentBlock = currentBlock.getNextBlock();
    idx++;
  }

  return code;
};

// ==========================================
// Category: Microfone
// ==========================================

// Bloco 0: Testar Microfone no Display
Blockly.Python['microfone_testar'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;

  Blockly.Python.definitions_['import_pin']       = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']       = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c']       = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306']   = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_mic']        = 'adc_mic = ADC(Pin(' + pins.MIC + '))';
  Blockly.Python.definitions_['setup_mic_offset'] = '_MIC_OFFSET = 32767';
  Blockly.Python.definitions_['setup_display']    = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';

  var code = '';
  // Pré-computar tudo antes dos comandos oled para evitar que o auto-inject
  // de oled.show() do app.js quebre if/else dentro do grupo oled.*
  //
  // Lógica: o MAX4466 tem bias DC fixo em ~1.65V (raw ≈ 32767) em silêncio.
  // Pino flutuante fica preso perto de 0 ou 65535 (sem centro estável).
  // Threshold: ±8000 de 32767 (≈25% da escala) — fora disso = pino errado.
  code += '_mic_raw = adc_mic.read_u16()\n';
  code += '_mic_sinal = abs(_mic_raw - _MIC_OFFSET)\n';
  code += '_mic_som = ("som:" + str(_mic_sinal)) if _mic_sinal > 3000 else "silencio"\n';
  code += 'oled.fill(0)\n';
  code += 'oled.text("MIC teste", 0, 0, 1)\n';
  code += 'oled.text("Raw:" + str(_mic_raw), 0, 22, 1)\n';
  code += 'oled.text(_mic_som, 0, 44, 1)\n';

  return code;
};

// Bloco 1: VU Meter na Matriz
Blockly.Python['microfone_vu_meter'] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var neo  = BitdogLabConfig.NEOPIXEL;

  Blockly.Python.definitions_['import_pin']       = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']       = 'from machine import ADC';
  Blockly.Python.definitions_['import_neopixel']  = 'import neopixel';
  Blockly.Python.definitions_['import_math']      = 'import math';
  Blockly.Python.definitions_['setup_mic']        = 'adc_mic = ADC(Pin(' + pins.MIC + '))';
  Blockly.Python.definitions_['setup_mic_offset'] = '_MIC_OFFSET = 32767';
  Blockly.Python.definitions_['setup_matriz']     = 'np = neopixel.NeoPixel(Pin(' + pins.NEOPIXEL + '), ' + neo.COUNT + ')';
  Blockly.Python.definitions_['led_matrix']       = 'LED_MATRIX = ' + JSON.stringify(neo.MATRIX);

  var cor = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(0, 255, 0)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = (brilho * neo.BRIGHTNESS / 100).toFixed(4);

  var code = '';
  // Pegar pico de 8 amostras rápidas para não perder cruzamentos de zero do sinal de áudio
  code += '_mic_peak = 0\n';
  code += 'for _i in range(8):\n';
  code += '  _s = abs(adc_mic.read_u16() - _MIC_OFFSET)\n';
  code += '  if _s > _mic_peak: _mic_peak = _s\n';
  // Escala logarítmica igual ao microfone_exemplo.md: log10(1 + 9*vol) — mais sensível a sons baixos
  code += '_mic_vol = min(1.0, _mic_peak / 32767)\n';
  code += '_mic_nivel = int(5 * math.log10(1 + 9 * _mic_vol))\n';
  code += '_cor_vu = (int(' + cor + '[0] * ' + brilho_float + '), int(' + cor + '[1] * ' + brilho_float + '), int(' + cor + '[2] * ' + brilho_float + '))\n';
  code += 'for _r in range(5):\n';
  code += '  for _c in range(5):\n';
  code += '    np[LED_MATRIX[_r][_c]] = _cor_vu if _r >= (5 - _mic_nivel) else (0, 0, 0)\n';
  code += 'np.write()\n';

  return code;
};
