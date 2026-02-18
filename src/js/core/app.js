// Based on Blockly Demos: Code
// Main application namespace and configuration

'use strict';

// Application namespace
var Code = {};

// Supported languages (ISO 639 format)
Code.LANGUAGE_NAME = {
  'en': 'English',
  'pt-br': 'Português Brasileiro',
  'es': 'Español',
  'it': 'Italiano',
  'fr': 'Français',
  'de': 'Deutsch',
  'zh-hans': 'Chinese (simplified)',
  'zh-hant': 'Chinese (traditional)'
};

// RTL (Right-to-Left) language codes
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

// Main Blockly workspace instance
Code.workspace = null;

// Extract URL query parameter (returns defaultValue if not found)
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)')); // Match ?param=value or &param=value
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue; // Convert + to space, then decode URI
};

// Get current language from URL (defaults to 'pt-br')
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', 'pt-br');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    lang = 'pt-br'; // Fallback to Portuguese Brazilian
  }
  return lang;
};

// Check if current language is RTL (Right-to-Left)
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

// Load blocks from storage (BlocklyStorage/sessionStorage) or use defaultXml
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    var loadOnce = null; // Firefox SecurityError workaround
  }
  // Wait for devices to load before loading blocks (poll every 500ms)
  var interval_ = setInterval(() => {
    if (typeof UI != 'undefined' && UI ['workspace'].devices.constructor.name == 'Object') { // Check if devices obj is ready
      // BlocklyStorage removed - using storage.js for auto-save
      if (loadOnce) {
        delete window.sessionStorage.loadOnceBlocks; // Clear language-switch temp storage
        var xml = Blockly.Xml.textToDom(loadOnce);
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
      } else if (defaultXml) {
        var xml = Blockly.Xml.textToDom(defaultXml); // Load default blocks
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
      }
      // else if ('BlocklyStorage' in window) {
      //   window.setTimeout(() => {BlocklyStorage.restoreBlocks(); UI['account'].openLastEdited()}, 0);
      // }
      clearInterval(interval_);
    }}, 500);
};

// Save blocks and reload page with new language
Code.changeLanguage = function() {
  if (window.sessionStorage) { // MSIE 11 doesn't support sessionStorage on file://
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var newLang = encodeURIComponent(Code.LANG);
  var search = window.location.search;
  if (search.length <= 1) { // No query string yet
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) { // Lang param exists, replace it
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else { // Other params exist, add lang
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

// DEPRECATED: Bind click event to element (use addEventListener directly)
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true); // true = capture phase (bubbles up from parent to target)
};

// Lazy-load Prettify for syntax highlighting
Code.importPrettify = function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
  document.head.appendChild(script);
};

// Current user language
Code.LANG = Code.getLang();

// Available tab names
Code.TABS_ = ['blocks', 'console', 'files', 'programs', 'device', 'databoard'];

// Current visible tabs [full, left, right]
Code.current = ["blocks", "", ""]

// Switch visible tab/pane with split-screen support
// _pos: 0=full screen, 1=left split, 2=right split
Code.handleLink = (_navigation, _pos) => {
  let _pos0 = _pos == 2 ? 1 : 2 // Opposite position (1<->2)
  let crt = Code.current

  // Hide and deinitialize tab content
  let turnOff = (elem, pos) => {
    let _tab  = get(`#content_${elem}`),
        _nav  = get(`#tab_${elem}`)
    Code.deinitContent(elem)
	  _nav.classList.remove('on')
	  if (pos == 1) _tab.classList.add(`_pos1`) // Temp class prevents CSS animation glitch
    if (pos == 2) _tab.classList.add(`_pos2`)
  	_tab.classList.remove(`pos${pos}`)
	  Animate.off(_tab)
  }

  // Show and initialize tab content
  let turnOn = (elem, pos) => {
    let _tab  = get(`#content_${elem}`),
        _nav  = get(`#tab_${elem}`)
    Code.renderContent(elem)

    _nav.classList.add('on')
	  Animate.on(_tab)
	  _tab.classList.remove("_pos1", "_pos2")
	  if (pos != 0) _tab.classList.add(`pos${pos}`)
  }

  // Full screen mode
  if (_pos == 0){
    turnOn(_navigation, 0)
    Code.current = [_navigation, '', '']
    return
  }

  // Swap left/right positions
  if (crt[_pos0] == _navigation) {
    let _tab  = get(`#content_${crt[_pos]}`),
        _tab0 = get(`#content_${crt[_pos0]}`)

 	  _tab.classList.remove(`pos${_pos}`)
 	  _tab.classList.add(`pos${_pos0}`)
 	  _tab0.classList.remove(`pos${_pos0}`)
 	  _tab0.classList.add(`pos${_pos}`)
 	  Code.current = ['', crt[2], crt[1]] // Swap array positions [1] and [2]
 	  return
  }

  // Already in full screen - ignore duplicate click
  if (crt[0] == _navigation && crt[1] == '' && crt[2] == '')
    return

  // Left click while in full screen - switch tabs
  if (_pos == 1 && crt[0] != ''){
    turnOff(crt[0], 0)
    crt[0] = _navigation
    turnOn(crt[0], 0)
    Code.resizeContent()
    return
  }

  // Left click on active split - expand to full screen
  if (_pos == 1){
    if (crt[_pos] == _navigation && crt[_pos0] != ''){
      turnOff(crt[_pos0], _pos0)
      let _tab  = get(`#content_${crt[_pos]}`)
   	  _tab.classList.remove(`pos${_pos}`)
      Code.current = [_navigation, '', '']
      Code.resizeContent()
      return
    }
  }

  // Right click on active split - close it
  if (_pos == 2){
    if (crt[_pos] == _navigation && crt[_pos0] != ''){
      turnOff(crt[_pos], _pos)
      let _tab0  = get(`#content_${crt[_pos0]}`)
   	  _tab0.classList.remove(`pos${_pos0}`)
      Code.current = [crt[_pos0], '', '']
      Code.resizeContent()
      return
    }
  }

  // Click new tab for split position
  if (crt[_pos] != _navigation && crt[0] == ''){
    if (crt[_pos] != '')
      turnOff(crt[_pos], _pos)
    turnOn(_navigation, _pos)
    Code.current[_pos] = _navigation
    Code.resizeContent()
    return
  }

  // Right click to create split while in full screen
  if (_pos == 2 && crt[_pos] != _navigation && crt[0] != ''){
    let _tab  = get(`#content_${crt[0]}`)
 	  _tab.classList.add(`pos1`)
    turnOn(_navigation, 2)
    Code.current = ['', crt[0], _navigation]
    Code.resizeContent()
    return
  }
}

// Initialize and render tab content
Code.renderContent = (_navigation) => {
  if (typeof _navigation == 'undefined')
    return
  let content = get(`#content_${_navigation}`)
  switch (_navigation) {
    case  "databoard":
      setTimeout(() => { // Chart.js canvas needs visible DOM
        if (!window.frames[3].inited) {
          if (typeof window.frames[3].modules == 'object' && typeof window.frames[3].modules.Workspaces == 'object') {
            window.frames[3].initDataStorage()
          } else {
            var interval = setInterval(() => { // Wait for databoard module
              if (typeof window.frames[3].modules == 'object' && typeof window.frames[3].modules.Workspaces == 'object') {
                window.frames[3].initDataStorage()
                if (window.frames[3].inited)
                  clearInterval(interval)
              }
            }, 500)
          }
        } else
        window.frames[3].initGrid()
      }, 10)
      break
    case "blocks":
      Code.workspace.setVisible(true)
      Code.auto_mode = true
      Blockly.svgResize(Code.workspace)
      break
    case "files":
      if (Files.editor.init == undefined) {
        Files.editor.setValue(new Array(9).fill('\r\n').join('')) // Workaround: editor needs 10+ lines to show line numbers
        setTimeout(() => {
          Files.editor.setValue('')
          Files.editor.init = true
        }, 10)
      }
      Files.handleCurrentProject()
      break
    case "console":
      term.resize()
      break
    case "device":
    case "programs":
      break
  }
  content.focus()
};

// Resize active tabs (needed for split-screen mode)
Code.resizeContent = (_navigation) => {
  Code.current.forEach (key => {
    switch (key) {
      case "blocks":
        setTimeout(()=>{Blockly.svgResize(Code.workspace)}, 250) // Delay ensures DOM layout completes
        break
      case "files":
        Files.resize()
        break
      case "console":
        term.resize()
        break
      case "databoard":
      case "device":
      case "programs":
        break
    }
  })
};

// Deinitialize tab when hiding (cleanup resources)
Code.deinitContent = (_navigation) => {
  switch (_navigation) {
  case  "databoard":
    if(window.frames[3].grid_inited)
      window.frames[3].deinitGrid()
    break
  case "blocks":
    Code.workspace.setVisible(false);
    Code.auto_mode = false;
    break
  }
}

// Validate all blocks have generator functions (prevents undefined code generation)
Code.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks();
  var missingBlockGenerators = [];

  if (!Code.checkAllGeneratorFunctionsDefined._alreadyAlerted) { // Static cache to prevent duplicate warnings
    Code.checkAllGeneratorFunctionsDefined._alreadyAlerted = {};
  }

  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) === -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var missingKey = missingBlockGenerators.sort().join(','); // Create unique key for this set of missing blocks

    if (!Code.checkAllGeneratorFunctionsDefined._alreadyAlerted[missingKey]) {
      console.warn('Missing generator code for blocks:', missingBlockGenerators.join(', '));
      Code.checkAllGeneratorFunctionsDefined._alreadyAlerted[missingKey] = true;
    }
  } else {
    Code.checkAllGeneratorFunctionsDefined._alreadyAlerted = {}; // Reset cache when all valid
  }
  return valid;
};

// Reload toolbox from XML (string or DOM) or fallback to default.xml
Code.reloadToolbox = function(XML_) {
  try {
    if (typeof XML_ === 'string') {
      XML_ = Blockly.Xml.textToDom(XML_);
    }

    if (XML_ && XML_.nodeName) {
      Code.workspace.updateToolbox(XML_);
      UI['notify'].send('Toolbox recarregada com sucesso!');
    } else {
      let request = new XMLHttpRequest(); // Fallback to default toolbox
      request.open('GET', 'toolbox/default.xml', false); // Synchronous request
      request.send(null);

      if (request.status === 200) {
        let toolboxXml = Blockly.Xml.textToDom(request.responseText);
        Code.workspace.updateToolbox(toolboxXml);
        UI['notify'].send('Toolbox padrão carregada!');
      }
    }

    Code.workspace.scrollCenter();
  } catch (e) {
    console.error('Erro ao recarregar a toolbox:', e);
    UI['notify'].send('Erro ao carregar a toolbox: ' + e.message);
  }
}

// Auto-generation flag for continuous code updates
Code.auto_mode = false;

// Wrap raw Blockly code with BitdogLab infinite loop structure
Code.wrapWithInfiniteLoop = function(rawCode) {
  if (!rawCode || rawCode.trim() === '') {
    return '';
  }

  // Wrap sound blocks with _buzzer_mudo guard only when button blocks are present.
  // Without buttons, parar_som is used for temporary silence in loops — no guard needed.
  // With buttons, parar_som is used for permanent stop — guard respects the flag.
  var hasButtonBlocks = rawCode.indexOf('flag_botao_') !== -1 ||
                        rawCode.indexOf('.irq(trigger=') !== -1 ||
                        rawCode.indexOf('.value()') !== -1;
  rawCode = rawCode.replace(
    // Capture leading whitespace separately so it is consumed by the match and
    // not left "orphaned" before the first content line when the block sits
    // inside an if/for (which would add extra indentation to only that line).
    /([ \t]*)# SOUND_BLOCK_START\n([\s\S]*?)[ \t]*# SOUND_BLOCK_END[ \t]*\n?/g,
    function(match, leadingIndent, content) {
      if (!hasButtonBlocks) {
        return content; // No buttons: always play, parar_som only silences momentarily
      }
      var indented = content.replace(/^(.+)$/gm, '  $1');
      return leadingIndent + 'if not _buzzer_mudo:\n' + indented;
    }
  );

  // Parse raw code into imports, setup, and action sections
  var lines = rawCode.split('\n');
  var imports = [];
  var setup = [];
  var actionCode = [];

  var soundCodeLines = [];
  var loopCodeLines = [];
  var setupCodeLines = [];
  var inSoundBlock = false;
  var inLoopBlock = false;
  var inSetupBlock = false;
  var inFunctionDef = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmedLine = line.trim();

    if (!trimmedLine) continue; // Skip empty lines

    // Skip orphan value expressions (disconnected output blocks)
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) continue; // Arrays like [1, 2, 3]
    if (/^\d+$/.test(trimmedLine)) continue; // Standalone numbers

    if (trimmedLine === BitdogLabConfig.MARKERS.SETUP_START) { // Setup block
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

    if (trimmedLine === BitdogLabConfig.MARKERS.LOOP_START) { // Custom loop block
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

    // DISABLED: Sound block separation was causing delays between notes to be moved to loop
    // if (trimmedLine === BitdogLabConfig.MARKERS.SOUND_START) { // Sound block
    //   inSoundBlock = true;
    //   continue;
    // }

    // if (trimmedLine === BitdogLabConfig.MARKERS.SOUND_END) {
    //   inSoundBlock = false;
    //   continue;
    // }

    // if (inSoundBlock) {
    //   soundCodeLines.push(line);
    //   continue;
    // }

    // Handle function definitions (multi-line)
    if (trimmedLine.startsWith('def ')) {
      inFunctionDef = true;
      setup.push(line);
      continue;
    }

    // If inside function definition, keep adding lines to setup until we hit a non-indented line
    if (inFunctionDef) {
      if (line.startsWith(' ') || line.startsWith('\t')) {
        setup.push(line);
        continue;
      } else {
        // Function ended, process this line normally
        inFunctionDef = false;
      }
    }

    // Categorize lines into imports, setup, or action code
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

  // Auto-inject oled.show() after groups of consecutive oled.* commands
  var processedAction = [];
  var inOledGroup = false;
  // lastContextIndent tracks the minimum indent seen from transparent lines after a group
  // opens. This handles display_dashboard_matriz which wraps each line in try/except:
  // oled cmds are at indent 2 (inside try), but except: is at indent 0 — so the injected
  // oled.show() must be at indent 0 (outside the except block), not at indent 2.
  var lastContextIndent = '';

  for (var k = 0; k < actionCode.length; k++) {
    var aLine = actionCode[k];
    var aTrimmed = aLine.trim();

    var isOledCmd = aTrimmed.startsWith('oled.') && aTrimmed !== 'oled.show()';
    var isOledShow = aTrimmed === 'oled.show()';

    // Group breakers: time.sleep and control flow keywords
    // NOTE: try/except/finally are NOT breakers — display_dashboard_matriz uses try/except
    // per line, and breaking there would cause multiple oled.show() per loop (flickering)
    var isBreaker = false;
    if (aTrimmed.indexOf('time.sleep') !== -1) isBreaker = true;
    if (aTrimmed.startsWith('if ') || aTrimmed.startsWith('for ') ||
        aTrimmed.startsWith('while ') || aTrimmed.startsWith('elif ') ||
        aTrimmed === 'else:') isBreaker = true;

    if (isOledShow) {
      // oled.show() terminates the group (no duplicate)
      inOledGroup = false;
      processedAction.push(aLine);
    } else if (isBreaker && inOledGroup) {
      var breakerIndent = aLine.match(/^(\s*)/)[1];
      var showIndent = breakerIndent.length <= lastContextIndent.length ? breakerIndent : lastContextIndent;
      processedAction.push(showIndent + 'oled.show()');
      inOledGroup = false;
      processedAction.push(aLine);
    } else if (isOledCmd) {
      var oledIndent = aLine.match(/^(\s*)/)[1];
      if (!inOledGroup) {
        // New group starting — initialize context indent to the oled command's indent
        lastContextIndent = oledIndent;
      }
      inOledGroup = true;
      processedAction.push(aLine);
    } else {
      // Transparent line — if we're in a group, track indent drops (e.g. except: at indent 0
      // after oled cmds at indent 2 signals we've exited the try block)
      if (inOledGroup && aTrimmed !== '') {
        var tIndent = aLine.match(/^(\s*)/)[1];
        if (tIndent.length < lastContextIndent.length) {
          lastContextIndent = tIndent;
        }
      }
      processedAction.push(aLine);
    }
  }

  // End of code - close any open oled group using lastContextIndent (not lastOledIndent)
  // to avoid injecting oled.show() inside a try/except block
  if (inOledGroup) {
    processedAction.push(lastContextIndent + 'oled.show()');
  }

  actionCode = processedAction;

  // Build final code structure
  var finalCode = '';

  // 1. Imports section
  if (imports.length > 0) {
    finalCode += imports.join('\n') + '\n';
  }

  if (finalCode.indexOf('import time') === -1) { // Ensure time import for delays
    finalCode += 'import time\n';
  }

  finalCode += '\n';

  // 2. Setup/initialization code (runs once, outside loop)
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
    finalCode += BitdogLabConfig.LED_INIT.generateInitCode(rawCode);
    finalCode += '\n';
  }

  // 2.5. Handle sound code (inside loop if buttons present, else run once)
  var hasButtonBlocks = rawCode.indexOf('.value()') !== -1; // .value() = button read method

  if (soundCodeLines.length > 0) {
    if (hasButtonBlocks) {
      actionCode = soundCodeLines.concat(actionCode); // Prepend sounds to loop (check button each iteration)
    } else {
      finalCode += '# Sons (execução única)\n';
      finalCode += soundCodeLines.join('\n') + '\n';
      finalCode += '\n';
    }
  }

  // 2.6. Custom loop code (bypass default loop)
  if (loopCodeLines.length > 0) {
    finalCode += '# Loop de Sons\n';
    finalCode += loopCodeLines.join('\n') + '\n';
    return finalCode; // Early return - custom loop replaces default
  }

  // 3. Static configuration (no loop needed)
  var hasStaticConfig = rawCode.indexOf(BitdogLabConfig.MARKERS.STATIC_CONFIG) !== -1; // Check for static LED config marker

  if (hasStaticConfig && actionCode.length === 0) {
    finalCode += '# Configuração estática concluída - LEDs fixos\n';
  }
  // 4. Main infinite loop (skip if "Repetir X vezes" is used)
  else if (actionCode.length > 0) {
    // Check if code contains "Repetir X vezes" block (for _rep in range)
    var hasRepeatXTimes = actionCode.some(line => line.includes('for _rep in range(') || line.includes('for _inner_rep in range('));

    if (hasRepeatXTimes) {
      // No while True needed - "Repetir X vezes" controls the loop
      for (var j = 0; j < actionCode.length; j++) {
        finalCode += actionCode[j] + '\n';
      }
    } else {
      // Add default infinite loop
      finalCode += '# Loop Principal\n';
      finalCode += 'while True:\n';

      for (var j = 0; j < actionCode.length; j++) {
        finalCode += '  ' + actionCode[j] + '\n';
      }

      finalCode += BitdogLabConfig.LOOP.getDelayCode(); // Prevent CPU overload
    }
  }

  return finalCode;
};

// Generate code from workspace (respects auto_mode flag)
Code.generateCode = function (generator = Blockly.Python) {
  if (Code.auto_mode || this.constructor.name != 'Window') { // Auto mode OR direct call (not from setInterval)
    if (Code.checkAllGeneratorFunctionsDefined(generator)) {
      if (generator.name_ == "Python") {
        // Pre-scan workspace for display_mostrar_status_buzzer so sound blocks
        // always find the config regardless of block order in the workspace
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
        var finalCode = Code.wrapWithInfiniteLoop(rawCode);

        if (rawCode.indexOf(BitdogLabConfig.MARKERS.STATIC_CONFIG) !== -1) {
          Code.auto_mode = false; // Stop auto-generation for static configs (no need to regenerate)
        }

        return finalCode;
      }
      else if (generator.name_ == "Javascript")
        return generator.workspaceToCode(Code.workspace);
    } else
      Code.auto_mode = false // Missing generator - stop auto mode to prevent errors
  }
}

// Generate XML from workspace with BIPES metadata
Code.generateXML = function (workspace = Code.workspace) {
    let xmlDom = Blockly.Xml.workspaceToDom(workspace);
    let xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    return UI['workspace'].writeWorkspace(xmlText, true);
}

// Initialize Blockly workspace and UI (called on page load)
Code.init = function() {
  Code.initLanguage();

  var rtl = Code.isRtl();

  // Import category names from MSG to Blockly.Msg (for toolbox XML decoding)
  setTimeout(function() {
    Code._generationInterval = setInterval(Code.generateCode, 250); // Poll every 250ms
    Code.auto_mode = true;
  }, 500); // 500ms delay ensures custom block generators are loaded

  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') == 0) { // Only process category messages (cat*)
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  // Load toolbox XML (BitdogLab default or basic fallback)
  let toolboxXml;
  let request = new XMLHttpRequest();
  request.open('GET', 'toolbox/default.xml', false); // Synchronous load (blocking)
  request.send(null);

  if (request.status === 200) {
    toolboxXml = Blockly.Xml.textToDom(request.responseText);
  } else {
    toolboxXml = Blockly.Xml.textToDom("<xml><category name='Básico' colour='%{BKY_LOGIC_HUE}'><block type='controls_if'></block><block type='logic_compare'></block><block type='controls_repeat_ext'></block><block type='math_number'></block><block type='math_arithmetic'></block><block type='text'></block><block type='text_print'></block></category></xml>"); // Minimal fallback toolbox
  }

  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25, // Grid spacing in pixels
           length: 3, // Grid dot size
           colour: '#ccc',
           snap: true}, // Enable snap-to-grid
       media: '../assets/media/',
       rtl: rtl,
       toolbox: toolboxXml,
       oneBasedIndex: false, // Arrays start at 0, not 1
       zoom:
           {controls: true, // Show zoom buttons
            wheel: true} // Enable mouse wheel zoom
      });

  Code.loadBlocks('');

  // Aumentar largura do flyout (painel de blocos)
  var flyout = Code.workspace.getFlyout();
  if (flyout) flyout.width_ = 300;

  // Display reminder removed - auto oled.show() handles display updates automatically

  // Joystick getter reminder notification system
  Code.showJoystickGetterReminder = function(blockType) {
    // Check if notification already exists
    if (document.getElementById('joystickGetterNotification')) {
      return;
    }

    var nomeBloco = blockType === 'joystick_intensidade_atual'
      ? '🕹️ Intensidade LED %'
      : '🕹️ Frequência Buzzer Hz';

    var notification = document.createElement('div');
    notification.id = 'joystickGetterNotification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #1565c0; color: white; padding: 18px 45px 18px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 450px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease-out;';
    notification.innerHTML = '<button id="closeJoystickNotification" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>' +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🕹️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver o número na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🕹️ Joystick controla LED <small>(ou Buzzer)</small><br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[' + nomeBloco + ']</strong> linha 1<br>' +
      '</div>';

    document.body.appendChild(notification);

    document.getElementById('closeJoystickNotification').addEventListener('click', function() {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    });

    var closeBtn = document.getElementById('closeJoystickNotification');
    closeBtn.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(0,0,0,0.4)';
    });
    closeBtn.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(0,0,0,0.2)';
    });
  };

  // Add slide-out animation
  var styleOut = document.createElement('style');
  styleOut.textContent = '@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
  document.head.appendChild(styleOut);

  // Seletor reminder notification
  Code.showJoystickSeletorReminder = function() {
    if (document.getElementById('joystickSeletorNotification')) return;

    var notification = document.createElement('div');
    notification.id = 'joystickSeletorNotification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #1565c0; color: white; padding: 18px 45px 18px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 460px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease-out;';
    notification.innerHTML =
      '<button id="closeJoystickSeletorNotification" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>' +
      '<strong style="font-size: 16px;">💡 Como usar: Trocar emoji na Matriz de LED</strong><br><br>' +
      '🕹️ Encaixe blocos de <strong>emoji</strong> dentro deste bloco.<br>' +
      'Use o joystick para <strong>trocar entre eles</strong>!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 4px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '🕹️ Trocar emoji na Matriz de LED<br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>coração</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>carinha feliz</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>seta</strong><br><br>' +
      '⚠️ <strong>A ordem que você colocar é a ordem de troca!</strong><br>' +
      'Joystick → próximo emoji &nbsp;|&nbsp; ← anterior' +
      '</div>';

    document.body.appendChild(notification);

    document.getElementById('closeJoystickSeletorNotification').addEventListener('click', function() {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (notification && notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
      }
    });

    var closeBtn = document.getElementById('closeJoystickSeletorNotification');
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.4)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.2)'; });
  };

  // Mic getter reminder notification
  Code.showMicGetterReminder = function() {
    if (document.getElementById('micGetterNotification')) return;

    var notification = document.createElement('div');
    notification.id = 'micGetterNotification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 18px 45px 18px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 450px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease-out;';
    notification.innerHTML =
      '<button id="closeMicGetterNotification" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>' +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🎙️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver o número na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🎙️ Acender matriz de LEDs com barulho<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🎙️ Nível do som]</strong> linha 1<br>' +
      '</div>';

    document.body.appendChild(notification);

    document.getElementById('closeMicGetterNotification').addEventListener('click', function() {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (notification && notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
      }
    });

    var closeBtn = document.getElementById('closeMicGetterNotification');
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.4)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.2)'; });
  };

  // Barra getter reminder notification
  Code.showBarraGetterReminder = function() {
    if (document.getElementById('barraGetterNotification')) return;

    var notification = document.createElement('div');
    notification.id = 'barraGetterNotification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 18px 45px 18px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 450px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease-out;';
    notification.innerHTML =
      '<button id="closeBarraGetterNotification" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>' +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🖥️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver a porcentagem na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🖥️ Medidor de barulho no Display  linha: 3<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🎙️ Intensidade do barulho (%)]</strong> linha 1<br>' +
      '</div>';

    document.body.appendChild(notification);

    document.getElementById('closeBarraGetterNotification').addEventListener('click', function() {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (notification && notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
      }
    });

    var closeBtn = document.getElementById('closeBarraGetterNotification');
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.4)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.2)'; });
  };

  // Palmas getter reminder notification
  Code.showPalmasGetterReminder = function() {
    if (document.getElementById('palmasGetterNotification')) return;

    var notification = document.createElement('div');
    notification.id = 'palmasGetterNotification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 18px 45px 18px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 450px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease-out;';
    notification.innerHTML =
      '<button id="closePalmasGetterNotification" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>' +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🖐️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Use-o no bloco <strong>"Mostrar valor"</strong> para ver o número, ou em condições como <strong>"se total de palmas = 3"</strong>.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🖐️ Contar palmas  sensibilidade: média  linha: 1<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🖐️ Total de palmas]</strong> linha 2<br>' +
      '</div>';

    document.body.appendChild(notification);

    document.getElementById('closePalmasGetterNotification').addEventListener('click', function() {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (notification && notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
      }
    });

    var closeBtn = document.getElementById('closePalmasGetterNotification');
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.4)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.2)'; });
  };

  // Listen for block create events
  Code.workspace.addChangeListener(function(event) {
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      var block = Code.workspace.getBlockById(event.blockId);
      if (block) {
        var blockType = block.type;
        var joystickGetterBlocks = [
          'joystick_intensidade_atual',
          'joystick_frequencia_atual',
          'joystick_posicao_x',
          'joystick_posicao_y'
        ];

        if (joystickGetterBlocks.indexOf(blockType) !== -1) {
          Code.showJoystickGetterReminder(blockType);
        }

        if (blockType === 'joystick_seletor') {
          Code.showJoystickSeletorReminder();
        }

        if (blockType === 'microfone_nivel_atual') {
          Code.showMicGetterReminder();
        }

        if (blockType === 'microfone_barra_pct') {
          Code.showBarraGetterReminder();
        }

        if (blockType === 'microfone_total_palmas') {
          Code.showPalmasGetterReminder();
        }
      }
    }
  });

  // BlocklyStorage removed - using storage.js for auto-save
  // if ('BlocklyStorage' in window) {
  //   BlocklyStorage.backupOnUnload(Code.workspace);
  // }

  Code.handleLink(Code.current[0], 0);


  // Version selector: switch between BitdogLab v6 and v7
  var versionSelector = document.getElementById('device_selector');
  if (versionSelector) {
    // Alias para facilitar troca
    var BitdogLabConfig_V7 = BitdogLabConfig;
    versionSelector.addEventListener('change', function() {
      BitdogLabConfig = (this.value === 'v6') ? BitdogLabConfig_V6 : BitdogLabConfig_V7;
      Code.renderContent();
      // Aviso para reconectar a placa ao trocar de versão
      if (typeof mux !== 'undefined' && mux.connected && mux.connected()) {
        Tool.stopPython();
        alert('Versão alterada para ' + this.value.toUpperCase() + '!\n\nDesconecte e reconecte a placa USB para aplicar a nova pinagem.');
      }
    });
  }

  // Link button disabled - BlocklyStorage removed
  var linkButton = document.getElementById('linkButton');
  if (linkButton) {
    linkButton.className = 'disabled';
  }
  // if ('BlocklyStorage' in window) {
  //   BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
  //   BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
  //   BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
  //   BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
  //   Code.bindClick(linkButton, function () {BlocklyStorage.link(Code.workspace);});
  // } else if (linkButton) {
  //   linkButton.className = 'disabled';
  // }

  // Bind tab click handlers (left=full/left split, right=right split)
  for (var i = 0; i < Code.TABS_.length; i++) {
    let name = Code.TABS_[i];
    let tab = get(`#tab_${name}`)
    tab.addEventListener("click", (ev) => {
      ev.preventDefault()
      Code.handleLink(name, 1) // Left click = position 1 (full or left)
    })
    tab.addEventListener("contextmenu", (ev) => {
      ev.preventDefault() // Block browser context menu
      Code.handleLink(name, 2) // Right click = position 2 (right split)
    })
  }
  Blockly.svgResize(Code.workspace);

  window.setTimeout(Code.importPrettify, 1); // Lazy-load syntax highlighting
};

// Initialize page language and direction (RTL/LTR)
Code.initLanguage = function() {
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically by display name
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]); // [display name, code]
  }
  var comp = function(a, b) { // Comparator for sorting
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);

  // Language menu removed from UI

  // Inject localized UI strings
  document.getElementById('tab_blocks').textContent = MSG['blocks'];
  document.getElementById('tab_files').textContent = MSG['files'];
  document.getElementById('tab_programs').textContent = MSG['shared'];
  document.getElementById('tab_device').textContent = MSG['device'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('saveButton').title = MSG['saveTooltip'];
  document.getElementById('loadButton').title = MSG['loadTooltip'];
  document.getElementById('notificationButton').title = MSG['notificationTooltip'];
  document.getElementById('toolbarButton').title = MSG['toolbarTooltip'];
};

// Clear workspace (with confirmation if >1 block)
Code.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 || // Skip confirm for single block
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) { // Replace %1 with count
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = ''; // Clear hash to prevent reload from storage
    }
  }
};

// Load localized message files (must execute before DOM ready)
document.write('<script src="../translations/app/' + Code.LANG + '.js"></script>\n'); // BIPES UI messages
document.write('<script src="../translations/blockly/languages/' + Code.LANG + '.js"></script>\n'); // Blockly core messages
