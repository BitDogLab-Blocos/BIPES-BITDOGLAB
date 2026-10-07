// Image preparation and session-only assets. No image data is written to storage.
'use strict';

(function(root) {
  var assets = new Map();
  var session = Math.random().toString(36).slice(2) + Date.now().toString(36);
  var nextId = 0;

  function dimensions(type) {
    if (type !== 'SMALL' && type !== 'LARGE') throw new Error('Invalid OLED type');
    return { width: 128, height: type === 'LARGE' ? 128 : 64 };
  }

  function options(value) {
    value = value || {};
    return {
      method: ['threshold', 'adaptive', 'dither'].indexOf(value.method) >= 0 ? value.method : 'threshold',
      threshold: Number.isFinite(Number(value.threshold)) ? Math.max(0, Math.min(255, Number(value.threshold))) : 128,
      invert: !!value.invert,
      margin: value.margin === 0 ? 0 : 1
    };
  }

  function fit(width, height, targetWidth, targetHeight, margin) {
    if (width <= 0 || height <= 0) throw new Error('Invalid image dimensions');
    var scale = Math.min((targetWidth - 2 * margin) / width, (targetHeight - 2 * margin) / height);
    var w = Math.max(1, Math.round(width * scale));
    var h = Math.max(1, Math.round(height * scale));
    return { x: Math.floor((targetWidth - w) / 2), y: Math.floor((targetHeight - h) / 2), width: w, height: h };
  }

  // Matches the tutorial: rows left-to-right, eight pixels/byte, bit 7 on the left.
  function pack(pixels, width, height) {
    if (width % 8 || pixels.length !== width * height) throw new Error('Invalid bitmap dimensions');
    var bytes = new Uint8Array(width * height / 8);
    for (var i = 0; i < pixels.length; i++) {
      if (pixels[i]) bytes[i >> 3] |= 0x80 >> (i & 7);
    }
    return bytes;
  }

  function convert(rgba, width, height, settings) {
    if (rgba.length !== width * height * 4 || width % 8) throw new Error('Invalid image data');
    settings = options(settings);
    var gray = new Float32Array(width * height);
    var pixels = new Uint8Array(width * height);
    for (var i = 0; i < gray.length; i++) {
      var offset = i * 4;
      var alpha = rgba[offset + 3] / 255;
      gray[i] = (0.299 * rgba[offset] + 0.587 * rgba[offset + 1] + 0.114 * rgba[offset + 2]) * alpha + 255 * (1 - alpha);
    }
    // Integral image keeps the local 9x9 threshold fast, even during slider edits.
    var stride = width + 1;
    var integral;
    if (settings.method === 'adaptive') {
      integral = new Float64Array(stride * (height + 1));
      for (var y = 0; y < height; y++) {
        var sum = 0;
        for (var x = 0; x < width; x++) {
          sum += gray[y * width + x];
          integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + sum;
        }
      }
    }
    for (var row = 0; row < height; row++) {
      for (var col = 0; col < width; col++) {
        var index = row * width + col;
        var threshold = settings.threshold;
        if (integral) {
          var left = Math.max(0, col - 4), right = Math.min(width, col + 5);
          var top = Math.max(0, row - 4), bottom = Math.min(height, row + 5);
          var total = integral[bottom * stride + right] - integral[top * stride + right] -
            integral[bottom * stride + left] + integral[top * stride + left];
          threshold = total / ((right - left) * (bottom - top)) - 10 + settings.threshold - 128;
        }
        var dark = gray[index] < threshold;
        pixels[index] = settings.invert ? Number(!dark) : Number(dark);
        if (settings.method === 'dither') {
          var error = gray[index] - (dark ? 0 : 255);
          if (col + 1 < width) gray[index + 1] += error * 7 / 16;
          if (row + 1 < height) {
            if (col > 0) gray[index + width - 1] += error * 3 / 16;
            gray[index + width] += error * 5 / 16;
            if (col + 1 < width) gray[index + width + 1] += error / 16;
          }
        }
      }
    }
    return { width: width, height: height, pixels: pixels, bytes: pack(pixels, width, height) };
  }

  function render(source, type, settings) {
    settings = options(settings);
    var size = dimensions(type);
    var canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size.width, size.height);
    var rect = fit(source.width, source.height, size.width, size.height, settings.margin);
    ctx.drawImage(source, rect.x, rect.y, rect.width, rect.height);
    return convert(ctx.getImageData(0, 0, size.width, size.height).data, size.width, size.height, settings);
  }

  function preview(bitmap, canvas) {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    var ctx = canvas.getContext('2d');
    var data = ctx.createImageData(bitmap.width, bitmap.height);
    for (var i = 0; i < bitmap.pixels.length; i++) {
      var colour = bitmap.pixels[i] ? 255 : 0;
      data.data[i * 4] = data.data[i * 4 + 1] = data.data[i * 4 + 2] = colour;
      data.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
  }

  function store(source, settings, name) {
    var token = session + '-' + (++nextId);
    // UI supplies a reduced canvas, never a full-size photo or a remote URL.
    assets.set(token, { source: source, settings: options(settings), name: name || '', cache: {} });
    return token;
  }

  function bitmap(token, type) {
    var asset = assets.get(token);
    if (!asset) return null;
    if (!asset.cache[type]) asset.cache[type] = render(asset.source, type, asset.settings);
    return asset.cache[type];
  }

  var api = { dimensions: dimensions, options: options, fit: fit, pack: pack, convert: convert,
    render: render, preview: preview, store: store, get: function(token) { return assets.get(token); }, bitmap: bitmap };
  root.OledImages = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
