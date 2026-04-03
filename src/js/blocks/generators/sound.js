// Auto-extracted from legacy generators.js into sound.js
'use strict';

const NOTE_FREQUENCIES = {
  'C4': 262, 'D4': 294, 'E4': 330, 'F4': 349, 'G4': 392, 'A4': 440, 'B4': 494,
  'C5': 523, 'D5': 587, 'E5': 659, 'F5': 698, 'G5': 784, 'A5': 880, 'B5': 988,
  'C6': 1047, 'D6': 1175, 'E6': 1319, 'F6': 1397, 'G6': 1568, 'A6': 1760, 'B6': 1976
};

Blockly.Python["nota_do"] = function(block) {
  return ['C', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_re"] = function(block) {
  return ['D', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_mi"] = function(block) {
  return ['E', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_fa"] = function(block) {
  return ['F', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_sol"] = function(block) {
  return ['G', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_la"] = function(block) {
  return ['A', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["nota_si"] = function(block) {
  return ['B', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["tocar_nota"] = function(block) {
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

Blockly.Python["tocar_som_agudo"] = function(block) {
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

Blockly.Python["parar_som"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['setup_buzzer'] = 'buzzer = PWM(Pin(' + BitdogLabConfig.PINS.BUZZER + '))';
  Blockly.Python.definitions_['setup_buzzer_mudo'] = '_buzzer_mudo = False';

  var code = '';
  code += 'buzzer.duty_u16(0)  # silencia o buzzer\n';
  code += '_buzzer_mudo = True  # impede som nas próximas iterações (quando há botões)\n';
  return code;
};

Blockly.Python["tocar_repetidamente"] = function(block) {
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

Blockly.Python["bipe_curto"] = function(block) {
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

Blockly.Python["bipe_duplo"] = function(block) {
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

Blockly.Python["alerta_intermitente"] = function(block) {
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

Blockly.Python["chamada"] = function(block) {
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

Blockly.Python["som_de_moeda"] = function(block) {
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

Blockly.Python["som_de_sucesso"] = function(block) {
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

Blockly.Python["som_de_falha"] = function(block) {
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

Blockly.Python["som_de_laser"] = function(block) {
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

Blockly.Python["sirene_policial"] = function(block) {
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

Blockly.Python["escala_musical_sobe"] = function(block) {
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

Blockly.Python["escala_musical_desce"] = function(block) {
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

Blockly.Python["brilha_brilha_estrelinha"] = function(block) {
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

Blockly.Python["natal_jingle_bells"] = function(block) {
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

Blockly.Python["natal_noite_feliz"] = function(block) {
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

Blockly.Python["natal_bate_sino"] = function(block) {
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

Blockly.Python["natal_noel"] = function(block) {
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

Blockly.Python["natal_o_vinde"] = function(block) {
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

Blockly.Python["criar_melodia"] = function(block) {
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

Blockly.Python["criar_trilha_sonora"] = function(block) {
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

Blockly.Python["rtttl_play"] = function(block) {
  var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
  var song = Blockly.Python.valueToCode(block, 'song', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_rtttl'] = 'import rtttl, songs';
  var code = 'play = rtttl.play(Pin(' + pin + ', Pin.OUT), songs.find(' + song + ')) \n';
  return code;
};

Blockly.Python["tone"] = function(block) {
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

Blockly.Python["note"] = function(block) {
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

Blockly.Python["tone_type"] = function(block) {
  var dropdown_tone = block.getFieldValue('tone');
  var code = dropdown_tone;
  return [code, Blockly.Python.ORDER_NONE]; // Fixed: was Blockly.JavaScript.ORDER_NONE
};
