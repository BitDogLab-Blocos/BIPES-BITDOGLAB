// Blockly definitions for the external ultrasonic distance sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for ultrasonic blocks.');
    return;
  }

  var ULTRASSONICO_COLOUR = '#2980b9';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function connectionField(kind) {
    var profile = global.BitdogLabConfig || {};
    var config = profile.EXTERNAL && profile.EXTERNAL.ULTRASSONICO || {};
    var connection = kind === 'TRIG'
      ? String(config.TRIG_CONNECTION || '3')
      : String(config.ECHO_CONNECTION || '2');
    return new Blockly.FieldDropdown([[connection, connection]]);
  }

  function graphPositionField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['top', '1'],
      ['bottom', '2'],
      ['whole', '0']
    ] : [
      ['cima', '1'],
      ['baixo', '2'],
      ['toda', '0']
    ]);
  }

  function screenSizeField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['small', 'SMALL'],
      ['large', 'LARGE']
    ] : [
      ['pequena', 'SMALL'],
      ['grande', 'LARGE']
    ]);
  }

  function setCommandBlock(block) {
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(ULTRASSONICO_COLOUR);
    block.setHelpUrl('');
  }

  Blockly.Blocks['ultrassonico_distancia'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '📏 Distance (cm)' : '📏 Distância (cm)')
        .appendField('TRIG/SCL')
        .appendField(connectionField('TRIG'), 'TRIG')
        .appendField('ECHO/SDA')
        .appendField(connectionField('ECHO'), 'ECHO');
      this.setOutput(true, 'Number');
      this.setColour(ULTRASSONICO_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Returns the distance in centimetres. TRIG/SCL is fixed to Connection 3 and ECHO/SDA to Connection 2.'
        : 'Entrega a distância em centímetros. TRIG/SCL fica fixo na Conexão 3 e ECHO/SDA na Conexão 2.');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ultrassonico_plotar'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField(isEnglish() ? '📊 Show distance graph of' : '📊 Mostrar gráfico da distância');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(graphPositionField(), 'POSICAO')
        .appendField(isEnglish() ? 'screen' : 'tela')
        .appendField(screenSizeField(), 'DISPLAY_TYPE');
      this.setInputsInline(false);
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Shows a scrolling graph of the distance. Connect Distance (cm) to the value input and choose the screen position.'
        : 'Mostra um gráfico contínuo da distância. Encaixe Distância (cm) na entrada e escolha a posição na tela.');
    }
  };

  console.log('[BitDogLab] Ultrasonic block definitions loaded.');
})(window);
