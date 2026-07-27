'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const connectionPath = path.resolve(
  __dirname,
  '..',
  '..',
  'device-file-manager',
  'connection.js'
);

function createEnvironment() {
  const writes = [];
  const statuses = [];
  const context = vm.createContext({
    Date,
    TextEncoder,
    btoa,
    Channel: { webserial: {} },
    Tool: { uid: () => 'testtoken123' },
    i2cScanner: {
      _isRunning: false,
      start() {},
      stop() {},
      _sendScan() {}
    },
    mux: {
      clearBuffer() {
        writes.length = 0;
      },
      bufferPush(value) {
        writes.push(value);
      }
    },
    window: {
      clearInterval,
      clearTimeout,
      setInterval,
      setTimeout
    }
  });

  vm.runInContext(
    'class DeviceFilesManager {};' +
      'DeviceFilesManager.extend = methods => Object.assign(DeviceFilesManager.prototype, methods);' +
      'globalThis.DeviceFilesManager = DeviceFilesManager;',
    context
  );
  vm.runInContext(fs.readFileSync(connectionPath, 'utf8'), context, {
    filename: connectionPath
  });

  const manager = vm.runInContext('new DeviceFilesManager()', context);
  manager.busy = false;
  manager.received_string = '';
  manager._operationPoll = null;
  manager._operationTimeout = null;
  manager._operationStart = null;
  manager._scannerSend = null;
  manager._pauseScanner = () => {};
  manager._resumeScanner = () => {};
  manager._setBusy = (busy) => {
    manager.busy = busy;
  };
  manager.isConnected = () => true;
  manager.setStatus = (message, state) => {
    statuses.push({ message, state });
  };
  manager.updateConnectionState = () => {};

  return { manager, statuses, writes };
}

async function waitFor(predicate, message, timeoutMs = 1000) {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt >= timeoutMs) throw new Error(message);
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

test('filesystem command waits for the MicroPython prompt before sending', async () => {
  const { manager, writes } = createEnvironment();
  let payload = null;

  manager._executeFsScript(
    'Lendo a raiz da placa…',
    "print(start+'OK:[]'+end)",
    500,
    (value) => {
      payload = value;
    }
  );

  assert.deepEqual(writes, ['\x03\x03']);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(writes.length, 1, 'o comando não pode ser enviado antes do prompt');

  manager.received_string = '\r\n>>> ';
  await waitFor(() => writes.length === 2, 'o comando não foi enviado após o prompt');

  manager.received_string =
    '__BIPES_FS_BEGIN_testtoken123__OK:[]__BIPES_FS_END_testtoken123__\r\n>>> ';
  await waitFor(() => payload !== null, 'a resposta do sistema de arquivos não foi processada');

  assert.equal(payload, '[]');
  assert.equal(manager.busy, false);
});

test('filesystem command reports a visible failure when the prompt never arrives', async () => {
  const { manager, statuses, writes } = createEnvironment();
  let failure = null;
  manager._replPrepareTimeoutMs = 20;
  manager._replPollMs = 5;

  manager._executeFsScript(
    'Lendo a raiz da placa…',
    "print(start+'OK:[]'+end)",
    500,
    () => {},
    (message) => {
      failure = message;
    }
  );

  await waitFor(() => failure !== null, 'a ausência do prompt não gerou uma falha');

  assert.deepEqual(writes, ['\x03\x03']);
  assert.match(failure, /terminal MicroPython não respondeu/);
  assert.equal(statuses.at(-1).state, 'error');
  assert.equal(manager.busy, false);
});
