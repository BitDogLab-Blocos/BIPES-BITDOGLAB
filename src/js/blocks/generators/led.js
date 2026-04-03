// Auto-extracted from legacy generators.js into led.js
'use strict';

function _ledAnimContext(block) {
  var nextBlock = block.getNextBlock();
  var hasParent = block.getSurroundParent() !== null;
  var nextIsWait = nextBlock && (nextBlock.type === 'esperar_segundos' || nextBlock.type === 'esperar_milisegundos');

  if (!nextBlock && !hasParent) {
    return { mode: 'infinite', ind: '    ', ind2: '        ', header: 'while True:\n' };
  } else if (nextIsWait) {
    Blockly.Python.definitions_['import_utime'] = 'import utime';
    var timeVal = Blockly.Python.valueToCode(nextBlock, 'TIME', Blockly.Python.ORDER_ATOMIC) || '1';
    var timeMs = nextBlock.type === 'esperar_segundos'
      ? 'int(' + timeVal + ' * 1000)'
      : 'int(' + timeVal + ')';
    nextBlock._animConsumed = true;
    return {
      mode: 'timed',
      ind: '    ', ind2: '        ',
      header: '_anim_end = utime.ticks_add(utime.ticks_ms(), ' + timeMs + ')\n' +
              'while utime.ticks_diff(_anim_end, utime.ticks_ms()) > 0:\n'
    };
  }
  return { mode: 'single', ind: '', ind2: '    ', header: '' };
}

Blockly.Python["bloco_ligar_led"] = function(block) {
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

Blockly.Python["bloco_desligar_led"] = function(block) {
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

Blockly.Python["bloco_desligar_todos_leds"] = function(block) {
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

Blockly.Python["bloco_acender_led_brilho"] = function(block) {
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

Blockly.Python["bloco_piscar_led"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind + 'time.sleep_ms(200)\n';
  code += ctx.ind + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind + 'led_verde.duty_u16(0)\n';
  code += ctx.ind + 'led_azul.duty_u16(0)\n';
  code += ctx.ind + 'time.sleep_ms(200)\n';
  return code;
};

Blockly.Python["piscar_led_lento"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind + 'time.sleep_ms(1000)\n';
  code += ctx.ind + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind + 'led_verde.duty_u16(0)\n';
  code += ctx.ind + 'led_azul.duty_u16(0)\n';
  code += ctx.ind + 'time.sleep_ms(1000)\n';
  return code;
};

Blockly.Python["bloco_animar_led_coracao"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind + 'time.sleep_ms(100)\n';
  code += ctx.ind + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind + 'led_verde.duty_u16(0)\n';
  code += ctx.ind + 'led_azul.duty_u16(0)\n';
  code += ctx.ind + 'time.sleep_ms(100)\n';
  code += ctx.ind + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind + 'time.sleep_ms(100)\n';
  code += ctx.ind + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind + 'led_verde.duty_u16(0)\n';
  code += ctx.ind + 'led_azul.duty_u16(0)\n';
  code += ctx.ind + 'time.sleep_ms(700)\n';
  return code;
};

Blockly.Python["bloco_sinalizar_led_sos"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'for _ in range(3):\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind2 + 'time.sleep_ms(150)\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(0)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(0)\n';
  code += ctx.ind2 + 'time.sleep_ms(150)\n';
  code += ctx.ind + 'time.sleep_ms(400)\n';
  code += ctx.ind + 'for _ in range(3):\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind2 + 'time.sleep_ms(500)\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(0)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(0)\n';
  code += ctx.ind2 + 'time.sleep_ms(150)\n';
  code += ctx.ind + 'time.sleep_ms(400)\n';
  code += ctx.ind + 'for _ in range(3):\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(' + colour + '[0] * 257)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(' + colour + '[1] * 257)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(' + colour + '[2] * 257)\n';
  code += ctx.ind2 + 'time.sleep_ms(150)\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(0)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(0)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(0)\n';
  code += ctx.ind2 + 'time.sleep_ms(150)\n';
  code += ctx.ind + 'time.sleep_ms(800)\n';
  return code;
};

Blockly.Python["piscar_led_aleatorio"] = function(block) {
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

Blockly.Python["bloco_alternar_led"] = function(block) {
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

Blockly.Python["bloco_transicao_led"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var colour2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  // Transition is self-timed (50 steps x 100ms = 5s), no timed-consume needed
  var singleCycle = block.getNextBlock() !== null || block.getSurroundParent() !== null;
  var ind = singleCycle ? '' : '    ';
  var ind2 = singleCycle ? '    ' : '        ';
  var code = singleCycle ? '' : 'while True:\n';
  code += ind + 'for i in range(50):\n';
  code += ind2 + 'led_vermelho.duty_u16(int(' + colour1 + '[0] * 257 * (50-i)/50 + ' + colour2 + '[0] * 257 * i/50))\n';
  code += ind2 + 'led_verde.duty_u16(int(' + colour1 + '[1] * 257 * (50-i)/50 + ' + colour2 + '[1] * 257 * i/50))\n';
  code += ind2 + 'led_azul.duty_u16(int(' + colour1 + '[2] * 257 * (50-i)/50 + ' + colour2 + '[2] * 257 * i/50))\n';
  code += ind2 + 'time.sleep_ms(100)\n';
  if (!singleCycle) {
    code += ind + 'time.sleep_ms(1000)\n';
  }
  return code;
};

Blockly.Python["bloco_batalhar_led"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['import_urandom'] = 'import urandom';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var colour2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'if urandom.randint(0, 1) == 0:\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(' + colour1 + '[0] * 257)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(' + colour1 + '[1] * 257)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(' + colour1 + '[2] * 257)\n';
  code += ctx.ind + 'else:\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(' + colour2 + '[0] * 257)\n';
  code += ctx.ind2 + 'led_verde.duty_u16(' + colour2 + '[1] * 257)\n';
  code += ctx.ind2 + 'led_azul.duty_u16(' + colour2 + '[2] * 257)\n';
  code += ctx.ind + 'time.sleep_ms(urandom.randint(100, 300))\n';
  return code;
};

Blockly.Python["bloco_animar_led_brilhar"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
  Blockly.Python.definitions_['import_time'] = 'import time';
  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
  var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(0, 0, 0)';
  var ctx = _ledAnimContext(block);
  var code = ctx.header;
  code += ctx.ind + 'for i in range(10):\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(int(' + colour + '[0] * 257 * i/10))\n';
  code += ctx.ind2 + 'led_verde.duty_u16(int(' + colour + '[1] * 257 * i/10))\n';
  code += ctx.ind2 + 'led_azul.duty_u16(int(' + colour + '[2] * 257 * i/10))\n';
  code += ctx.ind2 + 'time.sleep_ms(50)\n';
  code += ctx.ind + 'for i in range(10, 0, -1):\n';
  code += ctx.ind2 + 'led_vermelho.duty_u16(int(' + colour + '[0] * 257 * i/10))\n';
  code += ctx.ind2 + 'led_verde.duty_u16(int(' + colour + '[1] * 257 * i/10))\n';
  code += ctx.ind2 + 'led_azul.duty_u16(int(' + colour + '[2] * 257 * i/10))\n';
  code += ctx.ind2 + 'time.sleep_ms(50)\n';
  code += ctx.ind + 'time.sleep_ms(200)\n';
  return code;
};

Blockly.Python["bloco_criar_animacao_led"] = function(block) {
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

Blockly.Python["led_turn_on"] = function(block) {
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

Blockly.Python["led_turn_off"] = function(block) {
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

Blockly.Python["led_turn_off_all"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';

  Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
  Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';

  return 'led_vermelho.duty_u16(0)\nled_verde.duty_u16(0)\nled_azul.duty_u16(0)\n';
};

Blockly.Python["alternar_acao_entre_cores"] = function(block) {
  Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
  var pin1 = Blockly.Python.valueToCode(block, 'COLOUR1', Blockly.Python.ORDER_ATOMIC) || '13';
  var pin2 = Blockly.Python.valueToCode(block, 'COLOUR2', Blockly.Python.ORDER_ATOMIC) || '11';
  var statements_do = Blockly.Python.statementToCode(block, 'DO');
  var code = 'Pin(' + pin1 + ', Pin.OUT).on()\nPin(' + pin2 + ', Pin.OUT).off()\n' + statements_do;
  code += 'Pin(' + pin1 + ', Pin.OUT).off()\nPin(' + pin2 + ', Pin.OUT).on()\n' + statements_do;
  return code;
};
