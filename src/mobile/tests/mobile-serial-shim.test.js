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
    Map
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
