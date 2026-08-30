// Blockly definitions for the external MPU6050 motion sensor.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for MPU6050 blocks.');
    return;
  }

  var MPU6050_COLOUR = '#c2185b';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function connectionField(kind) {
    var profile = global.BitdogLabConfig || {};
    var config = profile.EXTERNAL && profile.EXTERNAL.MPU6050 || {};
    var connection = kind === 'SCL'
      ? String(config.SCL_CONNECTION || '3')
      : String(config.SDA_CONNECTION || '2');
    return new Blockly.FieldDropdown([[connection, connection]]);
  }

  function directionField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['right', 'RIGHT'],
      ['left', 'LEFT']
    ] : [
      ['direita', 'RIGHT'],
      ['esquerda', 'LEFT']
    ]);
  }

  function axisField() {
    return new Blockly.FieldDropdown([
      ['X', 'X'],
      ['Y', 'Y'],
      ['Z', 'Z']
    ]);
  }

  function screenSizeField() {
    return new Blockly.FieldDropdown(isEnglish() ? [
      ['small OLED', 'SMALL'],
      ['large SH1107', 'LARGE']
    ] : [
      ['pequena OLED', 'SMALL'],
      ['grande SH1107', 'LARGE']
    ]);
  }

  function appendFixedConnections(block) {
    block.appendDummyInput()
      .appendField(isEnglish() ? 'SCL Connection' : 'SCL Conexão')
      .appendField(connectionField('SCL'), 'SCL')
      .appendField(isEnglish() ? 'SDA Connection' : 'SDA Conexão')
      .appendField(connectionField('SDA'), 'SDA');
  }

  function setValueBlock(block, outputType) {
    block.setOutput(true, outputType);
    block.setColour(MPU6050_COLOUR);
    block.setHelpUrl('');
  }

  function setCommandBlock(block) {
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(MPU6050_COLOUR);
    block.setHelpUrl('');
  }

  Blockly.Blocks['mpu6050_inclinacao'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '📐 Tilt to the' : '📐 Inclinação para')
        .appendField(directionField(), 'DIRECTION')
        .appendField(isEnglish() ? '(degrees)' : '(graus)');
      appendFixedConnections(this);
      setValueBlock(this, 'Number');
      this.setTooltip(isEnglish()
        ? 'Returns how many degrees the sensor is tilted to the selected side. Keep it level to read close to zero.'
        : 'Mostra quantos graus o sensor está inclinado para o lado escolhido. Deixe o sensor reto para obter um valor próximo de zero.');
    }
  };

  Blockly.Blocks['mpu6050_foi_movimentado'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '👋 Was the sensor moved?' : '👋 O sensor foi movimentado?');
      appendFixedConnections(this);
      setValueBlock(this, 'Boolean');
      this.setTooltip(isEnglish()
        ? 'Answers yes when the sensor is moved and no while it remains still. Use it inside a condition.'
        : 'Responde sim quando o sensor é movimentado e não quando permanece parado. Use dentro de uma condição.');
    }
  };

  Blockly.Blocks['mpu6050_aceleracao'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish() ? '🚀 Acceleration on axis' : '🚀 Aceleração no eixo')
        .appendField(axisField(), 'AXIS')
        .appendField('(m/s²)');
      appendFixedConnections(this);
      setValueBlock(this, 'Number');
      this.setTooltip(isEnglish()
        ? 'Returns acceleration on axis X, Y, or Z in metres per second squared. Gravity is included.'
        : 'Mostra a aceleração no eixo X, Y ou Z em metros por segundo ao quadrado. A gravidade está incluída.');
    }
  };

  Blockly.Blocks['mpu6050_bolinha_display'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(isEnglish()
          ? '🎮 Move the ball by tilting the sensor'
          : '🎮 Mover bolinha no Display inclinando o sensor');
      appendFixedConnections(this);
      this.appendDummyInput()
        .appendField(isEnglish() ? 'screen' : 'tela')
        .appendField(screenSizeField(), 'DISPLAY_TYPE');
      setCommandBlock(this);
      this.setTooltip(isEnglish()
        ? 'Shows a ball in the centre of the display and moves it as the MPU6050 is tilted.'
        : 'Mostra uma bolinha no centro do Display e movimenta conforme o MPU6050 é inclinado.');
    }
  };

  console.log('[BitDogLab] MPU6050 block definitions loaded.');
})(window);
