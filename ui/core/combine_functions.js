/**
 * BIPES - Combina blocos originais de função com novos blocos
 */

console.log('🔧 Carregando sistema de combinação de blocos de função...');

// Aguarda o Blockly carregar e modifica a função flyoutCategoryBlocks
setTimeout(function() {
  if (typeof Blockly !== 'undefined' && Blockly.Procedures && Blockly.Procedures.flyoutCategoryBlocks) {
    console.log('🎯 Modificando categoria de Funções para incluir novos blocos...');

    // Salva a função original
    var originalFlyout = Blockly.Procedures.flyoutCategoryBlocks;

    // Sobrescreve para adicionar nossos blocos
    Blockly.Procedures.flyoutCategoryBlocks = function(workspace) {
      // Pega os blocos originais (para, para → retorna, se acontecer → retorna)
      var xmlList = originalFlyout.call(this, workspace);

      // Adiciona separador
      if (xmlList.length > 0) {
        xmlList[xmlList.length - 1].setAttribute('gap', 24);
      }

      // Adiciona apenas 2 novos blocos simples
      var newBlocks = [
        'function_call',
        'function_with_param'
      ];

      newBlocks.forEach(function(blockType, index) {
        var block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', blockType);
        block.setAttribute('gap', index === 0 ? 16 : 8);
        xmlList.push(block);
      });

        console.log('✅ Total de blocos na categoria Funções:', xmlList.length);
      console.log('📋 Blocos adicionados:', newBlocks);
      return xmlList;
    };

    console.log('✅ Sistema de combinação ativado!');
  } else {
    console.log('❌ Blockly.Procedures não disponível');
  }
}, 2000);