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

  Blockly.Blocks['salvar_dados_csv'] = {
    init: function() {
      this.appendValueInput('VALOR')
        .appendField(isEnglish() ? 'save' : 'salvar');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'to file' : 'no arquivo')
        .appendField(new Blockly.FieldTextInput('medidas.csv', csvFileName), 'ARQUIVO');
      this.appendDummyInput()
        .appendField(isEnglish() ? 'every' : 'a cada')
        .appendField(new Blockly.FieldNumber(10, 1, 86400, 1), 'INTERVALO')
        .appendField(isEnglish() ? 'seconds' : 'segundos')
        .appendField(isEnglish() ? 'for' : 'durante')
        .appendField(new Blockly.FieldNumber(5, 1, 1440, 1), 'DURACAO')
        .appendField(isEnglish() ? 'minutes' : 'minutos');
      this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'DATA_HORA')
        .appendField(isEnglish() ? 'save date and time' : 'salvar data e hora');
      this.setInputsInline(false);
      this.setPreviousStatement(true, 'ProgramCommand');
      this.setNextStatement(true, 'ProgramCommand');
      this.setColour('#168b83');
      this.setTooltip(isEnglish()
        ? 'Saves one reading per CSV row on the board. Date and time are optional. The board clock is synchronized when you run from BIPES.'
        : 'Salva uma leitura por linha do CSV na placa. Data e hora são opcionais. O relógio é ajustado ao executar pelo BIPES.');
      this.setHelpUrl('');
    }
  };
})(window);
