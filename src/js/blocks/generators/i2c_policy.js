// Pure policy for devices that share the external display I2C bus.
'use strict';

(function(global) {
  var ULTRASONIC_BLOCK_TYPES = {
    ultrassonico_distancia: true,
    ultrassonico_plotar: true
  };

  function workspaceUsesUltrasonic(workspace) {
    if (!workspace || typeof workspace.getAllBlocks !== 'function') return false;
    return workspace.getAllBlocks(false).some(function(block) {
      return Boolean(ULTRASONIC_BLOCK_TYPES[block.type]);
    });
  }

  function resolveSharedDisplayBus(profile, workspace) {
    profile = profile || {};
    var pins = profile.PINS || {};
    var display = profile.DISPLAY || {};
    var ultrasonic = profile.EXTERNAL && profile.EXTERNAL.ULTRASSONICO || null;
    var displayFrequency = Number(display.I2C_FREQ) || 400000;
    var sharesPhysicalBus = Boolean(ultrasonic) &&
      ultrasonic.I2C_BUS === display.I2C_BUS &&
      ultrasonic.I2C_SDA === pins.I2C_SDA &&
      ultrasonic.I2C_SCL === pins.I2C_SCL;
    var sharesUltrasonic = sharesPhysicalBus && workspaceUsesUltrasonic(workspace);
    var ultrasonicFrequency = ultrasonic ? Number(ultrasonic.I2C_FREQ) : displayFrequency;

    return {
      bus: display.I2C_BUS,
      sda: pins.I2C_SDA,
      scl: pins.I2C_SCL,
      frequency: sharesUltrasonic
        ? Math.min(displayFrequency, ultrasonicFrequency || displayFrequency)
        : displayFrequency,
      sharesUltrasonic: sharesUltrasonic
    };
  }

  global.BitdogLabI2cPolicy = {
    resolveSharedDisplayBus: resolveSharedDisplayBus,
    workspaceUsesUltrasonic: workspaceUsesUltrasonic
  };
})(window);
