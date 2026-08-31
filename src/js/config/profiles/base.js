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
             line.indexOf(' = SSD1306_I2C_PAGED(') !== -1 ||
             line.indexOf('=SSD1306_I2C_PAGED(') !== -1 ||
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
             // Estado persistente dos eventos de contatos externos.
             // Essas variáveis precisam ser inicializadas antes do loop
             // principal; se forem recriadas a cada ciclo, o debounce nunca
             // consegue reconhecer a transição de contato.
             line.startsWith('_contact_pin_numbers') ||
             line.startsWith('_contact_common') ||
             line.startsWith('_contact_pull') ||
             line.startsWith('_contact_active_level') ||
             line.startsWith('_contact_debounce_ms') ||
             line.startsWith('_contact_pins') ||
             line.startsWith('_contact_states') ||
             line.startsWith('_contact_event_seen') ||
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
             line.startsWith('MPU6050_') ||
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
             line.startsWith('_i2c_ultrassonico') ||
             line.startsWith('_ultrassonico =') ||
             line.startsWith('_ultrassonico_graficos =') ||
             line.startsWith('_ultrassonico_cache_') ||
             line.startsWith('_ultrassonico.ler()') ||
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

function validateExternalMpu6050Profile(profile) {
  var mpu = profile.EXTERNAL && profile.EXTERNAL.MPU6050;
  var prefix = 'Perfil BitDogLab ' + (profile.VERSION || '') + ' inválido: EXTERNAL.MPU6050 ';
  if (!mpu) {
    throw new Error(prefix + 'não foi configurado.');
  }

  var requiredFields = [
    'SUPPORTED',
    'I2C_BUS',
    'I2C_FREQ',
    'I2C_SDA',
    'I2C_SCL',
    'SDA_CONNECTION',
    'SCL_CONNECTION',
    'ADDRESS',
    'SAMPLE_CACHE_MS',
    'RECONNECT_MS',
    'TILT_DEADZONE_DEG',
    'TILT_RIGHT_SIGN',
    'MOVEMENT_THRESHOLD_MS2',
    'MOVEMENT_RELEASE_THRESHOLD_MS2',
    'MOVEMENT_CONFIRMATION_SAMPLES',
    'MOVEMENT_HOLD_MS',
    'BALL_DEADZONE_G',
    'BALL_SMOOTHING',
    'BALL_X_SIGN',
    'BALL_Y_SIGN',
    'BALL_RADIUS'
  ];
  var missingFields = requiredFields.filter(function(field) {
    return mpu[field] === undefined || mpu[field] === null;
  });
  if (missingFields.length) {
    throw new Error(prefix + 'está incompleto: ' + missingFields.join(', ') + '.');
  }

  if (mpu.SUPPORTED !== true && mpu.SUPPORTED !== false) {
    throw new Error(prefix + 'SUPPORTED deve ser booleano.');
  }

  var numericFields = requiredFields.filter(function(field) {
    return ['SUPPORTED', 'SDA_CONNECTION', 'SCL_CONNECTION'].indexOf(field) === -1;
  });
  var invalidNumericFields = numericFields.filter(function(field) {
    return !isFinite(Number(mpu[field]));
  });
  if (invalidNumericFields.length) {
    throw new Error(prefix + 'possui valores numéricos inválidos: ' + invalidNumericFields.join(', ') + '.');
  }

  if (String(mpu.SDA_CONNECTION) !== '2' || String(mpu.SCL_CONNECTION) !== '3') {
    throw new Error(prefix + 'deve manter SDA na Conexão 2 e SCL na Conexão 3.');
  }

  var digPins = profile.EXTERNAL.DIG_PINS || {};
  if (Number(mpu.I2C_SDA) !== Number(digPins['2']) || Number(mpu.I2C_SCL) !== Number(digPins['3'])) {
    throw new Error(prefix + 'não corresponde aos GPIOs das Conexões 2 e 3.');
  }

  if (Number(mpu.ADDRESS) !== 0x68) {
    throw new Error(prefix + 'ADDRESS deve ser 0x68 enquanto o pino AD0 permanecer desconectado.');
  }

  if (!Number.isInteger(Number(mpu.I2C_BUS)) || Number(mpu.I2C_BUS) < 0 ||
      Number(mpu.I2C_FREQ) <= 0 ||
      !Number.isInteger(Number(mpu.I2C_SDA)) || Number(mpu.I2C_SDA) < 0 ||
      !Number.isInteger(Number(mpu.I2C_SCL)) || Number(mpu.I2C_SCL) < 0) {
    throw new Error(prefix + 'possui barramento, frequência ou GPIO inválido.');
  }

  if (Number(mpu.SAMPLE_CACHE_MS) <= 0 || Number(mpu.RECONNECT_MS) < Number(mpu.SAMPLE_CACHE_MS)) {
    throw new Error(prefix + 'deve usar cache positivo e reconexão maior ou igual ao tempo do cache.');
  }

  if (Number(mpu.TILT_DEADZONE_DEG) < 0 || Number(mpu.TILT_DEADZONE_DEG) >= 90 ||
      Math.abs(Number(mpu.TILT_RIGHT_SIGN)) !== 1) {
    throw new Error(prefix + 'possui configuração de inclinação inválida.');
  }

  if (Number(mpu.MOVEMENT_THRESHOLD_MS2) <= 0 ||
      Number(mpu.MOVEMENT_RELEASE_THRESHOLD_MS2) < 0 ||
      Number(mpu.MOVEMENT_RELEASE_THRESHOLD_MS2) >= Number(mpu.MOVEMENT_THRESHOLD_MS2) ||
      !Number.isInteger(Number(mpu.MOVEMENT_CONFIRMATION_SAMPLES)) ||
      Number(mpu.MOVEMENT_CONFIRMATION_SAMPLES) < 1 ||
      Number(mpu.MOVEMENT_CONFIRMATION_SAMPLES) > 5 ||
      Number(mpu.MOVEMENT_HOLD_MS) < 0) {
    throw new Error(prefix + 'possui limiares de movimento inválidos.');
  }

  if (Number(mpu.BALL_DEADZONE_G) < 0 || Number(mpu.BALL_DEADZONE_G) >= 1 ||
      Number(mpu.BALL_SMOOTHING) <= 0 || Number(mpu.BALL_SMOOTHING) > 1 ||
      Math.abs(Number(mpu.BALL_X_SIGN)) !== 1 || Math.abs(Number(mpu.BALL_Y_SIGN)) !== 1 ||
      !Number.isInteger(Number(mpu.BALL_RADIUS)) || Number(mpu.BALL_RADIUS) < 1 || Number(mpu.BALL_RADIUS) > 4) {
    throw new Error(prefix + 'possui configuração inválida para a bolinha do Display.');
  }

  if (mpu.SUPPORTED === true) {
    var display = profile.DISPLAY || {};
    var pins = profile.PINS || {};
    if (Number(mpu.I2C_BUS) !== Number(display.I2C_BUS) ||
        Number(mpu.I2C_FREQ) !== Number(display.I2C_FREQ) ||
        Number(mpu.I2C_SDA) !== Number(pins.I2C_SDA) ||
        Number(mpu.I2C_SCL) !== Number(pins.I2C_SCL)) {
      throw new Error(prefix + 'marcado como suportado deve compartilhar barramento, frequência e pinos com o Display.');
    }
  }
}

function validateBitdogLabProfile(profile) {
  var required = [
    'PINS', 'NEOPIXEL', 'JOYSTICK', 'DISPLAY', 'ROBOT', 'ROBOT_POWER',
    'SENSOR', 'EXTERNAL', 'LED', 'LED_INIT', 'LOOP', 'MARKERS',
    'SETUP_PATTERNS'
  ];
  var missing = required.filter(function(section) {
    return !profile[section];
  });
  if (missing.length) {
    throw new Error('Perfil BitDogLab incompleto: ' + missing.join(', '));
  }
  validateExternalMpu6050Profile(profile);
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
    validateBitdogLabProfile: validateBitdogLabProfile,
    validateExternalMpu6050Profile: validateExternalMpu6050Profile
  };
}
