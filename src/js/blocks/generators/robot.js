'use strict';

function _setupRoboMovelDefinitions() {
  var robot = BitdogLabConfig.ROBOT;
  Blockly.Python.definitions_['import_robo_machine'] = 'from machine import Pin, PWM, I2C';
  Blockly.Python.definitions_['import_robo_time'] = 'from time import sleep, sleep_ms, ticks_ms, ticks_diff';
  Blockly.Python.definitions_['lib_mpu6050'] = SensorLibs.MPU6050;

  var start = BitdogLabConfig.MARKERS.SETUP_START;
  var end = BitdogLabConfig.MARKERS.SETUP_END;
  var hasAltMpuI2c = robot.MPU_I2C_BUS_ALT !== undefined &&
    robot.MPU_I2C_SDA_ALT !== undefined &&
    robot.MPU_I2C_SCL_ALT !== undefined;
  var mpuSetup =
    '_robo_i2c = I2C(' + robot.MPU_I2C_BUS + ', sda=Pin(' + robot.MPU_I2C_SDA + '), scl=Pin(' + robot.MPU_I2C_SCL + '), freq=' + robot.I2C_FREQ + ')\n' +
    '_robo_mpu = MPU6050(_robo_i2c)\n' +
    '_robo_mpu_bus = "I2C' + robot.MPU_I2C_BUS + ' GP' + robot.MPU_I2C_SDA + '/GP' + robot.MPU_I2C_SCL + '"\n';

  if (hasAltMpuI2c) {
    mpuSetup +=
      'if not _robo_mpu.is_ready:\n' +
      '  _robo_i2c = I2C(' + robot.MPU_I2C_BUS_ALT + ', sda=Pin(' + robot.MPU_I2C_SDA_ALT + '), scl=Pin(' + robot.MPU_I2C_SCL_ALT + '), freq=' + robot.I2C_FREQ + ')\n' +
      '  _robo_mpu = MPU6050(_robo_i2c)\n' +
      '  _robo_mpu_bus = "I2C' + robot.MPU_I2C_BUS_ALT + ' GP' + robot.MPU_I2C_SDA_ALT + '/GP' + robot.MPU_I2C_SCL_ALT + '"\n';
  }

  Blockly.Python.definitions_['setup_robo_movel'] =
    start + '\n' +
    mpuSetup +
    '_robo_esq_frente = Pin(' + robot.LEFT_FWD + ', Pin.OUT)\n' +
    '_robo_esq_tras = Pin(' + robot.LEFT_BWD + ', Pin.OUT)\n' +
    '_robo_esq_pwm = PWM(Pin(' + robot.LEFT_PWM + '))\n' +
    '_robo_esq_pwm.freq(' + robot.PWM_FREQ + ')\n' +
    '_robo_dir_frente = Pin(' + robot.RIGHT_FWD + ', Pin.OUT)\n' +
    '_robo_dir_tras = Pin(' + robot.RIGHT_BWD + ', Pin.OUT)\n' +
    '_robo_dir_pwm = PWM(Pin(' + robot.RIGHT_PWM + '))\n' +
    '_robo_dir_pwm.freq(' + robot.PWM_FREQ + ')\n' +
    '_robo_stby = Pin(' + robot.STBY + ', Pin.OUT)\n' +
    '_robo_stby.value(1)\n' +
    '_robo_vel_giro = ' + robot.TURN_SPEED + '\n' +
    '_robo_zona_morta_giro = ' + robot.TURN_DEADZONE_DPS + '\n' +
    '_robo_timeout_min_ms = ' + robot.TURN_TIMEOUT_MIN_MS + '\n' +
    '_robo_timeout_ms_por_grau = ' + robot.TURN_TIMEOUT_MS_PER_DEGREE + '\n' +
    '_robo_mpu_sda = ' + robot.MPU_I2C_SDA + '\n' +
    '_robo_mpu_scl = ' + robot.MPU_I2C_SCL + '\n' +
    '_robo_mpu_sda_alt = ' + (hasAltMpuI2c ? robot.MPU_I2C_SDA_ALT : 'None') + '\n' +
    '_robo_mpu_scl_alt = ' + (hasAltMpuI2c ? robot.MPU_I2C_SCL_ALT : 'None') + '\n' +
    '_robo_pronto = False\n' +
    '_robo_angulo = 0.0\n' +
    end;

  Blockly.Python.definitions_['func_robo_movel'] =
    'def _robo_pwm(valor):\n' +
    '  return max(0, min(65535, int(valor)))\n' +
    '\n' +
    'def _robo_parar():\n' +
    '  _robo_esq_frente.value(0)\n' +
    '  _robo_esq_tras.value(0)\n' +
    '  _robo_esq_pwm.duty_u16(0)\n' +
    '  _robo_dir_frente.value(0)\n' +
    '  _robo_dir_tras.value(0)\n' +
    '  _robo_dir_pwm.duty_u16(0)\n' +
    '\n' +
    'def _robo_pivot_esq(velocidade):\n' +
    '  d = _robo_pwm(velocidade)\n' +
    '  _robo_esq_frente.value(0)\n' +
    '  _robo_esq_tras.value(1)\n' +
    '  _robo_esq_pwm.duty_u16(d)\n' +
    '  _robo_dir_frente.value(1)\n' +
    '  _robo_dir_tras.value(0)\n' +
    '  _robo_dir_pwm.duty_u16(d)\n' +
    '\n' +
    'def _robo_pivot_dir(velocidade):\n' +
    '  d = _robo_pwm(velocidade)\n' +
    '  _robo_esq_frente.value(1)\n' +
    '  _robo_esq_tras.value(0)\n' +
    '  _robo_esq_pwm.duty_u16(d)\n' +
    '  _robo_dir_frente.value(0)\n' +
    '  _robo_dir_tras.value(1)\n' +
    '  _robo_dir_pwm.duty_u16(d)\n' +
    '\n' +
    'def _robo_inicializar(espera=5):\n' +
    '  global _robo_pronto, _robo_angulo\n' +
    '  _robo_parar()\n' +
    '  if espera > 0:\n' +
    '    print("Coloque o robo no chao. Iniciando em", espera, "s")\n' +
    '    sleep(float(espera))\n' +
    '  if not _robo_mpu.is_ready:\n' +
    '    if _robo_mpu_sda_alt is None:\n' +
    '      print("MPU6050 nao encontrado. Verifique SDA=GP{} e SCL=GP{}.".format(_robo_mpu_sda, _robo_mpu_scl))\n' +
    '    else:\n' +
    '      print("MPU6050 nao encontrado. Verifique GP{}/GP{} ou GP{}/GP{}.".format(_robo_mpu_sda, _robo_mpu_scl, _robo_mpu_sda_alt, _robo_mpu_scl_alt))\n' +
    '    _robo_pronto = False\n' +
    '    return\n' +
    '  print("MPU6050 encontrado em", _robo_mpu_bus)\n' +
    '  print("Calibrando giro. Nao mexa no robo.")\n' +
    '  _robo_pronto = _robo_mpu.calibrate()\n' +
    '  _robo_angulo = 0.0\n' +
    '  print("Robo pronto!" if _robo_pronto else "Falha ao calibrar o robo.")\n' +
    '\n' +
    'def _robo_girar(graus, direcao="L"):\n' +
    '  global _robo_angulo\n' +
    '  if not _robo_pronto:\n' +
    '    _robo_inicializar(0)\n' +
    '  if not _robo_mpu.is_ready:\n' +
    '    _robo_parar()\n' +
    '    return\n' +
    '  alvo = abs(float(graus))\n' +
    '  if alvo <= 0:\n' +
    '    _robo_parar()\n' +
    '    return\n' +
    '  direcao = "L" if direcao == "L" else "R"\n' +
    '  acumulado = 0.0\n' +
    '  inicio = ticks_ms()\n' +
    '  t_ant = inicio\n' +
    '  limite_ms = max(_robo_timeout_min_ms, int(alvo * _robo_timeout_ms_por_grau))\n' +
    '  sleep_ms(10)\n' +
    '  while acumulado < alvo and ticks_diff(ticks_ms(), inicio) < limite_ms:\n' +
    '    agora = ticks_ms()\n' +
    '    dt = min(ticks_diff(agora, t_ant) / 1000.0, 0.05)\n' +
    '    t_ant = agora\n' +
    '    gz = _robo_mpu.gz()\n' +
    '    if abs(gz) < _robo_zona_morta_giro:\n' +
    '      gz = 0.0\n' +
    '    delta = gz * dt if direcao == "L" else -gz * dt\n' +
    '    if delta > 0:\n' +
    '      acumulado += delta\n' +
    '    _robo_angulo += gz * dt\n' +
    '    if direcao == "L":\n' +
    '      _robo_pivot_esq(_robo_vel_giro)\n' +
    '    else:\n' +
    '      _robo_pivot_dir(_robo_vel_giro)\n' +
    '    sleep_ms(10)\n' +
    '  _robo_parar()\n' +
    '  sleep_ms(200)\n' +
    '  print("Giro", "esquerda" if direcao == "L" else "direita", round(acumulado, 1), "graus")\n';
}

function _roboSetupCode(code) {
  return BitdogLabConfig.MARKERS.SETUP_START + '\n' + code + BitdogLabConfig.MARKERS.SETUP_END + '\n';
}

Blockly.Python['robo_inicializar'] = function(block) {
  _setupRoboMovelDefinitions();
  var espera = Number(block.getFieldValue('ESPERA'));
  if (!isFinite(espera) || espera < 0) espera = 0;
  return _roboSetupCode('_robo_inicializar(' + espera + ')\n');
};

Blockly.Python['robo_girar'] = function(block) {
  _setupRoboMovelDefinitions();
  var graus = Blockly.Python.valueToCode(block, 'GRAUS', Blockly.Python.ORDER_ATOMIC) || '45';
  var direcao = block.getFieldValue('DIRECAO') || 'L';
  return _roboSetupCode('_robo_girar(' + graus + ', "' + direcao + '")\n');
};
