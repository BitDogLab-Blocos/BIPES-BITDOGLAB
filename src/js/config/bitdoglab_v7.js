'use strict';

// BitdogLab v7 — Hardware Configuration
// Para adaptar para outro hardware: altere PINS e as configurações dos periféricos.

const BitdogLabConfig = {

  // Pinos GPIO -> MUDE AQUI PARA OUTRO HARDWARE
  PINS: {
    LED_RED: 13, LED_GREEN: 11, LED_BLUE: 12,
    BUZZER: 21,
    BUTTON_A: 5, BUTTON_B: 6, BUTTON_C: 10,
    JOYSTICK_X: 27, JOYSTICK_Y: 26, JOYSTICK_SW: 22,
    NEOPIXEL: 7,
    I2C_SCL: 3, I2C_SDA: 2
  },

  // Periféricos
  NEOPIXEL: {
    COUNT: 25,
    MATRIX: [
      [24, 23, 22, 21, 20],
      [15, 16, 17, 18, 19],
      [14, 13, 12, 11, 10],
      [5,  6,  7,  8,  9],
      [4,  3,  2,  1,  0]
    ]
  },

  JOYSTICK: { CENTER_VALUE: 32768, DEADZONE: 5000 },

  DISPLAY: { I2C_BUS: 1, I2C_FREQ: 400000, WIDTH: 128, HEIGHT: 64 },

  // Variáveis Python geradas para os LEDs RGB
  LED: { PWM_FREQ: 1000, VAR_RED: 'led_vermelho', VAR_GREEN: 'led_verde', VAR_BLUE: 'led_azul' },

  // Engine — usada por app.js para montar o código final
  LED_INIT: {
    generateInitCode: function(rawCode) {
      var led = BitdogLabConfig.LED;
      var r = rawCode.indexOf(led.VAR_RED) !== -1;
      var g = rawCode.indexOf(led.VAR_GREEN) !== -1;
      var b = rawCode.indexOf(led.VAR_BLUE) !== -1;
      if (!r && !g && !b) return '';
      var code = '\n# Inicializar LEDs (desligar todos)\n';
      if (r) code += led.VAR_RED + '.duty_u16(0)\n';
      if (g) code += led.VAR_GREEN + '.duty_u16(0)\n';
      if (b) code += led.VAR_BLUE + '.duty_u16(0)\n';
      return code;
    }
  },

  LOOP: {
    DELAY_MS: 50,
    getDelayCode: function() {
      return '  time.sleep_ms(' + this.DELAY_MS + ')  # Pausa de cortesia\n';
    }
  },

  MARKERS: {
    LOOP_START:    '# LOOP_BLOCK_START',
    LOOP_END:      '# LOOP_BLOCK_END',
    SOUND_START:   '# SOUND_BLOCK_START',
    SOUND_END:     '# SOUND_BLOCK_END',
    SETUP_START:   '# SETUP_BLOCK_START',
    SETUP_END:     '# SETUP_BLOCK_END',
    STATIC_CONFIG: 'CONFIGURACAO_FIXA'
  },

  SETUP_PATTERNS: {
    isSetupLine: function(line) {
      if (line.startsWith(' ') || line.startsWith('\t')) return false;
      return line.indexOf(' = Pin(') !== -1 ||
             line.indexOf('=Pin(') !== -1 ||
             line.indexOf(' = PWM(') !== -1 ||
             line.indexOf('=PWM(') !== -1 ||
             line.indexOf(' = I2C(') !== -1 ||
             line.indexOf('=I2C(') !== -1 ||
             line.indexOf(' = SSD1306_I2C(') !== -1 ||
             line.indexOf('=SSD1306_I2C(') !== -1 ||
             line.startsWith('LED_MATRIX = ') ||
             line.startsWith('np = neopixel') ||
             line.startsWith('EMOJIS_5X5 = ') ||
             line.startsWith('NUMEROS_5X5 = ') ||
             line.startsWith('_contador_repeticao = ') ||
             (line.startsWith('_crono_') && (line.endsWith(' = 0') || line.endsWith(' = False'))) ||
             (line.startsWith('estado_anterior_botao_') && line.endsWith(' = 1')) ||
             line.startsWith('flag_botao_') ||
             line.startsWith('last_time_') ||
             line.startsWith('def callback_') ||
             line.startsWith('def _btn_') ||
             line.startsWith('_btn_a_count') ||
             line.startsWith('_btn_b_count') ||
             line.startsWith('_btn_c_count') ||
             line.startsWith('_btn_a_last_time') ||
             line.startsWith('_btn_b_last_time') ||
             line.startsWith('_btn_c_last_time') ||
             line.startsWith('_debounce_ms') ||
             line.indexOf('.irq(trigger=') !== -1 ||
             line.indexOf(' = ADC(') !== -1 ||
             line.startsWith('joystick_') ||
             line.startsWith('botao_joy') ||
             line.startsWith('_joy_');
    }
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = BitdogLabConfig;
