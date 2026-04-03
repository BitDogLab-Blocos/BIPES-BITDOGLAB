'use strict';

var Code = window.Code || (window.Code = {});
var CodeGeneratorManager = {};

Code.auto_mode = false;

CodeGeneratorManager.getOledCompatSetupCode = function() {
  return [
    '# OLED compatibility helpers',
    'if not hasattr(oled, "fill_rect"):',
    '  def _oled_hline(x, y, w, c):',
    '    for _x in range(x, x + max(0, w)):',
    '      oled.pixel(_x, y, c)',
    '  def _oled_vline(x, y, h, c):',
    '    for _y in range(y, y + max(0, h)):',
    '      oled.pixel(x, _y, c)',
    '  def _oled_fill_rect(x, y, w, h, c):',
    '    for _yy in range(y, y + max(0, h)):',
    '      for _xx in range(x, x + max(0, w)):',
    '        oled.pixel(_xx, _yy, c)',
    '  def _oled_rect(x, y, w, h, c):',
    '    if w <= 0 or h <= 0:',
    '      return',
    '    _oled_hline(x, y, w, c)',
    '    _oled_hline(x, y + h - 1, w, c)',
    '    _oled_vline(x, y, h, c)',
    '    _oled_vline(x + w - 1, y, h, c)',
    '  def _oled_line(x0, y0, x1, y1, c):',
    '    dx = abs(x1 - x0)',
    '    sx = 1 if x0 < x1 else -1',
    '    dy = -abs(y1 - y0)',
    '    sy = 1 if y0 < y1 else -1',
    '    err = dx + dy',
    '    while True:',
    '      oled.pixel(x0, y0, c)',
    '      if x0 == x1 and y0 == y1:',
    '        break',
    '      e2 = err * 2',
    '      if e2 >= dy:',
    '        err += dy',
    '        x0 += sx',
    '      if e2 <= dx:',
    '        err += dx',
    '        y0 += sy',
    '  oled.hline = _oled_hline',
    '  oled.vline = _oled_vline',
    '  oled.fill_rect = _oled_fill_rect',
    '  oled.rect = _oled_rect',
    '  oled.line = _oled_line'
  ].join('\n') + '\n';
};

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

CodeGeneratorManager.wrapWithInfiniteLoop = function(rawCode) {
  if (!rawCode || rawCode.trim() === '') {
    return '';
  }

  var hasButtonBlocks = rawCode.indexOf('flag_botao_') !== -1 ||
                        rawCode.indexOf('.irq(trigger=') !== -1 ||
                        rawCode.indexOf('.value()') !== -1;
  rawCode = rawCode.replace(
    /([ \t]*)# SOUND_BLOCK_START\n([\s\S]*?)[ \t]*# SOUND_BLOCK_END[ \t]*\n?/g,
    function(match, leadingIndent, content) {
      if (!hasButtonBlocks) {
        return content;
      }
      var indented = content.replace(/^(.+)$/gm, '  $1');
      return leadingIndent + 'if not _buzzer_mudo:\n' + indented;
    }
  );

  var lines = rawCode.split('\n');
  var imports = [];
  var setup = [];
  var actionCode = [];
  var soundCodeLines = [];
  var loopCodeLines = [];
  var setupCodeLines = [];
  var inLoopBlock = false;
  var inSetupBlock = false;
  var inFunctionDef = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmedLine = line.trim();

    if (!trimmedLine) continue;
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) continue;
    if (/^\d+$/.test(trimmedLine)) continue;

    if (trimmedLine === BitdogLabConfig.MARKERS.SETUP_START) {
      inSetupBlock = true;
      continue;
    }
    if (trimmedLine === BitdogLabConfig.MARKERS.SETUP_END) {
      inSetupBlock = false;
      continue;
    }
    if (inSetupBlock) {
      setupCodeLines.push(line);
      continue;
    }

    if (trimmedLine === BitdogLabConfig.MARKERS.LOOP_START) {
      inLoopBlock = true;
      continue;
    }
    if (trimmedLine === BitdogLabConfig.MARKERS.LOOP_END) {
      inLoopBlock = false;
      continue;
    }
    if (inLoopBlock) {
      loopCodeLines.push(line);
      continue;
    }

    if (trimmedLine.startsWith('def ') || trimmedLine.startsWith('class ')) {
      inFunctionDef = true;
      setup.push(line);
      continue;
    }

    if (inFunctionDef) {
      if (line.startsWith(' ') || line.startsWith('\t')) {
        setup.push(line);
        continue;
      }
      inFunctionDef = false;
    }

    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      imports.push(line);
    } else if (BitdogLabConfig.SETUP_PATTERNS.isSetupLine(line)) {
      setup.push(line);
    } else if (trimmedLine.startsWith('#')) {
      setup.push(line);
    } else {
      actionCode.push(line);
    }
  }

  var processedAction = [];
  var inOledGroup = false;
  var groupHasContent = false;
  var hadPreviousShow = false;
  var lastContextIndent = '';

  for (var k = 0; k < actionCode.length; k++) {
    var aLine = actionCode[k];
    var aTrimmed = aLine.trim();
    var isOledCmd = aTrimmed.startsWith('oled.') && aTrimmed !== 'oled.show()';
    var isOledShow = aTrimmed === 'oled.show()';
    var isClearOnly = aTrimmed === 'oled.fill(0)';
    var isBreaker = false;

    if (aTrimmed.indexOf('time.sleep') !== -1) isBreaker = true;
    if (aTrimmed.startsWith('if ') || aTrimmed.startsWith('for ') ||
        aTrimmed.startsWith('while ') || aTrimmed.startsWith('elif ') ||
        aTrimmed === 'else:') isBreaker = true;

    if (isOledShow) {
      inOledGroup = false;
      groupHasContent = false;
      hadPreviousShow = true;
      processedAction.push(aLine);
    } else if (isBreaker && inOledGroup) {
      var breakerIndent = aLine.match(/^(\s*)/)[1];
      var isElseLike = aTrimmed === 'else:' || aTrimmed.startsWith('elif ');
      var showIndent = isElseLike
        ? lastContextIndent
        : (breakerIndent.length <= lastContextIndent.length ? breakerIndent : lastContextIndent);
      var shouldInject = groupHasContent || !hadPreviousShow;

      if (shouldInject) {
        processedAction.push(showIndent + 'oled.show()');
        hadPreviousShow = true;
      }

      inOledGroup = false;
      groupHasContent = false;
      if (isElseLike) {
        hadPreviousShow = false;
      }
      processedAction.push(aLine);
    } else if (isOledCmd) {
      var oledIndent = aLine.match(/^(\s*)/)[1];
      if (inOledGroup && groupHasContent && isClearOnly) {
        processedAction.push(lastContextIndent + 'oled.show()');
        hadPreviousShow = true;
        inOledGroup = false;
        groupHasContent = false;
      }
      if (!inOledGroup) {
        lastContextIndent = oledIndent;
        groupHasContent = false;
      }
      inOledGroup = true;
      if (!isClearOnly) {
        groupHasContent = true;
      }
      processedAction.push(aLine);
    } else {
      if (inOledGroup && aTrimmed !== '') {
        var tIndent = aLine.match(/^(\s*)/)[1];
        if (tIndent.length < lastContextIndent.length) {
          lastContextIndent = tIndent;
        }
      }
      processedAction.push(aLine);
    }
  }

  if (inOledGroup && (groupHasContent || !hadPreviousShow)) {
    processedAction.push(lastContextIndent + 'oled.show()');
  }

  actionCode = processedAction;
  var finalCode = '';

  if (imports.length > 0) {
    finalCode += imports.join('\n') + '\n';
  }
  if (finalCode.indexOf('import time') === -1) {
    finalCode += 'import time\n';
  }
  finalCode += '\n';

  if (setup.length > 0 || setupCodeLines.length > 0) {
    finalCode += '# Bloco de Setup\n';
    if (setup.length > 0) {
      finalCode += setup.join('\n') + '\n';
    }
    if (setupCodeLines.length > 0) {
      var nonEmpty = setupCodeLines.filter(function(l) { return l.trim(); });
      var minIndent = nonEmpty.reduce(function(min, l) {
        return Math.min(min, l.match(/^(\s*)/)[1].length);
      }, Infinity);
      if (minIndent === Infinity) minIndent = 0;
      var dedentedSetup = setupCodeLines.map(function(l) { return l.substring(minIndent); });
      finalCode += dedentedSetup.join('\n') + '\n';
    }
    if (rawCode.indexOf('SSD1306_I2C(') !== -1) {
      finalCode += CodeGeneratorManager.getOledCompatSetupCode();
    }
    finalCode += BitdogLabConfig.LED_INIT.generateInitCode(rawCode);
    finalCode += '\n';
  }

  hasButtonBlocks = rawCode.indexOf('.value()') !== -1;
  if (soundCodeLines.length > 0) {
    if (hasButtonBlocks) {
      actionCode = soundCodeLines.concat(actionCode);
    } else {
      finalCode += '# Sons (execução única)\n';
      finalCode += soundCodeLines.join('\n') + '\n\n';
    }
  }

  if (loopCodeLines.length > 0) {
    finalCode += '# Loop de Sons\n';
    finalCode += loopCodeLines.join('\n') + '\n';
    return finalCode;
  }

  var hasStaticConfig = rawCode.indexOf(BitdogLabConfig.MARKERS.STATIC_CONFIG) !== -1;
  if (hasStaticConfig && actionCode.length === 0) {
    finalCode += '# Configuração estática concluída - LEDs fixos\n';
  } else if (actionCode.length > 0) {
    var hasRepeatXTimes = actionCode.some(function(line) {
      return line.indexOf('for _rep in range(') !== -1 || line.indexOf('for _inner_rep in range(') !== -1;
    });

    if (hasRepeatXTimes) {
      for (var j = 0; j < actionCode.length; j++) {
        finalCode += actionCode[j] + '\n';
      }
    } else {
      finalCode += '# Loop Principal\n';
      finalCode += 'while True:\n';
      for (var m = 0; m < actionCode.length; m++) {
        finalCode += '  ' + actionCode[m] + '\n';
      }
      finalCode += BitdogLabConfig.LOOP.getDelayCode();
    }
  }

  if (Code.translateGeneratedCode) {
    finalCode = Code.translateGeneratedCode(finalCode);
  }
  return finalCode;
};

CodeGeneratorManager.generateCode = function(generator) {
  generator = generator || Blockly.Python;

  if (Code.auto_mode || this.constructor.name !== 'Window') {
    if (CodeGeneratorManager.checkAllGeneratorFunctionsDefined(generator)) {
      if (generator.name_ === 'Python') {
        generator.buzzerDisplayConfig = null;
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
              showFreq: mostrarFrequencia
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

CodeGeneratorManager.startAutoGeneration = function() {
  setTimeout(function() {
    Code._generationInterval = setInterval(Code.generateCode, 250);
    Code.auto_mode = true;
  }, 500);
};

Code.getOledCompatSetupCode = CodeGeneratorManager.getOledCompatSetupCode;
Code.checkAllGeneratorFunctionsDefined = CodeGeneratorManager.checkAllGeneratorFunctionsDefined;
Code.wrapWithInfiniteLoop = CodeGeneratorManager.wrapWithInfiniteLoop;
Code.generateCode = CodeGeneratorManager.generateCode;
Code.startAutoGeneration = CodeGeneratorManager.startAutoGeneration;
