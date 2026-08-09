'use strict';

var Code = window.Code || (window.Code = {});
var CodeGeneratorManager = window.CodeGeneratorManager || (window.CodeGeneratorManager = {});

CodeGeneratorManager.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks();
  var missingBlockGenerators = [];

  if (!CodeGeneratorManager.checkAllGeneratorFunctionsDefined._alreadyAlerted) {
    CodeGeneratorManager.checkAllGeneratorFunctionsDefined._alreadyAlerted = {};
  }

  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) === -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length === 0;
  if (!valid) {
    var missingKey = missingBlockGenerators.sort().join(',');
    if (!CodeGeneratorManager.checkAllGeneratorFunctionsDefined._alreadyAlerted[missingKey]) {
      console.warn('Missing generator code for blocks:', missingBlockGenerators.join(', '));
      CodeGeneratorManager.checkAllGeneratorFunctionsDefined._alreadyAlerted[missingKey] = true;
    }
  } else {
    CodeGeneratorManager.checkAllGeneratorFunctionsDefined._alreadyAlerted = {};
  }

  return valid;
};

CodeGeneratorManager.generateCode = function(generator) {
  generator = generator || Blockly.Python;

  if (Code.auto_mode || this.constructor.name !== 'Window') {
    if (Code.BlockContractValidator && Code.workspace) {
      var report = Code.BlockContractValidator.getReport(Code.workspace);
      if (!report.valid) {
        var summary = Code.BlockContractValidator.getSummaryText(report, 5);
        return '# Codigo nao gerado: corrija os avisos dos blocos.\n' +
          summary.split('\n').map(function(line) {
            return '# ' + line;
          }).join('\n') + '\n';
      }
    }

    if (CodeGeneratorManager.checkAllGeneratorFunctionsDefined(generator)) {
      if (generator.name_ === 'Python') {
        generator.buzzerDisplayConfig = null;
        generator.activeDisplayType = null;
        var allBlocks = Code.workspace.getAllBlocks();
        for (var bi = 0; bi < allBlocks.length; bi++) {
          if (allBlocks[bi].type === 'display_mostrar_status_buzzer') {
            var yPositions = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
            var linha = allBlocks[bi].getFieldValue('LINHA');
            var mostrarFrequencia = allBlocks[bi].getFieldValue('MOSTRAR_FREQUENCIA') === 'TRUE';
            var linhaFreq = allBlocks[bi].getFieldValue('LINHA_FREQ');
            generator.buzzerDisplayConfig = {
              line: yPositions[linha],
              freqLine: yPositions[linhaFreq],
              showFreq: mostrarFrequencia,
              displayType: allBlocks[bi].getFieldValue('DISPLAY_TYPE') || 'SMALL'
            };
            break;
          }
        }

        var rawCode = generator.workspaceToCode(Code.workspace);
        var finalCode = CodeGeneratorManager.wrapWithInfiniteLoop(rawCode);
        if (rawCode.indexOf(BitdogLabConfig.MARKERS.STATIC_CONFIG) !== -1) {
          Code.auto_mode = false;
        }
        return finalCode;
      } else if (generator.name_ === 'Javascript') {
        return generator.workspaceToCode(Code.workspace);
      }
    } else {
      Code.auto_mode = false;
    }
  }
};

