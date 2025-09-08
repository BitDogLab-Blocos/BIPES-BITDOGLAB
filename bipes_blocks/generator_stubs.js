Blockly.Python['delay_seconds'] = function(block) {
  var number_time = block.getFieldValue('TIME');
  var code = 'time.sleep(' + number_time + ')\n';
  return code;
};

Blockly.Python['delay_microseconds'] = function(block) {
  var number_time = block.getFieldValue('TIME');
  var code = 'time.sleep_us(' + number_time + ')\n';
  return code;
};

Blockly.Python['reset'] = function(block) {
  // TODO: Assemble Python into code variable.
  var code = '...\n';
  return code;
};

Blockly.Python['gpio_set'] = function(block) {
  var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
  var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = '...\n';
  return code;
};

Blockly.Python['exec_python'] = function(block) {
  var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = '...\n';
  return code;
};