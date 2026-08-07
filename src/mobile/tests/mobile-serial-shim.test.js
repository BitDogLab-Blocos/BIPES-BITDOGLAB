'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const shimPath = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'res',
  'raw',
  'mobile_serial_shim.js'
);
const legacyWebSerialPath = path.resolve(
  __dirname,
  '..',
  '..',
  'js',
  'communication',
  'webserial.js'
);

async function waitFor(predicate, message, timeoutMs = 1000) {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt >= timeoutMs) {
      throw new Error(message);
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function createEnvironment() {
  const sent = [];
  const window = {
    navigator: {},
    BitDogLabUsbNative: {
      postMessage(message) {
        sent.push(JSON.parse(message));
      }
    },
    DOMException,
    ReadableStream,
    WritableStream,
    Uint8Array,
    Promise,
    Map,
    TextDecoder,
    TextEncoder,
    btoa,
    atob
  };
  const context = vm.createContext({
    window,
    DOMException,
    ReadableStream,
    WritableStream,
    Uint8Array,
    Promise,
    Map,
    TextDecoder,
    TextEncoder
  });
  vm.runInContext(fs.readFileSync(shimPath, 'utf8'), context, { filename: shimPath });
  return { window, sent };
}

function answer(window, request, value = {}) {
  window.__bitdoglabNativeSerialReceive({
    type: 'response',
    id: request.id,
    ok: true,
    value
  });
}

test('exposes a native transaction for device file commands', async () => {
  const { window, sent } = createEnvironment();
  const endMarker = '__BIPES_FS_END_test123__';
  const executing = window.BitDogLabMobileSerial.executeTransaction(
    'print("files")\r',
    endMarker,
    9000
  );

  assert.equal(sent[0].action, 'executeTransaction');
  assert.equal(sent[0].payload.data, 'cHJpbnQoImZpbGVzIikN');
  assert.equal(sent[0].payload.endMarker, endMarker);
  assert.equal(sent[0].payload.timeoutMs, 9000);

  answer(window, sent[0], {
    data: Buffer.from('OK:["main.py"]' + endMarker).toString('base64')
  });
  assert.equal(await executing, 'OK:["main.py"]' + endMarker);
});

test('installs a navigator.serial port backed by native USB messages', async () => {
  const { window, sent } = createEnvironment();

  const selecting = window.navigator.serial.requestPort();
  assert.equal(sent[0].action, 'requestPort');
  answer(window, sent[0], { vendorId: 0x2e8a, productId: 10 });
  const port = await selecting;
  assert.equal(port.getInfo().usbVendorId, 0x2e8a);
  assert.equal(port.getInfo().usbProductId, 10);

  const opening = port.open({ baudRate: 115200 });
  assert.equal(sent[1].action, 'open');
  assert.equal(sent[1].payload.baudRate, 115200);
  answer(window, sent[1]);
  await opening;

  const writer = port.writable.getWriter();
  const writing = writer.write(new Uint8Array([3, 4, 13]));
  assert.equal(sent[2].action, 'write');
  assert.equal(sent[2].payload.data, 'AwQN');
  answer(window, sent[2]);
  await writing;
  writer.releaseLock();

  const reader = port.readable.getReader();
  window.__bitdoglabNativeSerialReceive({ type: 'data', data: 'Pj4+IA==' });
  const received = await reader.read();
  assert.deepEqual(Array.from(received.value), [62, 62, 62, 32]);
  reader.releaseLock();

  const closing = port.close();
  assert.equal(sent[3].action, 'close');
  answer(window, sent[3]);
  await closing;
  assert.equal(port.readable, null);
  assert.equal(port.writable, null);
});

test('recovers the mobile connection and runs again without a user reconnect', async () => {
  const { window, sent } = createEnvironment();
  window.Channel = {
    webserial: {
      packetSize: 100
    }
  };

  const selecting = window.navigator.serial.requestPort();
  answer(window, sent[0], { vendorId: 0x2e8a, productId: 10 });
  const port = await selecting;
  const opening = port.open({ baudRate: 115200 });
  answer(window, sent[1]);
  await opening;
  assert.equal(window.Channel.webserial.packetSize, 4096);

  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();
  const stopping = window.BitDogLabMobileSerial.stopProgram();
  assert.equal(sent[2].action, 'stopProgram');
  answer(window, sent[2]);
  await stopping;
  window.__bitdoglabNativeSerialReceive({
    type: 'data',
    data: Buffer.from('KeyboardInterrupt\r\n>>> ').toString('base64')
  });
  const stoppedOutput = await reader.read();
  assert.equal(
    new TextDecoder().decode(stoppedOutput.value),
    'KeyboardInterrupt\r\n>>> '
  );
  reader.releaseLock();

  const runningAgain = writer.write(new Uint8Array([5, 112, 114, 105, 110, 116, 40, 49, 41, 4]));
  assert.equal(sent[3].action, 'write');
  answer(window, sent[3]);
  await runningAgain;
  writer.releaseLock();

  assert.equal(
    sent.filter((message) => message.action === 'requestPort').length,
    1,
    'a segunda execução não deve solicitar nem desconectar a porta novamente'
  );
});

test('automatic connection recovery does not imitate a disconnect in the interface', async () => {
  const { window, sent } = createEnvironment();
  let idleUpdates = 0;
  window.Channel = {
    webserial: {
      connected: true,
      buffer: ['\x05print(1)\x04'],
      completeBufferCallback: []
    }
  };
  window.UI = {
    workspace: {
      runAbort() {
        idleUpdates += 1;
      }
    }
  };

  const selecting = window.navigator.serial.requestPort();
  answer(window, sent[0], { vendorId: 0x2e8a, productId: 10 });
  const port = await selecting;
  const opening = port.open({ baudRate: 115200 });
  answer(window, sent[1]);
  await opening;

  const writer = port.writable.getWriter();
  const recovering = writer.write(new Uint8Array([3, 3]));
  assert.equal(sent[2].action, 'interrupt');
  answer(window, sent[2]);
  await recovering;
  writer.releaseLock();

  assert.equal(window.Channel.webserial.connected, true);
  assert.deepEqual(
    window.Channel.webserial.buffer,
    ['\x05print(1)\x04'],
    'a recuperação automática não pode apagar um programa aguardando na fila'
  );
  assert.equal(idleUpdates, 0);
  assert.equal(
    sent.filter((message) => message.action === 'close').length,
    0,
    'a recuperação inicial não pode fechar a porta'
  );
});

test('propagates permission errors and physical disconnection', async () => {
  const { window, sent } = createEnvironment();

  const denied = window.navigator.serial.requestPort();
  window.__bitdoglabNativeSerialReceive({
    type: 'response',
    id: sent[0].id,
    ok: false,
    error: 'Permissão USB negada.'
  });
  await assert.rejects(denied, /Permissão USB negada/);

  const selecting = window.navigator.serial.requestPort();
  answer(window, sent[1], { vendorId: 0x2e8a, productId: 10 });
  const port = await selecting;
  const opening = port.open({ baudRate: 115200 });
  answer(window, sent[2]);
  await opening;

  const reader = port.readable.getReader();
  const read = reader.read();
  window.__bitdoglabNativeSerialReceive({
    type: 'disconnect',
    error: 'A BitDogLab foi desconectada do celular.'
  });

  await assert.rejects(read, /desconectada/);
  assert.equal(port.readable, null);
  assert.equal(port.writable, null);
});

test('physical removal asks the existing protocol to reset its interface', async () => {
  const { window, sent } = createEnvironment();
  const selecting = window.navigator.serial.requestPort();
  answer(window, sent[0], { vendorId: 0x2e8a, productId: 10 });
  const port = await selecting;
  const opening = port.open({ baudRate: 115200 });
  answer(window, sent[1]);
  await opening;

  let disconnects = 0;
  window.Channel = {
    webserial: {
      connected: true,
      port,
      disconnect() {
        disconnects += 1;
      }
    }
  };

  window.__bitdoglabNativeSerialReceive({
    type: 'disconnect',
    error: 'A BitDogLab foi desconectada do celular.'
  });

  assert.equal(disconnects, 1);
});

test('the unchanged WebSerial protocol connects and reads through the mobile shim', async (t) => {
  const { window, sent } = createEnvironment();
  const events = { terminal: [], scans: [] };
  const Channel = {};
  const UI = {
    notify: { send() {}, log() {} },
    progress: { remain() {}, end() {} },
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
    processData(chunk) { events.scans.push(chunk); },
    start() { this._isRunning = true; },
    stop() { this._isRunning = false; }
  };
  const term = {
    on() {},
    off() {},
    write(value) { events.terminal.push(value); }
  };
  const context = vm.createContext({
    window,
    navigator: window.navigator,
    Channel,
    UI,
    i2cScanner,
    term,
    Files: { received_string: '' },
    MSG: { notAvailableFlag: '$1 não está disponível.' },
    ERROR_CODES: { PORT_ALREADY_OPEN: 11 },
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
    DOMException,
    ReadableStream,
    WritableStream,
    TextEncoder,
    TextDecoder,
    TextDecoderStream,
    Uint8Array,
    Promise,
    Map,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    console
  });
  window.Channel = Channel;
  vm.runInContext(
    `${fs.readFileSync(legacyWebSerialPath, 'utf8')}\n` +
      'globalThis.__WebSerialProtocol = WebSerialProtocol;',
    context,
    { filename: legacyWebSerialPath }
  );

  const protocol = new context.__WebSerialProtocol();
  protocol._resetBoard = () => {};
  Channel.webserial = protocol;
  t.after(() => clearInterval(protocol.watcher));

  protocol.connect();
  answer(window, sent[0], { vendorId: 0x2e8a, productId: 10 });
  await waitFor(() => sent.length >= 2, 'A abertura nativa não foi solicitada.');
  answer(window, sent[1]);
  await waitFor(() => protocol.connected, 'O protocolo WebSerial não conectou.');
  assert.equal(
    protocol.packetSize,
    4096,
    'o aplicativo deve reduzir as viagens da ponte usando pacotes maiores'
  );

  window.__bitdoglabNativeSerialReceive({ type: 'data', data: 'Pj4+IA==' });
  await waitFor(
    () => context.Files.received_string === '>>> ',
    'O prompt do MicroPython não atravessou a ponte móvel.'
  );

  assert.deepEqual(events.scans, ['>>> ']);
  assert.match(events.terminal.join(''), /Connected using Web Serial API/);

  UI.workspace.runButton.status = false;
  protocol.buffer = [];
  const stopping = window.BitDogLabMobileSerial.stopProgram();
  await waitFor(
    () => sent.length >= 3,
    'A parada manual não chegou à ponte nativa.'
  );
  assert.equal(sent[2].action, 'stopProgram');
  answer(window, sent[2]);
  await stopping;
  window.__bitdoglabNativeSerialReceive({
    type: 'data',
    data: Buffer.from('KeyboardInterrupt\r\n>>> ').toString('base64')
  });
  await waitFor(
    () => protocol.buffer.length === 0 && UI.workspace.runButton.status === true,
    'O prompt da parada não liberou a próxima execução.'
  );

  protocol.buffer = ['\x05print(1)\x04'];
  protocol._pollSerialBuffer();
  await waitFor(() => sent.length >= 4, 'A segunda execução não foi enviada.');
  assert.equal(sent[3].action, 'write');
  answer(window, sent[3]);
  await waitFor(
    () => protocol.buffer.length === 0,
    'A fila não concluiu a segunda execução.'
  );

  protocol.disconnect();
  await waitFor(() => sent.length >= 5, 'O fechamento nativo não foi solicitado.');
  answer(window, sent[4]);
  await waitFor(() => !protocol.connected, 'O protocolo WebSerial não desconectou.');
});
