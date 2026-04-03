// Shared generator helpers.
'use strict';

// Shared helpers extracted from the legacy monolith.

function _getBuzzerDisplayConfig() {
  if (Blockly.Python.buzzerDisplayConfig) {
    return Blockly.Python.buzzerDisplayConfig;
  }
  try {
    var ws = Blockly.getMainWorkspace();
    if (!ws) return null;
    var blocks = ws.getAllBlocks();
    var yPos = {'1': 8, '2': 18, '3': 28, '4': 38, '5': 48};
    for (var _bi = 0; _bi < blocks.length; _bi++) {
      if (blocks[_bi].type === 'display_mostrar_status_buzzer') {
        Blockly.Python.buzzerDisplayConfig = {
          line: yPos[blocks[_bi].getFieldValue('LINHA')],
          freqLine: yPos[blocks[_bi].getFieldValue('LINHA_FREQ')],
          showFreq: blocks[_bi].getFieldValue('MOSTRAR_FREQUENCIA') === 'TRUE'
        };
        return Blockly.Python.buzzerDisplayConfig;
      }
    }
  } catch (e) {}
  return null;
}
