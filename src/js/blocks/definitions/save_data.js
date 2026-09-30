// Blocks for storing measurements in a CSV file on the board.
'use strict';

(function(global) {
  var Blockly = global.Blockly;
  if (!Blockly || !Blockly.Blocks) return;

  function isEnglish() {
    return global.Code && global.Code.LANG === 'en';
  }

  function csvFileName(value) {
    var name = String(value || '').trim();
    return /^[a-zA-Z0-9_-]+\.csv$/i.test(name) ? name : 'medidas.csv';
  }

  function columnHeader(value, index) {
    var name = String(value || '').replace(/[\r\n]/g, ' ').trim();
    if (name) return name;
    return isEnglish() ? 'column ' + (index + 1) : 'coluna ' + (index + 1);
  }

  Blockly.Blocks['save_data_value_placeholder'] = {
    init: function() {
      this.appendDummyInput().appendField(isEnglish() ? 'variable' : 'variável');
      this.setOutput(true, 'Number');
      var placeholderColour = '#53688f';
      this.setColour(placeholderColour);
      // Blockly renders shadow blocks with the style's secondary colour,
      // rather than its primary colour. Keep it dark so the label stays clear.
      this.style.colourSecondary = placeholderColour;
      this.applyColour();
      this.setTooltip(isEnglish()
        ? 'Replace this placeholder with the number or sensor value you want to save.'
        : 'Troque este espaço pela variável ou pelo valor do sensor que deseja salvar.');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['salvar_dados_csv'] = {
    init: function() {
      this.itemCount_ = 1;
      this.columnNames_ = [columnHeader('', 0)];
      this.appendDummyInput()
        .appendField(isEnglish() ? '💾 save data to' : '💾 salvar dados em')
        .appendField(new Blockly.FieldTextInput('medidas.csv', csvFileName), 'ARQUIVO');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'every' : 'a cada')
        .appendField(new Blockly.FieldNumber(10, 1, 86400, 1), 'INTERVALO')
        .appendField(isEnglish() ? 'seconds' : 'segundos')
        .appendField(isEnglish() ? 'for' : 'durante')
        .appendField(new Blockly.FieldNumber(5, 1, 1440, 1), 'DURACAO')
        .appendField(new Blockly.FieldDropdown([
          [isEnglish() ? 'minutes' : 'minutos', 'MINUTES'],
          [isEnglish() ? 'hours' : 'horas', 'HOURS'],
          [isEnglish() ? 'days' : 'dias', 'DAYS']
        ], function(unit) {
          var block = this.getSourceBlock();
          var duration = block && block.getField('DURACAO');
          var maximum = unit === 'DAYS' ? 30 : unit === 'HOURS' ? 24 : 1440;
          if (duration) duration.setConstraints(1, maximum, 1);
          return unit;
        }), 'DURACAO_UNIDADE');
      this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'DATA_HORA')
        .appendField(isEnglish() ? 'save date and time' : 'salvar data e hora');
      this.updateShape_();
      this.setMutator(new Blockly.Mutator(['salvar_dados_csv_item']));
      this.setInputsInline(false);
      this.setPreviousStatement(true, 'ProgramCommand');
      this.setNextStatement(true, 'ProgramCommand');
      this.setColour('#168b83');
      this.setTooltip(isEnglish()
        ? 'Saves every added column in one CSV row for the chosen number of minutes, hours or days (up to 30 days). Use the gear to add more variables. Date and time, when enabled, is the first column.'
        : 'Salva todas as colunas adicionadas na mesma linha do CSV durante os minutos, horas ou dias escolhidos (até 30 dias). Use a engrenagem para incluir mais variáveis. Quando ativada, a data e hora fica na primeira coluna.');
      this.setHelpUrl('');
    },
    mutationToDom: function() {
      var mutation = document.createElement('mutation');
      mutation.setAttribute('items', this.itemCount_);
      return mutation;
    },
    domToMutation: function(xmlElement) {
      this.itemCount_ = Math.max(1, parseInt(xmlElement.getAttribute('items'), 10) || 1);
      this.columnNames_ = [];
      for (var i = 0; i < this.itemCount_; i++) this.columnNames_.push(columnHeader('', i));
      this.updateShape_();
    },
    decompose: function(workspace) {
      var container = workspace.newBlock('salvar_dados_csv_container');
      container.initSvg();
      var connection = container.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var item = workspace.newBlock('salvar_dados_csv_item');
        item.setFieldValue(this.getFieldValue('CABECALHO' + i) || this.columnNames_[i], 'HEADER');
        item.initSvg();
        connection.connect(item.previousConnection);
        connection = item.nextConnection;
      }
      return container;
    },
    compose: function(container) {
      var item = container.getInputTargetBlock('STACK');
      var names = [];
      var connections = [];
      while (item) {
        names.push(columnHeader(item.getFieldValue('HEADER'), names.length));
        connections.push(item.valueConnection_ || null);
        item = item.nextConnection && item.nextConnection.targetBlock();
      }
      if (!names.length) names.push(columnHeader('', 0));

      for (var i = 0; i < this.itemCount_; i++) {
        var oldInput = this.getInput('VALOR' + i);
        var oldConnection = oldInput && oldInput.connection.targetConnection;
        var oldValue = oldInput && oldInput.connection.targetBlock();
        if (oldValue && oldValue.isShadow()) {
          oldInput.connection.setShadowDom(null);
        } else if (oldConnection && connections.indexOf(oldConnection) === -1) {
          oldConnection.disconnect();
        }
      }

      this.itemCount_ = names.length;
      this.columnNames_ = names;
      this.updateShape_();
      for (var j = 0; j < this.itemCount_; j++) {
        if (connections[j]) Blockly.Mutator.reconnect(connections[j], this, 'VALOR' + j);
      }
    },
    saveConnections: function(container) {
      var item = container.getInputTargetBlock('STACK');
      var i = 0;
      while (item) {
        var input = this.getInput('VALOR' + i);
        var connectedValue = input && input.connection.targetBlock();
        item.valueConnection_ = connectedValue && !connectedValue.isShadow()
          ? input.connection.targetConnection
          : null;
        item.setFieldValue(this.getFieldValue('CABECALHO' + i) || this.columnNames_[i], 'HEADER');
        i++;
        item = item.nextConnection && item.nextConnection.targetBlock();
      }
    },
    updateShape_: function() {
      var index = 0;
      while (this.getInput('VALOR' + index)) {
        var oldInput = this.getInput('VALOR' + index);
        if (oldInput.connection) {
          // Removing an input can leave its shadow block orphaned in the
          // workspace. Clear the shadow first; real connected blocks remain
          // available for the mutator to reconnect afterward.
          oldInput.connection.setShadowDom(null);
        }
        this.removeInput('VALOR' + index);
        index++;
      }
      for (var i = 0; i < this.itemCount_; i++) {
        var header = columnHeader(this.columnNames_[i], i);
        this.columnNames_[i] = header;
        var input = this.appendValueInput('VALOR' + i)
          .appendField(isEnglish() ? 'add column' : 'adicionar coluna')
          .appendField(new Blockly.FieldTextInput(header, function(value) {
            return String(value || '').replace(/[\r\n]/g, ' ').trim() || null;
          }), 'CABECALHO' + i)
          .appendField(isEnglish() ? 'with value' : 'com valor');
        var placeholder = document.createElement('shadow');
        placeholder.setAttribute('type', 'save_data_value_placeholder');
        input.setShadowDom(placeholder);
      }
    }
  };

  Blockly.Blocks['salvar_dados_csv_container'] = {
    init: function() {
      this.setColour('#168b83');
      this.appendDummyInput().appendField(isEnglish() ? 'CSV columns' : 'colunas do CSV');
      this.appendStatementInput('STACK');
      this.setTooltip(isEnglish() ? 'Add or remove variable columns.' : 'Adicione ou remova colunas de variáveis.');
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['salvar_dados_csv_item'] = {
    init: function() {
      this.setColour('#168b83');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'add column' : 'adicionar coluna')
        .appendField(new Blockly.FieldTextInput(''), 'HEADER');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(isEnglish() ? 'Add one named variable column.' : 'Adicione uma coluna com nome para uma variável.');
      this.contextMenu = false;
    }
  };

  Blockly.Blocks['piscar_led_ao_salvar'] = {
    init: function() {
      this.appendValueInput('COLOUR')
        .setCheck('Colour')
        .appendField(isEnglish() ? '💡 Blink LED of colour' : '💡 Piscar LED da cor');
      this.appendValueInput('INTENSITY')
        .setCheck('Number')
        .appendField(isEnglish() ? 'when saving with brightness of' : 'ao salvar com brilho de')
        .appendField('%');
      this.setInputsInline(true);
      this.setPreviousStatement(true, 'ProgramCommand');
      this.setNextStatement(true, 'ProgramCommand');
      this.setColour('#168b83');
      this.setTooltip(isEnglish()
        ? 'Flashes the board RGB LED once after each CSV row is saved, without pausing the program.'
        : 'Pisca o LED RGB da placa uma vez após cada linha salva no CSV, sem pausar o programa.');
      this.setHelpUrl('');
    }
  };
})(window);
