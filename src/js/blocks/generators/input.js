// Auto-extracted from legacy generators.js into input.js
'use strict';

Blockly.Python["botao_enquanto_apertado"] = function(block) {
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

Blockly.Python["botao_se_apertado"] = function(block) {
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

Blockly.Python["microfone_testar"] = function(block) {
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

Blockly.Python["microfone_vu_meter"] = function(block) {
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
  Blockly.Python.definitions_['setup_mic_nivel']  = '_mic_nivel = 0';

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
  code += '_mic_nivel_raw = int(5 * math.log10(1 + 9 * _mic_vol))\n';
  code += '_mic_nivel = _mic_nivel_raw if _mic_nivel_raw > _mic_nivel else max(0, _mic_nivel - 1)\n';
  code += '_cor_vu = (int(' + cor + '[0] * ' + brilho_float + '), int(' + cor + '[1] * ' + brilho_float + '), int(' + cor + '[2] * ' + brilho_float + '))\n';
  code += 'for _r in range(5):\n';
  code += '  for _c in range(5):\n';
  code += '    np[LED_MATRIX[_r][_c]] = _cor_vu if _r >= (5 - _mic_nivel) else (0, 0, 0)\n';
  code += 'np.write()\n';

  return code;
};

Blockly.Python["microfone_nivel_atual"] = function(_block) {
  Blockly.Python.definitions_['setup_mic_nivel'] = Blockly.Python.definitions_['setup_mic_nivel'] || '_mic_nivel = 0';
  return ['_mic_nivel', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["microfone_barra_display"] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc'] = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_mic'] = 'adc_mic = ADC(Pin(' + pins.MIC + '))';
  Blockly.Python.definitions_['setup_mic_offset'] = '_MIC_OFFSET = 32767';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['setup_barra_pct'] = '_barra_pct = 0';

  var linha = block.getFieldValue('LINHA');
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];

  var code = '';
  code += '_mic_peak = 0\n';
  code += 'for _i in range(8):\n';
  code += '    _s = abs(adc_mic.read_u16() - _MIC_OFFSET)\n';
  code += '    if _s > _mic_peak: _mic_peak = _s\n';
  code += '_barra_w = _mic_peak * 128 // 32767\n';
  code += '_barra_pct = _barra_w * 100 // 128\n';
  code += 'oled.fill_rect(0, ' + y + ', _barra_w, 6, 1)\n';
  code += 'oled.fill_rect(_barra_w, ' + y + ', 128 - _barra_w, 6, 0)\n';
  return code;
};

Blockly.Python["microfone_contar_palmas"] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc'] = 'from machine import ADC';
  Blockly.Python.definitions_['import_i2c'] = 'from machine import I2C';
  Blockly.Python.definitions_['import_ssd1306'] = 'from ssd1306 import SSD1306_I2C';
  Blockly.Python.definitions_['setup_mic'] = 'adc_mic = ADC(Pin(' + pins.MIC + '))';
  Blockly.Python.definitions_['setup_mic_offset'] = '_MIC_OFFSET = 32767';
  Blockly.Python.definitions_['setup_display'] = 'i2c = I2C(' + display.I2C_BUS + ', scl=Pin(' + pins.I2C_SCL + '), sda=Pin(' + pins.I2C_SDA + '), freq=' + display.I2C_FREQ + ')\noled = SSD1306_I2C(' + display.WIDTH + ', ' + display.HEIGHT + ', i2c)';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_palmas'] = '_palmas = 0\n_mic_ultima_palma = 0';

  var linha = block.getFieldValue('LINHA');
  var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
  var y = yPositions[linha];

  var code = '';
  // Janela de 50ms: amostrar continuamente e guardar o pico (palmas são transientes rápidos)
  code += '_mic_t0 = time.ticks_ms()\n';
  code += '_mic_peak = 0\n';
  code += 'while time.ticks_diff(time.ticks_ms(), _mic_t0) < 50:\n';
  code += '    _s = abs(adc_mic.read_u16() - _MIC_OFFSET)\n';
  code += '    if _s > _mic_peak: _mic_peak = _s\n';
  // Conta palma só se: pico acima do limiar E mínimo 300ms desde a última
  code += '_mic_agora_ms = time.ticks_ms()\n';
  code += 'if _mic_peak > 20000 and time.ticks_diff(_mic_agora_ms, _mic_ultima_palma) > 300:\n';
  code += '    _palmas += 1\n';
  code += '    _mic_ultima_palma = _mic_agora_ms\n';
  code += 'oled.fill_rect(0, ' + y + ', ' + display.WIDTH + ', 8, 0)\n';
  code += 'oled.text("Palmas: " + str(_palmas), 0, ' + y + ', 1)\n';
  return code;
};

Blockly.Python["microfone_total_palmas"] = function(_block) {
  Blockly.Python.definitions_['setup_palmas'] = Blockly.Python.definitions_['setup_palmas'] || '_palmas = 0\n_mic_ultima_palma = 0';
  return ['_palmas', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["microfone_barra_pct"] = function(_block) {
  Blockly.Python.definitions_['setup_barra_pct'] = Blockly.Python.definitions_['setup_barra_pct'] || '_barra_pct = 0';
  return ['_barra_pct', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["microfone_controlar_led"] = function(block) {
  var pins = BitdogLabConfig.PINS;
  var led  = BitdogLabConfig.LED;

  Blockly.Python.definitions_['import_pin']       = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc']       = 'from machine import ADC';
  Blockly.Python.definitions_['import_pwm']       = 'from machine import PWM';
  Blockly.Python.definitions_['import_math']      = 'import math';
  Blockly.Python.definitions_['setup_mic']        = 'adc_mic = ADC(Pin(' + pins.MIC + '))';
  Blockly.Python.definitions_['setup_mic_offset'] = '_MIC_OFFSET = 32767';
  Blockly.Python.definitions_['setup_led_red']    = led.VAR_RED   + ' = PWM(Pin(' + pins.LED_RED   + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_led_green']  = led.VAR_GREEN + ' = PWM(Pin(' + pins.LED_GREEN + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_led_blue']   = led.VAR_BLUE  + ' = PWM(Pin(' + pins.LED_BLUE  + '), freq=' + led.PWM_FREQ + ')';
  Blockly.Python.definitions_['setup_mic_nivel']  = '_mic_nivel = 0';

  var cor = Blockly.Python.valueToCode(block, 'COR', Blockly.Python.ORDER_ATOMIC) || '(255, 255, 255)';
  var r = led.VAR_RED, g = led.VAR_GREEN, b = led.VAR_BLUE;

  var code = '';
  code += '_mic_peak = 0\n';
  code += 'for _i in range(8):\n';
  code += '  _s = abs(adc_mic.read_u16() - _MIC_OFFSET)\n';
  code += '  if _s > _mic_peak: _mic_peak = _s\n';
  code += '_mic_vol = min(1.0, _mic_peak / 32767)\n';
  code += '_mic_nivel_raw = int(5 * math.log10(1 + 9 * _mic_vol))\n';
  code += '_mic_nivel = _mic_nivel_raw if _mic_nivel_raw > _mic_nivel else max(0, _mic_nivel - 1)\n';
  code += r + '.duty_u16(int(' + cor + '[0] * 257 * _mic_peak / 32767))\n';
  code += g + '.duty_u16(int(' + cor + '[1] * 257 * _mic_peak / 32767))\n';
  code += b + '.duty_u16(int(' + cor + '[2] * 257 * _mic_peak / 32767))\n';

  return code;
};
