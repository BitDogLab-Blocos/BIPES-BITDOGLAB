// ==========================================
// Category: Variables
// ==========================================
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Python) {
    console.warn('[BitDogLab] Python generator is not available for variable blocks.');
    return;
  }

  function variableName(block) {
    return Blockly.Python.nameDB_.getName(
      block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME
    );
  }

  Blockly.Python['variables_guardar'] = function(block) {
    var name = variableName(block);
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
    return name + ' = ' + value + '\n';
  };

  Blockly.Python['variables_adicionar'] = function(block) {
    var name = variableName(block);
    var amount = Blockly.Python.valueToCode(block, 'AMOUNT', Blockly.Python.ORDER_ADDITIVE) || '0';
    return name + ' = (' + name + ' if isinstance(' + name + ', (int, float)) else 0) + ' + amount + '\n';
  };

  Blockly.Python['variables_tirar'] = function(block) {
    var name = variableName(block);
    var amount = Blockly.Python.valueToCode(block, 'AMOUNT', Blockly.Python.ORDER_ADDITIVE) || '0';
    return name + ' = (' + name + ' if isinstance(' + name + ', (int, float)) else 0) - ' + amount + '\n';
  };

  Blockly.Python['variables_valor_guardado'] = function(block) {
    return [variableName(block), Blockly.Python.ORDER_ATOMIC];
  };

  console.log('[BitDogLab] Tangible variable generators loaded.');
})(window);
