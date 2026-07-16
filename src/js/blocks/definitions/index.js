(function(global) {
  var requiredBlocks = [
    'controls_repeat_simple',
    'bloco_ligar_led',
    'mostrar_emoji',
    'display_texto',
    'tocar_nota',
    'joystick_controlar_led',
    'microfone_testar',
    'sensor_temperatura',
    'robo_inicializar',
    'robo_frente',
    'robo_tras',
    'robo_girar',
    'robo_parar',
    'robo_joystick',
    'robo_giro_valor',
    'robo_aceleracao_x',
    'robo_aceleracao_y',
    'robo_aceleracao_z',
    'robo_transferidor_360',
    'robo_tensao_bateria',
    'robo_corrente_robo'
  ];
  var missing = requiredBlocks.filter(function(type) {
    return !global.Blockly || !global.Blockly.Blocks || !global.Blockly.Blocks[type];
  });
  if (missing.length) {
    console.warn('[BitDogLab] Missing split block definitions: '+ missing.join(', '));
  }
  if (global.Code && global.Code.BlockTypeDomains) {
    var domains = global.Code.BlockTypeDomains;
    domains.applyPreviousCheck(domains.get('DISPLAY_COMMANDS'), 'DisplayCommand');
    domains.applyPreviousCheck(domains.get('MATRIX_OPTION_COMMANDS'), 'MatrixOptionCommand');
    domains.applyDefaultPreviousCheck('ProgramCommand', domains.allTypedBlocks());
  }
  global.BitDogLabBlockDefinitionsLoaded = missing.length === 0;
})(window);
