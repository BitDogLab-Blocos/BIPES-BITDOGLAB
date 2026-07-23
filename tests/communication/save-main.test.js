'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  loadBrowserScript,
  waitFor
} = require('../helpers/load-browser-script');

test('saving main.py preserves the ordered base64 protocol and verifies byte count', async () => {
  const sourceCode = "print('BitDogLab Android transport baseline')\n".repeat(3);
  const generatedCode = `while True:\n${sourceCode}`;
  const expectedBytes = new TextEncoder().encode(generatedCode);
  const events = {
    commands: [],
    progress: [],
    statuses: []
  };
  const Files = { received_string: '' };
  const UI = {
    progress: {
      start(total, determinate) {
        events.progress.push(['start', total, determinate]);
      },
      load(current, total) {
        events.progress.push(['load', current, total]);
      },
      end(success) {
        events.progress.push(['end', success]);
      }
    }
  };
  const mux = {
    clearBuffer() {},
    bufferPush(command, callback) {
      events.commands.push(command);
      if (String(command).includes('__BIPES_MAIN_SAVED__')) {
        Files.received_string = `__BIPES_MAIN_SAVED__ ${expectedBytes.length}`;
      }
      if (callback) callback();
    }
  };
  const Blockly = {
    Python: {
      buzzerDisplayConfig: true,
      activeDisplayType: 'oled',
      workspaceToCode() {
        return sourceCode;
      }
    }
  };
  const Code = {
    workspace: {},
    wrapWithInfiniteLoop() {
      return generatedCode;
    }
  };
  const loaded = loadBrowserScript(
    'src/js/core/utils.js',
    {
      Blockly,
      Channel: {},
      Code,
      Files,
      mux,
      UI
    },
    '{ Tool, files }'
  );
  loaded.exports.files.update_file_status = (status) => {
    events.statuses.push(status);
  };
  let completed;

  loaded.exports.Tool._doSaveAsMainPy((verified) => {
    completed = verified;
  });
  await waitFor(() => completed !== undefined, 'main.py verification did not finish');

  assert.equal(completed, true);
  assert.equal(events.commands[0], "import ubinascii; f=open('main.py','wb')\r");
  assert.equal(events.commands.at(-2), "f.close()\r");
  assert.match(events.commands.at(-1), /__BIPES_MAIN_SAVED__/);

  const writes = events.commands.filter((command) =>
    String(command).startsWith('f.write(ubinascii.a2b_base64')
  );
  assert.ok(writes.length > 1, 'Fixture must exercise multiple transfer chunks');
  assert.ok(events.statuses.at(-1).includes(`${expectedBytes.length} bytes`));

  const started = events.progress[0];
  assert.deepEqual(started, ['start', writes.length + 3, true]);
  assert.equal(
    events.progress.filter(([type]) => type === 'load').length,
    writes.length + 3
  );
  assert.equal(Blockly.Python.buzzerDisplayConfig, undefined);
  assert.equal(Blockly.Python.activeDisplayType, undefined);
});
