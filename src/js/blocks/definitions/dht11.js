// Blockly definitions for the external DHT11 sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for DHT11 blocks.');
    return;
  }

  var DHT11_COLOUR = '#e67e22';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function digField() {
    var profile = global.BitdogLabConfig || {};
    var external = profile.EXTERNAL || {};
    var dht11 = external.DHT11 || {};
    var allowed = dht11.ALLOWED_DIG || ['0', '1', '2', '3'];
    return new Blockly.FieldDropdown(allowed.map(function(dig) {
      return [isEnglish() ? 'Connection ' + dig : 'Conexão ' + dig, String(dig)];
    }));
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

  function setValueBlock(block) {
    block.setOutput(true, 'Number');
    block.setColour(DHT11_COLOUR);
    block.setHelpUrl('');
  }

  function setCommandBlock(block) {
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(DHT11_COLOUR);
    block.setHelpUrl('');
  }

  Blockly.Blocks['dht11_temperatura'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '🌡️ DHT11 temperature' : '🌡️ Temperatura DHT11')
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(digField(), 'DIG');
      setValueBlock(this);
      this.setTooltip(isEnglish()
        ? 'Returns the DHT11 temperature in degrees Celsius. Connect it to Show value, math, conditions, or a graph.'
        : 'Entrega a temperatura do DHT11 em graus Celsius. Encaixe em Mostrar valor, matemática, condições ou gráfico.');
    }
  };

  Blockly.Blocks['dht11_umidade'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '💧 DHT11 humidity' : '💧 Umidade DHT11')
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(digField(), 'DIG');
      setValueBlock(this);
      this.setTooltip(isEnglish()
        ? 'Returns the DHT11 relative humidity percentage. Connect it to Show value, math, conditions, or a graph.'
        : 'Entrega a umidade relativa do DHT11 em porcentagem. Encaixe em Mostrar valor, matemática, condições ou gráfico.');
    }
  };

  // Graph behavior follows the AHT20 greenhouse graph block:
  // value input + screen position + display type.
  Blockly.Blocks['dht11_plotar'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField(isEnglish() ? '📊 Show graph of' : '📊 Mostrar gráfico de');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(graphPositionField(), 'POSICAO');
      appendDisplayTypeInput(this);
      this.setInputsInline(true);
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Shows a scrolling graph for a DHT11 value. Use the DHT11 temperature or humidity block as the value, choose the screen position, and choose the display type. It follows the AHT20 greenhouse graph behavior.'
        : 'Mostra um gráfico contínuo de um valor do DHT11. Use o bloco de temperatura ou umidade como valor, escolha a posição e o tipo de display. O comportamento é semelhante ao gráfico da estufa com AHT20.');
    }
  };

  console.log('[BitDogLab] DHT11 block definitions loaded.');
})(window);
