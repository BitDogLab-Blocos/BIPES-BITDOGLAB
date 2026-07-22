(function (global) {
  'use strict';

  var STORAGE_KEY = 'bitdoglab_visual_theme';
  var SOLID_COLOR_KEY = 'bitdoglab_visual_solid_color';
  var DEFAULT_THEME = 'default';
  var DEFAULT_SOLID_COLOR = '#34495e';
  var SOLID_COLORS = ['#34495e', '#315a78', '#3f6652', '#55466e', '#704d5c', '#75684f'];

  var THEMES = {
    default: {
      color: '#2980b9',
      copy: {
        'pt-br': { name: 'Padrão BitDogLab', description: 'O visual atual da plataforma.' },
        en: { name: 'BitDogLab default', description: 'The platform\'s current visual.' }
      },
      terminal: {
        foreground: '#00FFFF', background: '#000000', cursor: '#00FFFF',
        black: '#2e3436', red: '#cc0000', green: '#00FF00', yellow: '#c4a000',
        blue: '#3465a4', magenta: '#75507b', cyan: '#00FFFF', white: '#FFFFFF',
        brightBlack: '#555753', brightRed: '#ef2929', brightGreen: '#8ae234',
        brightYellow: '#fce94f', brightBlue: '#729fcf', brightMagenta: '#ad7fa8',
        brightCyan: '#00FFFF', brightWhite: '#FFFFFF'
      }
    },
    space: {
      color: '#171c4b',
      copy: {
        'pt-br': { name: 'Espaço', description: 'Lua, astronauta e estrelas pelo caminho.' },
        en: { name: 'Space', description: 'Moon, astronaut and stars along the way.' }
      },
      terminal: {
        foreground: '#d9f8ff', background: '#070b28', cursor: '#ffffff',
        black: '#121636', red: '#ff7190', green: '#73f4c4', yellow: '#ffe38a',
        blue: '#71b7ff', magenta: '#c291ff', cyan: '#79efff', white: '#ecfaff',
        brightBlack: '#626b9b', brightRed: '#ff9caf', brightGreen: '#a3f8da',
        brightYellow: '#fff0ad', brightBlue: '#a3d2ff', brightMagenta: '#ddbdff',
        brightCyan: '#b5f7ff', brightWhite: '#ffffff'
      }
    },
    nature: {
      color: '#36734a',
      copy: {
        'pt-br': { name: 'Natureza', description: 'Céu, árvores e folhas para explorar.' },
        en: { name: 'Nature', description: 'Sky, trees and leaves to explore.' }
      },
      terminal: {
        foreground: '#efffdc', background: '#123b2d', cursor: '#f0c95e',
        black: '#183a2f', red: '#ff8f75', green: '#99df87', yellow: '#f4d675',
        blue: '#8bcbd2', magenta: '#d6a5d6', cyan: '#92e0cd', white: '#f4f6dc',
        brightBlack: '#678174', brightRed: '#ffb19e', brightGreen: '#bdf0a9',
        brightYellow: '#fce7a4', brightBlue: '#b6e7eb', brightMagenta: '#ebc6e9',
        brightCyan: '#c5f3e7', brightWhite: '#ffffff'
      }
    },
    neon: {
      color: '#260d4d',
      copy: {
        'pt-br': { name: 'Neon', description: 'Luzes, formas e uma cidade futurista.' },
        en: { name: 'Neon', description: 'Lights, shapes and a futuristic city.' }
      },
      terminal: {
        foreground: '#2cecff', background: '#09051e', cursor: '#ff5bd3',
        black: '#110828', red: '#ff438f', green: '#44ffb5', yellow: '#ffeb5d',
        blue: '#4aa6ff', magenta: '#ff5bd3', cyan: '#2cecff', white: '#f7ecff',
        brightBlack: '#715087', brightRed: '#ff7eae', brightGreen: '#89ffd2',
        brightYellow: '#fff399', brightBlue: '#8bc9ff', brightMagenta: '#ff9de4',
        brightCyan: '#8af5ff', brightWhite: '#ffffff'
      }
    },
    ocean: {
      color: '#086c91',
      copy: {
        'pt-br': { name: 'Oceano', description: 'Peixes, ondas e um mergulho colorido.' },
        en: { name: 'Ocean', description: 'Fish, waves and a colorful dive.' }
      },
      terminal: {
        foreground: '#d8ffff', background: '#06334f', cursor: '#7fe8df',
        black: '#082f45', red: '#ff8c8c', green: '#72e4b3', yellow: '#ffe28c',
        blue: '#71c9ff', magenta: '#d89ee8', cyan: '#6eece4', white: '#e9ffff',
        brightBlack: '#5e8190', brightRed: '#ffb0b0', brightGreen: '#a0f1cc',
        brightYellow: '#fff0b5', brightBlue: '#a6dcff', brightMagenta: '#ebc2f2',
        brightCyan: '#a8f6f1', brightWhite: '#ffffff'
      }
    },
    solid: {
      color: DEFAULT_SOLID_COLOR,
      copy: {
        'pt-br': { name: 'Cor sólida', description: 'Um fundo simples com a cor que você escolher.' },
        en: { name: 'Solid color', description: 'A simple background in the color you choose.' }
      },
      terminal: {
        foreground: '#f4fbff', background: DEFAULT_SOLID_COLOR, cursor: '#ffffff',
        black: '#1d2935', red: '#ff8a8a', green: '#8ee0ad', yellow: '#f2d888',
        blue: '#8ebee8', magenta: '#d6a7df', cyan: '#89dce2', white: '#edf4f7',
        brightBlack: '#71808d', brightRed: '#ffb0b0', brightGreen: '#b5ecc8',
        brightYellow: '#f9e8b3', brightBlue: '#b5d5f0', brightMagenta: '#e7c8ed',
        brightCyan: '#b5ebee', brightWhite: '#ffffff'
      }
    }
  };

  function normalizeTheme(themeId) {
    return Object.prototype.hasOwnProperty.call(THEMES, themeId) ? themeId : DEFAULT_THEME;
  }

  function readStoredTheme() {
    try {
      return normalizeTheme(global.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function normalizeColor(color) {
    return /^#[0-9a-f]{6}$/i.test(String(color || '')) ? String(color).toLowerCase() : DEFAULT_SOLID_COLOR;
  }

  function readStoredSolidColor() {
    try {
      return normalizeColor(global.localStorage.getItem(SOLID_COLOR_KEY));
    } catch (error) {
      return DEFAULT_SOLID_COLOR;
    }
  }

  function getContrastColor(color) {
    var value = normalizeColor(color).slice(1);
    var red = parseInt(value.slice(0, 2), 16);
    var green = parseInt(value.slice(2, 4), 16);
    var blue = parseInt(value.slice(4, 6), 16);
    return ((red * 299 + green * 587 + blue * 114) / 1000) > 150 ? '#10202c' : '#f4fbff';
  }

  function getLanguage() {
    var language = (global.Code && global.Code.LANG) || document.documentElement.lang;
    if (!language) {
      try {
        language = global.localStorage.getItem('bitdoglab_lang');
      } catch (error) {}
    }
    return String(language || 'pt-br').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt-br';
  }

  function setTerminalTheme(themeId) {
    if (global.terminal && typeof global.terminal.setOption === 'function') {
      var terminalTheme = THEMES[themeId].terminal;
      if (themeId === 'solid') {
        terminalTheme = Object.assign({}, terminalTheme, {
          background: readStoredSolidColor(),
          foreground: getContrastColor(readStoredSolidColor())
        });
      }
      global.terminal.setOption('theme', terminalTheme);
    }
  }

  function updateSolidColorSelection(color) {
    var selectedColor = normalizeColor(color);
    var swatches = document.querySelectorAll('.visual-solid-swatch[data-solid-color]');
    for (var i = 0; i < swatches.length; i += 1) {
      var isActive = swatches[i].getAttribute('data-solid-color') === selectedColor;
      swatches[i].classList.toggle('is-active', isActive);
      swatches[i].setAttribute('aria-pressed', String(isActive));
    }
    var input = document.getElementById('visualSolidColorInput');
    if (input && input.value !== selectedColor) input.value = selectedColor;
  }

  function updateSolidControls(themeId) {
    var controls = document.getElementById('visualSolidControls');
    if (!controls) return;
    var isSolid = themeId === 'solid';
    controls.hidden = !isSolid;
    controls.setAttribute('aria-hidden', String(!isSolid));
    if (isSolid) updateSolidColorSelection(readStoredSolidColor());
  }

  function updateSelection(themeId) {
    var options = document.querySelectorAll('.visual-theme-option[data-theme]');
    for (var i = 0; i < options.length; i += 1) {
      var isActive = options[i].getAttribute('data-theme') === themeId;
      options[i].classList.toggle('is-active', isActive);
      options[i].setAttribute('aria-pressed', String(isActive));
    }
    updateSolidControls(themeId);
  }

  function applySolidColor(color, persist) {
    var selectedColor = normalizeColor(color);
    document.documentElement.style.setProperty('--visual-solid-color', selectedColor);

    if (persist) {
      try {
        global.localStorage.setItem(SOLID_COLOR_KEY, selectedColor);
      } catch (error) {}
    }

    updateSolidColorSelection(selectedColor);
    if (document.documentElement.getAttribute('data-visual-theme') === 'solid') {
      var themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.setAttribute('content', selectedColor);
      setTerminalTheme('solid');
    }
    global.dispatchEvent(new CustomEvent('visualsolidcolorchange', { detail: { color: selectedColor } }));
    return selectedColor;
  }

  function applyTheme(themeId, persist) {
    var selectedTheme = normalizeTheme(themeId);
    document.documentElement.setAttribute('data-visual-theme', selectedTheme);
    if (selectedTheme === 'solid') applySolidColor(readStoredSolidColor(), false);

    if (persist) {
      try {
        global.localStorage.setItem(STORAGE_KEY, selectedTheme);
      } catch (error) {}
    }

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', selectedTheme === 'solid' ? readStoredSolidColor() : THEMES[selectedTheme].color);
    }

    updateSelection(selectedTheme);
    setTerminalTheme(selectedTheme);
    global.dispatchEvent(new CustomEvent('visualthemechange', { detail: { theme: selectedTheme } }));
    return selectedTheme;
  }

  function renderOptions(container) {
    var language = getLanguage();
    var fragment = document.createDocumentFragment();

    Object.keys(THEMES).forEach(function (themeId) {
      var copy = THEMES[themeId].copy[language];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'visual-theme-option';
      button.setAttribute('data-theme', themeId);
      button.setAttribute('aria-pressed', 'false');

      var preview = document.createElement('span');
      preview.className = 'visual-theme-preview';
      preview.setAttribute('aria-hidden', 'true');

      var text = document.createElement('span');
      text.className = 'visual-theme-option-copy';
      var name = document.createElement('strong');
      name.textContent = copy.name;
      var description = document.createElement('small');
      description.textContent = copy.description;

      text.appendChild(name);
      text.appendChild(description);
      button.appendChild(preview);
      button.appendChild(text);
      fragment.appendChild(button);
    });

    container.replaceChildren(fragment);
  }

  function renderSolidControls(container) {
    var isEnglish = getLanguage() === 'en';
    var controls = document.createElement('div');
    controls.id = 'visualSolidControls';
    controls.className = 'visual-solid-controls';
    controls.hidden = true;
    controls.setAttribute('aria-hidden', 'true');

    var title = document.createElement('strong');
    title.textContent = isEnglish ? 'Choose the background color' : 'Escolha a cor do fundo';
    controls.appendChild(title);

    var palette = document.createElement('div');
    palette.className = 'visual-solid-palette';
    SOLID_COLORS.forEach(function (color) {
      var swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'visual-solid-swatch';
      swatch.style.setProperty('--swatch-color', color);
      swatch.setAttribute('data-solid-color', color);
      swatch.setAttribute('aria-label', (isEnglish ? 'Use color ' : 'Usar a cor ') + color);
      swatch.setAttribute('aria-pressed', 'false');
      palette.appendChild(swatch);
    });
    controls.appendChild(palette);

    var customLabel = document.createElement('label');
    customLabel.className = 'visual-solid-custom';
    var customText = document.createElement('span');
    customText.textContent = isEnglish ? 'Other color' : 'Outra cor';
    var customInput = document.createElement('input');
    customInput.id = 'visualSolidColorInput';
    customInput.type = 'color';
    customInput.value = readStoredSolidColor();
    customInput.setAttribute('aria-label', customText.textContent);
    customLabel.appendChild(customText);
    customLabel.appendChild(customInput);
    controls.appendChild(customLabel);

    container.insertAdjacentElement('afterend', controls);
    return controls;
  }

  function localizePanel() {
    var isEnglish = getLanguage() === 'en';
    var label = document.getElementById('visualThemeButtonLabel');
    var button = document.getElementById('visualThemeButton');
    var title = document.getElementById('visualThemePanelTitle');
    var intro = document.getElementById('visualThemePanelIntro');
    var closeButton = document.getElementById('closeVisualThemePanel');

    if (label) label.textContent = isEnglish ? 'Theme' : 'Visual';
    if (button) button.title = isEnglish ? 'Change visual theme' : 'Alterar visual';
    if (title) title.textContent = isEnglish ? 'Choose a visual theme' : 'Escolha o visual';
    if (intro) intro.textContent = isEnglish
      ? 'Change the Blocks and Messages environment.'
      : 'Mude o ambiente dos Blocos e das Mensagens.';
    if (closeButton) closeButton.setAttribute('aria-label', isEnglish ? 'Close' : 'Fechar');
  }

  function init() {
    var button = document.getElementById('visualThemeButton');
    var panel = document.getElementById('visualThemePanel');
    var closeButton = document.getElementById('closeVisualThemePanel');
    var options = document.getElementById('visualThemeOptions');
    if (!button || !panel || !closeButton || !options) return;

    function closePanel() {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      button.setAttribute('aria-expanded', 'false');
    }

    function openPanel() {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
    }

    localizePanel();
    renderOptions(options);
    var solidControls = renderSolidControls(options);
    applyTheme(readStoredTheme(), false);

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      if (panel.classList.contains('is-open')) closePanel();
      else openPanel();
    });

    closeButton.addEventListener('click', closePanel);
    options.addEventListener('click', function (event) {
      var option = event.target.closest('.visual-theme-option');
      if (!option) return;
      var selectedTheme = option.getAttribute('data-theme');
      applyTheme(selectedTheme, true);
      if (selectedTheme === 'solid') return;
      closePanel();
      button.focus();
    });

    solidControls.addEventListener('click', function (event) {
      var swatch = event.target.closest('.visual-solid-swatch');
      if (!swatch) return;
      applySolidColor(swatch.getAttribute('data-solid-color'), true);
    });
    var solidColorInput = document.getElementById('visualSolidColorInput');
    solidColorInput.addEventListener('input', function () {
      applySolidColor(solidColorInput.value, true);
    });

    document.addEventListener('click', function (event) {
      if (!panel.contains(event.target) && !button.contains(event.target)) closePanel();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        closePanel();
        button.focus();
      }
    });
  }

  global.VisualThemeManager = {
    THEMES: THEMES,
    applyTheme: applyTheme,
    applySolidColor: applySolidColor,
    getCurrentTheme: function () {
      return normalizeTheme(document.documentElement.getAttribute('data-visual-theme'));
    }
  };

  applySolidColor(readStoredSolidColor(), false);
  applyTheme(readStoredTheme(), false);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
