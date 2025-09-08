// Correção JavaScript para Bug de Empilhamento de Blocos na Categoria Temporização

(function fixTemporizacaoBlocks() {
    console.log('🔧 Aplicando correção para categoria Temporização...');
    
    // Função para separar blocos empilhados
    function separateStackedBlocks() {
        const flyout = document.querySelector('.blocklyFlyout');
        if (!flyout) return;
        
        const blockCanvas = flyout.querySelector('.blocklyBlockCanvas');
        if (!blockCanvas) return;
        
        // Encontrar todos os blocos da categoria Temporização
        const timeBlocks = blockCanvas.querySelectorAll('g.blocklyDraggable');
        
        let yOffset = 0;
        const blockSpacing = 80; // Espaçamento entre blocos
        
        timeBlocks.forEach((block, index) => {
            const blockType = block.getAttribute('data-block-type');
            
            // Verifica se é um bloco de temporização
            if (blockType && (
                blockType.includes('delay') ||
                blockType.includes('ticks') ||
                blockType.includes('rtc') ||
                blockType.includes('timer') ||
                blockType.includes('sleep')
            )) {
                // Força posicionamento vertical
                block.style.position = 'relative';
                block.style.transform = `translate(0, ${yOffset}px)`;
                block.style.display = 'block';
                
                // Remove transformações conflitantes
                block.removeAttribute('transform');
                
                yOffset += blockSpacing;
                
                console.log(`✅ Bloco ${blockType} reposicionado em y=${yOffset-blockSpacing}`);
            }
        });
        
        if (yOffset > 0) {
            console.log(`🎯 ${Math.floor(yOffset/blockSpacing)} blocos de temporização foram reorganizados`);
        }
    }
    
    // Função para detectar quando categoria Temporização é selecionada
    function onCategorySelected() {
        const toolboxItems = document.querySelectorAll('.blocklyTreeRow');
        
        toolboxItems.forEach(item => {
            item.addEventListener('click', function() {
                const label = this.getAttribute('aria-label') || this.textContent;
                
                if (label && (label.includes('Temporização') || label.includes('Tempo'))) {
                    console.log('🎯 Categoria Temporização selecionada');
                    
                    // Aguarda o Blockly renderizar o flyout
                    setTimeout(() => {
                        separateStackedBlocks();
                    }, 100);
                }
            });
        });
    }
    
    // Observer para detectar mudanças no DOM do Blockly
    function setupMutationObserver() {
        const targetNode = document.querySelector('.blocklyFlyout');
        if (!targetNode) {
            setTimeout(setupMutationObserver, 500);
            return;
        }
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Verifica se novos blocos foram adicionados
                    setTimeout(separateStackedBlocks, 50);
                }
            });
        });
        
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observer configurado para categoria Temporização');
    }
    
    // Inicialização
    function init() {
        // Aguarda o Blockly estar completamente carregado
        if (typeof Blockly === 'undefined') {
            setTimeout(init, 500);
            return;
        }
        
        console.log('🚀 Iniciando correção para categoria Temporização');
        
        // Configura listeners
        onCategorySelected();
        
        // Configura observer
        setupMutationObserver();
        
        // Aplica correção inicial se categoria já estiver selecionada
        setTimeout(separateStackedBlocks, 1000);
    }
    
    // Inicia quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();