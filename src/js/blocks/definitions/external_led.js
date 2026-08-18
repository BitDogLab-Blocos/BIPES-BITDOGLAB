// ==========================================
// Category: External RGB LED (KY-016, channels selected in command blocks)
// ==========================================
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) return;

  var COLOUR = 35;
  var COMMAND_TYPES = [
    'led_externo_ligar',
    'led_externo_desligar',
    'led_externo_piscar_rapido',
    'led_externo_piscar_lento'
  ];
  var GLOBAL_TYPES = ['led_externo_desligar_todos'];
  var ALL_TYPES = COMMAND_TYPES.concat(['led_externo_criar_animacao']);
  var CHANNEL_ORDER = ['R', 'G', 'B'];
  var CHANNELS = {
    R: { pt: '🔴 R — Vermelho', en: '🔴 R — Red' },
    G: { pt: '🟢 G — Verde', en: '🟢 G — Green' },
    B: { pt: '🔵 B — Azul', en: '🔵 B — Blue' }
  };

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function channelOptions() {
    return CHANNEL_ORDER.map(function(channel) {
      return [CHANNELS[channel][isEnglish() ? 'en' : 'pt'], channel];
    });
  }

  function connectionOptions() {
    return [0, 1, 2, 3].map(function(dig) {
      return [isEnglish() ? 'Connection ' + dig : 'Conexão ' + dig, String(dig)];
    });
  }

  function channelLabel(channel) {
    var item = CHANNELS[channel] || CHANNELS.R;
    return item[isEnglish() ? 'en' : 'pt'];
  }

  // The colour is chosen in the category's "+" button. Keep this field
  // visible on command blocks so learners can see R/G/B, but do not let a
  // command silently change to another physical channel after it was created.
  function channelField() {
    var field = new Blockly.FieldDropdown(channelOptions());
    field.showEditor_ = function() {};
    field.isClickable = function() { return false; };
    return field;
  }

  Blockly.Blocks['led_externo_desligar_todos'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Desligar todos os LEDs externos');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLOUR);
      this.setTooltip(isEnglish()
        ? 'Turns off every external LED used in this project.'
        : 'Desliga todos os LEDs externos usados neste projeto.');
      this.setHelpUrl('');
    }
  };

  function setCommandShape(block, label, tooltip) {
    block.appendDummyInput()
      .appendField(label)
      .appendField(channelField(), 'CHANNEL')
      .appendField(isEnglish() ? 'on' : 'na')
      .appendField(new Blockly.FieldDropdown(connectionOptions()), 'DIG');
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
        isEnglish() ? '💡 Turn on' : '💡 Ligar',
        isEnglish() ? 'Turns on the selected KY-016 colour pin.' : 'Liga o pino da cor R, G ou B escolhido no módulo de LED colorido KY-016.');
    }
  };

  Blockly.Blocks['led_externo_desligar'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '🌑 Turn off' : '🌑 Desligar',
        isEnglish() ? 'Turns off the selected KY-016 colour pin.' : 'Desliga o pino da cor R, G ou B escolhido no módulo de LED colorido KY-016.');
    }
  };

  Blockly.Blocks['led_externo_piscar_rapido'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '⚡ Blink quickly' : '⚡ Piscar rápido',
        isEnglish() ? 'One blink: on for 0.2 seconds, then off for 0.2 seconds.' : 'Uma piscada: fica ligado por 0,2 segundo e desligado por 0,2 segundo.');
    }
  };

  Blockly.Blocks['led_externo_piscar_lento'] = {
    init: function() {
      setCommandShape(this,
        isEnglish() ? '🐢 Blink slowly' : '🐢 Piscar devagar',
        isEnglish() ? 'One blink: on for 1 second, then off for 1 second.' : 'Uma piscada: fica ligado por 1 segundo e desligado por 1 segundo.');
    }
  };

  Blockly.Blocks['led_externo_criar_animacao_container'] = {
    init: function() {
      this.setColour(COLOUR);
      this.appendDummyInput().appendField(isEnglish() ? 'animation' : 'animação');
      this.appendStatementInput('STACK');
      this.setTooltip(isEnglish() ? 'Add LED actions and wait times in seconds.' : 'Adicione ações do LED e tempos de espera em segundos.');
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
      this.appendDummyInput().appendField(isEnglish() ? 'wait (seconds)' : 'espera (segundos)');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['led_externo_criar_animacao'] = {
    init: function() {
      this.setColour(COLOUR);
      this.appendDummyInput()
        .appendField(isEnglish() ? '🎬 Animate external LEDs' : '🎬 Criar animação dos LEDs externos');
      this.steps_ = ['action', 'time'];
      this.updateShape_();
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setMutator(new Blockly.Mutator([
        'led_externo_criar_animacao_action',
        'led_externo_criar_animacao_time'
      ]));
      this.setTooltip(isEnglish()
        ? 'Creates an animation that stops after the last action. Choose the R, G, or B colour pin in each action.'
        : 'Cria uma animação que termina após a última ação. Escolha o pino da cor R, G ou B em cada ação.');
    },

    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('steps', JSON.stringify(this.steps_));
      return container;
    },

    domToMutation: function(xmlElement) {
      var raw = xmlElement.getAttribute('steps');
      try { this.steps_ = raw ? JSON.parse(raw) : []; } catch (e) { this.steps_ = []; }
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
        steps.push(item.type === 'led_externo_criar_animacao_action' ? 'action' : 'time');
        connections.push(item.stepConnection_ || null);
        item = item.nextConnection && item.nextConnection.targetBlock();
      }

      for (var i = 0; i < this.steps_.length; i++) {
        var oldName = this.steps_[i] === 'action' ? 'STEP' + i : 'TIME' + i;
        var oldInput = this.getInput(oldName);
        if (oldInput && oldInput.connection && oldInput.connection.targetConnection &&
            connections.indexOf(oldInput.connection.targetConnection) === -1) {
          oldInput.connection.disconnect();
        }
      }
      this.steps_ = steps;
      this.updateShape_();
      for (var j = 0; j < this.steps_.length; j++) {
        if (connections[j]) Blockly.Mutator.reconnect(
          connections[j], this, this.steps_[j] === 'action' ? 'STEP' + j : 'TIME' + j);
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
      while (this.getInput('STEP' + index) || this.getInput('TIME' + index)) {
        if (this.getInput('STEP' + index)) this.removeInput('STEP' + index);
        if (this.getInput('TIME' + index)) this.removeInput('TIME' + index);
        index++;
      }
      if (this.getInput('EMPTY')) this.removeInput('EMPTY');

      if (!this.steps_.length) {
        this.appendDummyInput('EMPTY').appendField(
          isEnglish() ? 'Add animation steps' : 'Adicione passos à animação');
        return;
      }
      for (var i = 0; i < this.steps_.length; i++) {
        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
            .setCheck('ExternalLedCommand')
            .appendField(isEnglish() ? 'Do:' : 'Fazer:');
        } else {
          this.appendValueInput('TIME' + i)
            .setCheck('Time')
            .appendField(isEnglish() ? 'Wait (Seconds):' : 'Esperar (Segundos):');
        }
      }
    }
  };

  function createField(name, value) {
    var field = Blockly.utils.xml.createElement('field');
    field.setAttribute('name', name);
    field.appendChild(Blockly.utils.xml.createTextNode(value));
    return field;
  }

  function createCommandBlock(type, channel, gap) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', type);
    block.setAttribute('gap', String(gap || 12));
    block.appendChild(createField('CHANNEL', channel));
    block.appendChild(createField('DIG', '0'));
    return block;
  }

  function createAnimationBlock() {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'led_externo_criar_animacao');
    block.setAttribute('gap', '24');
    var mutation = Blockly.utils.xml.createElement('mutation');
    mutation.setAttribute('steps', '["action","time"]');
    block.appendChild(mutation);
    return block;
  }

  function createGlobalBlock(type, gap) {
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', type);
    block.setAttribute('gap', String(gap || 12));
    return block;
  }

  function selectedChannels(workspace) {
    var selected = workspace.bitdogLabExternalLedChannels_ || {};
    workspace.getAllBlocks(false).forEach(function(block) {
      if (ALL_TYPES.indexOf(block.type) === -1 || !block.getFieldValue) return;
      var channel = block.getFieldValue('CHANNEL');
      if (CHANNEL_ORDER.indexOf(channel) !== -1) selected[channel] = true;
    });
    workspace.bitdogLabExternalLedChannels_ = selected;
    return selected;
  }

  function closeChannelPicker() {
    var picker = document.getElementById('external-led-channel-picker');
    if (picker && picker.parentNode) picker.parentNode.removeChild(picker);
  }

  function addChannel(workspace, channel) {
    var selected = selectedChannels(workspace);
    if (selected[channel]) {
      closeChannelPicker();
      return;
    }
    selected[channel] = true;
    refreshFlyout(workspace);
    closeChannelPicker();
    if (global.Code && global.Code.showExternalLedChannelReminder) {
      global.Code.showExternalLedChannelReminder(channel);
    }
  }

  function refreshFlyout(workspace) {
    if (workspace && workspace.refreshToolboxSelection) workspace.refreshToolboxSelection();
  }

  function showChannelPicker(button) {
    var workspace = button.getTargetWorkspace();
    var selected = selectedChannels(workspace);
    closeChannelPicker();

    var overlay = document.createElement('div');
    overlay.id = 'external-led-channel-picker';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:10001;display:flex;align-items:center;justify-content:center;padding:18px;';
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff7ed;color:#4a2c13;border:3px solid #d97706;border-radius:14px;max-width:520px;width:100%;padding:22px;box-shadow:0 8px 28px rgba(0,0,0,.35);font-family:Arial,sans-serif;';
    var title = document.createElement('h2');
    title.textContent = isEnglish() ? 'Which KY-016 colour will you use?' : 'Qual cor do KY-016 você vai usar?';
    title.style.margin = '0 0 8px';
    card.appendChild(title);
    var help = document.createElement('p');
    help.textContent = isEnglish()
      ? 'Choose each channel only once. Then connect that letter to the selected board connection.'
      : 'Escolha cada pino de cor apenas uma vez. Depois ligue essa letra à Conexão escolhida na placa.';
    card.appendChild(help);

    CHANNEL_ORDER.forEach(function(channel) {
      var choice = document.createElement('button');
      choice.type = 'button';
      choice.disabled = !!selected[channel];
      choice.textContent = selected[channel]
        ? (channelLabel(channel) + ' — já adicionado')
        : channelLabel(channel);
      choice.style.cssText = 'display:block;width:100%;margin:8px 0;padding:13px 15px;border:2px solid #d97706;border-radius:9px;background:' + (selected[channel] ? '#eadfd2' : '#fff') + ';color:#4a2c13;font-size:17px;text-align:left;cursor:' + (selected[channel] ? 'not-allowed' : 'pointer') + ';';
      choice.addEventListener('click', function() { addChannel(workspace, channel); });
      card.appendChild(choice);
    });
    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = isEnglish() ? 'Cancel' : 'Cancelar';
    cancel.style.cssText = 'margin-top:10px;padding:9px 16px;border:0;border-radius:8px;background:#6b7280;color:white;font-size:15px;cursor:pointer;';
    cancel.addEventListener('click', closeChannelPicker);
    card.appendChild(cancel);
    overlay.appendChild(card);
    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) closeChannelPicker();
    });
    document.body.appendChild(overlay);
  }

  function externalLedFlyout(workspace) {
    var items = [];
    var selected = selectedChannels(workspace);
    var available = CHANNEL_ORDER.filter(function(channel) { return !selected[channel]; });
    if (available.length) {
      var button = Blockly.utils.xml.createElement('button');
    button.setAttribute('text', isEnglish() ? '+ Add an RGB colour' : '+ Adicionar uma cor RGB');
      button.setAttribute('callbackKey', 'CHOOSE_EXTERNAL_LED_CHANNEL');
      workspace.registerButtonCallback('CHOOSE_EXTERNAL_LED_CHANNEL', showChannelPicker);
      items.push(button);
    } else {
      var done = Blockly.utils.xml.createElement('label');
      done.setAttribute('text', isEnglish() ? '✅ R, G and B already added' : '✅ R, G e B já foram adicionados');
      items.push(done);
    }

    // This command is always available and is intentionally not offered
    // inside the animation mutator.
    items.push(createGlobalBlock('led_externo_desligar_todos', 18));

    CHANNEL_ORDER.forEach(function(channel) {
      if (!selected[channel]) return;
      items.push(createCommandBlock('led_externo_ligar', channel, 12));
      items.push(createCommandBlock('led_externo_desligar', channel, 12));
      items.push(createCommandBlock('led_externo_piscar_rapido', channel, 12));
      items.push(createCommandBlock('led_externo_piscar_lento', channel, 12));
    });
    if (CHANNEL_ORDER.some(function(channel) { return selected[channel]; })) {
      items.push(createAnimationBlock());
    }
    return items;
  }

  global.BitDogLabExternalLed = {
    channels: CHANNELS,
    commandTypes: COMMAND_TYPES,
    globalTypes: GLOBAL_TYPES,
    allTypes: ALL_TYPES,
    flyoutCategory: externalLedFlyout,
    channelLabel: channelLabel
  };

  console.log('[BitDogLab] External LED channel blocks loaded.');
})(window);
