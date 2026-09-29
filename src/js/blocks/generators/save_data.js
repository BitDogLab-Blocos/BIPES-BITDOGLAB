// MicroPython generator for the first CSV data collection block.
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
    'def _bipes_save_csv(filename, interval_ms, duration_ms, with_clock, read_value):',
    '  header = "data_hora_local,valor" if with_clock else "valor"',
    '  if with_clock and time.localtime()[0] < 2024:',
    '    raise RuntimeError("Ajuste a data e a hora antes de salvar dados")',
    '  try:',
    '    with open(filename, "r") as existing:',
    '      first_line = existing.readline().rstrip("\\r\\n")',
    '    if first_line != header:',
    '      raise ValueError("CSV existente tem outro formato; renomeie o arquivo antigo")',
    '  except OSError as error:',
    '    if not error.args or error.args[0] != 2:',
    '      raise',
    '    with open(filename, "w") as new_file:',
    '      new_file.write(header + "\\n")',
    '  started = time.ticks_ms()',
    '  next_sample = started',
    '  while True:',
    '    now = time.ticks_ms()',
    '    if time.ticks_diff(now, started) > duration_ms:',
    '      break',
    '    remaining = time.ticks_diff(next_sample, now)',
    '    if remaining > 0:',
    '      time.sleep_ms(min(remaining, 50))',
    '      continue',
    '    value = read_value()',
    '    fields = []',
    '    if with_clock:',
    '      date = time.localtime()',
    '      fields.append("%02d/%02d/%04d %02d:%02d:%02d" % (date[2], date[1], date[0], date[3], date[4], date[5]))',
    '    fields.append(_bipes_csv_cell(value))',
    '    with open(filename, "a") as output:',
    '      output.write(",".join(fields) + "\\n")',
    '    next_sample = time.ticks_add(next_sample, interval_ms)',
    '    if time.ticks_diff(now, next_sample) >= 0:',
    '      next_sample = time.ticks_add(now, interval_ms)'
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
    if (withClock) {
      // ExecutionRunner replaces this marker with the computer's current UTC
      // immediately before sending code to the board.
      Blockly.Python.definitions_['marker_save_data_clock'] = '# BIPES_SAVE_DATA_RTC';
    }

    return '_bipes_save_csv(' + JSON.stringify(filename) + ', ' +
      Math.round(intervalSeconds * 1000) + ', ' +
      Math.round(durationMinutes * 60000) + ', ' +
      (withClock ? 'True' : 'False') + ', lambda: ' + value + ')\n';
  };
})(window);
