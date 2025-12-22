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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'for i in range(25):\n';
  code += '    np[i] = (int(' + colour + '[0] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[1] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[2] * ' + intensity + ' * 0.7 / 100))\n';
  code += 'np.write()\n';
  return code;
};

// Turn off LED matrix generator
Blockly.Python['desligar_matriz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  var code = 'for i in range(25):\n';
  code += '    np[i] = (0, 0, 0)\n';
  code += 'np.write()\n';
  return code;
};

// Turn on LED at specific position generator
Blockly.Python['acender_led_posicao'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  var linha = block.getFieldValue('LINHA');
  var coluna = block.getFieldValue('COLUNA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'if 0 <= ' + linha + ' <= 4 and 0 <= ' + coluna + ' <= 4:\n';
  code += '    led_index = LED_MATRIX[4 - ' + linha + '][' + coluna + ']\n';
  code += '    np[led_index] = (int(' + colour + '[0] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[1] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[2] * ' + intensity + ' * 0.7 / 100))\n';
  code += '    np.write()\n';
  return code;
};

// Turn on horizontal line generator
Blockly.Python['acender_linha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  var linha = block.getFieldValue('LINHA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'if 0 <= ' + linha + ' <= 4:\n';
  code += '    for x in range(5):\n';
  code += '        led_index = LED_MATRIX[4 - ' + linha + '][x]\n';
  code += '        np[led_index] = (int(' + colour + '[0] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[1] * ' + intensity + ' * 0.7 / 100), int(' + colour + '[2] * ' + intensity + ' * 0.7 / 100))\n';
  code += '    np.write()\n';
  return code;
};

// Turn on vertical column generator
Blockly.Python['acender_coluna'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  var coluna = block.getFieldValue('COLUNA');
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var intensity = block.getFieldValue('INTENSITY');
  var code = 'if 0 <= ' + coluna + ' <= 4:\n';
  code += '    for y in range(5):\n';
  code += '        led_index = LED_MATRIX[y][' + coluna + ']\n';
  code += '        r = max(1, int(' + colour + '[0] * ' + intensity + ' / 100))\n';
  code += '        g = max(1, int(' + colour + '[1] * ' + intensity + ' / 100))\n';
  code += '        b = max(1, int(' + colour + '[2] * ' + intensity + ' / 100))\n';
  code += '        np[led_index] = (r, g, b)\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(10)\n';
  return code;
};

// Turn on LED with color generator
Blockly.Python['bloco_ligar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
  var code = 'led_vermelho.duty_u16(0)\n';
  code += 'led_verde.duty_u16(0)\n';
  code += 'led_azul.duty_u16(0)\n';
  return code;
};

// Control LED intensity generator
Blockly.Python['bloco_acender_led_brilho'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
  var colour1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var colour2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var code = 'while True:\n';
  code += '    for i in range(10):\n';
  code += '        led_vermelho.duty_u16(int(' + colour1 + '[0] * 257 * (10-i)/10 + ' + colour2 + '[0] * 257 * i/10))\n';
  code += '        led_verde.duty_u16(int(' + colour1 + '[1] * 257 * (10-i)/10 + ' + colour2 + '[1] * 257 * i/10))\n';
  code += '        led_azul.duty_u16(int(' + colour1 + '[2] * 257 * (10-i)/10 + ' + colour2 + '[2] * 257 * i/10))\n';
  code += '        time.sleep_ms(50)\n';
  code += '    time.sleep_ms(500)\n';
  return code;
};

// Battle colors LED animation generator
Blockly.Python['bloco_batalhar_led'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_urandom'] = 'import urandom';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';
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
  for (var i = 0; i < block.steps_.length; i++) {
    if (block.steps_[i] === 'action') {
      var stepCode = Blockly.Python.statementToCode(block, 'STEP' + i);
      if (stepCode) {
        code += stepCode.replace(/^  /gm, '');
      }
    } else if (block.steps_[i] === 'wait') {
      var timeValue = Blockly.Python.valueToCode(block, 'STEP' + i, Blockly.Python.ORDER_ATOMIC) || '0';
      code += 'time.sleep_ms(' + timeValue + ')\n';
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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';

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
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';

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

  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(13), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(11), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(12), freq=1000)';

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
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var octave = block.getFieldValue('OCTAVE');
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  note = note.replace(/['"]/g, '').trim();
  var noteKey = note + octave;
  var frequency = NOTE_FREQUENCIES[noteKey];
  if (!frequency) {
    return '';
  }
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(' + frequency + ')\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep(0.5)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Play high pitch sound
Blockly.Python['tocar_som_agudo'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(1000)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep(0.5)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Stop sound
Blockly.Python['parar_som'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
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
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
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
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(1500)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(100)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Double beep sound
Blockly.Python['bipe_duplo'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(1500)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(100)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += 'time.sleep_ms(50)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(100)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Intermittent alert sound
Blockly.Python['alerta_intermitente'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(2000)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(200)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += 'time.sleep_ms(800)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Call sound
Blockly.Python['chamada'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(440)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(523)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Coin sound
Blockly.Python['som_de_moeda'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(494)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(100)\n';
  code += 'buzzer.freq(659)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Success sound
Blockly.Python['som_de_sucesso'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
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
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Failure sound
Blockly.Python['som_de_falha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(392)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(200)\n';
  code += 'buzzer.freq(370)\n';
  code += 'time.sleep_ms(200)\n';
  code += 'buzzer.freq(349)\n';
  code += 'time.sleep_ms(200)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Laser sound
Blockly.Python['som_de_laser'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(2000)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(50)\n';
  code += 'buzzer.freq(1000)\n';
  code += 'time.sleep_ms(50)\n';
  code += 'buzzer.freq(500)\n';
  code += 'time.sleep_ms(50)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Police siren sound
Blockly.Python['sirene_policial'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.freq(698)\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'time.sleep_ms(400)\n';
  code += 'buzzer.freq(587)\n';
  code += 'time.sleep_ms(400)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Musical scale up
Blockly.Python['escala_musical_sobe'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'buzzer.freq(262)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(294)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(330)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(349)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(392)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(440)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(494)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(523)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Musical scale down
Blockly.Python['escala_musical_desce'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  code += 'buzzer.freq(523)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(494)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(440)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(392)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(349)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(330)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(294)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.freq(262)\n';
  code += 'time.sleep_ms(150)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Twinkle twinkle little star melody
Blockly.Python['brilha_brilha_estrelinha'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
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
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Jingle Bells
Blockly.Python['natal_jingle_bells'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  // E E E (Jingle bells)
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(400)\n';
  // E E E (Jingle bells)
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(400)\n';
  // E G C D E (Jingle all the way)
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(784)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(300)\n';
  code += 'buzzer.freq(587)\ntime.sleep_ms(100)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(800)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Silent Night (Noite Feliz)
Blockly.Python['natal_noite_feliz'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  // G A G E (Noite feliz)
  code += 'buzzer.freq(392)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(600)\n';
  code += 'buzzer.freq(330)\ntime.sleep_ms(800)\n';
  // G A G E (Noite feliz)
  code += 'buzzer.freq(392)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(600)\n';
  code += 'buzzer.freq(330)\ntime.sleep_ms(800)\n';
  // D D B (Ó Senhor)
  code += 'buzzer.freq(587)\ntime.sleep_ms(600)\n';
  code += 'buzzer.freq(587)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(800)\n';
  // C C G (de amor)
  code += 'buzzer.freq(523)\ntime.sleep_ms(600)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(800)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Deck the Halls (Bate o Sino)
Blockly.Python['natal_bate_sino'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  // D C B A G A B G (Deck the halls with boughs of holly)
  code += 'buzzer.freq(587)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(300)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(100)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(400)\n';
  // A B C A B (Fa la la la la)
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(600)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: We Wish You a Merry Christmas (Noel)
Blockly.Python['natal_noel'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  // C F F G F E D (We wish you a merry)
  code += 'buzzer.freq(262)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(349)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(349)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(349)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(330)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(294)\ntime.sleep_ms(400)\n';
  // C C G G A G F E C (Christmas and a happy new year)
  code += 'buzzer.freq(262)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(262)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(349)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(330)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(262)\ntime.sleep_ms(600)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
  return code;
};

// Christmas song: Adeste Fideles (Ó Vinde)
Blockly.Python['natal_o_vinde'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var volume = block.getFieldValue('VOLUME');
  var duty_cycle = Math.round(65535 * volume * 0.7 / 100);
  var code = '# SOUND_BLOCK_START\n';
  code += 'buzzer.duty_u16(' + duty_cycle + ')\n';
  // G G D C B A G (Adeste fideles)
  code += 'buzzer.freq(392)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(587)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(494)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(440)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(392)\ntime.sleep_ms(600)\n';
  // D E D C D (Laeti triumphantes)
  code += 'buzzer.freq(587)\ntime.sleep_ms(400)\n';
  code += 'buzzer.freq(659)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(587)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(523)\ntime.sleep_ms(200)\n';
  code += 'buzzer.freq(587)\ntime.sleep_ms(800)\n';
  code += 'buzzer.duty_u16(0)\n';
  code += '# SOUND_BLOCK_END\n';
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
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(21))';
  var code = '# SOUND_BLOCK_START\n';
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
    code += 'time.sleep_ms(' + tempo + ')\n';
    code += 'buzzer.duty_u16(0)\n';
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
  var order = (operator == '==' || operator == '!=') ?
    Blockly.Python.ORDER_EQUALITY : Blockly.Python.ORDER_RELATIONAL;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  Blockly.Python.definitions_['numeros_matriz'] = 'NUMEROS_5X5 = {0: [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1], 1: [0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0], 2: [1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1], 3: [1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1], 4: [1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1], 5: [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1], 6: [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1], 7: [1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0], 8: [1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1], 9: [1,1,1,1,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,0,0,1, 1,1,1,1,1]}';
  var numero = Blockly.Python.valueToCode(block, 'NUMERO', Blockly.Python.ORDER_ATOMIC) || '0';
  var cor_rgb = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = brilho * 0.7 / 100;
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  Blockly.Python.definitions_['emojis_matriz'] = 'EMOJIS_5X5 = {"happy": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0], "sad": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 1,0,0,0,1], "surprised": [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 0,1,1,1,0], "heart": [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0], "arrow_up": [0,0,1,0,0, 0,1,1,1,0, 1,0,1,0,1, 0,0,1,0,0, 0,0,1,0,0], "arrow_down": [0,0,1,0,0, 0,0,1,0,0, 1,0,1,0,1, 0,1,1,1,0, 0,0,1,0,0], "sun": [0,0,0,0,0, 0,1,1,1,0, 0,1,1,1,0, 0,1,1,1,0, 0,0,0,0,0], "rain": [1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1], "flower": [0,1,0,1,0, 1,0,1,0,1, 0,1,1,1,0, 0,0,1,0,0, 0,0,1,0,0], "ghost": [0,1,1,1,0, 1,0,1,0,1, 1,1,1,1,1, 1,1,1,1,1, 1,0,1,0,1], "christmas_tree": [0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0, 1,1,1,1,1, 0,0,1,0,0], "snowflake": [1,0,1,0,1, 0,0,1,0,0, 1,1,1,1,1, 0,0,1,0,0, 1,0,1,0,1], "gift": [1,0,1,0,1, 0,1,1,1,0, 1,1,1,1,1, 1,0,1,0,1, 1,1,1,1,1], "bell": [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 0,0,1,0,0]}';
  var emoji = Blockly.Python.valueToCode(block, 'EMOJI', Blockly.Python.ORDER_ATOMIC) || '"happy"';
  var cor_rgb = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 0)';
  var brilho = block.getFieldValue('BRILHO');
  var brilho_float = brilho * 0.7 / 100;
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
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
  code += '        np[i] = (int(_cores_finais[i][0] * brilho * 0.7 / 100), int(_cores_finais[i][1] * brilho * 0.7 / 100), int(_cores_finais[i][2] * brilho * 0.7 / 100))\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(150)\n';
  code += '# Fade out\n';
  code += 'for brilho in range(100, -1, -10):\n';
  code += '    for i in range(25):\n';
  code += '        np[i] = (int(_cores_finais[i][0] * brilho * 0.7 / 100), int(_cores_finais[i][1] * brilho * 0.7 / 100), int(_cores_finais[i][2] * brilho * 0.7 / 100))\n';
  code += '    np.write()\n';
  code += '    time.sleep_ms(150)\n';
  return code;
};

// Pulse brightness animation
Blockly.Python['matriz_pulsar_brilho'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
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
  code += '            np[i] = (int(_cores_pulsar[i][0] * brilho * 0.7 / 100), int(_cores_pulsar[i][1] * brilho * 0.7 / 100), int(_cores_pulsar[i][2] * brilho * 0.7 / 100))\n';
  code += '        np.write()\n';
  code += '        time.sleep_ms(150)\n';
  code += '    # Decrease brightness\n';
  code += '    for brilho in range(100, 29, -10):\n';
  code += '        for i in range(25):\n';
  code += '            np[i] = (int(_cores_pulsar[i][0] * brilho * 0.7 / 100), int(_cores_pulsar[i][1] * brilho * 0.7 / 100), int(_cores_pulsar[i][2] * brilho * 0.7 / 100))\n';
  code += '        np.write()\n';
  code += '        time.sleep_ms(150)\n';
  return code;
};

// Slide up animation
Blockly.Python['matriz_deslizar_cima'] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_neopixel'] = 'import neopixel';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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
  code += '# Animate sliding up (5 steps to clear everything)\n';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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
  code += '# Animate sliding left (5 steps to clear everything)\n';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
  var codigo_interno = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_interno) {
    codigo_interno = codigo_interno.replace(/^  /gm, '');
  }
  var code = '';
  code += '# Slide down\n';
  if (codigo_interno) {
    code += codigo_interno;
  }
  code += '# Capture current matrix state\n';
  code += '_matriz_deslizar = [[np[LED_MATRIX[y][x]] for x in range(5)] for y in range(5)]\n';
  code += '# Animate sliding down (5 steps to clear everything)\n';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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
  code += '# Animate sliding right (5 steps to clear everything)\n';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
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
    'botao_esquerda = Pin(5, Pin.IN, Pin.PULL_UP)\n' +
    'botao_direita = Pin(6, Pin.IN, Pin.PULL_UP)\n' +
    'botao_centro = Pin(10, Pin.IN, Pin.PULL_UP)';
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
  Blockly.Python.definitions_['setup_botoes'] =
    'botao_esquerda = Pin(5, Pin.IN, Pin.PULL_UP)\n' +
    'botao_direita = Pin(6, Pin.IN, Pin.PULL_UP)\n' +
    'botao_centro = Pin(10, Pin.IN, Pin.PULL_UP)';
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
    default:
      variavel_botao = 'botao_esquerda';
      nome_botao = 'esquerda';
  }
  var codigo_do = Blockly.Python.statementToCode(block, 'DO');
  if (codigo_do) {
    codigo_do = codigo_do.replace(/^  /gm, '');
  }
  codigo_do = codigo_do.replace(/# SOUND_BLOCK_START|# SOUND_BLOCK_END/g, '');
  Blockly.Python.definitions_['estado_anterior_' + nome_botao] = 'estado_anterior_botao_' + nome_botao + ' = 1';
  var code = '';
  code += '# Edge detection (falling edge) for button ' + nome_botao + '\n';
  code += 'leitura_atual_' + nome_botao + ' = ' + variavel_botao + '.value()\n';
  code += 'if leitura_atual_' + nome_botao + ' == 0 and estado_anterior_botao_' + nome_botao + ' == 1:\n';
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
  code += 'estado_anterior_botao_' + nome_botao + ' = leitura_atual_' + nome_botao + '\n';
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
  Blockly.Python.definitions_['setup_matriz'] = 'np = neopixel.NeoPixel(Pin(7), 25)  # Pin 7, 25 LEDs';
  Blockly.Python.definitions_['led_matrix'] = 'LED_MATRIX = [[24, 23, 22, 21, 20], [15, 16, 17, 18, 19], [14, 13, 12, 11, 10], [5, 6, 7, 8, 9], [4, 3, 2, 1, 0]]';
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