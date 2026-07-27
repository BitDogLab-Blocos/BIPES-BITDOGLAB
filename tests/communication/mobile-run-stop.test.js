'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { loadBrowserScript } = require('../helpers/load-browser-script');

function createHarness(mobileSerial) {
  const events = {
    buffer: [],
    cleared: 0,
    receiving: 0,
    scannerStarts: 0,
    scannerStops: 0
  };
  const Channel = {
    webserial: {
      connected: true,
      packetSize: mobileSerial ? 4096 : 100
    }
  };
  const mux = {
    bufferPush(value) {
      events.buffer.push(value);
    },
    clearBuffer() {
      events.cleared += 1;
    }
  };
  const i2cScanner = {
    start() {
      events.scannerStarts += 1;
    },
    stop() {
      events.scannerStops += 1;
    }
  };
  const UI = {
    notify: { send() {} },
    progress: { start() {} },
    workspace: {
      receiving() {
        events.receiving += 1;
      }
    }
  };
  const window = { BitDogLabMobileSerial: mobileSerial };
  const loaded = loadBrowserScript(
    'src/js/core/utils.js',
    {
      Blockly: {},
      Channel,
      Code: {},
      Files: {},
      UI,
      i2cScanner,
      mux,
      window,
      setTimeout(callback) {
        callback();
      }
    },
    '{ Tool }'
  );
  return { Tool: loaded.exports.Tool, Channel, events };
}

test('mobile run becomes stoppable immediately and uses the larger packet size', () => {
  const mobileSerial = {
    stopProgram() {
      return Promise.resolve();
    }
  };
  const { Tool, events } = createHarness(mobileSerial);

  Tool.runPython('print(1)');

  assert.equal(events.receiving, 1);
  assert.equal(events.buffer.length, 1);
  assert.match(events.buffer[0], /^\x05print\(1\)/);
});

test('mobile stop cancels queued packets and bypasses the WebSerial queue', async () => {
  let resolveStop;
  const stop = new Promise((resolve) => {
    resolveStop = resolve;
  });
  const mobileSerial = {
    stopProgram() {
      return stop;
    }
  };
  const { Tool, events } = createHarness(mobileSerial);

  Tool.stopPython();

  assert.equal(events.scannerStops, 1);
  assert.equal(events.cleared, 1);
  assert.deepEqual(events.buffer, []);
  resolveStop();
  await stop;
});

test('browser stop keeps the original queued Ctrl+C behavior', () => {
  const { Tool, events } = createHarness(undefined);

  Tool.stopPython();

  assert.deepEqual(events.buffer, ['\x03\x03']);
  assert.equal(events.cleared, 0);
  assert.equal(events.scannerStarts, 1);
});
