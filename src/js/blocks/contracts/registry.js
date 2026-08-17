// Block contracts describe expected usage without changing existing generators.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var MESSAGES = {
    'pt-br': {
      valueNeedsParent: 'Este bloco entrega uma informação. Encaixe ele em outro bloco que peça esse tipo de informação.',
      emptyStatementInput: 'Este espaço está vazio. Coloque pelo menos um bloco aqui ou remova este bloco se não for usar.',
      missingDriver: 'Este bloco mostra um valor guardado, mas falta o bloco que atualiza esse valor: %1.',
      missingSetup: 'Este bloco depende de %1 antes dele para funcionar de forma confiável.',
      wrongContainerChild: 'Este bloco parece estar no lugar errado. Aqui era esperado: %1.',
      missingValueInput: 'Falta encaixar um bloco aqui: %1.',
      missingGenerator: 'Este bloco ainda não tem gerador de código Python. Ele não vai virar programa.',
      needsAncestor: 'Este bloco deve ficar dentro de: %1.',
      displayTypeConflict: 'Há blocos usando tipos de display diferentes. Use um único tipo de display no mesmo programa.',
      emptyJoystickSelector: 'Coloque pelo menos uma opção dentro do seletor do joystick.',
      workspaceHasIssues: 'Corrija os avisos dos blocos antes de gerar, executar ou enviar o código.',
      moreIssues: 'Ainda há mais %1 bloco(s) com aviso.',
      nearIncompatibleConnection: 'Este encaixe recebeu um bloco incompatível por perto. Aqui era esperado: %1. O bloco perto dele é: %2.',
      servoOledV7PinConflict: 'Na BitDogLab V7, as Conexões 2 e 3 compartilham os GPIOs usados pelo Display OLED (tela da placa). Para usar servo e Display juntos, escolha a Conexão 0 ou 1 no servo.',
      dht11V7PinConflict: 'Na BitDogLab V7, o DHT11 deve usar somente as Conexões 0 ou 1. A Conexão %1 fica reservada para o Display OLED (tela da placa); escolha 0 ou 1 no DHT11.',
      dht11Aht20V7I2c0Conflict: 'Conflito de ligação: o DHT11 (sensor de temperatura externo) está na Conexão %1 e o AHT20 (sensor de temperatura do projeto Estufa) está usando o mesmo caminho da placa. Por isso os sensores podem se atrapalhar e o programa foi bloqueado. Para usar os dois, ligue o AHT20 no outro conector I2C (I2C1) ou mude a Conexão do DHT11. Confira os fios com o professor e tente compilar novamente.',
      externalConnectionConflict: 'A Conexão %1 já está sendo usada pelo bloco de %2. Mude a conexão neste bloco e confira fisicamente em qual contato da placa o cabo está ligado. A conexão escolhida no bloco não detecta a ligação real.',
      externalLedInvalidConnection: 'O LED externo está em uma conexão que não existe neste perfil de placa. Escolha uma conexão DIG válida.',
      externalLedInvalidChannel: 'Escolha o canal R (vermelho), G (verde) ou B (azul) do KY-016.',
      externalLedOledV7PinConflict: 'Na BitDogLab V7, as Conexões 2 e 3 compartilham os GPIOs do Display OLED (tela da placa). Para usar este LED externo com o Display, escolha a Conexão 0 ou 1.',
      servoAngleConnectionMismatch: 'O bloco Ângulo atual usa a Conexão %1, mas nenhum bloco que move o servo usa essa mesma Conexão.',
      servoJoystickSameDirection: 'Escolha direções diferentes para subir e descer o servo. A mesma direção não consegue fazer os dois movimentos.',
      servoRaiseAngleOrder: 'Para subir o servo, o ângulo inicial deve ser menor que o ângulo final.',
      servoLowerAngleOrder: 'Para descer o servo, o ângulo inicial deve ser maior que o ângulo final.',
      generic: 'Revise a conexão deste bloco.'
    },
    en: {
      valueNeedsParent: 'This block gives information. Connect it inside another block that asks for this kind of information.',
      emptyStatementInput: 'This space is empty. Add at least one block here or remove this block if you will not use it.',
      missingDriver: 'This block shows a stored value, but the block that updates it is missing: %1.',
      missingSetup: 'This block depends on %1 before it to work reliably.',
      wrongContainerChild: 'This block seems to be in the wrong place. Expected here: %1.',
      missingValueInput: 'A block is missing here: %1.',
      missingGenerator: 'This block does not have a Python code generator yet. It will not become a program.',
      needsAncestor: 'This block should be inside: %1.',
      displayTypeConflict: 'Blocks are using different display types. Use one display type in the same program.',
      emptyJoystickSelector: 'Add at least one option inside the joystick selector.',
      workspaceHasIssues: 'Fix the block warnings before generating, running, or sending code.',
      moreIssues: 'There are %1 more block(s) with warnings.',
      nearIncompatibleConnection: 'This socket has an incompatible block nearby. Expected here: %1. The nearby block is: %2.',
      servoOledV7PinConflict: 'On BitDogLab V7, Connections 2 and 3 share the GPIOs used by the OLED display (board screen). To use a servo and display together, choose Connection 0 or 1 for the servo.',
      dht11V7PinConflict: 'On BitDogLab V7, DHT11 must use only Connections 0 or 1. Connection %1 is reserved for the OLED display (board screen); choose Connection 0 or 1 for DHT11.',
      dht11Aht20V7I2c0Conflict: 'Wiring conflict: DHT11 (external temperature sensor) is on Connection %1 and AHT20 (Greenhouse project temperature sensor) is using the same board path. The sensors may interfere, so the program was blocked. To use both, connect AHT20 to the other I2C connector (I2C1) or move DHT11. Check the wires with your teacher and compile again.',
      externalConnectionConflict: 'Connection %1 is already used by the %2 block. Change the connection in this block and physically check which board contact the cable is connected to. The connection selected in the block cannot detect the real wiring.',
      externalLedInvalidConnection: 'This external LED uses a connection that does not exist in the active board profile. Choose a valid DIG connection.',
      externalLedInvalidChannel: 'Choose the R (red), G (green), or B (blue) KY-016 channel.',
      externalLedOledV7PinConflict: 'On BitDogLab V7, Connections 2 and 3 share the OLED display (board screen) GPIOs. To use this external LED with the display, choose Connection 0 or 1.',
      servoAngleConnectionMismatch: 'The Current angle block uses Connection %1, but no block that moves the servo uses that same Connection.',
      servoJoystickSameDirection: 'Choose different directions to raise and lower the servo. The same direction cannot perform both movements.',
      servoRaiseAngleOrder: 'To raise the servo, the initial angle must be less than the final angle.',
      servoLowerAngleOrder: 'To lower the servo, the initial angle must be greater than the final angle.',
      generic: 'Review this block connection.'
    }
  };

  MESSAGES['pt-br'].externalLedDuplicateChannel = 'O canal %1 do KY-016 foi colocado nas Conexoes %2 e %3. Cada cor precisa ficar em uma unica Conexao.';
  MESSAGES['pt-br'].externalLedDuplicateConnection = 'As cores %1 e %2 estao na mesma Conexao %3. Escolha tres Conexoes diferentes para o LED RGB.';
  MESSAGES['pt-br'].externalLedPwmRequired = 'A Conexao %1 nao oferece PWM neste perfil. O LED RGB externo precisa de uma Conexao com PWM.';
  MESSAGES['pt-br'].externalLedRgbOledConflict = 'Na BitDogLab V7, o KY-016 RGB completo precisa de tres Conexoes e o Display OLED (tela da placa) usa as Conexoes 2 e 3. Escolha usar o LED RGB ou o Display neste projeto.';
  MESSAGES.en.externalLedDuplicateChannel = 'The KY-016 %1 channel was placed on Connections %2 and %3. Each colour must use one Connection only.';
  MESSAGES.en.externalLedDuplicateConnection = 'Colours %1 and %2 use the same Connection %3. Choose three different Connections for the RGB LED.';
  MESSAGES.en.externalLedPwmRequired = 'Connection %1 does not provide PWM in this profile. The external RGB LED needs a PWM connection.';
  MESSAGES.en.externalLedRgbOledConflict = 'On BitDogLab V7, a complete KY-016 RGB LED needs three Connections and the OLED display (board screen) uses Connections 2 and 3. Choose the RGB LED or the display for this project.';

  var Domains = Code.BlockTypeDomains;
  var MATRIX_OPTION_COMMANDS = Domains ? Domains.get('MATRIX_OPTION_COMMANDS') : [];
  var MATRIX_COMMANDS = Domains ? Domains.get('MATRIX_COMMANDS') : [];
  var MATRIX_ANIMATION_BLOCKS = Domains ? Domains.get('MATRIX_ANIMATION_BLOCKS') : [];
  var LED_COMMANDS = Domains ? Domains.get('LED_COMMANDS') : [];
  var EXTERNAL_LED_COMMANDS = Domains ? Domains.get('EXTERNAL_LED_COMMANDS') : [];
  var SOUND_COMMANDS = Domains ? Domains.get('SOUND_COMMANDS') : [];

  var CONTRACTS = {
    joystick_controlar_led: {
      kind: 'statement',
      requiredValueInputs: {
        COR: 'cor'
      }
    },
    joystick_intensidade_atual: {
      kind: 'value',
      requiresAnyBlock: ['joystick_controlar_led'],
      requiresLabel: 'Joystick controla LED'
    },
    joystick_frequencia_atual: {
      kind: 'value',
      requiresAnyBlock: ['joystick_controlar_buzzer'],
      requiresLabel: 'Joystick controla Buzzer'
    },
    servo_mover: {
      kind: 'statement'
    },
    servo_angulo_atual: {
      kind: 'value',
      requiresAnyBlock: [
        'servo_mover',
        'servo_joystick_controlar',
        'servo_subir_gradualmente',
        'servo_descer_gradualmente'
      ],
      requiresLabel: 'Mover servo, Joystick controla servo, Subir servo ou Descer servo'
    },
    servo_joystick_controlar: {
      kind: 'statement'
    },
    servo_subir_gradualmente: {
      kind: 'statement'
    },
    servo_descer_gradualmente: {
      kind: 'statement'
    },
    dht11_temperatura: {
      kind: 'value'
    },
    dht11_umidade: {
      kind: 'value'
    },
    dht11_plotar: {
      kind: 'statement',
      requiredValueInputs: {
        VALOR: 'temperatura ou umidade do DHT11'
      }
    },
    microfone_vu_meter: {
      kind: 'statement',
      requiredValueInputs: {
        COR: 'cor'
      }
    },
    microfone_controlar_led: {
      kind: 'statement',
      requiredValueInputs: {
        COR: 'cor'
      }
    },
    microfone_nivel_atual: {
      kind: 'value',
      requiresAnyBlock: ['microfone_vu_meter', 'microfone_controlar_led'],
      requiresLabel: 'Medidor de barulho na Matriz ou Controlar LED com a Voz'
    },
    microfone_total_palmas: {
      kind: 'value',
      requiresAnyBlock: ['microfone_contar_palmas'],
      requiresLabel: 'Contar palmas'
    },
    microfone_barra_pct: {
      kind: 'value',
      requiresAnyBlock: ['microfone_barra_display'],
      requiresLabel: 'Medidor de barulho no Display'
    },
    estufa_temp_sensor1: {
      kind: 'value',
      requiresAnyBlock: ['sensor_estufa_comparar', 'estufa_plotar'],
      requiresLabel: 'Efeito Estufa ou Mostrar Grafico'
    },
    estufa_umid_sensor1: {
      kind: 'value',
      requiresAnyBlock: ['sensor_estufa_comparar', 'estufa_plotar'],
      requiresLabel: 'Efeito Estufa ou Mostrar Grafico'
    },
    estufa_temp_sensor2: {
      kind: 'value',
      requiresAnyBlock: ['sensor_estufa_comparar', 'estufa_plotar'],
      requiresLabel: 'Efeito Estufa ou Mostrar Grafico'
    },
    estufa_umid_sensor2: {
      kind: 'value',
      requiresAnyBlock: ['sensor_estufa_comparar', 'estufa_plotar'],
      requiresLabel: 'Efeito Estufa ou Mostrar Grafico'
    },
    estufa_toggle_sensor1: {
      kind: 'statement',
      requiredAncestorAny: ['botao_se_apertado', 'botao_enquanto_apertado'],
      requiredAncestorLabel: 'um bloco de botão'
    },
    estufa_toggle_sensor2: {
      kind: 'statement',
      requiredAncestorAny: ['botao_se_apertado', 'botao_enquanto_apertado'],
      requiredAncestorLabel: 'um bloco de botão'
    },
    robo_frente: {
      kind: 'statement',
      requiredValueInputs: {
        TEMPO: 'tempo em segundos'
      }
    },
    robo_tras: {
      kind: 'statement',
      requiredValueInputs: {
        TEMPO: 'tempo em segundos'
      }
    },
    robo_girar: {
      kind: 'statement',
      requiredValueInputs: {
        GRAUS: 'graus do giro'
      }
    },
    robo_giro_valor: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robô'
    },
    robo_aceleracao_x: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robô'
    },
    robo_aceleracao_y: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robô'
    },
    robo_aceleracao_z: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robô'
    },
    robo_transferidor_360: {
      kind: 'statement',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robô'
    },
    display_mostrar_valor: {
      kind: 'statement',
      requiredValueInputs: {
        VALOR: 'valor numerico'
      }
    },
    display_mostrar_calculo: {
      kind: 'statement',
      requiredValueInputs: {
        VALOR: 'resultado numerico'
      }
    },
    estufa_plotar: {
      kind: 'statement',
      requiredValueInputs: {
        VALOR: 'valor numérico para o gráfico'
      }
    },
    bloco_criar_animacao_led: {
      kind: 'container',
      dynamicStatementInputs: [
        {
          prefix: 'STEP',
          allow: LED_COMMANDS,
          label: 'comandos de LED'
        }
      ]
    },
    led_externo_ligar: { kind: 'statement' },
    led_externo_desligar: { kind: 'statement' },
    led_externo_piscar_rapido: { kind: 'statement' },
    led_externo_piscar_lento: { kind: 'statement' },
    led_externo_desligar_todos: { kind: 'statement' },
    led_externo_criar_animacao: {
      kind: 'statement',
      dynamicStatementInputs: [
        {
          prefix: 'STEP',
          allow: EXTERNAL_LED_COMMANDS,
          label: 'comandos de LED externo'
        }
      ],
      requiredValueInputPrefixes: {
        TIME: 'duração em milissegundos'
      }
    },
    criar_trilha_sonora: {
      kind: 'container',
      dynamicStatementInputs: [
        {
          prefix: 'STEP',
          allow: SOUND_COMMANDS,
          label: 'comandos de som'
        }
      ]
    },
    criar_desenho_na_matriz: {
      kind: 'container',
      dynamicStatementInputs: [
        {
          prefix: 'DESENHO',
          allow: MATRIX_COMMANDS,
          label: 'comandos de matriz de LED'
        }
      ]
    },
    joystick_seletor: {
      kind: 'container',
      inputs: {
        OPCOES: {
          allow: MATRIX_OPTION_COMMANDS,
          label: 'opcoes da matriz de LED'
        }
      }
    }
  };

  function extendContract(blockType, extension) {
    var contract = CONTRACTS[blockType] || {};
    for (var key in extension) {
      if (!extension.hasOwnProperty(key)) continue;

      if (key === 'requiredValueInputs' || key === 'requiredValueInputPrefixes') {
        contract[key] = contract[key] || {};
        for (var inputName in extension[key]) {
          if (extension[key].hasOwnProperty(inputName)) {
            contract[key][inputName] = extension[key][inputName];
          }
        }
      } else {
        contract[key] = extension[key];
      }
    }
    CONTRACTS[blockType] = contract;
  }

  function requireValues(blockType, requiredValueInputs) {
    extendContract(blockType, {
      kind: CONTRACTS[blockType] && CONTRACTS[blockType].kind || 'statement',
      requiredValueInputs: requiredValueInputs
    });
  }

  [
    'bloco_ligar_led',
    'bloco_desligar_led',
    'bloco_acender_led_brilho',
    'bloco_piscar_led',
    'piscar_led_lento',
    'bloco_animar_led_coracao',
    'bloco_sinalizar_led_sos',
    'bloco_animar_led_brilhar'
  ].forEach(function(blockType) {
    requireValues(blockType, {
      COLOUR: 'cor do LED'
    });
  });

  requireValues('bloco_transicao_led', {
    COLOUR1: 'cor inicial do LED',
    COLOUR2: 'cor final do LED'
  });

  requireValues('bloco_batalhar_led', {
    COLOUR1: 'primeira cor do LED',
    COLOUR2: 'segunda cor do LED'
  });

  extendContract('bloco_alternar_led', {
    kind: 'statement',
    requiredValueInputPrefixes: {
      COLOUR: 'cor do LED'
    }
  });

  [
    'preencher_matriz',
    'acender_led_posicao',
    'acender_linha',
    'acender_coluna'
  ].forEach(function(blockType) {
    requireValues(blockType, {
      COLOUR: 'cor da matriz de LED'
    });
  });

  requireValues('mostrar_numero_matriz', {
    NUMERO: 'número da matriz',
    COR: 'cor da matriz de LED'
  });

  requireValues('mostrar_emoji', {
    EMOJI: 'emoji da matriz',
    COR: 'cor da matriz de LED'
  });

  for (var i = 0; i < MATRIX_ANIMATION_BLOCKS.length; i++) {
    CONTRACTS[MATRIX_ANIMATION_BLOCKS[i]] = {
      kind: 'container',
      requiredValueInputs: MATRIX_ANIMATION_BLOCKS[i] === 'matriz_dar_flash' ? {
        COR: 'cor do flash'
      } : undefined,
      inputs: {
        DO: {
          allow: MATRIX_COMMANDS,
          label: 'comandos de matriz de LED'
        }
      }
    };
  }

  Code.BlockContracts = {
    VERSION: '2026-08-14-external-resources',
    contracts: CONTRACTS,
    messages: MESSAGES,
    get: function(blockType) {
      return CONTRACTS[blockType] || null;
    },
    getMessage: function(key) {
      var lang = Code.LANG || 'pt-br';
      var table = MESSAGES[lang] || MESSAGES['pt-br'];
      return table[key] || MESSAGES['pt-br'][key] || key;
    }
  };
})(window);
