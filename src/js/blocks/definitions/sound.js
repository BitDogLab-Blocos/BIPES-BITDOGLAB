// ==========================================
// Category: Musical Notes
// ==========================================
// Use international note names when English is active
var __isEnglishNotes = (typeof Code !== 'undefined' && Code.LANG === 'en');
var __noteLabel = {
  do: __isEnglishNotes ? '🎵 C' : '🎵 Dó',
  re: __isEnglishNotes ? '👑 D' : '👑 Ré',
  mi: __isEnglishNotes ? '🐱 E' : '🐱 Mi',
  fa: __isEnglishNotes ? '🧚‍♀️ F' : '🧚‍♀️ Fá',
  sol: __isEnglishNotes ? '☀️ G' : '☀️ Sol',
  la: __isEnglishNotes ? '⭐ A' : '⭐ Lá',
  si: __isEnglishNotes ? '👍 B' : '👍 Si'
};
var __noteTooltip = {
  do: __isEnglishNotes ? 'Note C' : 'Nota Dó',
  re: __isEnglishNotes ? 'Note D' : 'Nota Ré',
  mi: __isEnglishNotes ? 'Note E' : 'Nota Mi',
  fa: __isEnglishNotes ? 'Note F' : 'Nota Fá',
  sol: __isEnglishNotes ? 'Note G' : 'Nota Sol',
  la: __isEnglishNotes ? 'Note A' : 'Nota Lá',
  si: __isEnglishNotes ? 'Note B' : 'Nota Si'
};
// Do note block for musical notes
Blockly.Blocks['nota_do'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.do);
    this.setOutput(true, "Note");
    this.setColour("#EA2027");
    this.setTooltip(__noteTooltip.do);
    this.setHelpUrl("");
  }
};
// Re note block for musical notes
Blockly.Blocks['nota_re'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.re);
    this.setOutput(true, "Note");
    this.setColour("#EE5A24");
    this.setTooltip(__noteTooltip.re);
    this.setHelpUrl("");
  }
};
// Mi note block for musical notes
Blockly.Blocks['nota_mi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.mi);
    this.setOutput(true, "Note");
    this.setColour("#FFC312");
    this.setTooltip(__noteTooltip.mi);
    this.setHelpUrl("");
  }
};
// Fa note block for musical notes
Blockly.Blocks['nota_fa'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.fa);
    this.setOutput(true, "Note");
    this.setColour("#C4E538");
    this.setTooltip(__noteTooltip.fa);
    this.setHelpUrl("");
  }
};
// Sol note block for musical notes
Blockly.Blocks['nota_sol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.sol);
    this.setOutput(true, "Note");
    this.setColour("#12CBC4");
    this.setTooltip(__noteTooltip.sol);
    this.setHelpUrl("");
  }
};
// La note block for musical notes
Blockly.Blocks['nota_la'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.la);
    this.setOutput(true, "Note");
    this.setColour("#833471");
    this.setTooltip(__noteTooltip.la);
    this.setHelpUrl("");
  }
};
// Si note block for musical notes
Blockly.Blocks['nota_si'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(__noteLabel.si);
    this.setOutput(true, "Note");
    this.setColour("#FD7272");
    this.setTooltip(__noteTooltip.si);
    this.setHelpUrl("");
  }
};
// Interactive piano launcher block
Blockly.Blocks['piano_interativo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎹 Piano interativo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#22c55e");
    this.setTooltip("Abre um piano grande na tela. Ao clicar em uma tecla, o bloco da nota aparece na área de trabalho.");
    this.setHelpUrl("");
  }
};
// Timing launcher block (opens timing panel in the piano)
Blockly.Blocks['temporizacao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("♩ Temporização");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#f59e0b");
    this.setTooltip("Abre as figuras rítmicas. Clique numa nota do piano e depois na figura para criar a nota com a duração certa.");
    this.setHelpUrl("");
  }
};
// Piano note block (simpler: just note + volume, no octave/duration)
Blockly.Blocks['piano_nota'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎹 Tocar")
        .appendField(new Blockly.FieldDropdown((__isEnglishNotes ? [
          ["C", "C"], ["C#", "C#"],
          ["D", "D"], ["D#", "D#"],
          ["E", "E"],
          ["F", "F"], ["F#", "F#"],
          ["G", "G"], ["G#", "G#"],
          ["A", "A"], ["A#", "A#"],
          ["B", "B"]
        ] : [
          ["C (Dó)", "C"], ["C# (Dó#)", "C#"],
          ["D (Ré)", "D"], ["D# (Ré#)", "D#"],
          ["E (Mi)", "E"],
          ["F (Fá)", "F"], ["F# (Fá#)", "F#"],
          ["G (Sol)", "G"], ["G# (Sol#)", "G#"],
          ["A (Lá)", "A"], ["A# (Lá#)", "A#"],
          ["B (Si)", "B"]
        ])), "NOTE")
        .appendField("volume")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setColour("#22c55e");
    this.setTooltip("Toca uma nota musical no buzzer (gerado pelo piano interativo)");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Sound
// ==========================================
// Play musical note block
Blockly.Blocks['tocar_nota'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎵 Tocar nota");
    this.appendValueInput("NOTA")
        .setCheck("Note");
    this.appendDummyInput()
        .appendField("na oitava")
        .appendField(new Blockly.FieldDropdown([
            ["4", "4"],
            ["5", "5"],
            ["6", "6"]
        ]), "OCTAVE")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%")
        .appendField("por")
        .appendField(new Blockly.FieldNumber(500, 0, 10000), "DURATION")
        .appendField("ms");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma nota musical no buzzer (GPIO21)");
    this.setHelpUrl("");
  }
};
// Play high sound block
Blockly.Blocks['tocar_som_agudo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔔 Tocar som agudo")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%")
        .appendField("por")
        .appendField(new Blockly.FieldNumber(500, 0, 10000), "DURATION")
        .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som agudo de teste (1000 Hz)");
    this.setHelpUrl("");
  }
};
// Stop sound block
Blockly.Blocks['parar_som'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔇 Parar som");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Para o som do buzzer");
    this.setHelpUrl("");
  }
};
// Play repeatedly block
Blockly.Blocks['tocar_repetidamente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔁 Tocar repetidamente");
    this.appendStatementInput("DO")
        .setCheck("SoundCommand");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca os sons dentro deste bloco repetidamente em um loop infinito");
    this.setHelpUrl("");
  }
};
// Short beep block
Blockly.Blocks['bipe_curto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Bipe curto")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um bipe curto");
    this.setHelpUrl("");
  }
};
// Double beep block
Blockly.Blocks['bipe_duplo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📌 Bipe duplo")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca dois bipes rápidos");
    this.setHelpUrl("");
  }
};
// Intermittent alert block
Blockly.Blocks['alerta_intermitente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚨 Alerta intermitente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um alerta intermitente");
    this.setHelpUrl("");
  }
};
// Call sound block
Blockly.Blocks['chamada'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📞 Chamada")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de chamada");
    this.setHelpUrl("");
  }
};
// Coin sound block
Blockly.Blocks['som_de_moeda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪙 Som de moeda")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de moeda");
    this.setHelpUrl("");
  }
};
// Success sound block
Blockly.Blocks['som_de_sucesso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✅ Som de sucesso")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de sucesso com notas ascendentes");
    this.setHelpUrl("");
  }
};
// Failure sound block
Blockly.Blocks['som_de_falha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❌ Som de falha")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de falha com notas descendentes");
    this.setHelpUrl("");
  }
};
// Laser sound block
Blockly.Blocks['som_de_laser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔫 Som de laser")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca um som de laser");
    this.setHelpUrl("");
  }
};
// Police siren block
Blockly.Blocks['sirene_policial'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚓 Sirene policial")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma sirene policial");
    this.setHelpUrl("");
  }
};
// Ascending musical scale block
Blockly.Blocks['escala_musical_sobe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📈 Escala musical ascendente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical ascendente");
    this.setHelpUrl("");
  }
};
// Descending musical scale block
Blockly.Blocks['escala_musical_desce'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📉 Escala musical descendente")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca uma escala musical descendente");
    this.setHelpUrl("");
  }
};
// Twinkle Twinkle Little Star melody block
Blockly.Blocks['brilha_brilha_estrelinha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ Brilha Brilha Estrelinha")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Toca a melodia de Brilha Brilha Estrelinha");
    this.setHelpUrl("");
  }
};
// Christmas song: Jingle Bells
Blockly.Blocks['natal_jingle_bells'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Jingle Bells")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Jingle Bells. Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Silent Night (Noite Feliz)
Blockly.Blocks['natal_noite_feliz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Noite Feliz")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Noite Feliz (Silent Night). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Deck the Halls (Bate o Sino)
Blockly.Blocks['natal_bate_sino'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Bate o Sino")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Bate o Sino (Deck the Halls). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: We Wish You a Merry Christmas (Noel)
Blockly.Blocks['natal_noel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Feliz Natal")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca We Wish You a Merry Christmas. Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};
// Christmas song: Adeste Fideles (Ó Vinde)
Blockly.Blocks['natal_o_vinde'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎄 Ó Vinde")
        .appendField("com volume de")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#c0392b");
    this.setTooltip("Toca a melodia de Ó Vinde (Adeste Fideles). Use com 'Repetir para sempre' para loop infinito");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['criar_melodia_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("melodia");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover notas da melodia.");
    this.contextMenu = false;
  }
};
// Note step block for melody mutator
Blockly.Blocks['criar_melodia_note_step'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("nota");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma nota à melodia.");
    this.contextMenu = false;
  }
};
// Create melody block
Blockly.Blocks['criar_melodia'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.noteSteps_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_melodia_note_step']));
    this.setTooltip("Cria uma melodia personalizada. Use a engrenagem para adicionar mais notas!");
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('note_steps', this.noteSteps_);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.noteSteps_ = parseInt(xmlElement.getAttribute('note_steps'), 10) || 0;
    this.updateShape_();
  },
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_melodia_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.noteSteps_; i++) {
      var itemBlock = workspace.newBlock('criar_melodia_note_step');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    // Collect existing connections
    while (itemBlock) {
      connections.push(itemBlock.noteConnection_);
      connections.push(itemBlock.timeConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect old connections
    for (var i = 0; i < this.noteSteps_; i++) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      if (noteInput) {
        var noteConn = noteInput.connection.targetConnection;
        if (noteConn && connections.indexOf(noteConn) == -1) {
          noteConn.disconnect();
        }
      }
      if (tempoInput) {
        var tempoConn = tempoInput.connection.targetConnection;
        if (tempoConn && connections.indexOf(tempoConn) == -1) {
          tempoConn.disconnect();
        }
      }
    }
    this.noteSteps_ = connections.length / 2;
    this.updateShape_();
    // Reconnect blocks
    for (var i = 0; i < this.noteSteps_; i++) {
      if (connections[i * 2]) {
        Blockly.Mutator.reconnect(connections[i * 2], this, 'NOTA' + i);
      }
      if (connections[i * 2 + 1]) {
        Blockly.Mutator.reconnect(connections[i * 2 + 1], this, 'TEMPO' + i);
      }
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      itemBlock.noteConnection_ = noteInput && noteInput.connection.targetConnection;
      itemBlock.timeConnection_ = tempoInput && tempoInput.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('NOTA' + i) || this.getInput('TEMPO' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('NOTA' + i)) this.removeInput('NOTA' + i);
      if (this.getInput('TEMPO' + i)) this.removeInput('TEMPO' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }
    // Add inputs for each step
    if (this.noteSteps_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎼 Criar Melodia");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      for (var i = 0; i < this.noteSteps_; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎼 Criar Melodia");
        }
        this.appendValueInput('NOTA' + i)
            .setCheck("Note")
            .appendField((i + 1) + '. Tocar nota:');
        this.appendValueInput('TEMPO' + i)
            .setCheck("Time")
            .appendField('   por:');
      }
    }
  }
};
// Container block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("trilha sonora");
    this.appendStatementInput('STACK');
    this.setTooltip("Adicionar ou remover passos da trilha sonora.");
    this.contextMenu = false;
  }
};
// Action block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_action'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("som");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma ação de som (tocar nota, bipe, melodia, etc).");
    this.contextMenu = false;
  }
};
// Wait block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_wait'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("pausa");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Adicionar uma pausa (silêncio por um tempo).");
    this.contextMenu = false;
  }
};
// Create soundtrack block
Blockly.Blocks['criar_trilha_sonora'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_trilha_sonora_action', 'criar_trilha_sonora_wait']));
    this.setTooltip("Cria uma trilha sonora personalizada. Use a engrenagem para adicionar sons e pausas!");
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('steps', JSON.stringify(this.steps_));
    return container;
  },
  domToMutation: function(xmlElement) {
    var stepsStr = xmlElement.getAttribute('steps');
    this.steps_ = stepsStr ? JSON.parse(stepsStr) : [];
    this.updateShape_();
  },
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_trilha_sonora_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.steps_.length; i++) {
      var blockType = this.steps_[i] === 'action' ? 'criar_trilha_sonora_action' : 'criar_trilha_sonora_wait';
      var itemBlock = workspace.newBlock(blockType);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var newSteps = [];
    var connections = [];
    // Collect types and connections
    while (itemBlock) {
      if (itemBlock.type === 'criar_trilha_sonora_action') {
        newSteps.push('action');
        connections.push(itemBlock.stepConnection_);
      } else if (itemBlock.type === 'criar_trilha_sonora_wait') {
        newSteps.push('wait');
        connections.push(itemBlock.stepConnection_);
      }
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect old connections
    for (var i = 0; i < this.steps_.length; i++) {
      var input = this.getInput('STEP' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
    }
    this.steps_ = newSteps;
    this.updateShape_();
    // Reconnect blocks
    for (var i = 0; i < this.steps_.length; i++) {
      if (connections[i]) {
        Blockly.Mutator.reconnect(connections[i], this, 'STEP' + i);
      }
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('STEP' + i);
      itemBlock.stepConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('STEP' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('STEP' + i)) this.removeInput('STEP' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }
    // Add inputs for each step
    if (this.steps_.length === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎵 Criar Trilha Sonora");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      for (var i = 0; i < this.steps_.length; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎵 Criar Trilha Sonora");
        }
        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
              .setCheck("SoundCommand")
              .appendField('🔊 Tocar:');
        } else {
          this.appendValueInput('STEP' + i)
              .setCheck("Time")
              .appendField('🔇 Pausar por:');
        }
      }
    }
  }
};

(function() {
  if (Code.BlockTypeDomains) {
    Code.BlockTypeDomains.applyPreviousCheck(Code.BlockTypeDomains.get('SOUND_COMMANDS'), 'SoundCommand');
  }
})();
