'use strict';

// BitDogLab V6 — perfil completo de hardware.
// Todos os pinos ficam explícitos aqui, inclusive os compartilhados com a V7.
var BitdogLabConfig_V6 = createProfile(BitdogLabProfileBase, {
  VERSION: 'v6',
  PINS: {
    // LED RGB
    LED_RED: 13,
    LED_GREEN: 11,
    LED_BLUE: 12,

    // Som e botões
    BUZZER: 10,
    BUTTON_A: 5,
    BUTTON_B: 6,
    BUTTON_C: null,

    // Joystick e matriz de LEDs
    JOYSTICK_X: 27,
    JOYSTICK_Y: 26,
    JOYSTICK_SW: 22,
    NEOPIXEL: 7,

    // Barramento I2C disponível na V6
    I2C_SCL: 15,
    I2C_SDA: 14,

    // Microfone
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

  JOYSTICK: {
    CENTER_VALUE: 32768,
    DEADZONE: 5000,
    INVERT_X: true,
    INVERT_Y: true
  },

  DISPLAY: {
    I2C_BUS: 1,
    I2C_FREQ: 400000,
    WIDTH: 128,
    HEIGHT: 64
  },

  EXTERNAL: {
    DIG_PINS: {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3
    },
    EXTERNAL_CONTACT: {
      ALLOWED_DIG: ['0', '1', '2', '3'],
      DEFAULT_COMMON: 'GND',
      DEBOUNCE_MS: 50
    },
    SERVO: {
      ALLOWED_DIG: ['0', '1', '2', '3'],
      PWM_FREQ: 50,
      MIN_ANGLE: 0,
      MAX_ANGLE: 180,
      MIN_PULSE_NS: 640000,
      MAX_PULSE_NS: 2420000
    },
    DHT11: {
      ALLOWED_DIG: ['0', '1', '2', '3'],
      MIN_INTERVAL_MS: 2000
    },
    EXTERNAL_LED: {
      ALLOWED_DIG: ['0', '1', '2', '3'],
      PWM_DIG: ['0', '1', '2', '3'],
      PWM_REQUIRED: true,
      PWM_FREQ: 1000,
      CHANNELS: ['R', 'G', 'B'],
      MAX_MODULES: 1,
      ACTIVE_LEVEL: 1,
      INACTIVE_LEVEL: 0
    }
  },

  ROBOT: {
    MPU_I2C_BUS: 0,
    MPU_I2C_SDA: 0,
    MPU_I2C_SCL: 1,
    MPU_I2C_BUS_ALT: 1,
    MPU_I2C_SDA_ALT: 14,
    MPU_I2C_SCL_ALT: 15,
    I2C_FREQ: 400000,
    LEFT_FWD: 4,
    LEFT_BWD: 9,
    LEFT_PWM: 8,
    RIGHT_FWD: 18,
    RIGHT_BWD: 19,
    RIGHT_PWM: 16,
    STBY: 20,
    PWM_FREQ: 1000,
    MOVE_SPEED: 35000,
    TURN_SPEED: 35000,
    TURN_DEADZONE_DPS: 0.8,
    TURN_TIMEOUT_MIN_MS: 1500,
    TURN_TIMEOUT_MS_PER_DEGREE: 120
  },

  ROBOT_POWER: {
    INA226_I2C_BUS: 1,
    INA226_I2C_SDA: 14,
    INA226_I2C_SCL: 15,
    INA226_ADDR: 0x40,
    SHUNT_RESISTOR_OHMS: 0.1,
    I2C_FREQ: 400000
  },

  SENSOR: {
    I2C_BUS: 0,
    I2C_FREQ: 400000,
    I2C_BUS_ALT: 1,
    AHT20_ADDR: '0x38',
    I2C_KNOWN_DEVICES: {
      0x38: 'AHT20',
      0x68: 'MPU6050'
    }
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig_V6;
}
