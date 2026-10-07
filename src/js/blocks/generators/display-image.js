// Tutorial-compatible rendering works with both existing OLED drivers.
'use strict';

Blockly.Python.display_mostrar_imagem = function(block) {
  var type = _getDisplayType(block);
  var image = OledImages.bitmap(block.oledImageToken_, type);
  if (!image) throw new Error(Code.t('oledImageMissing'));
  _setupDisplayForBlock(block);
  Blockly.Python.definitions_.import_oled_image_binascii = 'import binascii';
  Blockly.Python.definitions_.lib_oled_image = [
    'def _oled_mostrar_imagem(bitmap, width, height):',
    '  oled.fill(0)',
    '  indice = 0',
    '  for y in range(height):',
    '    for bloco_x in range(width // 8):',
    '      valor = bitmap[indice]',
    '      indice += 1',
    '      x_inicial = bloco_x * 8',
    '      for bit in range(8):',
    '        if valor & (0x80 >> bit):',
    '          oled.pixel(x_inicial + bit, y, 1)',
    '  oled.show()',
    ''
  ].join('\n');
  var hex = Array.from(image.bytes, function(value) { return value.toString(16).padStart(2, '0'); }).join('');
  // Hex strings avoid thousands of integer literals in the MicroPython parser.
  // Setup markers keep allocations outside the main program loop.
  var name = '_oled_bitmap_' + block.oledImageToken_.replace(/[^a-zA-Z0-9_]/g, '_');
  Blockly.Python.definitions_[name] = _displaySetupDefinition(
    name + ' = binascii.unhexlify(\n' +
    hex.match(/.{1,128}/g).map(function(line) { return '  "' + line + '"'; }).join('\n') + '\n)');
  return '_oled_mostrar_imagem(' + name + ', ' + image.width + ', ' + image.height + ')\n';
};
