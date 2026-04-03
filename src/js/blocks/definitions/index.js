(function(global) {
  var requiredBlocks = [
    'controls_repeat_simple',
    'bloco_ligar_led',
    'mostrar_emoji',
    'display_texto',
    'tocar_nota',
    'joystick_controlar_led',
    'microfone_testar',
    'sensor_temperatura'
  ];
  var missing = requiredBlocks.filter(function(type) {
    return !global.Blockly || !global.Blockly.Blocks || !global.Blockly.Blocks[type];
  });
  if (missing.length) {
    console.warn('[BitDogLab] Missing split block definitions: '+ missing.join(', '));
  }
  global.BitDogLabBlockDefinitionsLoaded = missing.length === 0;
})(window);
