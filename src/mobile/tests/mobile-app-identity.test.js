'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const mobileRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(mobileRoot, relativePath), 'utf8');
}

test('Android package exposes the BitDogLab-Blocos 0.3.6 identity', () => {
  const build = read('android/app/build.gradle.kts');
  const manifest = read('android/app/src/main/AndroidManifest.xml');
  const strings = read('android/app/src/main/res/values/strings.xml');

  assert.match(build, /versionCode = 19/);
  assert.match(build, /versionName = "0\.3\.6"/);
  assert.match(manifest, /android:label="@string\/app_name"/);
  assert.match(strings, /<string name="app_name">BitDogLab-Blocos<\/string>/);
});
