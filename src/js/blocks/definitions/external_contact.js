// Child-friendly blocks for external electrical contacts.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for external contact blocks.');
    return;
  }

  var CONTACT_COLOUR = '#0f9d8a';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function contactConfig() {
    var profile = global.BitdogLabConfig || {};
    var external = profile.EXTERNAL || {};
    return external.EXTERNAL_CONTACT || {};
  }

  function connectionField() {
    var config = contactConfig();
    var allowed = config.ALLOWED_DIG || ['0', '1', '2', '3'];
    return new Blockly.FieldDropdown(allowed.map(function(dig) {
      return [isEnglish() ? 'Connection ' + dig : 'Conexão ' + dig, String(dig)];
    }));
  }

  function commonWireField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['GND — recommended', 'GND'],
      ['3.3 V — alternative wiring', '3V3']
    ] : [
      ['GND — recomendado', 'GND'],
      ['3,3 V — montagem alternativa', '3V3']
    ]);
  }

  function setCommandConnections(block) {
    block.setPreviousStatement(true, 'ProgramCommand');
    block.setNextStatement(true, 'ProgramCommand');
    block.setColour(CONTACT_COLOUR);
    block.setHelpUrl('');
  }

  Blockly.Blocks.external_contact_prepare = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '🔌 Set up contacts using' : '🔌 Preparar contatos usando')
        .appendField(commonWireField(), 'COMMON')
        .appendField(isEnglish() ? 'as the common wire' : 'como fio comum');
      setCommandConnections(this);
      this.setTooltip(isEnglish()
        ? 'Choose where the wire shared by all contacts is connected. Use GND for most projects.'
        : 'Escolha onde foi ligado o fio compartilhado por todos os contatos. Use GND na maioria dos projetos.');
    }
  };

  Blockly.Blocks.external_contact_when_closed = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '✨ When contact is made on' : '✨ Quando houver contato na')
        .appendField(connectionField(), 'DIG');
      this.appendStatementInput('DO')
        .setCheck('ProgramCommand')
        .appendField(isEnglish() ? 'do' : 'faça');
      setCommandConnections(this);
      this.setTooltip(isEnglish()
        ? 'Runs the actions once when the contact parts touch. Separate and touch them again to run once more.'
        : 'Faz as ações uma vez quando as partes do contato encostam. Separe e encoste novamente para acontecer outra vez.');
    }
  };

  Blockly.Blocks.external_contact_is_closed = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '🔘 Is there contact on' : '🔘 Há contato na')
        .appendField(connectionField(), 'DIG')
        .appendField('?');
      this.setOutput(true, 'Boolean');
      this.setColour(CONTACT_COLOUR);
      this.setHelpUrl('');
      this.setTooltip(isEnglish()
        ? 'Answers yes while the contact parts are touching and no while they are separated.'
        : 'Responde sim enquanto as partes do contato estão encostadas e não enquanto estão separadas.');
    }
  };

  Blockly.Blocks.external_contact_test_matrix = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish()
          ? '🧪 Test contacts on the LED Matrix'
          : '🧪 Testar contatos na Matriz de LEDs');
      setCommandConnections(this);
      this.setTooltip(isEnglish()
        ? 'Shows the four contact Connections on the LED Matrix. Press button A to finish the test.'
        : 'Mostra as quatro Conexões de contato na Matriz de LEDs. Aperte o botão A para terminar o teste.');
    }
  };

  console.log('[BitDogLab] External contact block definitions loaded.');
})(window);
