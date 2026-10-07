// Preset effects use the selected board profile and stay cancellable by button B.
'use strict';

(function() {
  function ensureWait() {
    var definitions = Blockly.Python.definitions_;
    definitions.import_feedback_time = 'from time import sleep_ms';
    definitions.feedback_wait = [
      'def _feedback_check():',
      '  if "_robo_verificar_parada" in globals():',
      '    _robo_verificar_parada()',
      '',
      'def _feedback_wait(ms):',
      '  if "_robo_pausa_segura" in globals():',
      '    _robo_pausa_segura(ms)',
      '  else:',
      '    sleep_ms(ms)'
    ].join('\n');
  }

  function colourCode(block) {
    var colour = block.getFieldValue('COR');
    if (!/^#[0-9a-f]{6}$/i.test(colour || '')) colour = RobotFeedback.blocks[block.type].colour;
    return '(' + [1, 3, 5].map(function(offset) { return parseInt(colour.slice(offset, offset + 2), 16); }).join(', ') + ')';
  }

  function ensureMatrix() {
    ensureWait();
    var definitions = Blockly.Python.definitions_;
    definitions.import_pin = 'from machine import Pin';
    definitions.import_neopixel = 'import neopixel';
    definitions.setup_matriz = 'np = neopixel.NeoPixel(Pin(' + BitdogLabConfig.PINS.NEOPIXEL + '), ' + BitdogLabConfig.NEOPIXEL.COUNT + ')';
    definitions.led_matrix = 'LED_MATRIX = ' + JSON.stringify(BitdogLabConfig.NEOPIXEL.MATRIX);
    definitions.feedback_matrix = [
      'def _feedback_matrix_clear():',
      '  for i in range(' + BitdogLabConfig.NEOPIXEL.COUNT + '):',
      '    np[i] = (0, 0, 0)',
      '  np.write()',
      '',
      'def _feedback_matrix(pattern, colour, brightness, name):',
      '  global _matriz_status, _matriz_desenho, _matriz_cor, _matriz_brilho, _matriz_leds_count',
      '  _feedback_check()',
      '  for i in range(' + BitdogLabConfig.NEOPIXEL.COUNT + '):',
      '    np[i] = (0, 0, 0)',
      '  rgb = tuple(int(value * brightness * ' + BitdogLabConfig.NEOPIXEL.BRIGHTNESS + ' / 100) for value in colour)',
      '  for y in range(5):',
      '    for x in range(5):',
      '      if pattern[y * 5 + x]:',
      '        np[LED_MATRIX[y][x]] = rgb',
      '  np.write()',
      '  _matriz_status = "ON"',
      '  _matriz_desenho = name',
      '  _matriz_cor = colour',
      '  _matriz_brilho = brightness',
      '  _matriz_leds_count = sum(1 for i in range(' + BitdogLabConfig.NEOPIXEL.COUNT + ') if np[i] != (0, 0, 0))'
    ].join('\n');
  }

  function ensureLed() {
    ensureWait();
    var definitions = Blockly.Python.definitions_;
    definitions.import_pin = 'from machine import Pin';
    definitions.import_pwm = 'from machine import PWM';
    definitions.setup_led_red = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
    definitions.setup_led_green = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
    definitions.setup_led_blue = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
    definitions.feedback_led = [
      'def _feedback_led_off():',
      '  led_vermelho.duty_u16(0)',
      '  led_verde.duty_u16(0)',
      '  led_azul.duty_u16(0)',
      '',
      'def _feedback_led(colour):',
      '  _feedback_check()',
      '  led_vermelho.duty_u16(int(colour[0] * 257 * ' + RobotFeedback.ledBrightness + ' / 100))',
      '  led_verde.duty_u16(int(colour[1] * 257 * ' + RobotFeedback.ledBrightness + ' / 100))',
      '  led_azul.duty_u16(int(colour[2] * 257 * ' + RobotFeedback.ledBrightness + ' / 100))'
    ].join('\n');
  }

  ['happy', 'sad'].forEach(function(pattern, index) {
    var type = index ? 'robo_setas_rosto_triste' : 'robo_setas_rosto_feliz';
    Blockly.Python[type] = function(block) {
      ensureMatrix();
      return '_feedback_matrix(' + JSON.stringify(RobotFeedback.patterns[pattern]) + ', ' + colourCode(block) +
        ', ' + RobotFeedback.matrixBrightness + ', "' + (index ? 'Triste' : 'Feliz') + '")\n' +
        '_feedback_wait(' + RobotFeedback.observationMs + ')\n';
    };
  });

  Blockly.Python.robo_setas_coracao = function(block) {
    ensureMatrix();
    Blockly.Python.definitions_.feedback_heart = [
      'def _feedback_heart(colour):',
      '  try:',
      '    for _ in range(2):',
      '      for brightness in ' + JSON.stringify(RobotFeedback.pulseBrightness) + ':',
      '        _feedback_matrix(' + JSON.stringify(RobotFeedback.patterns.heart) + ', colour, brightness, "Coracao")',
      '        _feedback_wait(' + RobotFeedback.pulseStepMs + ')',
      '    _feedback_matrix(' + JSON.stringify(RobotFeedback.patterns.heart) + ', colour, ' + RobotFeedback.matrixBrightness + ', "Coracao")',
      '  except:',
      '    _feedback_matrix_clear()',
      '    raise'
    ].join('\n');
    return '_feedback_heart(' + colourCode(block) + ')\n';
  };

  Blockly.Python.robo_setas_led_aceso = function(block) {
    ensureLed();
    return '_feedback_led(' + colourCode(block) + ')\n' +
      '_feedback_wait(' + RobotFeedback.observationMs + ')\n';
  };

  Blockly.Python.robo_setas_led_piscando = function(block) {
    ensureLed();
    Blockly.Python.definitions_.feedback_blink = [
      'def _feedback_blink(colour):',
      '  try:',
      '    for _ in range(3):',
      '      _feedback_led(colour)',
      '      _feedback_wait(' + RobotFeedback.blinkStepMs + ')',
      '      _feedback_led_off()',
      '      _feedback_wait(' + RobotFeedback.blinkStepMs + ')',
      '  finally:',
      '    _feedback_led_off()'
    ].join('\n');
    return '_feedback_blink(' + colourCode(block) + ')\n';
  };

  ['beep', 'success'].forEach(function(sound, index) {
    Blockly.Python[index ? 'robo_setas_sucesso' : 'robo_setas_bipe'] = function() {
      ensureWait();
      var definitions = Blockly.Python.definitions_;
      definitions.import_pin = 'from machine import Pin';
      definitions.import_pwm = 'from machine import PWM';
      definitions.setup_buzzer = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
      definitions.feedback_sound = [
        'def _feedback_sound(notes):',
        '  try:',
        '    for frequency, duration in notes:',
        '      _feedback_check()',
        '      buzzer.duty_u16(0)',
        '      buzzer.freq(frequency)',
        '      buzzer.duty_u16(' + Math.round(65535 * RobotFeedback.volume * .7 / 100) + ')',
        '      _feedback_wait(duration)',
        '  finally:',
        '    buzzer.duty_u16(0)'
      ].join('\n');
      var notes = RobotFeedback.sounds[sound];
      var soundMs = notes.reduce(function(total, note) { return total + note[1]; }, 0);
      var silenceMs = Math.max(0, RobotFeedback.observationMs - soundMs);
      return '_feedback_sound(' + JSON.stringify(notes) + ')\n' +
        '_feedback_wait(' + silenceMs + ')\n';
    };
  });
})();
