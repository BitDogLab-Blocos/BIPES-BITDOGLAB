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
      [isEnglish() ? 'Connection 0' : 'Conexão 0', '0'],
      [isEnglish() ? 'Connection 1' : 'Conexão 1', '1'],
      [isEnglish() ? 'Connection 2' : 'Conexão 2', '2'],
      [isEnglish() ? 'Connection 3' : 'Conexão 3', '3']
    ]);
  }

  function angleField(defaultValue) {
    return new Blockly.FieldNumber(defaultValue, 0, 180, 1);
  }

  function stepField(defaultValue) {
    return new Blockly.FieldNumber(defaultValue, 1, 180, 1);
  }

  function pauseField(defaultValue) {
    return new Blockly.FieldNumber(defaultValue, 0, 60, 0.1);
  }

  function joystickDirectionField(defaultDirection) {
    var options = isEnglish() ? [
      ['↑ Up', 'UP'],
      ['↓ Down', 'DOWN'],
      ['← Left', 'LEFT'],
      ['→ Right', 'RIGHT']
    ] : [
      ['↑ Cima', 'UP'],
      ['↓ Baixo', 'DOWN'],
      ['← Esquerda', 'LEFT'],
      ['→ Direita', 'RIGHT']
    ];
    for (var i = 0; i < options.length; i++) {
      if (options[i][1] === defaultDirection) {
        options.unshift(options.splice(i, 1)[0]);
        break;
      }
    }
    return new Blockly.FieldDropdown(options);
  }

  function setCommandConnections(block) {
    block.setPreviousStatement(true, 'ProgramCommand');
    block.setNextStatement(true, 'ProgramCommand');
    block.setColour(SERVO_COLOUR);
    block.setHelpUrl('');
  }

  function appendGradualInputs(block, direction) {
    var ascending = direction === 'up';

    block.appendDummyInput('HEADER')
        .appendField(ascending
          ? (isEnglish() ? '↗️ Raise servo' : '↗️ Subir servo')
          : (isEnglish() ? '↘️ Lower servo' : '↘️ Descer servo'))
        .appendField(isEnglish() ? 'on' : 'na')
        .appendField(digField(), 'DIG');

    block.appendDummyInput('TARGET_ROW')
        .appendField(ascending
          ? (isEnglish() ? 'from 0° to' : 'de 0° até')
          : (isEnglish() ? 'from 180° to' : 'de 180° até'))
        .appendField(angleField(90), 'TARGET')
        .appendField(isEnglish() ? 'degrees (limit: 0°–180°)' : 'graus (limite: 0°–180°)');

    block.appendDummyInput('STEP_ROW')
        .appendField(isEnglish() ? 'in steps of' : 'em passos de')
        .appendField(stepField(10), 'STEP')
        .appendField(isEnglish() ? 'degrees' : 'graus');

    block.appendDummyInput('PAUSE_ROW')
        .appendField(isEnglish() ? 'pausing' : 'com pausa de')
        .appendField(pauseField(3), 'PAUSE')
        .appendField(isEnglish() ? 'seconds' : 'segundos');

    block.appendStatementInput('EACH_STEP')
        .setCheck('ProgramCommand')
        .appendField(isEnglish() ? 'at each step do' : 'a cada passo faça');

    setCommandConnections(block);
  }

  Blockly.Blocks['servo_mover'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(isEnglish() ? '🎯 Move servo' : '🎯 Mover servo')
          .appendField(isEnglish() ? 'on' : 'na')
          .appendField(digField(), 'DIG')
          .appendField(isEnglish() ? 'to' : 'para')
          .appendField(angleField(90), 'ANGLE')
          .appendField(isEnglish() ? 'degrees' : 'graus');
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
          .appendField(isEnglish() ? 'on' : 'na')
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
          .appendField(isEnglish() ? 'on' : 'na')
          .appendField(digField(), 'DIG');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'starting at' : 'começando em')
          .appendField(angleField(90), 'INITIAL_ANGLE')
          .appendField(isEnglish() ? 'degrees' : 'graus');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'raises when moved:' : 'sobe ao mover:')
          .appendField(joystickDirectionField('UP'), 'DIR_INCREASE');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'lowers when moved:' : 'desce ao mover:')
          .appendField(joystickDirectionField('DOWN'), 'DIR_DECREASE');
      this.appendDummyInput()
          .appendField(isEnglish() ? 'in steps of' : 'em passos de')
          .appendField(stepField(2), 'STEP')
          .appendField(isEnglish() ? 'degrees' : 'graus');
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
