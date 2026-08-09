'use strict';

// Regras compartilhadas por todas as revisões da BitDogLab.
// Pinos e periféricos físicos pertencem aos arquivos v6.js e v7.js.

var BitdogLabProfileBase = {

  // Variáveis Python geradas para os LEDs RGB
  LED: { PWM_FREQ: 1000, VAR_RED: 'led_vermelho', VAR_GREEN: 'led_verde', VAR_BLUE: 'led_azul' },

  // Preenchido por createProfile para usar o perfil selecionado.
  LED_INIT: {},

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
      // Verifica linhas com indentação (para _plot_* e outras variáveis globais)
      var trimmed = line.trim();
      if (trimmed.startsWith('_plot_buffers')) {
        return true;
      }
      if (line.startsWith(' ') || line.startsWith('\t')) return false;
      return line.indexOf(' = Pin(') !== -1 ||
             line.indexOf('=Pin(') !== -1 ||
             line.indexOf(' = PWM(') !== -1 ||
             line.indexOf('=PWM(') !== -1 ||
             line.indexOf(' = const(') !== -1 ||
             line.indexOf('=const(') !== -1 ||
             line.indexOf(' = I2C(') !== -1 ||
             line.indexOf('=I2C(') !== -1 ||
             line.indexOf(' = SSD1306_I2C(') !== -1 ||
             line.indexOf('=SSD1306_I2C(') !== -1 ||
             line.indexOf(' = SH1107_I2C(') !== -1 ||
             line.indexOf('=SH1107_I2C(') !== -1 ||
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
             line === '_palmas = 0' ||
             line === '_mic_ultima_palma = 0' ||
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
             line.startsWith('AHT20_ADDR') ||
             line.startsWith('MPU6050_ADDR') ||
             line.startsWith('INA226_ADDR') ||
             line.startsWith('CONFIG_REG') ||
             line.startsWith('SHUNT_VOLTAGE_REG') ||
             line.startsWith('BUS_VOLTAGE_REG') ||
             line.startsWith('_aht20') ||
             line.startsWith('_robo_ina226') ||
             line.startsWith('_ssd1306_') ||
             line.startsWith('_display_width') ||
             line.startsWith('_display_height') ||
             line.startsWith('_sh1107_') ||
             line.startsWith('_i2c_sensor') ||
             line.startsWith('_i2c_estufa') ||
             line.startsWith('_aht_esq') ||
             line.startsWith('_aht_dir') ||
             line.startsWith('_estufa_esq_on') ||
             line.startsWith('_estufa_dir_on') ||
             (line.startsWith('_matriz_') && (
               line.endsWith(' = "OFF"') ||
               line.endsWith(' = ""') ||
               line.endsWith(' = (0, 0, 0)') ||
               line.endsWith(' = 0') ||
               line.endsWith(' = False')));
    }
  }
};


function cloneProfileValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneProfileValue);
  }
  if (value && typeof value === 'object') {
    var copy = {};
    Object.keys(value).forEach(function(key) {
      copy[key] = cloneProfileValue(value[key]);
    });
    return copy;
  }
  return value;
}

function mergeProfile(target, overrides) {
  Object.keys(overrides || {}).forEach(function(key) {
    var value = overrides[key];
    var current = target[key];
    var mergeable = value && current &&
      typeof value === 'object' && typeof current === 'object' &&
      !Array.isArray(value) && !Array.isArray(current);

    target[key] = mergeable
      ? mergeProfile(current, value)
      : cloneProfileValue(value);
  });
  return target;
}

function validateBitdogLabProfile(profile) {
  var required = [
    'PINS', 'NEOPIXEL', 'JOYSTICK', 'DISPLAY', 'ROBOT', 'ROBOT_POWER',
    'SENSOR', 'LED', 'LED_INIT', 'LOOP', 'MARKERS', 'SETUP_PATTERNS'
  ];
  var missing = required.filter(function(section) {
    return !profile[section];
  });
  if (missing.length) {
    throw new Error('Perfil BitDogLab incompleto: ' + missing.join(', '));
  }
  return profile;
}

function createProfile(baseProfile, overrides) {
  var profile = mergeProfile(cloneProfileValue(baseProfile), overrides || {});

  profile.LED_INIT.generateInitCode = function(rawCode) {
    var led = profile.LED;
    var red = rawCode.indexOf(led.VAR_RED) !== -1;
    var green = rawCode.indexOf(led.VAR_GREEN) !== -1;
    var blue = rawCode.indexOf(led.VAR_BLUE) !== -1;
    if (!red && !green && !blue) return '';

    var code = '\n# Inicializar LEDs (desligar todos)\n';
    if (red) code += led.VAR_RED + '.duty_u16(0)\n';
    if (green) code += led.VAR_GREEN + '.duty_u16(0)\n';
    if (blue) code += led.VAR_BLUE + '.duty_u16(0)\n';
    return code;
  };

  return validateBitdogLabProfile(profile);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BitdogLabProfileBase: BitdogLabProfileBase,
    createProfile: createProfile,
    validateBitdogLabProfile: validateBitdogLabProfile
  };
}
