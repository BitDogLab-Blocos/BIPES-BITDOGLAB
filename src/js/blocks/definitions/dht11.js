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
        : 'Entrega a temperatura do ar em graus Celsius usando o sensor DHT11. Encaixe em Mostrar valor, matemática, condições ou gráfico.');
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
        : 'Entrega a quantidade de umidade do ar, em porcentagem, usando o sensor DHT11. Encaixe em Mostrar valor, matemática, condições ou gráfico.');
    }
  };

  // Graph block: value input, screen position, and screen size.
  Blockly.Blocks['dht11_plotar'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .setCheck('Number')
        .appendField(isEnglish() ? '📊 Show graph of' : '📊 Mostrar gráfico de');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(graphPositionField(), 'POSICAO');
      appendScreenSizeInput(this);
      this.setInputsInline(true);
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Shows a scrolling graph of the air temperature or humidity. Choose where it appears and the board screen size.'
        : 'Mostra um gráfico contínuo da temperatura ou da umidade do ar. Escolha onde ele aparecerá e o tamanho da tela da placa.');
    }
  };

  console.log('[BitDogLab] DHT11 block definitions loaded.');
})(window);
