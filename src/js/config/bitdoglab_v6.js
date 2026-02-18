'use strict';

// BitdogLab v6 — Hardware Configuration
// Diferenças em relação à v7:
//   - Display: GPIO14 (SDA) / GPIO15 (SCL)  [v7 usa GPIO2/3]
//   - Buzzer principal: GPIO10 (Buzzer-B)    [v7 usa GPIO21]
//   - Sem botão C (GPIO10 é buzzer na v6)

const BitdogLabConfig_V6 = {

  PINS: {
    LED_RED: 13, LED_GREEN: 11, LED_BLUE: 12,
    BUZZER: 10,
    BUTTON_A: 5, BUTTON_B: 6, BUTTON_C: null,
    JOYSTICK_X: 27, JOYSTICK_Y: 26, JOYSTICK_SW: 22,
    NEOPIXEL: 7,
    I2C_SCL: 15, I2C_SDA: 14,
    MIC: 28
  },

  NEOPIXEL: {
    COUNT: 25,
    BRIGHTNESS: 0.2,
    MATRIX: [
      [24, 23, 22, 21, 20],
      [15, 16, 17, 18, 19],
      [14, 13, 12, 11, 10],
      [5,  6,  7,  8,  9],
      [4,  3,  2,  1,  0]
    ]
  },

  JOYSTICK: { CENTER_VALUE: 32768, DEADZONE: 5000, INVERT_X: true, INVERT_Y: true },

  DISPLAY: { I2C_BUS: 1, I2C_FREQ: 400000, WIDTH: 128, HEIGHT: 64 },

  LED: { PWM_FREQ: 1000, VAR_RED: 'led_vermelho', VAR_GREEN: 'led_verde', VAR_BLUE: 'led_azul' },

  LED_INIT: {
    generateInitCode: function(rawCode) {
      var led = BitdogLabConfig_V6.LED;
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
             line.startsWith('_btn_joystick_count') ||
             line.startsWith('_btn_a_last_time') ||
             line.startsWith('_btn_b_last_time') ||
             line.startsWith('_btn_c_last_time') ||
             line.startsWith('_btn_joystick_last_time') ||
             line.startsWith('_debounce_ms') ||
             line.indexOf('.irq(trigger=') !== -1 ||
             line.indexOf(' = ADC(') !== -1 ||
             line.startsWith('joystick_') ||
             line.startsWith('botao_joy') ||
             line.startsWith('_joy_') ||
             line.startsWith('_intensidade_joy') ||
             line.startsWith('_freq_joy') ||
             line.startsWith('_MIC_OFFSET') ||
             line === '_mic_nivel = 0' ||
             line === '_barra_pct = 0' ||
             (line.startsWith('_buzzer_mudo') && line.indexOf('True') === -1) ||
             line.startsWith('_player_size') ||
             line === '_px = 0' ||
             line === '_py = 0' ||
             line.startsWith('_pen_size = ') ||
             line.startsWith('_lx = ') ||
             line.startsWith('_ly = ') ||
             (line.startsWith('_seletor_') && line.endsWith(' = 0')) ||
             (line.startsWith('_cursor_col = ') || line.startsWith('_cursor_row = ') || line.startsWith('_cursor_tempo = ')) ||
             line.startsWith('EMOJI_NAMES =') ||
             (line.startsWith('_matriz_') && (
               line.endsWith(' = "OFF"') ||
               line.endsWith(' = ""') ||
               line.endsWith(' = (0, 0, 0)') ||
               line.endsWith(' = 0') ||
               line.endsWith(' = False')));
    }
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = BitdogLabConfig_V6;
