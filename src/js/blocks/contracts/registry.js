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
      displayTypeConflict: 'Há blocos usando telas diferentes. Escolha o mesmo tamanho de tela em todos eles.',
      emptyJoystickSelector: 'Coloque pelo menos uma opção dentro do seletor do joystick.',
      workspaceHasIssues: 'Corrija os blocos marcados antes de rodar o programa.',
      moreIssues: 'Ainda há mais %1 bloco(s) com aviso.',
      nearIncompatibleConnection: 'Este encaixe recebeu um bloco incompatível por perto. Aqui era esperado: %1. O bloco perto dele é: %2.',
      servoOledV7PinConflict: 'Na placa BitDogLab V7, as Conexões 2 e 3 também são usadas pelo Display (tela da placa). Para usar o servo e a tela juntos, escolha a Conexão 0 ou 1 no servo.',
      dht11V7PinConflict: 'Na placa BitDogLab V7, o DHT11 deve usar somente as Conexões 0 ou 1. A Conexão %1 também é usada pelo Display (tela da placa); escolha 0 ou 1 no DHT11.',
      dht11Aht20V7I2c0Conflict: 'O sensor DHT11 está na Conexão %1. Os dois sensores estão tentando usar a mesma ligação da placa e podem se atrapalhar. O programa foi bloqueado. Peça ao professor para mover o sensor da Estufa para a outra entrada indicada no guia ou escolha outra Conexão para o DHT11. Depois, rode o programa novamente.',
      externalConnectionConflict: 'A Conexão %1 já está sendo usada pelo bloco de %2. Escolha outro número neste bloco. Depois, confira se o número escolhido é o mesmo contato onde o fio foi colocado na placa.',
      externalLedInvalidConnection: 'Este LED externo usa uma Conexão que não existe na versão da BitDogLab selecionada. Escolha uma Conexão disponível na placa.',
      externalLedInvalidChannel: 'Escolha o pino R — vermelho, G — verde ou B — azul do módulo de LED colorido KY-016.',
      externalLedOledV7Notice: '👀 Confira os fios! Na BitDogLab V7, a tela usa as Conexões 2 e 3. Se um fio colorido do KY-016 estiver em 2 ou 3, essa cor pode piscar com a tela. Use 0 e 1 para até duas cores junto com a tela. Para usar vermelho, verde e azul, escolha a tela ou o LED colorido.',
      externalLedOledV7PinConflict: 'Na placa BitDogLab V7, as Conexões 2 e 3 também são usadas pelo Display (tela da placa). Para usar este LED externo com a tela, escolha a Conexão 0 ou 1.',
      externalContactInvalidConnection: 'Esta Conexão não está disponível para contatos na placa selecionada. Escolha uma Conexão mostrada no bloco.',
      externalContactMissingPrepare: 'Antes de usar os contatos, coloque o bloco 🔌 Preparar contatos no projeto. Deixe ele no começo e escolha o fio comum usado na montagem: GND (recomendado) ou 3,3 V. Sem esse preparo, o programa não será gerado.',
      externalContactPrepareConflict: 'Há duas preparações diferentes para os contatos. Escolha somente um fio comum para todo o projeto: GND ou 3,3 V.',
      externalContactPrepareDuplicate: 'Este preparo está repetido. Um único bloco Preparar contatos vale para todas as Conexões.',
      externalContactOledV7Notice: '👀 Confira os fios! Na BitDogLab V7, o Display usa as Conexões 2 e 3. Se um contato estiver ligado em 2 ou 3, ele pode se atrapalhar com a tela. Para usar contatos e Display juntos, escolha somente as Conexões 0 e 1. Para quatro contatos, retire os blocos do Display durante esse projeto.',
      externalContactOledV7Conflict: 'A Conexão %1 também é usada pelo Display na BitDogLab V7. Para usar contato e tela juntos, escolha a Conexão 0 ou 1.',
      externalContactTestOledV7Conflict: 'O teste verifica as quatro Conexões, mas o Display usa as Conexões 2 e 3 na BitDogLab V7. Remova os blocos do Display antes de testar os contatos.',
      externalContactI2cConflict: 'A Conexão %1 também é usada pelo %2. O contato e esse componente estão tentando usar o mesmo pino da placa. O programa foi bloqueado. Escolha outra Conexão para o contato ou retire um dos dois blocos.',
      servoAngleConnectionMismatch: 'O bloco Último ângulo enviado ao servo usa a Conexão %1, mas nenhum bloco que move o servo usa essa mesma Conexão.',
      servoJoystickSameDirection: 'Escolha direções diferentes para aumentar e diminuir o ângulo do servo. A mesma direção não consegue fazer os dois movimentos.',
      servoRaiseAngleOrder: 'Para aumentar o ângulo do servo, o número inicial deve ser menor que o número final.',
      servoLowerAngleOrder: 'Para diminuir o ângulo do servo, o número inicial deve ser maior que o número final.',
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
      displayTypeConflict: 'Blocks are using different screens. Choose the same screen size in all of them.',
      emptyJoystickSelector: 'Add at least one option inside the joystick selector.',
      workspaceHasIssues: 'Fix the marked blocks before running the program.',
      moreIssues: 'There are %1 more block(s) with warnings.',
      nearIncompatibleConnection: 'This socket has an incompatible block nearby. Expected here: %1. The nearby block is: %2.',
      servoOledV7PinConflict: 'On board BitDogLab V7, Connections 2 and 3 are also used by the board display. To use the servo and screen together, choose Connection 0 or 1 for the servo.',
      dht11V7PinConflict: 'On BitDogLab V7, DHT11 must use only Connections 0 or 1. Connection %1 is reserved for the OLED display (board screen); choose Connection 0 or 1 for DHT11.',
      dht11Aht20V7I2c0Conflict: 'The DHT11 sensor is on Connection %1. The two sensors are trying to use the same board connection and may interfere with each other. The program was blocked. Ask your teacher to move the Greenhouse sensor to the other input shown in the guide, or choose another Connection for DHT11. Then run the program again.',
      externalConnectionConflict: 'Connection %1 is already used by the %2 block. Change the connection in this block and physically check which board contact the cable is connected to. The connection selected in the block cannot detect the real wiring.',
      externalLedInvalidConnection: 'This external LED uses a Connection that does not exist on the selected BitDogLab version. Choose a Connection available on the board.',
      externalLedInvalidChannel: 'Choose the R — red, G — green, or B — blue pin on the KY-016 colour LED module.',
      externalLedOledV7Notice: '👀 Check the wires! On BitDogLab V7, the screen uses Connections 2 and 3. If a KY-016 colour wire is on 2 or 3, that colour may blink with the screen. Use 0 and 1 for up to two colours with the screen. To use red, green, and blue, choose the screen or the colour LED.',
      externalLedOledV7PinConflict: 'On board BitDogLab V7, Connections 2 and 3 are also used by the board display. To use this external LED with the screen, choose Connection 0 or 1.',
      externalContactInvalidConnection: 'This Connection is not available for contacts on the selected board. Choose a Connection shown in the block.',
      externalContactMissingPrepare: 'Before using contacts, add the 🔌 Set up contacts block to the project. Keep it at the beginning and choose the common wire used in the circuit: GND (recommended) or 3.3 V. Without this setup, the program will not be generated.',
      externalContactPrepareConflict: 'There are two different contact setups. Choose only one common wire for the whole project: GND or 3.3 V.',
      externalContactPrepareDuplicate: 'This setup is repeated. One Set up contacts block applies to every Connection.',
      externalContactOledV7Notice: '👀 Check the wires! On BitDogLab V7, the display uses Connections 2 and 3. If a contact is connected to 2 or 3, it may interfere with the screen. To use contacts and the display together, choose only Connections 0 and 1. For four contacts, remove the display blocks during this project.',
      externalContactOledV7Conflict: 'Connection %1 is also used by the display on BitDogLab V7. To use a contact and the screen together, choose Connection 0 or 1.',
      externalContactTestOledV7Conflict: 'The test checks all four Connections, but the display uses Connections 2 and 3 on BitDogLab V7. Remove the display blocks before testing contacts.',
      externalContactI2cConflict: 'Connection %1 is also used by the %2. The contact and this component are trying to use the same board pin. The program was blocked. Choose another contact Connection or remove one of the two blocks.',
      servoAngleConnectionMismatch: 'The Last angle sent to servo block uses Connection %1, but no block that moves the servo uses that same Connection.',
      servoJoystickSameDirection: 'Choose different directions to increase and decrease the servo angle. The same direction cannot perform both movements.',
      servoRaiseAngleOrder: 'To increase the servo angle, the initial number must be less than the final number.',
      servoLowerAngleOrder: 'To decrease the servo angle, the initial number must be greater than the final number.',
      generic: 'Review this block connection.'
    }
  };

  MESSAGES['pt-br'].externalLedDuplicateChannel = 'O pino da cor %1 do KY-016 foi colocado nas Conexões %2 e %3. Cada cor precisa ficar em uma única Conexão.';
  MESSAGES['pt-br'].externalLedDuplicateConnection = 'As cores %1 e %2 estão na mesma Conexão %3. Escolha três Conexões diferentes para o LED colorido.';
  MESSAGES['pt-br'].externalLedPwmRequired = 'A Conexão %1 não consegue controlar corretamente este LED. Escolha outra Conexão da placa.';
  MESSAGES['pt-br'].externalLedRgbOledConflict = 'Na placa BitDogLab V7, o módulo de LED colorido completo precisa de três Conexões, mas o Display (tela da placa) usa as Conexões 2 e 3. Escolha usar o LED colorido ou a tela neste projeto.';
  MESSAGES['pt-br'].externalLedGlobalOledV7Conflict = 'O bloco Desligar todos os LEDs externos verifica as quatro Conexões da placa: 0, 1, 2 e 3. Na placa V7, ele não pode ser usado junto com o Display (tela da placa).';
  MESSAGES.en.externalLedDuplicateChannel = 'The KY-016 %1 colour pin was placed on Connections %2 and %3. Each colour must use one Connection only.';
  MESSAGES.en.externalLedDuplicateConnection = 'Colours %1 and %2 use the same Connection %3. Choose three different Connections for the RGB LED.';
  MESSAGES.en.externalLedPwmRequired = 'Connection %1 cannot control this LED correctly. Choose another board Connection.';
  MESSAGES.en.externalLedRgbOledConflict = 'On board BitDogLab V7, the complete colour LED module needs three Connections, but the board display uses Connections 2 and 3. Choose the colour LED or the screen for this project.';
  MESSAGES.en.externalLedGlobalOledV7Conflict = 'The Turn off all external LEDs block checks all four board Connections: 0, 1, 2, and 3. On board V7, it cannot be used together with the board display.';

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
      requiresLabel: 'Mover servo, Joystick controla servo, Aumentar o ângulo do servo ou Diminuir o ângulo do servo'
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
    external_contact_prepare: {
      kind: 'statement'
    },
    external_contact_when_closed: {
      kind: 'container',
      inputs: {
        DO: {
          label: 'ações do programa'
        }
      }
    },
    external_contact_is_closed: {
      kind: 'value'
    },
    external_contact_test_matrix: {
      kind: 'statement'
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
    VERSION: '2026-08-19-external-contacts',
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
