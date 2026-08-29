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

  Blockly.Python['mpu6050_bolinha_display'] = function(block) {
    var displayType = _setupDisplayForBlock(block);
    ensureMpu6050ReadSupport();

    var profile = global.BitdogLabConfig || {};
    var config = profile.EXTERNAL && profile.EXTERNAL.MPU6050 || {};
    var deadzone = numberConfig(config, 'BALL_DEADZONE_G', 0.04);
    var smoothing = numberConfig(config, 'BALL_SMOOTHING', 0.28);
    var xSign = numberConfig(config, 'BALL_X_SIGN', 1) < 0 ? -1 : 1;
    var ySign = numberConfig(config, 'BALL_Y_SIGN', -1) < 0 ? -1 : 1;
    var radius = Math.max(1, Math.min(4, Math.round(numberConfig(config, 'BALL_RADIUS', 2))));

    Blockly.Python.definitions_['setup_mpu6050_ball'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '_mpu6050_ball_x = (_display_width - 1) / 2\n' +
      '_mpu6050_ball_y = (_display_height - 1) / 2\n' +
      BitdogLabConfig.MARKERS.SETUP_END;
    Blockly.Python.definitions_['func_mpu6050_ball'] =
      'def _mpu6050_ball_update():\n' +
      '  global _mpu6050_ball_x, _mpu6050_ball_y\n' +
      '  _sample = _mpu6050_sample()\n' +
      '  _center_x = (_display_width - 1) / 2\n' +
      '  _center_y = (_display_height - 1) / 2\n' +
      '  oled.fill(0)\n' +
      '  if any(_value != _value for _value in _sample):\n' +
      '    _mpu6050_ball_x = _center_x\n' +
      '    _mpu6050_ball_y = _center_y\n' +
      '    oled.text("MPU?", max(0, int(_center_x) - 16), max(0, int(_center_y) - 4), 1)\n' +
      '    oled.show()\n' +
      '    return\n' +
      '  _gx = _sample[0] / 9.80665\n' +
      '  _gy = _sample[1] / 9.80665\n' +
      '  if abs(_gx) < ' + deadzone + ':\n' +
      '    _gx = 0.0\n' +
      '  if abs(_gy) < ' + deadzone + ':\n' +
      '    _gy = 0.0\n' +
      '  _gx = max(-1.0, min(1.0, _gx * ' + xSign + '))\n' +
      '  _gy = max(-1.0, min(1.0, _gy * ' + ySign + '))\n' +
      '  _target_x = _center_x + _gx * max(0, _center_x - ' + radius + ')\n' +
      '  _target_y = _center_y + _gy * max(0, _center_y - ' + radius + ')\n' +
      '  _mpu6050_ball_x += (_target_x - _mpu6050_ball_x) * ' + smoothing + '\n' +
      '  _mpu6050_ball_y += (_target_y - _mpu6050_ball_y) * ' + smoothing + '\n' +
      '  _ball_x = max(' + radius + ', min(_display_width - ' + (radius + 1) + ', int(round(_mpu6050_ball_x))))\n' +
      '  _ball_y = max(' + radius + ', min(_display_height - ' + (radius + 1) + ', int(round(_mpu6050_ball_y))))\n' +
      '  oled.fill_rect(_ball_x - 1, _ball_y - ' + radius + ', 3, ' + (radius * 2 + 1) + ', 1)\n' +
      '  oled.fill_rect(_ball_x - ' + radius + ', _ball_y - 1, ' + (radius * 2 + 1) + ', 3, 1)\n' +
      '  oled.show()\n';

    Blockly.Python.mpu6050BallDisplayType = displayType;
    return '_mpu6050_ball_update()\n';
  };

  global.ensureMpu6050ReadSupport = ensureMpu6050ReadSupport;
  console.log('[BitDogLab] MPU6050 value generators loaded.');
})(window);
