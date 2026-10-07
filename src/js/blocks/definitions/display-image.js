// The mutation stores only a session reference, never the uploaded image bytes.
'use strict';

(function() {
  function text(key) { return Code.t('oledImage' + key); }
  var placeholder = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">' +
    '<rect width="128" height="128" rx="8" fill="#152b35"/>' +
    '<path d="M20 92V36h88v56H20m0-10 28-28 24 24 14-14 22 22" fill="none" stroke="#fff" stroke-width="4"/>' +
    '<circle cx="86" cy="48" r="6" fill="#fff"/></svg>');

  function ImageButton() { Blockly.Field.call(this, text('Choose')); }
  Blockly.utils.object.inherits(ImageButton, Blockly.Field);
  ImageButton.prototype.isSerializable = function() { return false; };
  ImageButton.prototype.CURSOR = 'pointer';
  ImageButton.prototype.showEditor_ = function() { OledImageEditor.open(this.getSourceBlock()); };

  Blockly.Blocks.display_mostrar_imagem = {
    init: function() {
      this.oledImageToken_ = '';
      this.appendDummyInput().appendField(text('Block'));
      this.appendDummyInput()
        .appendField(text('DisplayType'))
        .appendField(new Blockly.FieldDropdown([
          [text('Small'), 'SMALL'], [text('Large'), 'LARGE']
        ]), 'DISPLAY_TYPE');
      this.appendDummyInput()
        .appendField(new Blockly.FieldImage(placeholder, 80, 80, text('Preview'), function(field) {
          OledImageEditor.open(field.getSourceBlock());
        }), 'IMAGE_PREVIEW')
        .appendField(new ImageButton(), 'CHOOSE_IMAGE');
      this.appendDummyInput().appendField(new Blockly.FieldLabel(text('Empty')), 'IMAGE_NAME');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a085');
      this.setTooltip(function() { return text('Tooltip'); });
      this.setHelpUrl('');
      this.setOnChange(function(event) {
        if (event && event.blockId === this.id) this.refreshOledImage();
      });
    },

    mutationToDom: function() {
      var mutation = document.createElement('mutation');
      if (this.oledImageToken_) mutation.setAttribute('image_session', this.oledImageToken_);
      return mutation;
    },

    domToMutation: function(xml) {
      this.oledImageToken_ = xml.getAttribute('image_session') || '';
      this.refreshOledImage();
    },

    setOledImageToken: function(token) {
      var before = Blockly.Xml.domToText(this.mutationToDom());
      this.oledImageToken_ = token || '';
      this.refreshOledImage();
      var after = Blockly.Xml.domToText(this.mutationToDom());
      if (before !== after && Blockly.Events.isEnabled()) {
        Blockly.Events.fire(new Blockly.Events.BlockChange(this, 'mutation', null, before, after));
      }
    },

    refreshOledImage: function() {
      var type = this.getFieldValue('DISPLAY_TYPE');
      var key = this.oledImageToken_ + ':' + type;
      if (key === this.oledImagePreviewKey_) return;
      this.oledImagePreviewKey_ = key;
      var asset = OledImages.get(this.oledImageToken_);
      var bitmap = asset && OledImages.bitmap(this.oledImageToken_, type);
      // Preview fields are derived UI: only the session mutation belongs in undo.
      Blockly.Events.disable();
      try {
        this.getField('IMAGE_NAME').setValue(asset ? asset.name.slice(0, 36) : text('Empty'));
        this.getField('IMAGE_PREVIEW').setValue(bitmap
          ? OledImages.preview(bitmap, document.createElement('canvas')).toDataURL('image/png') : placeholder);
      } finally {
        Blockly.Events.enable();
      }
    }
  };
})();
