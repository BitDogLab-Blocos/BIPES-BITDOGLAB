'use strict';

(function(global) {
  var ExamplesPanel = {};

  // Temporary data to validate the navigation and placement before catalog.json exists.
  var CATEGORIES = [
    {
      id: 'leds',
      title: 'LEDs',
      icon: '💡',
      count: 20,
      examples: [
        { number: 1, title: 'Ligar', description: 'Acenda o LED da placa e observe o primeiro resultado.', icon: '💡', xml: '../../examples/leds/led_01_ligar.xml' },
        { number: 4, title: 'Brilho', description: 'Controle a intensidade do LED usando blocos.', icon: '✨', xml: '../../examples/leds/led_04_brilho.xml' },
        { number: 14, title: 'Semáforo', description: 'Monte uma sequência de cores com LEDs.', icon: '🚦', xml: '../../examples/leds/led_14_semaforo.xml' }
      ]
    },
    {
      id: 'matriz_led',
      title: 'Matriz de LEDs',
      icon: '🔲',
      count: 32,
      examples: [
        { number: 1, title: 'Acender toda a matriz', description: 'Preencha a matriz e explore os primeiros desenhos.', icon: '🔲', xml: '../../examples/matriz_led/1_acender_toda_a_matriz.xml' },
        { number: 3, title: 'Ponto central', description: 'Posicione um ponto no centro da matriz.', icon: '🎯', xml: '../../examples/matriz_led/3_ponto_central.xml' },
        { number: 9, title: 'Emoções em sequência', description: 'Mostre diferentes expressões em sequência.', icon: '😊', xml: '../../examples/matriz_led/9_emocoes_em_sequencia.xml' }
      ]
    },
    {
      id: 'display_oled',
      title: 'Display OLED',
      icon: '📺',
      count: 36,
      examples: [
        { number: 1, title: 'Testar conexão OLED', description: 'Verifique a comunicação com o display.', icon: '📺', xml: '../../examples/display_oled/01_testar_conexao_oled_pequeno.xml' },
        { number: 3, title: 'Texto centralizado', description: 'Escreva uma mensagem no centro da tela.', icon: '🔤', xml: '../../examples/display_oled/03_texto_centralizado.xml' },
        { number: 8, title: 'Resultado de uma soma', description: 'Calcule e mostre um resultado no OLED.', icon: '➕', xml: '../../examples/display_oled/08_mostrar_resultado_de_soma.xml' }
      ]
    },
    {
      id: 'joystick',
      title: 'Joystick',
      icon: '🕹️',
      count: 17,
      examples: [
        { number: 1, title: 'Brilho com direções', description: 'Use o joystick para alterar o brilho.', icon: '🕹️', xml: '../../examples/joystick/01_led_brilho_com_direcoes.xml' },
        { number: 10, title: 'Cursor na matriz', description: 'Movimente um cursor usando as direções.', icon: '🎮', xml: '../../examples/joystick/10_cursor_na_matriz.xml' },
        { number: 11, title: 'Seletor de emojis', description: 'Escolha emojis com o movimento do joystick.', icon: '😄', xml: '../../examples/joystick/11_seletor_de_emojis.xml' }
      ]
    }
  ];

  var state = {
    category: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function renderCategories() {
    var content = byId('examplesContent');
    var intro = byId('examplesPanelIntro');
    var back = byId('examplesBack');
    var title = byId('examplesPanelTitle');
    if (!content || !intro || !back || !title) return;

    state.category = null;
    title.textContent = 'Exemplos';
    intro.textContent = 'Escolha uma categoria para encontrar um projeto pronto para editar.';
    back.hidden = true;
    content.replaceChildren();

    var list = document.createElement('div');
    list.className = 'examples-category-list';

    CATEGORIES.forEach(function(category) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'examples-category-card';
      card.innerHTML =
        '<span class="examples-category-icon" aria-hidden="true">' + category.icon + '</span>' +
        '<span class="examples-category-copy"><strong>' + category.title + '</strong><span>' + category.count + ' exemplos disponíveis</span></span>' +
        '<span class="examples-category-arrow" aria-hidden="true">›</span>';
      card.addEventListener('click', function() {
        renderExamples(category);
      });
      list.appendChild(card);
    });

    content.appendChild(list);
  }

  function renderExamples(category) {
    var content = byId('examplesContent');
    var intro = byId('examplesPanelIntro');
    var back = byId('examplesBack');
    var title = byId('examplesPanelTitle');
    if (!content || !intro || !back || !title) return;

    state.category = category.id;
    title.textContent = category.title;
    intro.textContent = 'Escolha um exemplo para abrir os blocos na área de trabalho.';
    back.hidden = false;
    content.replaceChildren();

    var list = document.createElement('div');
    list.className = 'examples-list';

    category.examples.forEach(function(example) {
      var card = document.createElement('article');
      card.className = 'examples-card';
      card.innerHTML =
        '<div class="examples-card-illustration" aria-hidden="true">' + example.icon + '</div>' +
        '<div><span class="examples-card-number">Exemplo ' + String(example.number).padStart(2, '0') + '</span>' +
        '<strong class="examples-card-title">' + example.title + '</strong>' +
        '<p class="examples-card-description">' + example.description + '</p>' +
        '<button class="examples-card-load" type="button">Carregar</button></div>';
      card.querySelector('.examples-card-load').addEventListener('click', function() {
        loadExample(example);
      });
      list.appendChild(card);
    });

    content.appendChild(list);
  }

  function loadExample(example) {
    if (!global.Code || !Code.workspace) return;

    if (Code.workspace.getAllBlocks(false).length > 0 && !global.confirm('Carregar este exemplo e substituir os blocos atuais?')) {
      return;
    }

    fetch(example.xml)
      .then(function(response) {
        if (!response.ok) throw new Error('Não foi possível encontrar o XML do exemplo.');
        return response.text();
      })
      .then(function(xmlText) {
        var loaded = global.SimpleStorage && SimpleStorage.loadWorkspaceFromText
          ? SimpleStorage.loadWorkspaceFromText(xmlText)
          : false;
        if (!loaded) throw new Error('O workspace ainda não está pronto para carregar este exemplo.');

        if (Code.workspace.zoomToFit) Code.workspace.zoomToFit();
        if (global.UI && UI.notify && UI.notify.send) {
          UI.notify.send('Exemplo carregado: ' + example.title);
        }
        close();
      })
      .catch(function(error) {
        console.error('[BitDogLab] Erro ao carregar exemplo:', error);
        if (global.UI && UI.notify && UI.notify.send) {
          UI.notify.send(error.message);
        }
      });
  }

  function open() {
    var panel = byId('examplesPanel');
    var toggle = byId('examplesToggle');
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    renderCategories();
    if (global.Code && Code.workspace && global.Blockly) {
      Blockly.svgResize(Code.workspace);
    }
  }

  function close() {
    var panel = byId('examplesPanel');
    var toggle = byId('examplesToggle');
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (global.Code && Code.workspace && global.Blockly) {
      Blockly.svgResize(Code.workspace);
    }
  }

  ExamplesPanel.init = function() {
    var toggle = byId('examplesToggle');
    var closeButton = byId('examplesClose');
    var back = byId('examplesBack');
    var panel = byId('examplesPanel');
    if (!toggle || !closeButton || !back || !panel) return;

    toggle.addEventListener('click', function() {
      panel.hidden ? open() : close();
    });
    closeButton.addEventListener('click', close);
    back.addEventListener('click', renderCategories);
    panel.addEventListener('click', function(event) {
      if (event.target === panel) close();
    });
    renderCategories();
  };

  global.ExamplesPanel = ExamplesPanel;
  ExamplesPanel.init();
})(window);
