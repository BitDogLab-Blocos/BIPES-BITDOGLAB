// ==========================================
// Category: External LEDs (KY-016 used as a one-channel digital LED)
// ==========================================
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) return;

  var COLOUR = 35;
  var VARIABLE_TYPE = 'ExternalLed';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  // The name is a wiring label, not a Python variable. Keeping a FieldVariable
  // gives us Blockly's rename and XML persistence behavior while preventing the
  // Python generator from creating an unused ``name = None`` assignment.
  function externalLedField() {
    var field = new Blockly.FieldVariable('LED', null, [VARIABLE_TYPE], VARIABLE_TYPE);
    field.referencesVariables = function() { return false; };
    return field;
  }

  function setCommandShape(block, label, tooltip) {
    block.appendDummyInput()
      .appendField(label)
      .appendField(externalLedField(), 'LED')
      .appendField(isEnglish() ? 'on Connection' : 'na Conexão')
      .appendField(new Blockly.FieldDropdown([
        [isEnglish() ? 'Connection 0' : 'Conexão 0', '0'],
        [isEnglish() ? 'Connection 1' : 'Conexão 1', '1'],
        [isEnglish() ? 'Connection 2' : 'Conexão 2', '2'],
        [isEnglish() ? 'Connection 3' : 'Conexão 3', '3']
      ]), 'DIG');
    block.setInputsInline(true);
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(COLOUR);
    block.setTooltip(tooltip);
    block.setHelpUrl('');
  }

  Blockly.Blocks['led_externo_ligar'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '💡 Turn on external LED' : '💡 Ligar LED externo',
        isEnglish() ? 'Turns on the selected LED channel.' : 'Liga o canal digital do LED externo selecionado.');
    }
  };

  Blockly.Blocks['led_externo_desligar'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '🌑 Turn off external LED' : '🌑 Desligar LED externo',
        isEnglish() ? 'Turns off the selected LED channel.' : 'Desliga o canal digital do LED externo selecionado.');
    }
  };

  Blockly.Blocks['led_externo_piscar_rapido'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '⚡ Blink external LED quickly' : '⚡ Piscar LED externo rápido',
        isEnglish() ? 'One cycle: 200 ms on, 200 ms off.' : 'Faz um ciclo: 200 ms ligado e 200 ms desligado.');
    }
  };

  Blockly.Blocks['led_externo_piscar_lento'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '🐢 Blink external LED slowly' : '🐢 Piscar LED externo devagar',
        isEnglish() ? 'One cycle: 1000 ms on, 1000 ms off.' : 'Faz um ciclo: 1000 ms ligado e 1000 ms desligado.');
    }
  };

  Blockly.Blocks['led_externo_criar_animacao_container'] = {
    init: function() {
      this.setColour(COLOUR);
      this.appendDummyInput().appendField(isEnglish() ? 'animation' : 'animação');
      this.appendStatementInput('STACK');
      this.setTooltip(isEnglish() ? 'Add LED actions and durations.' : 'Adicione ações do LED e durações.');
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['led_externo_criar_animacao_action'] = {
    init: function() {
      this.setColour(COLOUR);
      this.appendDummyInput().appendField(isEnglish() ? 'LED action' : 'ação do LED');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['led_externo_criar_animacao_time'] = {
    init: function() {
      this.setColour(COLOUR);
      this.appendDummyInput().appendField(isEnglish() ? 'duration' : 'duração');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['led_externo_criar_animacao'] = {
    init: function() {
      this.setColour(COLOUR);
      this.steps_ = ['action', 'time'];
      this.updateShape_();
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setMutator(new Blockly.Mutator([
        'led_externo_criar_animacao_action',
        'led_externo_criar_animacao_time'
      ]));
      this.setTooltip(isEnglish()
        ? 'Creates a finite external LED animation. It does not create a forever loop.'
        : 'Cria uma animação finita do LED externo. Ela não cria um loop infinito.');
    },

    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('steps', JSON.stringify(this.steps_));
      return container;
    },

    domToMutation: function(xmlElement) {
      var raw = xmlElement.getAttribute('steps');
      try {
        this.steps_ = raw ? JSON.parse(raw) : [];
      } catch (e) {
        this.steps_ = [];
      }
      this.steps_ = this.steps_.filter(function(step) {
        return step === 'action' || step === 'time';
      });
      this.updateShape_();
    },

    decompose: function(workspace) {
      var container = workspace.newBlock('led_externo_criar_animacao_container');
      container.initSvg();
      var connection = container.getInput('STACK').connection;
      for (var i = 0; i < this.steps_.length; i++) {
        var type = this.steps_[i] === 'action'
          ? 'led_externo_criar_animacao_action'
          : 'led_externo_criar_animacao_time';
        var item = workspace.newBlock(type);
        item.initSvg();
        connection.connect(item.previousConnection);
        connection = item.nextConnection;
      }
      return container;
    },

    compose: function(container) {
      var item = container.getInputTargetBlock('STACK');
      var steps = [];
      var connections = [];
      while (item) {
        var kind = item.type === 'led_externo_criar_animacao_action' ? 'action' : 'time';
        steps.push(kind);
        connections.push(item.stepConnection_ || null);
        item = item.nextConnection && item.nextConnection.targetBlock();
      }

      for (var i = 0; i < this.steps_.length; i++) {
        var inputName = this.steps_[i] === 'action' ? 'STEP' + i : 'TIME' + i;
        var input = this.getInput(inputName);
        if (input && input.connection && input.connection.targetConnection &&
            connections.indexOf(input.connection.targetConnection) === -1) {
          input.connection.disconnect();
        }
      }

      this.steps_ = steps;
      this.updateShape_();
      for (var j = 0; j < this.steps_.length; j++) {
        if (connections[j]) {
          Blockly.Mutator.reconnect(connections[j], this,
            this.steps_[j] === 'action' ? 'STEP' + j : 'TIME' + j);
        }
      }
    },

    saveConnections: function(container) {
      var item = container.getInputTargetBlock('STACK');
      var i = 0;
      while (item) {
        var inputName = item.type === 'led_externo_criar_animacao_action' ? 'STEP' + i : 'TIME' + i;
        var input = this.getInput(inputName);
        item.stepConnection_ = input && input.connection.targetConnection;
        i++;
        item = item.nextConnection && item.nextConnection.targetBlock();
      }
    },

    updateShape_: function() {
      var index = 0;
      while (this.getInput('STEP' + index) || this.getInput('TIME' + index) || this.getInput('LABEL' + index)) {
        if (this.getInput('STEP' + index)) this.removeInput('STEP' + index);
        if (this.getInput('TIME' + index)) this.removeInput('TIME' + index);
        if (this.getInput('LABEL' + index)) this.removeInput('LABEL' + index);
        index++;
      }
      if (this.getInput('EMPTY')) this.removeInput('EMPTY');

      if (!this.steps_.length) {
        this.appendDummyInput('EMPTY').appendField(
          isEnglish() ? '🎬 Create external LED animation' : '🎬 Criar animação de LEDs externos');
        return;
      }

      this.appendDummyInput('LABEL0').appendField(
        isEnglish() ? '🎬 External LED animation' : '🎬 Animação de LEDs externos');
      for (var i = 0; i < this.steps_.length; i++) {
        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
            .setCheck('ExternalLedCommand')
            .appendField(isEnglish() ? 'Do:' : 'Fazer:');
        } else {
          this.appendValueInput('TIME' + i)
            .setCheck('Time')
            .appendField(isEnglish() ? 'Wait (ms):' : 'Esperar (ms):');
        }
      }
    }
  };

  function createFieldDom(variable) {
    return Blockly.Variables.generateVariableFieldDom(variable);
  }

  function createCommandBlock(type, variable, gap) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', type);
    block.setAttribute('gap', String(gap || 12));
    block.appendChild(createFieldDom(variable));
    var dig = Blockly.utils.xml.createElement('field');
    dig.setAttribute('name', 'DIG');
    dig.appendChild(Blockly.utils.xml.createTextNode('0'));
    block.appendChild(dig);
    return block;
  }

  function createAnimationBlock(variable) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'led_externo_criar_animacao');
    block.setAttribute('gap', '24');
    var mutation = Blockly.utils.xml.createElement('mutation');
    mutation.setAttribute('steps', '["action","time"]');
    block.appendChild(mutation);
    return block;
  }

  function markCreated(workspace, variable) {
    workspace.bitdogLabExternalLedIds_ = workspace.bitdogLabExternalLedIds_ || {};
    if (variable) workspace.bitdogLabExternalLedIds_[variable.getId()] = true;
  }

  function refresh(workspace) {
    if (workspace.refreshToolboxSelection) workspace.refreshToolboxSelection();
  }

  function createExternalLed(button) {
    var workspace = button.getTargetWorkspace();
    var prompt = isEnglish() ? 'Name this external LED:' : 'Nome deste LED externo:';
    Blockly.Variables.promptName(prompt, '', function(name) {
      if (!name) return;
      var existing = Blockly.Variables.nameUsedWithAnyType(name, workspace);
      if (existing) {
        var message = Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE ||
          'A variable named "%1" already exists for another type "%2".';
        Blockly.alert(message.replace('%1', existing.name).replace('%2', existing.type));
        return;
      }
      markCreated(workspace, workspace.createVariable(name, VARIABLE_TYPE));
      refresh(workspace);
    });
  }

  function externalLedFlyout(workspace) {
    var items = [];
    var button = Blockly.utils.xml.createElement('button');
    button.setAttribute('text', isEnglish() ? '+ Identify new LED' : '+ Identificar novo LED');
    button.setAttribute('callbackKey', 'CREATE_EXTERNAL_LED');
    workspace.registerButtonCallback('CREATE_EXTERNAL_LED', createExternalLed);
    items.push(button);

    var ids = workspace.bitdogLabExternalLedIds_ || {};
    var variables = workspace.getVariablesOfType(VARIABLE_TYPE).filter(function(variable) {
      return !!ids[variable.getId()];
    });
    variables.sort(Blockly.VariableModel.compareByName);
    for (var i = 0; i < variables.length; i++) {
      var variable = variables[i];
      items.push(createCommandBlock('led_externo_ligar', variable, 12));
      items.push(createCommandBlock('led_externo_desligar', variable, 12));
      items.push(createCommandBlock('led_externo_piscar_rapido', variable, 12));
      items.push(createCommandBlock('led_externo_piscar_lento', variable, 12));
      items.push(createAnimationBlock(variable));
    }
    return items;
  }

  global.BitDogLabExternalLed = {
    VARIABLE_TYPE: VARIABLE_TYPE,
    flyoutCategory: externalLedFlyout,
    field: externalLedField
  };

  console.log('[BitDogLab] External LED blocks loaded.');
})(window);
