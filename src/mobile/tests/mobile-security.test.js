'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const mobileRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(mobileRoot, relativePath), 'utf8');
}

test('Android package is offline and opts out of application backup', () => {
  const manifest = read('android/app/src/main/AndroidManifest.xml');

  assert.doesNotMatch(manifest, /android\.permission\.INTERNET/);
  assert.match(manifest, /android:allowBackup="false"/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
});

test('WebView bridge is scoped to the local origin and main frame', () => {
  const activity = read(
    'android/app/src/main/java/org/bitdoglab/bipes/MainActivity.java'
  );

  assert.doesNotMatch(activity, /addJavascriptInterface/);
  assert.match(activity, /addWebMessageListener/);
  assert.match(activity, /!isMainFrame/);
  assert.match(activity, /blockedNetworkResponse/);
  assert.match(activity, /MIXED_CONTENT_NEVER_ALLOW/);
});

test('USB bridge accepts only BitDogLab RP2040 devices and bounded messages', () => {
  const bridge = read(
    'android/app/src/main/java/org/bitdoglab/bipes/NativeSerialBridge.java'
  );

  assert.match(bridge, /BITDOGLAB_VENDOR_ID = 0x2E8A/);
  assert.match(bridge, /return null;/);
  assert.match(bridge, /MAX_MESSAGE_CHARS/);
  assert.match(bridge, /MAX_ENCODED_WRITE_CHARS/);
  assert.doesNotMatch(bridge, /@JavascriptInterface/);
});

test('private signing material and build outputs remain ignored', () => {
  const gitignore = read('.gitignore');

  for (const rule of [
    '*.apk',
    '*.aab',
    '*.jks',
    '*.keystore',
    'android/keystore.properties'
  ]) {
    assert.ok(gitignore.includes(rule), `Regra ausente no .gitignore: ${rule}`);
  }
});
