// MicroPython generators for CSV data collection and its LED indicator.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) return;

  var SUPPORT = [
    'def _bipes_csv_cell(value):',
    '  text = str(value)',
    '  if "," in text or "\\\"" in text or "\\n" in text or "\\r" in text:',
    '    return "\\\"" + text.replace("\\\"", "\\\"\\\"") + "\\\""',
    '  return text',
    '',
    'def _bipes_save_csv_step(key, filename, interval_ms, duration_ms, with_clock, read_value):',
    '  state = _bipes_csv_states.get(key)',
    '  if state is None:',
    '    header = "data_hora_local,valor" if with_clock else "valor"',
    '    if with_clock and time.localtime()[0] < 2024:',
    '      raise RuntimeError("Ajuste a data e a hora antes de salvar dados")',
    '    try:',
    '      with open(filename, "r") as existing:',
    '        first_line = existing.readline().rstrip("\\r\\n")',
    '      if first_line != header:',
    '        raise ValueError("CSV existente tem outro formato; renomeie o arquivo antigo")',
    '    except OSError as error:',
    '      if not error.args or error.args[0] != 2:',
    '        raise',
    '      with open(filename, "w") as new_file:',
    '        new_file.write(header + "\\n")',
    '    started = time.ticks_ms()',
    '    state = [started, started, False]',
    '    _bipes_csv_states[key] = state',
    '  if state[2]:',
    '    return',
    '  now = time.ticks_ms()',
    '  if time.ticks_diff(now, state[0]) > duration_ms:',
    '    state[2] = True',
    '    return',
    '  if time.ticks_diff(now, state[1]) >= 0:',
    '    value = read_value()',
    '    fields = []',
    '    if with_clock:',
    '      date = time.localtime()',
    '      fields.append("%02d/%02d/%04d %02d:%02d:%02d" % (date[2], date[1], date[0], date[3], date[4], date[5]))',
    '    fields.append(_bipes_csv_cell(value))',
    '    with open(filename, "a") as output:',
    '      output.write(",".join(fields) + "\\n")',
    '    _bipes_csv_led_pending[0] += 1',
    '    next_sample = time.ticks_add(state[1], interval_ms)',
    '    if time.ticks_diff(now, next_sample) >= 0:',
    '      next_sample = time.ticks_add(now, interval_ms)',
    '    state[1] = next_sample'
  ].join('\n');

  var LED_SUPPORT = [
    'def _bipes_save_led_step(colour, intensity):',
    '  if _bipes_csv_led_until[0] is not None:',
    '    if time.ticks_diff(time.ticks_ms(), _bipes_csv_led_until[0]) < 0:',
    '      return',
    '    led_vermelho.duty_u16(0)',
    '    led_verde.duty_u16(0)',
    '    led_azul.duty_u16(0)',
    '    _bipes_csv_led_until[0] = None',
    '  if _bipes_csv_led_pending[0] <= 0:',
    '    return',
    '  _bipes_csv_led_pending[0] -= 1',
    '  intensity = max(0, min(100, float(intensity)))',
    '  led_vermelho.duty_u16(int(colour[0] * 257 * intensity / 100))',
    '  led_verde.duty_u16(int(colour[1] * 257 * intensity / 100))',
    '  led_azul.duty_u16(int(colour[2] * 257 * intensity / 100))',
    '  _bipes_csv_led_until[0] = time.ticks_add(time.ticks_ms(), 120)'
  ].join('\n');

  Blockly.Python['salvar_dados_csv'] = function(block) {
    var filename = block.getFieldValue('ARQUIVO') || 'medidas.csv';
    if (!/^[a-zA-Z0-9_-]+\.csv$/i.test(filename)) filename = 'medidas.csv';
    var intervalSeconds = Math.max(1, Math.min(86400, Number(block.getFieldValue('INTERVALO')) || 10));
    var durationMinutes = Math.max(1, Math.min(1440, Number(block.getFieldValue('DURACAO')) || 5));
    var withClock = block.getFieldValue('DATA_HORA') === 'TRUE';
    var value = Blockly.Python.valueToCode(block, 'VALOR', Blockly.Python.ORDER_NONE) || '0';

    Blockly.Python.definitions_['import_save_data_time'] = 'import time';
    Blockly.Python.definitions_['support_save_data_csv'] = SUPPORT;
    Blockly.Python.definitions_['setup_save_data_states'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '_bipes_csv_states = {}\n' +
      '_bipes_csv_led_pending = [0]\n' +
      BitdogLabConfig.MARKERS.SETUP_END;
    if (withClock) {
      // ExecutionRunner replaces this marker with the computer's local time
      // immediately before sending code to the board.
      Blockly.Python.definitions_['marker_save_data_clock'] = '# BIPES_SAVE_DATA_RTC';
    }

    return '_bipes_save_csv_step(' + JSON.stringify(block.id || 'save_data') + ', ' +
      JSON.stringify(filename) + ', ' +
      Math.round(intervalSeconds * 1000) + ', ' +
      Math.round(durationMinutes * 60000) + ', ' +
      (withClock ? 'True' : 'False') + ', lambda: ' + value + ')\n';
  };

  Blockly.Python['piscar_led_ao_salvar'] = function(block) {
    var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC) || '(255, 0, 0)';
    var intensity = Blockly.Python.valueToCode(block, 'INTENSITY', Blockly.Python.ORDER_ATOMIC) || '50';

    Blockly.Python.definitions_['import_save_data_time'] = 'import time';
    Blockly.Python.definitions_['import_pin'] = 'from machine import Pin';
    Blockly.Python.definitions_['import_pwm'] = 'from machine import PWM';
    Blockly.Python.definitions_['setup_led_red'] = 'led_vermelho = PWM(Pin(' + BitdogLabConfig.PINS.LED_RED + '), freq=1000)';
    Blockly.Python.definitions_['setup_led_green'] = 'led_verde = PWM(Pin(' + BitdogLabConfig.PINS.LED_GREEN + '), freq=1000)';
    Blockly.Python.definitions_['setup_led_blue'] = 'led_azul = PWM(Pin(' + BitdogLabConfig.PINS.LED_BLUE + '), freq=1000)';
    Blockly.Python.definitions_['support_save_data_led'] = LED_SUPPORT;
    Blockly.Python.definitions_['setup_save_data_led'] =
      BitdogLabConfig.MARKERS.SETUP_START + '\n' +
      '_bipes_csv_led_until = [None]\n' +
      BitdogLabConfig.MARKERS.SETUP_END;
    if (!Blockly.Python.definitions_['setup_save_data_states']) {
      Blockly.Python.definitions_['setup_save_data_states'] =
        BitdogLabConfig.MARKERS.SETUP_START + '\n' +
        '_bipes_csv_led_pending = [0]\n' +
        BitdogLabConfig.MARKERS.SETUP_END;
    }
    return '_bipes_save_led_step(' + colour + ', ' + intensity + ')\n';
  };
})(window);
