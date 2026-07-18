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
          .appendField(isEnglish() ? '📦 Store' : '📦 Guardar')
          .appendField(variableField(), 'VAR')
          .appendField(isEnglish() ? 'as' : 'como');
      this.setInputsInline(true);
      setProgramConnections(this);
      this.setTooltip(isEnglish()
        ? 'Puts a new number in the program memory. Use it at the beginning, for example: store points as 0.'
        : 'Coloca um número novo na memória do programa. Use no começo, por exemplo: guardar pontos como 0.');
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
