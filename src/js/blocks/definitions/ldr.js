// Blockly definitions for the external LDR light sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for LDR blocks.');
    return;
  }

  var LDR_COLOUR = '#8e7cc3';

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
        .appendField(isEnglish() ? '💡 Light level (%)' : '💡 Nível de luz (%)')
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(connectionField(), 'CONNECTION');
      this.setOutput(true, 'Number');
      this.setColour(LDR_COLOUR);
      this.setTooltip(isEnglish()
        ? 'Shows a number from 0 to 100. More light should give a bigger number. If it works backwards, use Invert scale in the sensor notice.'
        : 'Mostra um número de 0 a 100. Mais luz deve dar um número maior. Se funcionar ao contrário, use Inverter escala no aviso do sensor.');
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
