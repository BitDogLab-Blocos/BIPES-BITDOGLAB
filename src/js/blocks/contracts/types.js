// Shared semantic block domains used by definitions and validation.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var DOMAINS = {
    GENERIC_PROGRAM_CONTAINERS: [
      'controls_repeat_simple',
      'controls_repeat_forever',
      'controls_if',
      'controls_ifelse',
      'botao_enquanto_apertado',
      'botao_se_apertado'
    ],

    DISPLAY_COMMANDS: [
      'display_criar_borda',
      'display_limpar_borda',
      'display_texto',
      'display_piscar_texto',
      'display_mostrar_calculo',
      'display_mostrar_valor',
      'display_mostrar_estado_led',
      'display_mostrar_estado_botao',
      'display_mostrar_status_buzzer',
      'display_dashboard_matriz',
      'display_mostrar_tempo_ligado',
      'cronometro_mostrar'
    ],

    MATRIX_OPTION_COMMANDS: [
      'mostrar_emoji',
      'mostrar_numero_matriz'
    ],

    MATRIX_COMMANDS: [
      'preencher_matriz',
      'desligar_matriz',
      'acender_led_posicao',
      'acender_linha',
      'acender_coluna',
      'mostrar_numero_matriz',
      'mostrar_emoji',
      'criar_desenho_na_matriz'
    ],

    MATRIX_ANIMATION_BLOCKS: [
      'matriz_piscar_rapido',
      'matriz_piscar_lento',
      'matriz_aparecer_sumir',
      'matriz_pulsar_brilho',
      'matriz_deslizar_cima',
      'matriz_deslizar_esquerda',
      'matriz_deslizar_baixo',
      'matriz_deslizar_direita',
      'matriz_balancar',
      'matriz_contracao',
      'matriz_dar_flash'
    ],

    LED_COMMANDS: [
      'bloco_ligar_led',
      'bloco_desligar_led',
      'bloco_desligar_todos_leds',
      'bloco_acender_led_brilho',
      'bloco_piscar_led',
      'piscar_led_lento',
      'bloco_animar_led_coracao',
      'bloco_sinalizar_led_sos',
      'piscar_led_aleatorio',
      'bloco_alternar_led',
      'bloco_transicao_led',
      'bloco_batalhar_led',
      'bloco_animar_led_brilhar'
    ],

    SOUND_COMMANDS: [
      'piano_nota',
      'parar_piano',
      'tocar_nota',
      'tocar_som_agudo',
      'parar_som',
      'tocar_repetidamente',
      'bipe_curto',
      'bipe_duplo',
      'alerta_intermitente',
      'chamada',
      'som_de_moeda',
      'som_de_sucesso',
      'som_de_falha',
      'som_de_laser',
      'sirene_policial',
      'escala_musical_sobe',
      'escala_musical_desce',
      'brilha_brilha_estrelinha',
      'natal_jingle_bells',
      'natal_noite_feliz',
      'natal_bate_sino',
      'natal_noel',
      'natal_o_vinde',
      'criar_melodia',
      'criar_trilha_sonora',
      'rtttl_play',
      'tone'
    ]
  };

  var INPUT_RULES = [
    {
      blockTypes: DOMAINS.GENERIC_PROGRAM_CONTAINERS,
      exact: {
        DO: 'ProgramCommand',
        ELSE: 'ProgramCommand',
        DO0: 'ProgramCommand'
      }
    },
    {
      blockTypes: ['display_mostrar', 'display_atualizar'],
      exact: {
        COMANDOS: 'DisplayCommand'
      }
    },
    {
      blockTypes: ['joystick_seletor'],
      exact: {
        OPCOES: 'MatrixOptionCommand'
      }
    },
    {
      blockTypes: DOMAINS.MATRIX_ANIMATION_BLOCKS,
      exact: {
        DO: 'MatrixCommand'
      }
    },
    {
      blockTypes: ['criar_desenho_na_matriz'],
      prefix: {
        DESENHO: 'MatrixCommand'
      }
    },
    {
      blockTypes: ['tocar_repetidamente'],
      exact: {
        DO: 'SoundCommand'
      }
    },
    {
      blockTypes: ['criar_trilha_sonora'],
      prefix: {
        STEP: 'SoundCommand'
      }
    },
    {
      blockTypes: ['bloco_criar_animacao_led'],
      prefix: {
        STEP: 'LedCommand'
      }
    }
  ];

  var OUTPUT_USAGE = {
    Number: {
      'pt-br': 'Este bloco entrega um número. Encaixe ele em um espaço numérico, como Mostrar valor, Matemática, Comparação ou tempo.',
      en: 'This block gives a number. Connect it to a numeric space, such as Show value, Math, Comparison, or time.'
    },
    String: {
      'pt-br': 'Este bloco entrega um texto. Encaixe ele em um espaço de texto, como imprimir texto ou montar uma mensagem.',
      en: 'This block gives text. Connect it to a text space, such as printing text or composing a message.'
    },
    Boolean: {
      'pt-br': 'Este bloco entrega uma condição. Encaixe ele em um bloco Se, Se/Senão ou comparação lógica.',
      en: 'This block gives a condition. Connect it to an If, If/Else, or logical comparison block.'
    },
    Colour: {
      'pt-br': 'Este bloco entrega uma cor. Encaixe ele em um espaço que pede cor, como LED, matriz de LED, microfone com cor ou flash.',
      en: 'This block gives a colour. Connect it to a colour space, such as LED, LED matrix, microphone colour, or flash.'
    },
    Time: {
      'pt-br': 'Este bloco entrega um tempo. Encaixe ele em um bloco que pede duração, espera ou pausa.',
      en: 'This block gives a time value. Connect it to a block that asks for duration, wait, or pause.'
    },
    Note: {
      'pt-br': 'Este bloco entrega uma nota musical. Encaixe ele em um bloco que toca nota ou cria melodia.',
      en: 'This block gives a musical note. Connect it to a play note or melody block.'
    },
    MatrixNumber: {
      'pt-br': 'Este bloco entrega um número para a matriz. Encaixe ele em Mostrar número na matriz ou no seletor do joystick.',
      en: 'This block gives a matrix number. Connect it to Show number on matrix or the joystick selector.'
    },
    MatrixEmoji: {
      'pt-br': 'Este bloco entrega um emoji da matriz. Encaixe ele em Mostrar emoji na matriz ou no seletor do joystick.',
      en: 'This block gives a matrix emoji. Connect it to Show emoji on matrix or the joystick selector.'
    },
    Array: {
      'pt-br': 'Este bloco entrega uma lista. Encaixe ele em um bloco que trabalha com listas.',
      en: 'This block gives a list. Connect it to a block that works with lists.'
    },
    default: {
      'pt-br': 'Este bloco entrega uma informação. Encaixe ele em outro bloco que peça exatamente este tipo de informação.',
      en: 'This block gives information. Connect it to another block that asks for exactly this kind of information.'
    }
  };

  var CONNECTION_LABELS = {
    ProgramCommand: {
      'pt-br': 'um comando comum do programa',
      en: 'a regular program command'
    },
    MatrixCommand: {
      'pt-br': 'um comando da matriz de LED',
      en: 'an LED matrix command'
    },
    MatrixAnimationCommand: {
      'pt-br': 'uma animação da matriz de LED',
      en: 'an LED matrix animation'
    },
    MatrixOptionCommand: {
      'pt-br': 'uma opção da matriz para o joystick',
      en: 'a joystick matrix option'
    },
    SoundCommand: {
      'pt-br': 'um comando de som',
      en: 'a sound command'
    },
    LedCommand: {
      'pt-br': 'um comando de LED',
      en: 'an LED command'
    },
    DisplayCommand: {
      'pt-br': 'um comando de display',
      en: 'a display command'
    },
    Number: {
      'pt-br': 'um número',
      en: 'a number'
    },
    String: {
      'pt-br': 'um texto',
      en: 'text'
    },
    Boolean: {
      'pt-br': 'uma condicao',
      en: 'a condition'
    },
    Colour: {
      'pt-br': 'uma cor',
      en: 'a colour'
    },
    Time: {
      'pt-br': 'um tempo ou duração',
      en: 'a time value or duration'
    },
    Note: {
      'pt-br': 'uma nota musical',
      en: 'a musical note'
    },
    MatrixNumber: {
      'pt-br': 'um número da matriz',
      en: 'a matrix number'
    },
    MatrixEmoji: {
      'pt-br': 'um emoji da matriz',
      en: 'a matrix emoji'
    },
    Array: {
      'pt-br': 'uma lista',
      en: 'a list'
    }
  };

  function asArray(value) {
    return Array.isArray(value) ? value.slice() : [value];
  }

  function mergeUnique(existing, values) {
    var result = existing ? existing.slice() : [];
    values = asArray(values);
    for (var i = 0; i < values.length; i++) {
      if (result.indexOf(values[i]) === -1) result.push(values[i]);
    }
    return result;
  }

  function isStatementInput(input) {
    if (!input) return false;
    if (global.Blockly && typeof global.Blockly.STATEMENT_INPUT !== 'undefined') {
      return input.type === global.Blockly.STATEMENT_INPUT;
    }
    return input.type === 3;
  }

  function applyInputRulesToBlock(block) {
    if (!block || !block.inputList || !global.Blockly || !global.Blockly.Blocks) return;
    var definition = global.Blockly.Blocks[block.type];
    var rules = definition && definition.__bitdoglabInputRules;
    if (!rules || !rules.length) return;

    for (var i = 0; i < block.inputList.length; i++) {
      var input = block.inputList[i];
      if (!isStatementInput(input)) continue;

      for (var r = 0; r < rules.length; r++) {
        var rule = rules[r];
        var check = null;

        if (rule.exact && rule.exact[input.name]) {
          check = rule.exact[input.name];
        }

        if (!check && rule.prefix) {
          for (var prefix in rule.prefix) {
            if (rule.prefix.hasOwnProperty(prefix) && input.name.indexOf(prefix) === 0) {
              check = rule.prefix[prefix];
              break;
            }
          }
        }

        if (check) {
          input.setCheck(asArray(check));
        }
      }
    }
  }

  Code.BlockTypeDomains = {
    domains: DOMAINS,
    inputRules: INPUT_RULES,
    outputUsage: OUTPUT_USAGE,
    connectionLabels: CONNECTION_LABELS,
    get: function(name) {
      return DOMAINS[name] ? DOMAINS[name].slice() : [];
    },
    getOutputChecks: function(block) {
      if (!block || !block.outputConnection || !block.outputConnection.getCheck) return [];
      return block.outputConnection.getCheck() || [];
    },
    getOutputWarning: function(block, lang) {
      var checks = this.getOutputChecks(block);
      var key = checks.length ? checks[0] : 'default';
      var usage = OUTPUT_USAGE[key] || OUTPUT_USAGE.default;
      return usage[lang] || usage['pt-br'];
    },
    describeChecks: function(checks, lang) {
      checks = checks || [];
      lang = lang || 'pt-br';
      if (!checks.length) {
        return lang === 'en' ? 'any compatible block' : 'qualquer bloco compativel';
      }

      var labels = checks.map(function(check) {
        var label = CONNECTION_LABELS[check];
        return label ? (label[lang] || label['pt-br']) : check;
      });

      if (labels.length === 1) return labels[0];
      return labels.slice(0, -1).join(', ') + (lang === 'en' ? ' or ' : ' ou ') + labels[labels.length - 1];
    },
    allTypedBlocks: function() {
      var seen = {};
      var result = [];
      for (var domainName in DOMAINS) {
        if (!DOMAINS.hasOwnProperty(domainName)) continue;
        for (var i = 0; i < DOMAINS[domainName].length; i++) {
          var blockType = DOMAINS[domainName][i];
          if (!seen[blockType]) {
            seen[blockType] = true;
            result.push(blockType);
          }
        }
      }
      return result;
    },
    applyPreviousCheck: function(blockTypes, checkName) {
      if (!global.Blockly || !global.Blockly.Blocks) return;

      for (var i = 0; i < blockTypes.length; i++) {
        var blockType = blockTypes[i];
        var definition = global.Blockly.Blocks[blockType];
        if (!definition || !definition.init) continue;

        definition.__bitdoglabPreviousChecks = mergeUnique(
          definition.__bitdoglabPreviousChecks,
          checkName
        );

        if (definition.__bitdoglabTyped) continue;

        (function(definitionToWrap, originalInit) {
          definitionToWrap.init = function() {
            originalInit.call(this);
            if (this.previousConnection) {
              var currentDefinition = global.Blockly.Blocks[this.type];
              this.previousConnection.setCheck(currentDefinition.__bitdoglabPreviousChecks);
            }
            applyInputRulesToBlock(this);
          };
        })(definition, definition.init);
        definition.__bitdoglabTyped = true;
      }
    },
    applyDefaultPreviousCheck: function(checkName, excludedBlockTypes) {
      if (!global.Blockly || !global.Blockly.Blocks) return;

      var excluded = {};
      excludedBlockTypes = excludedBlockTypes || [];
      for (var i = 0; i < excludedBlockTypes.length; i++) {
        excluded[excludedBlockTypes[i]] = true;
      }

      var blockTypes = Object.keys(global.Blockly.Blocks).filter(function(blockType) {
        return !excluded[blockType];
      });
      this.applyPreviousCheck(blockTypes, checkName);
    },
    applyStatementInputChecks: function(rules) {
      if (!global.Blockly || !global.Blockly.Blocks) return;
      rules = rules || INPUT_RULES;

      for (var r = 0; r < rules.length; r++) {
        var rule = rules[r];
        for (var b = 0; b < rule.blockTypes.length; b++) {
          var blockType = rule.blockTypes[b];
          var definition = global.Blockly.Blocks[blockType];
          if (!definition || !definition.init) continue;

          definition.__bitdoglabInputRules = definition.__bitdoglabInputRules || [];
          if (definition.__bitdoglabInputRules.indexOf(rule) === -1) {
            definition.__bitdoglabInputRules.push(rule);
          }

          if (!definition.__bitdoglabInputTyped) {
            (function(definitionToWrap, originalInit) {
              definitionToWrap.init = function() {
                originalInit.call(this);
                applyInputRulesToBlock(this);
              };
            })(definition, definition.init);
            definition.__bitdoglabInputTyped = true;
          }

          if (definition.updateShape_ && !definition.__bitdoglabShapeTyped) {
            (function(definitionToWrap, originalUpdateShape) {
              definitionToWrap.updateShape_ = function() {
                var result = originalUpdateShape.apply(this, arguments);
                applyInputRulesToBlock(this);
                return result;
              };
            })(definition, definition.updateShape_);
            definition.__bitdoglabShapeTyped = true;
          }
        }
      }
    },
    applySemanticConnectionModel: function() {
      this.applyPreviousCheck(this.get('DISPLAY_COMMANDS'), ['ProgramCommand', 'DisplayCommand']);
      this.applyPreviousCheck(this.get('MATRIX_COMMANDS'), ['ProgramCommand', 'MatrixCommand']);
      this.applyPreviousCheck(this.get('MATRIX_ANIMATION_BLOCKS'), ['ProgramCommand', 'MatrixAnimationCommand']);
      this.applyPreviousCheck(this.get('MATRIX_OPTION_COMMANDS'), ['ProgramCommand', 'MatrixCommand', 'MatrixOptionCommand']);
      this.applyPreviousCheck(this.get('LED_COMMANDS'), ['ProgramCommand', 'LedCommand']);
      this.applyPreviousCheck(this.get('SOUND_COMMANDS'), ['ProgramCommand', 'SoundCommand']);
      this.applyDefaultPreviousCheck('ProgramCommand', []);
      this.applyStatementInputChecks(INPUT_RULES);
    }
  };
})(window);
