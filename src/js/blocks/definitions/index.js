(function(global) {
  var requiredBlocks = [
    'controls_repeat_simple',
    'variables_guardar',
    'variables_alterar',
    'variables_adicionar',
    'variables_tirar',
    'variables_valor_guardado',
    'bloco_ligar_led',
    'mostrar_emoji',
    'display_texto',
    'tocar_nota',
    'parar_piano',
    'joystick_controlar_led',
    'microfone_testar',
    'sensor_temperatura',
    'external_contact_prepare',
    'external_contact_when_closed',
    'external_contact_is_closed',
    'external_contact_test_matrix',
    'dht11_temperatura',
    'dht11_umidade',
    'dht11_plotar',
    'ldr_valor',
    'ldr_plotar',
    'led_externo_ligar',
    'led_externo_desligar',
    'led_externo_piscar_rapido',
    'led_externo_piscar_lento',
    'led_externo_criar_animacao',
    'servo_mover',
    'servo_angulo_atual',
    'servo_joystick_controlar',
    'servo_subir_gradualmente',
    'servo_descer_gradualmente',
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
    global.Code.BlockTypeDomains.applySemanticConnectionModel();
  }
  global.BitDogLabBlockDefinitionsLoaded = missing.length === 0;
})(window);
