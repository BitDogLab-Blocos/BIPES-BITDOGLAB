// Pure policy for devices that share the external display I2C bus.
'use strict';

(function(global) {
  var ULTRASONIC_BLOCK_TYPES = {
    ultrassonico_distancia: true,
    ultrassonico_plotar: true
  };
  var MPU6050_BLOCK_TYPES = {
    mpu6050_inclinacao: true,
    mpu6050_aceleracao: true,
    mpu6050_foi_movimentado: true,
    mpu6050_bolinha_display: true
  };

  function workspaceUsesUltrasonic(workspace) {
    if (!workspace || typeof workspace.getAllBlocks !== 'function') return false;
    return workspace.getAllBlocks(false).some(function(block) {
      return Boolean(ULTRASONIC_BLOCK_TYPES[block.type]);
    });
  }

  function workspaceUsesMpu6050(workspace) {
    if (!workspace || typeof workspace.getAllBlocks !== 'function') return false;
    return workspace.getAllBlocks(false).some(function(block) {
      return Boolean(MPU6050_BLOCK_TYPES[block.type]);
    });
  }

  function resolveSharedDisplayBus(profile, workspace) {
    profile = profile || {};
    var pins = profile.PINS || {};
    var display = profile.DISPLAY || {};
    var ultrasonic = profile.EXTERNAL && profile.EXTERNAL.ULTRASSONICO || null;
    var mpu6050 = profile.EXTERNAL && profile.EXTERNAL.MPU6050 || null;
    var displayFrequency = Number(display.I2C_FREQ) || 400000;
    var sharesPhysicalBus = Boolean(ultrasonic) &&
      ultrasonic.I2C_BUS === display.I2C_BUS &&
      ultrasonic.I2C_SDA === pins.I2C_SDA &&
      ultrasonic.I2C_SCL === pins.I2C_SCL;
    var sharesUltrasonic = sharesPhysicalBus && workspaceUsesUltrasonic(workspace);
    var ultrasonicFrequency = ultrasonic ? Number(ultrasonic.I2C_FREQ) : displayFrequency;
    var sharesMpuBus = Boolean(mpu6050) && mpu6050.SUPPORTED === true &&
      mpu6050.I2C_BUS === display.I2C_BUS &&
      mpu6050.I2C_SDA === pins.I2C_SDA &&
      mpu6050.I2C_SCL === pins.I2C_SCL;
    var sharesMpu6050 = sharesMpuBus && workspaceUsesMpu6050(workspace);
    var mpuFrequency = mpu6050 ? Number(mpu6050.I2C_FREQ) : displayFrequency;
    var frequency = displayFrequency;

    if (sharesUltrasonic) {
      frequency = Math.min(frequency, ultrasonicFrequency || frequency);
    }
    if (sharesMpu6050) {
      frequency = Math.min(frequency, mpuFrequency || frequency);
    }

    return {
      bus: display.I2C_BUS,
      sda: pins.I2C_SDA,
      scl: pins.I2C_SCL,
      frequency: frequency,
      sharesUltrasonic: sharesUltrasonic,
      sharesMpu6050: sharesMpu6050
    };
  }

  global.BitdogLabI2cPolicy = {
    resolveSharedDisplayBus: resolveSharedDisplayBus,
    workspaceUsesUltrasonic: workspaceUsesUltrasonic,
    workspaceUsesMpu6050: workspaceUsesMpu6050
  };
})(window);
