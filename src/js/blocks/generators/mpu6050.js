// Python generators for the external MPU6050 motion sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for MPU6050 blocks.');
    return;
  }

  function numberConfig(config, key, fallback) {
    var value = Number(config[key]);
    return isFinite(value) ? value : fallback;
  }

  function ensureMpu6050ReadSupport() {
    var profile = global.BitdogLabConfig || {};
    var config = profile.EXTERNAL && profile.EXTERNAL.MPU6050 || {};
    var address = numberConfig(config, 'ADDRESS', 0x68);
    var cacheMs = numberConfig(config, 'SAMPLE_CACHE_MS', 40);
    var reconnectMs = numberConfig(config, 'RECONNECT_MS', 1000);
    var tiltDeadzone = numberConfig(config, 'TILT_DEADZONE_DEG', 2);
    var tiltRightSign = numberConfig(config, 'TILT_RIGHT_SIGN', 1) < 0 ? -1 : 1;
    var movementThreshold = numberConfig(config, 'MOVEMENT_THRESHOLD_MS2', 1.96133);
    var movementRelease = numberConfig(config, 'MOVEMENT_RELEASE_THRESHOLD_MS2', 1.1768);
    var movementHoldMs = numberConfig(config, 'MOVEMENT_HOLD_MS', 250);

    _setupSharedExternalI2c();
    Blockly.Python.definitions_['import_mpu6050_time'] = 'import time';
    Blockly.Python.definitions_['import_mpu6050_math'] = 'import math';
    Blockly.Python.definitions_['lib_mpu6050'] = SensorLibs.MPU6050;
    Blockly.Python.definitions_['setup_mpu6050'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '_mpu6050 = MPU6050(i2c, addr=' + address + ', quiet=True)\n' +
      '_mpu6050_cache = (float("nan"), float("nan"), float("nan"))\n' +
      '_mpu6050_cache_ms = 0\n' +
      '_mpu6050_cache_ready = False\n' +
      '_mpu6050_last_retry_ms = time.ticks_ms()\n' +
      '_mpu6050_previous_sample = None\n' +
      '_mpu6050_motion_active = False\n' +
      '_mpu6050_motion_last_ms = 0\n' +
      BitdogLabConfig.MARKERS.SETUP_END;

    Blockly.Python.definitions_['func_mpu6050_read'] =
      'def _mpu6050_reconnect():\n' +
      '  global _mpu6050_last_retry_ms\n' +
      '  if _mpu6050.is_ready:\n' +
      '    return True\n' +
      '  _now = time.ticks_ms()\n' +
      '  if time.ticks_diff(_now, _mpu6050_last_retry_ms) < ' + reconnectMs + ':\n' +
      '    return False\n' +
      '  _mpu6050_last_retry_ms = _now\n' +
      '  return _mpu6050.initialize()\n' +
      '\n' +
      'def _mpu6050_sample():\n' +
      '  global _mpu6050_cache, _mpu6050_cache_ms, _mpu6050_cache_ready\n' +
      '  _now = time.ticks_ms()\n' +
      '  if _mpu6050_cache_ready and time.ticks_diff(_now, _mpu6050_cache_ms) < ' + cacheMs + ':\n' +
      '    return _mpu6050_cache\n' +
      '  _sample_g = _mpu6050.acceleration() if (_mpu6050.is_ready or _mpu6050_reconnect()) else None\n' +
      '  if _sample_g is None:\n' +
      '    _mpu6050_cache = (float("nan"), float("nan"), float("nan"))\n' +
      '  else:\n' +
      '    _mpu6050_cache = tuple(_axis * 9.80665 for _axis in _sample_g)\n' +
      '  _mpu6050_cache_ms = _now\n' +
      '  _mpu6050_cache_ready = True\n' +
      '  return _mpu6050_cache\n' +
      '\n' +
      'def _mpu6050_inclinacao(direction):\n' +
      '  _ax, _ay, _az = _mpu6050_sample()\n' +
      '  if _ax != _ax or _ay != _ay or _az != _az:\n' +
      '    return float("nan")\n' +
      '  _angle = math.degrees(math.atan2(_ax, math.sqrt(_ay * _ay + _az * _az))) * ' + tiltRightSign + '\n' +
      '  _angle = _angle if direction == "RIGHT" else -_angle\n' +
      '  if _angle <= ' + tiltDeadzone + ':\n' +
      '    return 0.0\n' +
      '  return min(90.0, _angle)\n' +
      '\n' +
      'def _mpu6050_aceleracao(axis):\n' +
      '  _sample = _mpu6050_sample()\n' +
      '  _index = 0 if axis == "X" else (1 if axis == "Y" else 2)\n' +
      '  return _sample[_index]\n' +
      '\n' +
      'def _mpu6050_movimentado():\n' +
      '  global _mpu6050_previous_sample, _mpu6050_motion_active, _mpu6050_motion_last_ms\n' +
      '  _sample = _mpu6050_sample()\n' +
      '  _now = time.ticks_ms()\n' +
      '  if any(_value != _value for _value in _sample):\n' +
      '    _mpu6050_previous_sample = None\n' +
      '    _mpu6050_motion_active = False\n' +
      '    return False\n' +
      '  if _mpu6050_previous_sample is None:\n' +
      '    _mpu6050_previous_sample = _sample\n' +
      '    return False\n' +
      '  _dx = _sample[0] - _mpu6050_previous_sample[0]\n' +
      '  _dy = _sample[1] - _mpu6050_previous_sample[1]\n' +
      '  _dz = _sample[2] - _mpu6050_previous_sample[2]\n' +
      '  _delta = math.sqrt(_dx * _dx + _dy * _dy + _dz * _dz)\n' +
      '  _mpu6050_previous_sample = _sample\n' +
      '  if _delta >= ' + movementThreshold + ':\n' +
      '    _mpu6050_motion_active = True\n' +
      '    _mpu6050_motion_last_ms = _now\n' +
      '  elif _mpu6050_motion_active and _delta >= ' + movementRelease + ':\n' +
      '    _mpu6050_motion_last_ms = _now\n' +
      '  elif _mpu6050_motion_active and time.ticks_diff(_now, _mpu6050_motion_last_ms) >= ' + movementHoldMs + ':\n' +
      '    _mpu6050_motion_active = False\n' +
      '  return _mpu6050_motion_active\n' +
      '\n' +
      'def _mpu6050_formatar(value, unit=""):\n' +
      '  try:\n' +
      '    _number = float(value)\n' +
      '    if _number != _number:\n' +
      '      return "MPU?"\n' +
      '    return str(round(_number, 1)) + unit\n' +
      '  except Exception:\n' +
      '    return "MPU?"\n';
  }

  Blockly.Python['mpu6050_inclinacao'] = function(block) {
    ensureMpu6050ReadSupport();
    var direction = block.getFieldValue('DIRECTION') === 'LEFT' ? 'LEFT' : 'RIGHT';
    return [
      '_mpu6050_inclinacao(' + Blockly.Python.quote_(direction) + ')',
      Blockly.Python.ORDER_FUNCTION_CALL
    ];
  };

  Blockly.Python['mpu6050_aceleracao'] = function(block) {
    ensureMpu6050ReadSupport();
    var axis = block.getFieldValue('AXIS');
    if (axis !== 'Y' && axis !== 'Z') axis = 'X';
    return [
      '_mpu6050_aceleracao(' + Blockly.Python.quote_(axis) + ')',
      Blockly.Python.ORDER_FUNCTION_CALL
    ];
  };

  Blockly.Python['mpu6050_foi_movimentado'] = function(_block) {
    ensureMpu6050ReadSupport();
    return ['_mpu6050_movimentado()', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  global.ensureMpu6050ReadSupport = ensureMpu6050ReadSupport;
  console.log('[BitDogLab] MPU6050 value generators loaded.');
})(window);
