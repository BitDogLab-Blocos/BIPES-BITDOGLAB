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
    var label = isEnglish() ? 'Connection ' + connection : 'Conexão ' + connection;
    return new Blockly.FieldDropdown([[label, connection]]);
  }

  function appendWiringInputs(block) {
    block.appendDummyInput()
      .appendField(isEnglish() ? 'TRIG/SCL on' : 'TRIG/SCL na')
      .appendField(connectionField('TRIG'), 'TRIG')
      .appendField(isEnglish() ? 'ECHO/SDA on' : 'ECHO/SDA na')
      .appendField(connectionField('ECHO'), 'ECHO');
  }

  function graphPositionField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['Top half', '1'],
      ['Bottom half', '2'],
      ['Whole screen', '0']
    ] : [
      ['Metade de cima', '1'],
      ['Metade de baixo', '2'],
      ['Tela toda', '0']
    ]);
  }

  function appendScreenSizeInput(block) {
    block.appendDummyInput()
      .appendField(isEnglish() ? 'screen size' : 'tamanho da tela')
      .appendField(new Blockly.FieldDropdown(isEnglish() ? [
        ['small OLED', 'SMALL'],
        ['large SH1107', 'LARGE']
      ] : [
        ['pequena OLED', 'SMALL'],
        ['grande SH1107', 'LARGE']
      ]), 'DISPLAY_TYPE');
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
        .appendField(isEnglish() ? '📏 Distance (cm)' : '📏 Distância (cm)');
      appendWiringInputs(this);
      this.setOutput(true, 'Number');
      this.setColour(ULTRASSONICO_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Returns the distance in centimetres. TRIG/SCL is fixed to Connection 3 and ECHO/SDA to Connection 2.'
        : 'Entrega a distância em centímetros. TRIG/SCL fica fixo na Conexão 3 e ECHO/SDA na Conexão 2.');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ultrassonico_mostrar_distancia'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '📏 Show distance' : '📏 Mostrar distância');
      appendWiringInputs(this);
      appendScreenSizeInput(this);
      this.setInputsInline(true);
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Measures the sensor and shows the distance in centimetres on the display. The sensor uses Connections 2 and 3.'
        : 'Mede o sensor e mostra a distância em centímetros no display. O sensor usa as Conexões 2 e 3.');
    }
  };

  Blockly.Blocks['ultrassonico_plotar'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField(isEnglish() ? '📊 Show distance graph of' : '📊 Mostrar gráfico da distância');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(graphPositionField(), 'POSICAO');
      appendScreenSizeInput(this);
      this.setInputsInline(true);
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Shows a scrolling graph of the distance. Connect Distance (cm) to the value input and choose the screen position.'
        : 'Mostra um gráfico contínuo da distância. Encaixe Distância (cm) na entrada e escolha a posição na tela.');
    }
  };

  console.log('[BitDogLab] Ultrasonic block definitions loaded.');
})(window);
