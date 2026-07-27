'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadManager(scriptName, mobile) {
  const context = vm.createContext({
    window: {
      BitDogLabMobileSerial: mobile ? { executeTransaction() {} } : undefined
    }
  });
  vm.runInContext(
    'class DeviceFilesManager {};' +
      'DeviceFilesManager.extend = methods => Object.assign(DeviceFilesManager.prototype, methods);' +
      'globalThis.DeviceFilesManager = DeviceFilesManager;',
    context
  );
  vm.runInContext(
    fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'device-file-manager', scriptName),
      'utf8'
    ),
    context
  );
  return vm.runInContext('new DeviceFilesManager()', context);
}

function captureBody(manager, invoke) {
  let body = '';
  manager._executeFsScript = (_label, commandBody) => {
    body = commandBody;
  };
  invoke();
  return body;
}

test('file listing pacing is exclusive to the Android transaction', () => {
  function commandFor(mobile) {
    const manager = loadManager('browser.js', mobile);
    manager.currentPath = '';
    manager.isConnected = () => true;
    manager._updatePathUI = () => {};
    manager._renderListMessage = () => {};
    return captureBody(manager, () => manager.listFiles());
  }

  assert.doesNotMatch(commandFor(false), /time\.sleep_ms/);
  assert.match(commandFor(true), /time\.sleep_ms\(3\)/);
});

test('move target pacing is defined in the operation that uses it', () => {
  function commandFor(mobile) {
    const manager = loadManager('operations.js', mobile);
    return captureBody(manager, () => manager._loadMoveTargets());
  }

  assert.doesNotMatch(commandFor(false), /time\.sleep_ms/);
  assert.match(commandFor(true), /time\.sleep_ms\(3\)/);
});

test('file content pacing is exclusive to the Android transaction', () => {
  function commandFor(mobile) {
    const manager = loadManager('preview.js', mobile);
    manager._pythonText = () => "'main.py'";
    return captureBody(manager, () => manager.get_file('main.py', 'main.py'));
  }

  assert.doesNotMatch(commandFor(false), /time\.sleep_ms/);
  assert.match(commandFor(true), /time\.sleep_ms\(3\)/);
});
