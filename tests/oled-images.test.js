'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const images = require('../src/js/core/oled-images.js');

test('tutorial example 10110010 packs as 0xB2 with the left pixel in bit 7', () => {
  assert.deepEqual(Array.from(images.pack([1, 0, 1, 1, 0, 0, 1, 0], 8, 1)), [0xB2]);
  assert.deepEqual(Array.from(images.pack([0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], 8, 2)), [1, 128]);
});

test('both displays have the required byte count and tutorial margin preserves aspect ratio', () => {
  for (const type of ['SMALL', 'LARGE']) {
    const { width, height } = images.dimensions(type);
    assert.equal(images.pack(new Uint8Array(width * height), width, height).length, type === 'LARGE' ? 2048 : 1024);
    assert.deepEqual(images.fit(128, 128, width, height, 1), type === 'LARGE'
      ? { x: 1, y: 1, width: 126, height: 126 } : { x: 33, y: 1, width: 62, height: 62 });
  }
});

test('transparent pixels are off, dark pixels are on, inversion complements all bits', () => {
  const rgba = new Uint8ClampedArray(8 * 4);
  for (let i = 0; i < 8; i++) rgba[i * 4 + 3] = i < 4 ? 255 : 0;
  assert.equal(images.convert(rgba, 8, 1).bytes[0], 0xf0);
  assert.equal(images.convert(rgba, 8, 1, { invert: true }).bytes[0], 0x0f);
});

test('adaptive threshold preserves a dark contour and dithering represents intermediate shades', () => {
  const rgba = new Uint8ClampedArray(16 * 8 * 4).fill(255);
  for (let y = 0; y < 8; y++) for (let c = 0; c < 3; c++) rgba[(y * 16 + 8) * 4 + c] = 0;
  const adaptive = images.convert(rgba, 16, 8, { method: 'adaptive' });
  for (let y = 0; y < 8; y++) assert.equal(adaptive.pixels[y * 16 + 8], 1);
  for (let i = 0; i < rgba.length; i++) if (i % 4 !== 3) rgba[i] = 127;
  const lit = images.convert(rgba, 16, 8, { method: 'dither' }).pixels.reduce((a, b) => a + b);
  assert.ok(lit > 45 && lit < 85);
});

test('assets have independent immutable settings and live only in the current module session', () => {
  const a = images.store({}, { invert: false }, 'a');
  const b = images.store({}, { invert: true }, 'b');
  assert.notEqual(a, b);
  assert.equal(images.get(a).settings.invert, false);
  assert.equal(images.get(b).settings.invert, true);
  delete require.cache[require.resolve('../src/js/core/oled-images.js')];
  const fresh = require('../src/js/core/oled-images.js');
  assert.equal(fresh.get(a), undefined);
  assert.equal(fresh.bitmap(b, 'SMALL'), null);
});
