// ==========================================
// REPETITION BLOCKS
// ==========================================

// Repeat N times block
Blockly.Blocks['controls_repeat_simple'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir")
        .appendField(new Blockly.FieldNumber(10, 1), "TIMES")
        .appendField("vezes");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete as ações um número específico de vezes");
    this.setHelpUrl("");
  },

  // Validate blocks inside and warn about incompatible ones
  onchange: function(event) {
    if (!this.workspace || this.workspace.isDragging()) {
      return; // Don't check during dragging
    }

    // Only check on block move/create events
    if (event.type !== Blockly.Events.BLOCK_MOVE &&
        event.type !== Blockly.Events.BLOCK_CREATE) {
      return;
    }

    // List of blocks with internal while True loops or that need continuous checking (incompatible)
    var incompatibleBlocks = {
      'bloco_piscar_led': 'Piscar LED',
      'piscar_led_lento': 'Piscar LED Lento',
      'bloco_animar_led_coracao': 'Animar LED Coração',
      'bloco_sinalizar_led_sos': 'Sinalizar LED SOS',
      'bloco_animar_led_brilhar': 'Animar LED Brilhar',
      'bloco_alternar_led': 'Alternar LED',
      'bloco_transicao_led': 'Transição LED',
      'bloco_batalhar_led': 'Batalhar LED',
      'botao_enquanto_apertado': 'Botão Enquanto Apertado',
      'botao_se_apertado': 'Botão Se Apertado'
    };

    // Check all child blocks
    var childBlocks = this.getDescendants(false);
    for (var i = 0; i < childBlocks.length; i++) {
      var childType = childBlocks[i].type;

      if (incompatibleBlocks[childType]) {
        // Found incompatible block - show alert popup
        if (!this.warningShown) {
          this.warningShown = true;
          setTimeout(function(blockName, isButton) {
            var message = '⚠️ ATENÇÃO!\n\n';

            if (isButton) {
              message += 'O bloco "' + blockName + '" precisa estar dentro do loop principal (while True) para verificar continuamente o estado do botão.\n\n' +
                        'Colocá-lo dentro de "Repetir X vezes" NÃO VAI FUNCIONAR corretamente porque ele será executado apenas N vezes rapidamente, sem tempo para você apertar o botão.\n\n';
            } else {
              message += 'O bloco "' + blockName + '" contém um loop infinito interno e NÃO VAI FUNCIONAR corretamente dentro de "Repetir X vezes".\n\n' +
                        'Esse bloco já repete para sempre sozinho, então colocá-lo dentro de uma repetição vai criar um loop dentro de outro loop.\n\n';
            }

            message += 'Use apenas blocos simples como:\n' +
                      '• Ligar LED\n' +
                      '• Desligar LED\n' +
                      '• Tocar nota\n' +
                      '• Mostrar emoji\n' +
                      '• Mostrar número';

            alert(message);
          }.bind(this, incompatibleBlocks[childType], childType.indexOf('botao_') === 0), 100);

          // Reset warning flag after 3 seconds
          setTimeout(function() {
            this.warningShown = false;
          }.bind(this), 3000);
        }

        // Also set warning icon
        this.setWarningText('⚠️ Bloco incompatível: "' + incompatibleBlocks[childType] + '" não funciona dentro de repetições');
        return;
      }
    }

    // No incompatible blocks found - clear warning
    this.setWarningText(null);
  }
};

// Repeat forever block
/*
Blockly.Blocks['controls_repeat_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repetir para sempre");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete continuamente até o programa ser parado (loop infinito)");
    this.setHelpUrl("");
  }
};
*/

// Repeat until condition block
/*
Blockly.Blocks['controls_repeat_until'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Repetir até");
    this.appendStatementInput("DO")
        .appendField("fazer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Repete até que a condição seja verdadeira (oposto de 'enquanto')");
    this.setHelpUrl("");
  }
};
*/

console.log('[BitdogLab] Basic repetition blocks loaded successfully!');
