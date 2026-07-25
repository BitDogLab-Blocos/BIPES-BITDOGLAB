'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.resolve(__dirname, '..', '..');
const guideNames = ['bitdoglab', 'estufa', 'robo'];

function loadGuide(name) {
  let registeredGuide;
  const context = {
    window: {
      DeviceHardwareGuides: {
        register(guide) {
          registeredGuide = guide;
        }
      }
    }
  };

  const script = fs.readFileSync(
    path.join(root, 'src', 'hardware-guides', name, 'tutorial.js'),
    'utf8'
  );
  vm.runInNewContext(script, context);
  return registeredGuide;
}

function translationKeysFrom(html) {
  const keys = [];
  const pattern = /data-copy(?:-alt)?="([^"]+)"/g;
  let match;

  while ((match = pattern.exec(html))) keys.push(match[1]);
  return [...new Set(keys)];
}

test('hardware guides provide English copy for every translated field', () => {
  guideNames.forEach((name) => {
    const html = fs.readFileSync(
      path.join(root, 'src', 'hardware-guides', name, 'tutorial.html'),
      'utf8'
    );
    const guide = loadGuide(name);
    const translations = guide.translations && guide.translations.en;

    assert.ok(guide.menu.en, `${name} is missing its English menu entry`);
    assert.ok(translations, `${name} is missing its English translations`);

    translationKeysFrom(html).forEach((key) => {
      assert.equal(
        typeof translations[key],
        'string',
        `${name} is missing the English translation for "${key}"`
      );
      assert.notEqual(
        translations[key].trim(),
        '',
        `${name} has an empty English translation for "${key}"`
      );
    });
  });
});
