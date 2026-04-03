// Auto-extracted from legacy generators.js into matrix.js
'use strict';

Blockly.Python["preencher_matriz"] = function(block) {
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

Blockly.Python["desligar_matriz"] = function(block) {
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

Blockly.Python["acender_led_posicao"] = function(block) {
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

Blockly.Python["acender_linha"] = function(block) {
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

Blockly.Python["acender_coluna"] = function(block) {
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

Blockly.Python["numero_matriz_0"] = function(block) {
  return ['0', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_1"] = function(block) {
  return ['1', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_2"] = function(block) {
  return ['2', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_3"] = function(block) {
  return ['3', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_4"] = function(block) {
  return ['4', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_5"] = function(block) {
  return ['5', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_6"] = function(block) {
  return ['6', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_7"] = function(block) {
  return ['7', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_8"] = function(block) {
  return ['8', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["numero_matriz_9"] = function(block) {
  return ['9', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["mostrar_numero_matriz"] = function(block) {
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

Blockly.Python["emoji_rosto_feliz"] = function(block) {
  return ['"happy"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_rosto_triste"] = function(block) {
  return ['"sad"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_rosto_surpreso"] = function(block) {
  return ['"surprised"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_coracao"] = function(block) {
  return ['"heart"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_seta_cima"] = function(block) {
  return ['"arrow_up"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_seta_baixo"] = function(block) {
  return ['"arrow_down"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_sol"] = function(block) {
  return ['"sun"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_chuva"] = function(block) {
  return ['"rain"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_flor"] = function(block) {
  return ['"flower"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_fantasma"] = function(block) {
  return ['"ghost"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_arvore_natal"] = function(block) {
  return ['"christmas_tree"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_floco_neve"] = function(block) {
  return ['"snowflake"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_presente"] = function(block) {
  return ['"gift"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["emoji_sino_natal"] = function(block) {
  return ['"bell"', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["mostrar_emoji"] = function(block) {
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

Blockly.Python["matriz_piscar_rapido"] = function(block) {
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

Blockly.Python["matriz_piscar_lento"] = function(block) {
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

Blockly.Python["matriz_aparecer_sumir"] = function(block) {
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

Blockly.Python["matriz_pulsar_brilho"] = function(block) {
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

Blockly.Python["matriz_deslizar_cima"] = function(block) {
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

Blockly.Python["matriz_deslizar_esquerda"] = function(block) {
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

Blockly.Python["matriz_deslizar_baixo"] = function(block) {
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

Blockly.Python["matriz_deslizar_direita"] = function(block) {
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

Blockly.Python["matriz_balancar"] = function(block) {
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

Blockly.Python["matriz_contracao"] = function(block) {
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

Blockly.Python["matriz_dar_flash"] = function(block) {
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

Blockly.Python["criar_desenho_na_matriz"] = function(block) {
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
