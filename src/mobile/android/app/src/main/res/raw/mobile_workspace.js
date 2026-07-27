(function installBitDogLabMobileWorkspace(global) {
  'use strict';

  if (!global.document) {
    return;
  }

  const document = global.document;
  let toolbox = null;
  let toggleButton = null;
  let collapsed = false;

  function isEnglish() {
    const pageLanguage = document.documentElement.getAttribute('lang');
    const language = pageLanguage || (global.navigator && global.navigator.language) || 'pt-br';
    return language.toLowerCase().startsWith('en');
  }

  function updateLabel() {
    if (!toggleButton) {
      return;
    }
    const english = isEnglish();
    const action = collapsed
      ? (english ? 'Show block categories' : 'Mostrar categorias de blocos')
      : (english ? 'Hide block categories' : 'Recolher categorias de blocos');
    toggleButton.title = action;
    toggleButton.setAttribute('aria-label', action);
    toggleButton.setAttribute('aria-expanded', String(!collapsed));
    toggleButton.textContent = collapsed ? '\u203a' : '\u2039';
  }

  function resizeWorkspace() {
    global.requestAnimationFrame(function resizeAfterLayout() {
      if (global.Blockly && typeof global.Blockly.svgResize === 'function'
          && global.Code && global.Code.workspace) {
        global.Blockly.svgResize(global.Code.workspace);
      }
    });
  }

  function positionToggle() {
    if (!toggleButton || !toolbox || collapsed) {
      return;
    }
    const bounds = toolbox.getBoundingClientRect();
    const maximumLeft = Math.max(4, global.innerWidth - toggleButton.offsetWidth);
    toggleButton.style.left = Math.min(Math.max(4, bounds.right), maximumLeft) + 'px';
  }

  function updateVisibility() {
    if (!toggleButton) {
      return;
    }
    const blocksContent = document.getElementById('content_blocks');
    toggleButton.hidden = !blocksContent || !blocksContent.classList.contains('on');
  }

  function applyState(shouldResize) {
    const stateClass = 'bipes-mobile-toolbox-collapsed';
    if (document.documentElement.classList.contains(stateClass) !== collapsed) {
      document.documentElement.classList.toggle(stateClass, collapsed);
    }
    if (toolbox) {
      toolbox.setAttribute('aria-hidden', String(collapsed));
    }
    updateLabel();
    updateVisibility();
    positionToggle();
    if (shouldResize) {
      resizeWorkspace();
    }
  }

  function toggleToolbox() {
    collapsed = !collapsed;
    applyState(true);
  }

  function attachControl() {
    const currentToolbox = document.querySelector('.blocklyToolboxDiv');
    if (!currentToolbox) {
      return false;
    }
    toolbox = currentToolbox;

    if (!toggleButton) {
      toggleButton = document.createElement('button');
      toggleButton.id = 'bitdoglab-toolbox-toggle';
      toggleButton.type = 'button';
      toggleButton.addEventListener('click', toggleToolbox);
      document.body.appendChild(toggleButton);
    }

    applyState(false);
    return true;
  }

  function waitForToolbox(attempt) {
    if (attachControl() || attempt >= 100) {
      return;
    }
    global.setTimeout(function tryAgain() {
      waitForToolbox(attempt + 1);
    }, 100);
  }

  function start() {
    const languageObserver = new MutationObserver(updateLabel);
    languageObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    const blocksContent = document.getElementById('content_blocks');
    if (blocksContent) {
      const tabObserver = new MutationObserver(updateVisibility);
      tabObserver.observe(blocksContent, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    waitForToolbox(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  global.addEventListener('resize', function repositionAfterResize() {
    positionToggle();
    resizeWorkspace();
  });
})(window);
