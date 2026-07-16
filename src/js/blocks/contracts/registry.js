// Block contracts describe expected usage without changing existing generators.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var MESSAGES = {
    'pt-br': {
      valueNeedsParent: 'Este bloco entrega um valor. Encaixe ele dentro de outro bloco, por exemplo em Mostrar valor, Matematica ou uma comparacao.',
      emptyStatementInput: 'Este espaco esta vazio. Coloque pelo menos um bloco aqui ou remova este bloco se nao for usar.',
      missingDriver: 'Este bloco mostra um valor guardado, mas falta o bloco que atualiza esse valor: %1.',
      missingSetup: 'Este bloco depende de %1 antes dele para funcionar de forma confiavel.',
      wrongContainerChild: 'Este bloco parece estar no lugar errado. Aqui era esperado: %1.',
      missingValueInput: 'Falta encaixar um bloco aqui: %1.',
      missingGenerator: 'Este bloco ainda nao tem gerador de codigo Python. Ele nao vai virar programa.',
      needsAncestor: 'Este bloco deve ficar dentro de: %1.',
      displayTypeConflict: 'Ha blocos usando tipos de display diferentes. Use um unico tipo de display no mesmo programa.',
      emptyJoystickSelector: 'Coloque pelo menos uma opcao dentro do seletor do joystick.',
      workspaceHasIssues: 'Corrija os avisos dos blocos antes de gerar, executar ou enviar o codigo.',
      moreIssues: 'Ainda ha mais %1 bloco(s) com aviso.',
      generic: 'Revise a conexao deste bloco.'
    },
    en: {
      valueNeedsParent: 'This block gives a value. Connect it inside another block, for example Show value, Math, or a comparison.',
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
      generic: 'Review this block connection.'
    }
  };

  var Domains = Code.BlockTypeDomains;
  var DISPLAY_COMMANDS = Domains ? Domains.get('DISPLAY_COMMANDS') : [];
  var MATRIX_OPTION_COMMANDS = Domains ? Domains.get('MATRIX_OPTION_COMMANDS') : [];
  var MATRIX_COMMANDS = Domains ? Domains.get('MATRIX_COMMANDS') : [];
  var MATRIX_ANIMATION_BLOCKS = Domains ? Domains.get('MATRIX_ANIMATION_BLOCKS') : [];
  var LED_COMMANDS = Domains ? Domains.get('LED_COMMANDS') : [];
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
      requiredAncestorLabel: 'um bloco de botao'
    },
    estufa_toggle_sensor2: {
      kind: 'statement',
      requiredAncestorAny: ['botao_se_apertado', 'botao_enquanto_apertado'],
      requiredAncestorLabel: 'um bloco de botao'
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
      requiresLabel: 'Inicializar robo'
    },
    robo_aceleracao_x: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robo'
    },
    robo_aceleracao_y: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robo'
    },
    robo_aceleracao_z: {
      kind: 'value',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robo'
    },
    robo_transferidor_360: {
      kind: 'statement',
      requiresAnyBlock: ['robo_inicializar'],
      requiresLabel: 'Inicializar robo'
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
        VALOR: 'valor numerico para o grafico'
      }
    },
    tocar_repetidamente: {
      kind: 'container',
      inputs: {
        DO: {
          allow: SOUND_COMMANDS,
          label: 'comandos de som'
        }
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
    display_mostrar: {
      kind: 'container',
      inputs: {
        COMANDOS: {
          allow: DISPLAY_COMMANDS,
          label: 'comandos de display'
        }
      }
    },
    display_atualizar: {
      kind: 'container',
      inputs: {
        COMANDOS: {
          allow: DISPLAY_COMMANDS,
          label: 'comandos de display'
        }
      }
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
    VERSION: '2026-07-16-initial',
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
