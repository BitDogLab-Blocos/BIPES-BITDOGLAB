'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript } = require('../helpers/load-browser-script');

function createHarness(connected = true) {
  const notifications = [];
  const serial = {
    connected,
    packetSize: 4,
    buffer: [],
    completeBufferCallback: [],
    connectCalls: 0,
    disconnectCalls: 0,
    connect() {
      this.connectCalls += 1;
    },
    disconnect() {
      this.disconnectCalls += 1;
      this.connected = false;
    }
  };
  const Channel = { webserial: serial };
  const UI = {
    notify: {
      send(message) {
        notifications.push(message);
      }
    }
  };
  const MSG = { notConnected: 'Not connected.' };
  const loaded = loadBrowserScript(
    'src/js/communication/channel.js',
    { Channel, MSG, UI },
    '{ ProtocolManager, mux, SERIAL_CONFIG, REPL_CONSTANTS }'
  );

  return {
    ...loaded.exports,
    Channel,
    notifications,
    serial
  };
}

test('ProtocolManager preserves the current Web Serial defaults', () => {
  const { ProtocolManager, SERIAL_CONFIG, REPL_CONSTANTS } = createHarness();
  const manager = new ProtocolManager();

  assert.deepEqual(Array.from(manager.available), ['webserial']);
  assert.equal(manager.currentChannel, 'webserial');
  assert.equal(SERIAL_CONFIG.BAUD_RATE, 115200);
  assert.equal(SERIAL_CONFIG.PACKET_SIZE, 100);
  assert.equal(REPL_CONSTANTS.PROMPT, '>>> ');
});

test('bufferPush normalizes line breaks, chunks data and retains callback order', () => {
  const { ProtocolManager, serial } = createHarness();
  const callback = () => {};

  ProtocolManager.bufferPush('ab\ncd', callback);

  assert.deepEqual(Array.from(serial.buffer), ['ab\rc', 'd']);
  assert.equal(serial.completeBufferCallback.length, 1);
  assert.equal(serial.completeBufferCallback[0], callback);
});

test('priority and clear operations preserve the legacy queue semantics', () => {
  const { ProtocolManager, serial } = createHarness();
  const callback = () => {};
  serial.buffer.push('normal');
  serial.completeBufferCallback.push(callback);

  ProtocolManager.bufferUnshift('urgent');
  assert.deepEqual(Array.from(serial.buffer), ['urgent', 'normal']);

  ProtocolManager.clearBuffer();
  assert.deepEqual(Array.from(serial.buffer), []);
  assert.deepEqual(Array.from(serial.completeBufferCallback), []);
});

test('queue operations notify instead of mutating when disconnected', () => {
  const { ProtocolManager, notifications, serial } = createHarness(false);

  ProtocolManager.bufferPush('ignored');
  ProtocolManager.bufferUnshift('ignored');
  ProtocolManager.clearBuffer();

  assert.deepEqual(Array.from(serial.buffer), []);
  assert.deepEqual(notifications, [
    'Not connected.',
    'Not connected.',
    'Not connected.'
  ]);
});

test('switch disconnects the active channel before reconnecting', () => {
  const { ProtocolManager, serial } = createHarness();
  const manager = new ProtocolManager();

  manager.switch('webserial');

  assert.equal(serial.disconnectCalls, 1);
  assert.equal(serial.connectCalls, 1);
});
