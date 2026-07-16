// Shared semantic block domains used by definitions and validation.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var DOMAINS = {
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

  Code.BlockTypeDomains = {
    domains: DOMAINS,
    get: function(name) {
      return DOMAINS[name] ? DOMAINS[name].slice() : [];
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

        var newChecks = Array.isArray(checkName) ? checkName : [checkName];
        var currentChecks = definition.__bitdoglabPreviousChecks || [];
        for (var c = 0; c < newChecks.length; c++) {
          if (currentChecks.indexOf(newChecks[c]) === -1) {
            currentChecks.push(newChecks[c]);
          }
        }
        definition.__bitdoglabPreviousChecks = currentChecks;

        if (definition.__bitdoglabTyped) continue;

        (function(definitionToWrap, originalInit) {
          definitionToWrap.init = function() {
            originalInit.call(this);
            if (this.previousConnection) {
              var currentDefinition = global.Blockly.Blocks[this.type];
              this.previousConnection.setCheck(currentDefinition.__bitdoglabPreviousChecks);
            }
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
    }
  };
})(window);
