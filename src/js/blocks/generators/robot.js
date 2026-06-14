'use strict';

function _setupRoboMovelDefinitions() {
  var robot = BitdogLabConfig.ROBOT;
  Blockly.Python.definitions_['import_robo_machine'] = 'from machine import Pin, PWM, I2C, ADC';
  Blockly.Python.definitions_['import_robo_time'] = 'from time import sleep, sleep_ms, ticks_ms, ticks_diff';
  Blockly.Python.definitions_['import_robo_math'] = 'import math';
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
    '_robo_vel_movimento = ' + robot.MOVE_SPEED + '\n' +
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
    '_robo_giro_tempo = ticks_ms()\n' +
    'try:\n' +
    '  _robo_display_giro_ativo\n' +
    'except NameError:\n' +
    '  _robo_display_giro_ativo = False\n' +
    '  _robo_display_giro_linha_y = 8\n' +
    '  _robo_display_giro_alinhamento = "CENTER"\n' +
    '  _robo_display_giro_ultimo_ms = 0\n' +
    'try:\n' +
    '  _robo_display_acel_x_ativo\n' +
    'except NameError:\n' +
    '  _robo_display_acel_x_ativo = False\n' +
    '  _robo_display_acel_x_linha_y = 18\n' +
    '  _robo_display_acel_x_alinhamento = "CENTER"\n' +
    'try:\n' +
    '  _robo_display_acel_y_ativo\n' +
    'except NameError:\n' +
    '  _robo_display_acel_y_ativo = False\n' +
    '  _robo_display_acel_y_linha_y = 28\n' +
    '  _robo_display_acel_y_alinhamento = "CENTER"\n' +
    'try:\n' +
    '  _robo_display_acel_z_ativo\n' +
    'except NameError:\n' +
    '  _robo_display_acel_z_ativo = False\n' +
    '  _robo_display_acel_z_linha_y = 38\n' +
    '  _robo_display_acel_z_alinhamento = "CENTER"\n' +
    'try:\n' +
    '  _robo_display_transferidor_ativo\n' +
    'except NameError:\n' +
    '  _robo_display_transferidor_ativo = False\n' +
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
    'def _robo_mover_reto(esq_frente, esq_tras, dir_frente, dir_tras, tempo):\n' +
    '  t = max(0, float(tempo))\n' +
    '  _robo_parar()\n' +
    '  _robo_stby.value(1)\n' +
    '  if t <= 0:\n' +
    '    return\n' +
    '  sleep_ms(50)\n' +
    '  _robo_esq_frente.value(esq_frente)\n' +
    '  _robo_esq_tras.value(esq_tras)\n' +
    '  _robo_dir_frente.value(dir_frente)\n' +
    '  _robo_dir_tras.value(dir_tras)\n' +
    '  _robo_esq_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_dir_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_esperar_movimento(t)\n' +
    '  _robo_parar()\n' +
    '\n' +
    'def _robo_pivot_esq(velocidade):\n' +
    '  d = _robo_pwm(velocidade)\n' +
    '  _robo_stby.value(1)\n' +
    '  _robo_esq_frente.value(0)\n' +
    '  _robo_esq_tras.value(1)\n' +
    '  _robo_esq_pwm.duty_u16(d)\n' +
    '  _robo_dir_frente.value(1)\n' +
    '  _robo_dir_tras.value(0)\n' +
    '  _robo_dir_pwm.duty_u16(d)\n' +
    '\n' +
    'def _robo_pivot_dir(velocidade):\n' +
    '  d = _robo_pwm(velocidade)\n' +
    '  _robo_stby.value(1)\n' +
    '  _robo_esq_frente.value(1)\n' +
    '  _robo_esq_tras.value(0)\n' +
    '  _robo_esq_pwm.duty_u16(d)\n' +
    '  _robo_dir_frente.value(0)\n' +
    '  _robo_dir_tras.value(1)\n' +
    '  _robo_dir_pwm.duty_u16(d)\n' +
    '\n' +
    'def _robo_frente(tempo):\n' +
    '  _robo_mover_reto(0, 1, 0, 1, tempo)\n' +
    '\n' +
    'def _robo_tras(tempo):\n' +
    '  t = max(0, float(tempo))\n' +
    '  if t <= 0:\n' +
    '    _robo_parar()\n' +
    '    return\n' +
    '  _robo_stby.value(1)\n' +
    '  _robo_esq_frente.value(1)\n' +
    '  _robo_esq_tras.value(0)\n' +
    '  _robo_esq_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_dir_frente.value(1)\n' +
    '  _robo_dir_tras.value(0)\n' +
    '  _robo_dir_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_esperar_movimento(t)\n' +
    '  _robo_parar()\n' +
    '\n' +
    'def _robo_inicializar(espera=5):\n' +
    '  global _robo_pronto, _robo_angulo, _robo_giro_tempo\n' +
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
    '  _robo_giro_tempo = ticks_ms()\n' +
    '  print("Robo pronto!" if _robo_pronto else "Falha ao calibrar o robo.")\n' +
    '\n' +
    'def _robo_girar(graus, direcao="L"):\n' +
    '  global _robo_angulo, _robo_giro_tempo\n' +
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
    '    _robo_atualizar_display_instrumentos(False)\n' +
    '    sleep_ms(10)\n' +
    '  _robo_parar()\n' +
    '  _robo_giro_tempo = ticks_ms()\n' +
    '  sleep_ms(200)\n' +
    '  print("Giro", "esquerda" if direcao == "L" else "direita", round(acumulado, 1), "graus")\n' +
    '\n' +
    'def _robo_giro():\n' +
    '  global _robo_angulo, _robo_giro_tempo\n' +
    '  if not _robo_pronto or not _robo_mpu.is_ready:\n' +
    '    return _robo_angulo\n' +
    '  agora = ticks_ms()\n' +
    '  dt = min(ticks_diff(agora, _robo_giro_tempo) / 1000.0, 0.05)\n' +
    '  _robo_giro_tempo = agora\n' +
    '  gz = _robo_mpu.gz()\n' +
    '  if abs(gz) < _robo_zona_morta_giro:\n' +
    '    gz = 0.0\n' +
    '  _robo_angulo += gz * dt\n' +
    '  return _robo_angulo\n' +
    '\n' +
    'def _robo_aceleracao_x():\n' +
    '  if not _robo_pronto or not _robo_mpu.is_ready:\n' +
    '    return 0.0\n' +
    '  return _robo_mpu.ax() * 9.80665\n' +
    '\n' +
    'def _robo_aceleracao_y():\n' +
    '  if not _robo_pronto or not _robo_mpu.is_ready:\n' +
    '    return 0.0\n' +
    '  return _robo_mpu.ay() * 9.80665\n' +
    '\n' +
    'def _robo_aceleracao_z():\n' +
    '  if not _robo_pronto or not _robo_mpu.is_ready:\n' +
    '    return 0.0\n' +
    '  return _robo_mpu.az() * 9.80665\n' +
    '\n' +
    'def _robo_esperar_movimento(tempo):\n' +
    '  duracao_ms = int(max(0, float(tempo)) * 1000)\n' +
    '  inicio = ticks_ms()\n' +
    '  while ticks_diff(ticks_ms(), inicio) < duracao_ms:\n' +
    '    _robo_atualizar_display_instrumentos(True)\n' +
    '    sleep_ms(40)\n' +
    '\n' +
    'def _robo_atualizar_display_instrumentos(atualizar_giro=True):\n' +
    '  global _robo_display_giro_ultimo_ms\n' +
    '  if not _robo_display_giro_ativo and not _robo_display_acel_x_ativo and not _robo_display_acel_y_ativo and not _robo_display_acel_z_ativo and not _robo_display_transferidor_ativo:\n' +
    '    return\n' +
    '  agora = ticks_ms()\n' +
    '  if ticks_diff(agora, _robo_display_giro_ultimo_ms) < 200:\n' +
    '    return\n' +
    '  _robo_display_giro_ultimo_ms = agora\n' +
    '  try:\n' +
    '    if _robo_display_transferidor_ativo:\n' +
    '      valor_giro = _robo_giro() if atualizar_giro else _robo_angulo\n' +
    '      _robo_desenhar_transferidor_360(valor_giro)\n' +
    '      return\n' +
    '    if _robo_display_giro_ativo:\n' +
    '      valor_giro = _robo_giro() if atualizar_giro else _robo_angulo\n' +
    '      _robo_escrever_valor_display(valor_giro, _robo_display_giro_linha_y, _robo_display_giro_alinhamento, "")\n' +
    '    if _robo_display_acel_x_ativo:\n' +
    '      _robo_escrever_valor_display(_robo_aceleracao_x(), _robo_display_acel_x_linha_y, _robo_display_acel_x_alinhamento, " m/s2")\n' +
    '    if _robo_display_acel_y_ativo:\n' +
    '      _robo_escrever_valor_display(_robo_aceleracao_y(), _robo_display_acel_y_linha_y, _robo_display_acel_y_alinhamento, " m/s2")\n' +
    '    if _robo_display_acel_z_ativo:\n' +
    '      _robo_escrever_valor_display(_robo_aceleracao_z(), _robo_display_acel_z_linha_y, _robo_display_acel_z_alinhamento, " m/s2")\n' +
    '    oled.show()\n' +
    '  except Exception:\n' +
    '    pass\n' +
    '\n' +
    'def _robo_escrever_valor_display(valor, linha_y, alinhamento, sufixo=""):\n' +
    '  texto = str(round(valor, 4)) + sufixo\n' +
    '  if alinhamento == "LEFT":\n' +
    '    x = 3\n' +
    '    x_clear = 3\n' +
    '  elif alinhamento == "RIGHT":\n' +
    '    x = max(3, 125 - len(texto) * 8)\n' +
    '    x_clear = max(3, x - 40)\n' +
    '  else:\n' +
    '    x = max(3, (128 - len(texto) * 8) // 2)\n' +
    '    x_clear = max(3, x - 32)\n' +
    '  oled.fill_rect(x_clear, linha_y, 128 - x_clear, 8, 0)\n' +
    '  oled.text(texto, x, linha_y, 1)\n' +
    '\n' +
    'def _robo_desenhar_transferidor_360(valor_giro):\n' +
    '  angulo = valor_giro % 360\n' +
    '  texto = "{:.1f} graus".format(angulo)\n' +
    '  cx = _display_width // 2\n' +
    '  cy = min(_display_height - 26, max(34, _display_height // 2 + 8))\n' +
    '  raio = min(26, max(18, min(_display_width, _display_height) // 3))\n' +
    '  oled.fill(0)\n' +
    '  oled.text("Giro 360", max(0, (_display_width - 64) // 2), 0, 1)\n' +
    '  oled.text(texto, max(0, (_display_width - len(texto) * 8) // 2), 10, 1)\n' +
    '  for a in range(0, 360, 10):\n' +
    '    rad = math.radians(a - 90)\n' +
    '    x = int(cx + math.cos(rad) * raio)\n' +
    '    y = int(cy + math.sin(rad) * raio)\n' +
    '    oled.pixel(x, y, 1)\n' +
    '  for a in (0, 90, 180, 270):\n' +
    '    rad = math.radians(a - 90)\n' +
    '    x1 = int(cx + math.cos(rad) * (raio - 4))\n' +
    '    y1 = int(cy + math.sin(rad) * (raio - 4))\n' +
    '    x2 = int(cx + math.cos(rad) * (raio + 2))\n' +
    '    y2 = int(cy + math.sin(rad) * (raio + 2))\n' +
    '    oled.line(x1, y1, x2, y2, 1)\n' +
    '  rad = math.radians(angulo - 90)\n' +
    '  px = int(cx + math.cos(rad) * (raio - 5))\n' +
    '  py = int(cy + math.sin(rad) * (raio - 5))\n' +
    '  oled.line(cx, cy, px, py, 1)\n' +
    '  oled.pixel(cx, cy, 1)\n' +
    '  oled.pixel(cx + 1, cy, 1)\n' +
    '  oled.pixel(cx - 1, cy, 1)\n' +
    '  oled.pixel(cx, cy + 1, 1)\n' +
    '  oled.pixel(cx, cy - 1, 1)\n' +
    '  oled.show()\n';
}

function _setupRoboJoystickDefinitions() {
  _setupRoboMovelDefinitions();

  var pins = BitdogLabConfig.PINS;
  var joy = BitdogLabConfig.JOYSTICK;
  var invX = joy.INVERT_X === true;
  var invY = joy.INVERT_Y === true;
  var dxExpr = invX ? '(_jx - _robo_joy_centro)' : '(_robo_joy_centro - _jx)';
  var dyExpr = invY ? '(_jy - _robo_joy_centro)' : '(_robo_joy_centro - _jy)';

  Blockly.Python.definitions_['setup_robo_joystick'] =
    BitdogLabConfig.MARKERS.SETUP_START + '\n' +
    '_robo_joy_x = ADC(Pin(' + pins.JOYSTICK_X + '))\n' +
    '_robo_joy_y = ADC(Pin(' + pins.JOYSTICK_Y + '))\n' +
    '_robo_joy_centro = ' + joy.CENTER_VALUE + '\n' +
    '_robo_joy_zona_morta = ' + joy.DEADZONE + '\n' +
    BitdogLabConfig.MARKERS.SETUP_END;

  Blockly.Python.definitions_['func_robo_joystick'] =
    'def _robo_set_frente_continuo():\n' +
    '  _robo_stby.value(1)\n' +
    '  _robo_esq_frente.value(0)\n' +
    '  _robo_esq_tras.value(1)\n' +
    '  _robo_dir_frente.value(0)\n' +
    '  _robo_dir_tras.value(1)\n' +
    '  _robo_esq_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_dir_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '\n' +
    'def _robo_set_tras_continuo():\n' +
    '  _robo_stby.value(1)\n' +
    '  _robo_esq_frente.value(1)\n' +
    '  _robo_esq_tras.value(0)\n' +
    '  _robo_dir_frente.value(1)\n' +
    '  _robo_dir_tras.value(0)\n' +
    '  _robo_esq_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '  _robo_dir_pwm.duty_u16(_robo_pwm(_robo_vel_movimento))\n' +
    '\n' +
    'def _robo_controlar_joystick():\n' +
    '  _jx = _robo_joy_x.read_u16()\n' +
    '  _jy = _robo_joy_y.read_u16()\n' +
    '  _dx = ' + dxExpr + '\n' +
    '  _dy = ' + dyExpr + '\n' +
    '  if abs(_dx) <= _robo_joy_zona_morta and abs(_dy) <= _robo_joy_zona_morta:\n' +
    '    _robo_parar()\n' +
    '  elif abs(_dy) >= abs(_dx):\n' +
    '    if _dy > 0:\n' +
    '      _robo_set_frente_continuo()\n' +
    '    else:\n' +
    '      _robo_set_tras_continuo()\n' +
    '  else:\n' +
    '    if _dx < 0:\n' +
    '      _robo_pivot_esq(_robo_vel_giro)\n' +
    '    else:\n' +
    '      _robo_pivot_dir(_robo_vel_giro)\n' +
    '  sleep_ms(40)\n';
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

Blockly.Python['robo_frente'] = function(block) {
  _setupRoboMovelDefinitions();
  var tempo = Blockly.Python.valueToCode(block, 'TEMPO', Blockly.Python.ORDER_ATOMIC) || '1';
  return _roboSetupCode('_robo_frente(' + tempo + ')\n');
};

Blockly.Python['robo_tras'] = function(block) {
  _setupRoboMovelDefinitions();
  var tempo = Blockly.Python.valueToCode(block, 'TEMPO', Blockly.Python.ORDER_ATOMIC) || '1';
  return _roboSetupCode('_robo_tras(' + tempo + ')\n');
};

Blockly.Python['robo_girar'] = function(block) {
  _setupRoboMovelDefinitions();
  var graus = Blockly.Python.valueToCode(block, 'GRAUS', Blockly.Python.ORDER_ATOMIC) || '45';
  var direcao = block.getFieldValue('DIRECAO') || 'L';
  return _roboSetupCode('_robo_girar(' + graus + ', "' + direcao + '")\n');
};

Blockly.Python['robo_parar'] = function(_block) {
  _setupRoboMovelDefinitions();
  return _roboSetupCode('_robo_parar()\n');
};

Blockly.Python['robo_joystick'] = function(_block) {
  _setupRoboJoystickDefinitions();
  var code = BitdogLabConfig.MARKERS.LOOP_START + '\n';
  code += 'try:\n';
  code += '  while True:\n';
  code += '    _robo_controlar_joystick()\n';
  code += 'finally:\n';
  code += '  _robo_parar()\n';
  code += BitdogLabConfig.MARKERS.LOOP_END + '\n';
  return code;
};

Blockly.Python['robo_giro_valor'] = function(_block) {
  _setupRoboMovelDefinitions();
  return ['_robo_giro()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['robo_aceleracao_x'] = function(_block) {
  _setupRoboMovelDefinitions();
  return ['_robo_aceleracao_x()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['robo_aceleracao_y'] = function(_block) {
  _setupRoboMovelDefinitions();
  return ['_robo_aceleracao_y()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['robo_aceleracao_z'] = function(_block) {
  _setupRoboMovelDefinitions();
  return ['_robo_aceleracao_z()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['robo_transferidor_360'] = function(block) {
  _setupDisplayForBlock(block);
  _setupRoboMovelDefinitions();
  Blockly.Python.definitions_['setup_robo_display_transferidor_config'] =
    BitdogLabConfig.MARKERS.SETUP_START + '\n' +
    '_robo_display_transferidor_ativo = True\n' +
    BitdogLabConfig.MARKERS.SETUP_END;
  return '_robo_desenhar_transferidor_360(_robo_giro())\n';
};
