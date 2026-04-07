// Auto-extracted from legacy generators.js into joystick.js
'use strict';

function ensureJoystickDisplayPositionSupport() {
  var pins = BitdogLabConfig.PINS;
  var display = BitdogLabConfig.DISPLAY;
  var invY = (BitdogLabConfig.JOYSTICK.INVERT_Y === true);
  var invX = (BitdogLabConfig.JOYSTICK.INVERT_X === true);
  var exprPx = invX ? '_jx' : '(65535 - _jx)';
  var exprPy = invY ? '(65535 - _jy)' : '_jy';

  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_adc'] = 'from machine import ADC';
  Blockly.Python.definitions_['setup_joy_x'] = 'joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))';
  Blockly.Python.definitions_['setup_joy_y'] = 'joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))';
  Blockly.Python.definitions_['setup_px'] = Blockly.Python.definitions_['setup_px'] || '_px = 0';
  Blockly.Python.definitions_['setup_py'] = Blockly.Python.definitions_['setup_py'] || '_py = 0';
  Blockly.Python.definitions_['setup_player_size'] = Blockly.Python.definitions_['setup_player_size'] || '_player_size = 5';
  Blockly.Python.definitions_['setup_joy_has_position'] = Blockly.Python.definitions_['setup_joy_has_position'] || '_joy_has_position = False';
  Blockly.Python.definitions_['joy_position_x_helper'] =
    'def _joystick_pos_x_val():\n' +
    '  global _joy_has_position, _px, _player_size\n' +
    '  if _joy_has_position:\n' +
    '    return _px\n' +
    '  _jx = joy_x.read_u16()\n' +
    '  return ' + exprPx + ' * (' + display.WIDTH + ' - _player_size) // 65535';
  Blockly.Python.definitions_['joy_position_y_helper'] =
    'def _joystick_pos_y_val():\n' +
    '  global _joy_has_position, _py, _player_size\n' +
    '  if _joy_has_position:\n' +
    '    return _py\n' +
    '  _jy = joy_y.read_u16()\n' +
    '  return ' + exprPy + ' * (' + display.HEIGHT + ' - _player_size) // 65535';
}

Blockly.Python["joystick_controlar_led"] = function(block) {
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

Blockly.Python["joystick_intensidade_atual"] = function(_block) {
  Blockly.Python.definitions_['setup_intensidade_joy'] = Blockly.Python.definitions_['setup_intensidade_joy'] || '_intensidade_joy = 50';
  return ['_intensidade_joy', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["joystick_controlar_buzzer"] = function(block) {
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

Blockly.Python["joystick_frequencia_atual"] = function(_block) {
  Blockly.Python.definitions_['setup_freq_joy'] = Blockly.Python.definitions_['setup_freq_joy'] || '_freq_joy = 1000';
  return ['_freq_joy', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["joystick_mover_player"] = function(block) {
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
  Blockly.Python.definitions_['setup_joy_has_position'] = Blockly.Python.definitions_['setup_joy_has_position'] || '_joy_has_position = False';

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
  code += '_joy_has_position = True\n';
  code += 'oled.fill_rect(_px, _py, _player_size, _player_size, 1)\n';

  return code;
};

Blockly.Python["joystick_lousa_magica"] = function(block) {
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
  Blockly.Python.definitions_['setup_joy_has_position'] = Blockly.Python.definitions_['setup_joy_has_position'] || '_joy_has_position = False';

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
  code += '_joy_has_position = True\n';

  return code;
};

Blockly.Python["joystick_posicao_x"] = function(_block) {
  ensureJoystickDisplayPositionSupport();
  return ['_joystick_pos_x_val()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["joystick_posicao_y"] = function(_block) {
  ensureJoystickDisplayPositionSupport();
  return ['_joystick_pos_y_val()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python["joystick_cursor_matriz"] = function(block) {
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

Blockly.Python["joystick_seletor"] = function(block) {
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
