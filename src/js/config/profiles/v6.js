'use strict';

// BitDogLab V6 overrides only the hardware differences from V7 defaults.
var BitdogLabConfig_V6 = createProfile(BitdogLabProfileBase, {
  PINS: {
    BUZZER: 10,
    BUTTON_C: null,
    I2C_SCL: 15,
    I2C_SDA: 14
  },
  NEOPIXEL: {
    BRIGHTNESS: 0.2
  },
  JOYSTICK: {
    INVERT_X: true,
    INVERT_Y: true
  },
  ROBOT: {
    MPU_I2C_SDA_ALT: 14,
    MPU_I2C_SCL_ALT: 15
  },
  ROBOT_POWER: {
    INA226_I2C_SDA: 14,
    INA226_I2C_SCL: 15
  }
});

// These keys were not exposed by the original V6 profile.
delete BitdogLabConfig_V6.PINS.I2C0_SCL;
delete BitdogLabConfig_V6.PINS.I2C0_SDA;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig_V6;
}

