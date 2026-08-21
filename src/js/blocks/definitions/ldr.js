// Blockly definitions for the external LDR light sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for LDR blocks.');
    return;
  }

  var LDR_COLOUR = '#16a085';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function connectionField() {
    // The LDR module is wired only to the dedicated analogue input.
    return new Blockly.FieldDropdown([['ANA-IN', 'ANA-IN']]);
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

  function appendDisplaySizeInput(block) {
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

  Blockly.Blocks['ldr_valor'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '💡 LDR light value' : '💡 Valor da luz (LDR)')
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(connectionField(), 'CONNECTION');
      this.setOutput(true, 'Number');
      this.setColour(LDR_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Returns the light sensor reading from the ANA-IN analogue input. Use it in Show value, math, conditions, or a graph.'
        : 'Entrega a leitura do sensor de luz pela entrada analógica ANA-IN. Use em Mostrar valor, matemática, condições ou gráfico.');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ldr_plotar'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField(isEnglish() ? '📊 Show graph of' : '📊 Mostrar gráfico de');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(graphPositionField(), 'POSICAO');
      appendDisplaySizeInput(this);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LDR_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Shows a scrolling graph of the LDR light reading. Choose the screen position and display size.'
        : 'Mostra um gráfico contínuo da leitura do LDR. Escolha a posição e o tamanho do display.');
      this.setHelpUrl('');
    }
  };

  console.log('[BitDogLab] LDR block definitions loaded.');
})(window);
