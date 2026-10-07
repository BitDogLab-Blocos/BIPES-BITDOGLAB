// Local file picker and OLED preview. Applying creates a new session asset.
'use strict';

var OledImageEditor = (function() {
  var activeDialog = null;
  function text(key) { return Code.t('oledImage' + key); }

  async function decode(file) {
    if (!file || ['image/png', 'image/jpeg', 'image/webp'].indexOf(file.type) < 0) {
      throw new Error(text('InvalidFile'));
    }
    if (file.size > 10 * 1024 * 1024) throw new Error(text('TooLarge'));
    var url = URL.createObjectURL(file);
    try {
      var image = new Image();
      await new Promise(function(resolve, reject) {
        image.onload = resolve;
        image.onerror = function() { reject(new Error(text('InvalidFile'))); };
        image.src = url;
      });
      if (image.naturalWidth * image.naturalHeight > 16000000) throw new Error(text('TooLarge'));
      var scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
      var source = document.createElement('canvas');
      source.width = Math.max(1, Math.round(image.naturalWidth * scale));
      source.height = Math.max(1, Math.round(image.naturalHeight * scale));
      source.getContext('2d').drawImage(image, 0, 0, source.width, source.height);
      return source;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function open(block) {
    if (!block.workspace || block.isInFlyout) return;
    if (activeDialog) activeDialog.close();
    var previous = OledImages.get(block.oledImageToken_);
    var source = previous ? previous.source : null;
    var name = previous ? previous.name : '';
    var settings = OledImages.options(previous && previous.settings);
    var closed = false;
    var loading = false;
    var pending = 0;
    var dialog = document.createElement('dialog');
    dialog.className = 'oled-image-editor';
    activeDialog = dialog;

    function element(tag, parent, label) {
      var node = document.createElement(tag);
      if (label) node.textContent = label;
      parent.appendChild(node);
      return node;
    }
    var header = element('div', dialog);
    header.className = 'oled-image-editor__header';
    element('h2', header, text('Title')).id = 'oled-image-title';
    dialog.setAttribute('aria-labelledby', 'oled-image-title');
    var close = element('button', header, '×');
    close.type = 'button';
    close.setAttribute('aria-label', text('Close'));
    close.onclick = function() { dialog.close(); };
    element('p', dialog, text('SessionNotice'));

    var pickerLabel = element('label', dialog, text('Choose'));
    var picker = element('input', pickerLabel);
    picker.type = 'file';
    picker.accept = 'image/png,image/jpeg,image/webp';
    var controls = element('div', dialog);
    controls.className = 'oled-image-editor__controls';
    var methodLabel = element('label', controls, text('Method'));
    var method = element('select', methodLabel);
    ['threshold', 'adaptive', 'dither'].forEach(function(value) {
      var option = element('option', method, text(value));
      option.value = value;
    });
    method.value = settings.method;
    var thresholdLabel = element('label', controls, text('Threshold'));
    var threshold = element('input', thresholdLabel);
    threshold.type = 'range';
    threshold.min = '0';
    threshold.max = '255';
    threshold.value = settings.threshold;
    var thresholdValue = element('output', thresholdLabel, String(settings.threshold));
    var invertLabel = element('label', controls);
    var invert = element('input', invertLabel);
    invert.type = 'checkbox';
    invert.checked = settings.invert;
    element('span', invertLabel, text('Invert'));
    var marginLabel = element('label', controls);
    var margin = element('input', marginLabel);
    margin.type = 'checkbox';
    margin.checked = settings.margin === 1;
    element('span', marginLabel, text('Margin'));
    var previewLabel = element('p', dialog);
    var canvas = element('canvas', dialog);
    canvas.className = 'oled-image-editor__preview';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', text('Preview'));
    var status = element('p', dialog);
    status.className = 'oled-image-editor__status';
    status.setAttribute('role', 'status');
    var footer = element('div', dialog);
    footer.className = 'oled-image-editor__footer';
    var cancel = element('button', footer, text('Cancel'));
    cancel.type = 'button';
    cancel.onclick = function() { dialog.close(); };
    var apply = element('button', footer, text('Apply'));
    apply.type = 'button';
    apply.className = 'oled-image-editor__apply';

    function update() {
      settings = OledImages.options({ method: method.value, threshold: threshold.value,
        invert: invert.checked, margin: margin.checked ? 1 : 0 });
      thresholdValue.textContent = threshold.value;
      var type = block.getFieldValue('DISPLAY_TYPE');
      var size = OledImages.dimensions(type);
      previewLabel.textContent = text('Preview') + ' — ' + size.width + ' × ' + size.height;
      canvas.style.aspectRatio = size.width + ' / ' + size.height;
      apply.disabled = !source || loading;
      if (source) {
        OledImages.preview(OledImages.render(source, type, settings), canvas);
        status.textContent = name + ' · ' + (size.width * size.height / 8) + ' bytes';
      } else {
        canvas.width = size.width;
        canvas.height = size.height;
        status.textContent = text('Empty');
      }
    }
    controls.addEventListener('input', update);
    picker.addEventListener('change', async function() {
      var file = picker.files[0];
      if (!file) return;
      var request = ++pending;
      loading = true;
      apply.disabled = true;
      status.textContent = text('Loading');
      try {
        var decoded = await decode(file);
        if (closed || request !== pending) return;
        source = decoded;
        name = file.name;
        loading = false;
        update();
      } catch (error) {
        if (closed || request !== pending) return;
        loading = false;
        update();
        status.textContent = error.message;
      }
    });
    apply.onclick = function() {
      if (!source || loading || !block.workspace) return;
      block.setOledImageToken(OledImages.store(source, settings, name));
      dialog.close();
    };
    dialog.addEventListener('close', function() {
      closed = true;
      if (activeDialog === dialog) activeDialog = null;
      dialog.remove();
    }, { once: true });
    document.body.appendChild(dialog);
    update();
    dialog.showModal();
    picker.focus();
  }
  return { open: open, decode: decode };
})();
