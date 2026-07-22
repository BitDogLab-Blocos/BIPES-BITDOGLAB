'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  loadBrowserScript,
  waitFor
} = require('../helpers/load-browser-script');

function createHarness(options = {}) {
  const events = {
    callbacks: 0,
    i2cChunks: [],
    i2cStarts: 0,
    notifications: [],
    terminal: [],
    toolVerifications: 0,
    writes: []
  };
  const UI = {
    notify: {
      send(message) {
        events.notifications.push(message);
      },
      log() {}
    },
    progress: {
      remain() {},
      end() {}
    },
    workspace: {
      connecting() {},
      receiving() {},
      resetBoard: { checked: false },
      runButton: { status: true, dom: { className: '' } },
      toolbarButton: { className: '' },
      runAbort() {}
    }
  };
  const i2cScanner = {
    _isRunning: false,
    processData(chunk) {
      events.i2cChunks.push(chunk);
    },
    start() {
      events.i2cStarts += 1;
      this._isRunning = true;
    },
    stop() {
      this._isRunning = false;
    }
  };
  const term = {
    on() {},
    off() {},
    write(value) {
      events.terminal.push(value);
    }
  };
  const Tool = {
    bipesVerify() {
      events.toolVerifications += 1;
    }
  };
  const Files = { received_string: '' };
  const MSG = {
    notAvailableFlag: '$1 não está disponível.'
  };
  const Channel = {};
  const navigator = options.navigator || {};
  const loaded = loadBrowserScript(
    'src/js/communication/webserial.js',
    {
      Channel,
      ERROR_CODES: { PORT_ALREADY_OPEN: 11 },
      Files,
      i2cScanner,
      MSG,
      navigator,
      REPL_CONSTANTS: {
        PROMPT: '>>> ',
        PROMPT_LENGTH: 4,
        CTRL_C: '\x03',
        CTRL_D: '\x04'
      },
      SERIAL_CONFIG: {
        PACKET_SIZE: 100,
        BAUD_RATE: 115200,
        WATCH_INTERVAL_MS: 50,
        RESET_TIMEOUT_MS: 50
      },
      term,
      Tool,
      UI
    },
    '{ WebSerialProtocol, webserial }'
  );

  return {
    ...loaded.exports,
    Channel,
    events,
    Files,
    i2cScanner,
    UI
  };
}

test('connect reports an unavailable Web Serial API without changing state', () => {
  const { WebSerialProtocol, events } = createHarness();
  const protocol = new WebSerialProtocol();

  protocol.connect();

  assert.equal(protocol.connected, false);
  assert.deepEqual(events.notifications, ['WebSerial API não está disponível.']);
  assert.equal(events.terminal.join(''), 'WebSerial API não está disponível.');
});

test('incoming fragmented prompt completes the legacy callback and resumes I2C', async (t) => {
  let readableController;
  const readable = new ReadableStream({
    start(controller) {
      readableController = controller;
    }
  });
  const port = {
    readable,
    writable: {
      locked: false,
      getWriter() {
        return {
          write: async () => {},
          close: async () => {},
          abort() {},
          releaseLock() {}
        };
      }
    },
    async open() {},
    async close() {}
  };
  const navigator = {
    serial: {
      async requestPort() {
        return port;
      }
    }
  };
  const harness = createHarness({ navigator });
  const protocol = new harness.WebSerialProtocol();
  protocol._resetBoard = () => {};
  harness.Channel.webserial = protocol;
  protocol.completeBufferCallback.push(() => {
    harness.events.callbacks += 1;
  });
  t.after(async () => {
    clearInterval(protocol.watcher);
    try {
      readableController.close();
    } catch (error) {}
  });

  protocol.connect();
  await waitFor(() => protocol.connected, 'Web Serial did not connect');

  const encoder = new TextEncoder();
  readableController.enqueue(encoder.encode('>'));
  readableController.enqueue(encoder.encode('>> '));

  await waitFor(() => harness.events.callbacks === 1, 'Prompt callback did not run');

  assert.equal(protocol.lastChars, '>>> ');
  assert.equal(harness.events.i2cStarts, 1);
  assert.deepEqual(harness.events.i2cChunks, ['>', '>> ']);
  assert.equal(harness.events.toolVerifications, 2);
  assert.equal(harness.Files.received_string, '>>> ');
  assert.equal(harness.UI.workspace.runButton.dom.className, 'icon');
  assert.equal(harness.UI.workspace.toolbarButton.className, 'icon medium');
});

test('_serialWrite encodes text and removes one queued packet after success', async () => {
  const harness = createHarness();
  const protocol = new harness.WebSerialProtocol();
  let released = false;
  protocol.buffer = ['packet'];
  protocol.port = {
    writable: {
      locked: false,
      getWriter() {
        return {
          async write(bytes) {
            harness.events.writes.push(Array.from(bytes));
          },
          releaseLock() {
            released = true;
          }
        };
      }
    }
  };

  protocol._serialWrite('abc');
  await waitFor(() => released, 'Writer lock was not released');

  assert.deepEqual(harness.events.writes, [[97, 98, 99]]);
  assert.deepEqual(protocol.buffer, []);
});
