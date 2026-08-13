// ==========================================
// Category: External Servo Motor
// ==========================================
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) {
    console.warn('[BitDogLab] Blockly blocks API is not available for servo blocks.');
    return;
  }

  var SERVO_COLOUR = '#00897b';

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function digField() {
    return new Blockly.FieldDropdown([
      ['DIG 0', '0'],
      ['DIG 1', '1'],
      ['DIG 2', '2'],
      ['DIG 3', '3']
    ]);
  }

  function setCommandConnections(block) {
    block.setPreviousStatement(true, 'ProgramCommand');
    block.setNextStatement(true, 'ProgramCommand');
    block.setColour(SERVO_COLOUR);
    block.setHelpUrl('');
  }

  function appendGradualInputs(block, direction) {
    var ascending = direction === 'up';

    block.appendValueInput('TARGET')
        .setCheck('Number')
        .appendField(ascending
          ? (isEnglish() ? '↗️ Raise servo' : '↗️ Subir servo')
          : (isEnglish() ? '↘️ Lower servo' : '↘️ Descer servo'))
        .appendField(digField(), 'DIG')
        .appendField(ascending
          ? (isEnglish() ? 'from 0° to' : 'de 0° até')
          : (isEnglish() ? 'from 180° to' : 'de 180° até'));

    block.appendValueInput('STEP')
        .setCheck('Number')
        .appendField(isEnglish() ? 'degrees in steps of' : 'graus em passos de');

    block.appendValueInput('PAUSE')
        .setCheck('Number')
        .appendField(isEnglish() ? 'degrees, pausing' : 'graus, com pausa de');

    block.appendDummyInput()
        .appendField(isEnglish() ? 'seconds' : 'segundos');

    block.appendStatementInput('EACH_STEP')
        .setCheck('ProgramCommand')
        .appendField(isEnglish() ? 'at each step do' : 'a cada passo faça');

    block.setInputsInline(false);
    setCommandConnections(block);
  }

  Blockly.Blocks['servo_mover'] = {
    init: function() {
      this.appendValueInput('ANGLE')
          .setCheck('Number')
          .appendField(isEnglish() ? '🎯 Move servo' : '🎯 Mover servo')
          .appendField(digField(), 'DIG')
          .appendField(isEnglish() ? 'to' : 'para');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'degrees' : 'graus');
      this.setInputsInline(true);
      setCommandConnections(this);
      this.setTooltip(isEnglish()
        ? 'Moves the selected external servo to an angle from 0 to 180 degrees.'
        : 'Move o servo externo escolhido para um ângulo entre 0 e 180 graus.');
    }
  };

  Blockly.Blocks['servo_angulo_atual'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(isEnglish() ? '📐 Current servo angle' : '📐 Ângulo atual do servo')
          .appendField(digField(), 'DIG');
      this.setOutput(true, 'Number');
      this.setColour(SERVO_COLOUR);
      this.setHelpUrl('');
      this.setTooltip(isEnglish()
        ? 'Returns the latest angle sent to this servo. A regular servo does not measure its physical position.'
        : 'Entrega o último ângulo enviado a este servo. Um servo comum não mede sua posição física.');
    }
  };

  Blockly.Blocks['servo_joystick_controlar'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(isEnglish() ? '🕹️ Joystick controls servo' : '🕹️ Joystick controla servo')
          .appendField(digField(), 'DIG');
      this.appendValueInput('INITIAL_ANGLE')
          .setCheck('Number')
          .appendField(isEnglish() ? 'starting at' : 'começando em');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'degrees on axis' : 'graus no eixo')
          .appendField(new Blockly.FieldDropdown([
            ['X — horizontal', 'X'],
            ['Y — vertical', 'Y']
          ]), 'AXIS');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'increase toward' : 'aumentando para')
          .appendField(new Blockly.FieldDropdown(isEnglish() ? [
            ['right / up', 'POSITIVE'],
            ['left / down', 'NEGATIVE']
          ] : [
            ['direita / cima', 'POSITIVE'],
            ['esquerda / baixo', 'NEGATIVE']
          ]), 'INCREASE_DIRECTION');
      this.appendValueInput('STEP')
          .setCheck('Number')
          .appendField(isEnglish() ? 'in steps of' : 'em passos de');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'degrees' : 'graus');
      this.setInputsInline(false);
      setCommandConnections(this);
      this.setTooltip(isEnglish()
        ? 'Moves the servo with the joystick and updates its current angle at every movement.'
        : 'Move o servo com o joystick e atualiza seu ângulo atual a cada movimento.');
    }
  };

  Blockly.Blocks['servo_subir_gradualmente'] = {
    init: function() {
      appendGradualInputs(this, 'up');
      this.setTooltip(isEnglish()
        ? 'Starts at 0 degrees and raises the servo step by step to the final angle.'
        : 'Começa em 0 graus e sobe o servo passo a passo até o ângulo final.');
    }
  };

  Blockly.Blocks['servo_descer_gradualmente'] = {
    init: function() {
      appendGradualInputs(this, 'down');
      this.setTooltip(isEnglish()
        ? 'Starts at 180 degrees and lowers the servo step by step to the final angle.'
        : 'Começa em 180 graus e desce o servo passo a passo até o ângulo final.');
    }
  };

  console.log('[BitDogLab] External servo block definitions loaded.');
})(window);
