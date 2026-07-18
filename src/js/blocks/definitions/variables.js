// ==========================================
// Category: Variables
// ==========================================
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks || !Blockly.Variables) {
    console.warn('[BitDogLab] Blockly variables API is not available.');
    return;
  }

  var VARIABLE_COLOUR = 330;

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function variableField() {
    return new Blockly.FieldVariable('item', null, [''], '');
  }

  function setProgramConnections(block) {
    block.setPreviousStatement(true, 'ProgramCommand');
    block.setNextStatement(true, 'ProgramCommand');
    block.setColour(VARIABLE_COLOUR);
    block.setHelpUrl('');
  }

  Blockly.Blocks['variables_guardar'] = {
    init: function() {
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField(isEnglish() ? '🏁 Set initial value of' : '🏁 Definir valor inicial de')
          .appendField(variableField(), 'VAR')
          .appendField(isEnglish() ? 'to' : 'como');
      this.setInputsInline(true);
      setProgramConnections(this);
      this.setTooltip(isEnglish()
        ? 'Chooses the number this variable starts with. At the top level, it runs once before the main loop.'
        : 'Escolhe o número com que esta variável começa. No nível principal, executa uma vez antes do loop.');
    }
  };

  Blockly.Blocks['variables_alterar'] = {
    init: function() {
      this.appendValueInput('TARGET')
          .setCheck('Number')
          .appendField(isEnglish() ? '🔄 Change' : '🔄 Alterar');
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField(isEnglish() ? 'to' : 'para');
      var legacyInput = this.appendDummyInput('LEGACY_VAR')
          .appendField(variableField(), 'VAR');
      legacyInput.setVisible(false);
      this.setInputsInline(true);
      setProgramConnections(this);
      this.setTooltip(isEnglish()
        ? 'Replaces the value in the variable block when this action runs. The expression can add, subtract, multiply, or divide.'
        : 'Substitui o valor do bloco de variável quando esta ação acontecer. A conta pode somar, subtrair, multiplicar ou dividir.');
    },
    onchange: function() {
      var targetBlock = this.getInputTargetBlock && this.getInputTargetBlock('TARGET');
      if (!targetBlock || targetBlock.type !== 'variables_valor_guardado') {
        return;
      }

      var variableId = targetBlock.getFieldValue('VAR');
      if (variableId && this.getFieldValue('VAR') !== variableId) {
        this.setFieldValue(variableId, 'VAR');
      }
    }
  };

  Blockly.Blocks['variables_adicionar'] = {
    init: function() {
      this.appendValueInput('AMOUNT')
          .setCheck('Number')
          .appendField(isEnglish() ? '➕ Add' : '➕ Adicionar');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'to' : 'à')
          .appendField(variableField(), 'VAR');
      this.setInputsInline(true);
      setProgramConnections(this);
      this.setTooltip(isEnglish()
        ? 'Adds this amount to the number already stored. Example: add 1 to points.'
        : 'Adiciona esta quantidade ao número que já está guardado. Exemplo: adicionar 1 à pontuação.');
    }
  };

  Blockly.Blocks['variables_tirar'] = {
    init: function() {
      this.appendValueInput('AMOUNT')
          .setCheck('Number')
          .appendField(isEnglish() ? '➖ Take' : '➖ Tirar');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'from' : 'de')
          .appendField(variableField(), 'VAR');
      this.setInputsInline(true);
      setProgramConnections(this);
      this.setTooltip(isEnglish()
        ? 'Takes this amount from the number already stored. Example: take 1 from lives.'
        : 'Tira esta quantidade do número que já está guardado. Exemplo: tirar 1 de vidas.');
    }
  };

  Blockly.Blocks['variables_valor_guardado'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(isEnglish() ? '🔎 Value stored in' : '🔎 Valor guardado em')
          .appendField(variableField(), 'VAR');
      this.setOutput(true, 'Number');
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Gives the number stored in this program memory. Connect it to a numeric space, such as Show value.'
        : 'Entrega o número guardado nesta memória do programa. Encaixe em um espaço numérico, como Mostrar valor.');
      this.setHelpUrl('');
    }
  };

  function createNumberShadow(inputName, defaultValue) {
    var value = Blockly.utils.xml.createElement('value');
    value.setAttribute('name', inputName);

    var shadow = Blockly.utils.xml.createElement('shadow');
    shadow.setAttribute('type', 'math_number');

    var field = Blockly.utils.xml.createElement('field');
    field.setAttribute('name', 'NUM');
    field.appendChild(Blockly.utils.xml.createTextNode(String(defaultValue)));

    shadow.appendChild(field);
    value.appendChild(shadow);
    return value;
  }

  function createVariableValueBlock(variable) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'variables_valor_guardado');
    block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
    return block;
  }

  function createVariableValueInput(inputName, variable) {
    var value = Blockly.utils.xml.createElement('value');
    value.setAttribute('name', inputName);
    value.appendChild(createVariableValueBlock(variable));
    return value;
  }

  function createVariableArithmeticInput(inputName, variable, defaultValue) {
    var value = Blockly.utils.xml.createElement('value');
    value.setAttribute('name', inputName);

    var arithmetic = Blockly.utils.xml.createElement('block');
    arithmetic.setAttribute('type', 'math_arithmetic');

    var operator = Blockly.utils.xml.createElement('field');
    operator.setAttribute('name', 'OP');
    operator.appendChild(Blockly.utils.xml.createTextNode('ADD'));
    arithmetic.appendChild(operator);

    var left = Blockly.utils.xml.createElement('value');
    left.setAttribute('name', 'A');
    left.appendChild(createVariableValueBlock(variable));
    arithmetic.appendChild(left);

    arithmetic.appendChild(createNumberShadow('B', defaultValue));
    value.appendChild(arithmetic);
    return value;
  }

  function createVariableBlock(type, variable, inputName, defaultValue, gap) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', type);
    block.setAttribute('gap', String(gap));
    block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
    if (inputName) {
      block.appendChild(createNumberShadow(inputName, defaultValue));
    }
    return block;
  }

  function createAlterVariableBlock(variable, gap) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'variables_alterar');
    block.setAttribute('gap', String(gap));
    block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
    block.appendChild(createVariableValueInput('TARGET', variable));
    block.appendChild(createVariableArithmeticInput('VALUE', variable, 1));
    return block;
  }

  function variablesFlyout(workspace) {
    var items = [];
    var button = Blockly.utils.xml.createElement('button');
    button.setAttribute('text', isEnglish() ? '+ Create variable' : '+ Criar variável');
    button.setAttribute('callbackKey', 'CREATE_BITDOGLAB_VARIABLE');

    workspace.registerButtonCallback('CREATE_BITDOGLAB_VARIABLE', function(buttonInstance) {
      Blockly.Variables.createVariableButtonHandler(buttonInstance.getTargetWorkspace());
    });
    items.push(button);

    var variables = workspace.getVariablesOfType('');
    if (!variables.length) {
      return items;
    }

    variables.sort(Blockly.VariableModel.compareByName);
    var selectedVariable = variables[variables.length - 1];

    items.push(createVariableBlock('variables_guardar', selectedVariable, 'VALUE', 0, 12));
    items.push(createAlterVariableBlock(selectedVariable, 12));
    items.push(createVariableBlock('variables_adicionar', selectedVariable, 'AMOUNT', 1, 12));
    items.push(createVariableBlock('variables_tirar', selectedVariable, 'AMOUNT', 1, 12));
    items.push(createVariableBlock('variables_valor_guardado', selectedVariable, null, null, 8));
    return items;
  }

  // Blockly registers this callback automatically when the workspace is created.
  // Only the contents of the VARIABLE flyout are customized; variable storage,
  // rename/delete behavior and workspace persistence remain native Blockly behavior.
  Blockly.Variables.flyoutCategory = variablesFlyout;

  global.BitDogLabVariables = {
    flyoutCategory: variablesFlyout
  };

  console.log('[BitDogLab] Tangible variable blocks loaded.');
})(window);
