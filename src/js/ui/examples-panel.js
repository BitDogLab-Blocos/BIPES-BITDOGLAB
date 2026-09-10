'use strict';

(function(global) {
  var ExamplesPanel = {};

  var state = {
    categories: [],
    category: null,
    loading: true,
    error: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderMessage(message) {
    var content = byId('examplesContent');
    if (!content) return;
    content.replaceChildren(createElement('p', 'examples-panel-message', message));
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

    if (state.loading) {
      renderMessage('Carregando exemplos...');
      return;
    }

    if (state.error) {
      renderMessage(state.error);
      return;
    }

    if (!state.categories.length) {
      renderMessage('Nenhum exemplo disponível.');
      return;
    }

    content.replaceChildren();
    var list = createElement('div', 'examples-category-list');

    state.categories.forEach(function(category) {
      var card = createElement('button', 'examples-category-card');
      card.type = 'button';

      var icon = createElement('span', 'examples-category-icon', category.icon);
      icon.setAttribute('aria-hidden', 'true');

      var copy = createElement('span', 'examples-category-copy');
      copy.appendChild(createElement('strong', '', category.title));
      copy.appendChild(createElement('span', '', category.examples.length + ' exemplos disponíveis'));

      var arrow = createElement('span', 'examples-category-arrow', '›');
      arrow.setAttribute('aria-hidden', 'true');

      card.appendChild(icon);
      card.appendChild(copy);
      card.appendChild(arrow);
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

    var list = createElement('div', 'examples-list');

    category.examples.forEach(function(example) {
      var card = createElement('article', 'examples-card');
      var illustration = createElement('div', 'examples-card-illustration');

      if (example.image) {
        var image = document.createElement('img');
        image.src = example.image;
        image.alt = example.title;
        image.loading = 'lazy';
        illustration.appendChild(image);
      } else {
        illustration.textContent = example.icon;
        illustration.setAttribute('aria-hidden', 'true');
      }

      var copy = createElement('div');
      copy.appendChild(createElement('span', 'examples-card-number', 'Exemplo ' + String(example.number).padStart(2, '0')));
      copy.appendChild(createElement('strong', 'examples-card-title', example.title));
      copy.appendChild(createElement('p', 'examples-card-description', example.description));

      var loadButton = createElement('button', 'examples-card-load', 'Carregar');
      loadButton.type = 'button';
      loadButton.addEventListener('click', function() {
        loadExample(example);
      });
      copy.appendChild(loadButton);

      card.appendChild(illustration);
      card.appendChild(copy);
      list.appendChild(card);
    });

    content.appendChild(list);
  }

  function loadCatalog() {
    if (!global.ExamplesCatalog || !ExamplesCatalog.load) {
      state.loading = false;
      state.error = 'O catálogo de exemplos não está disponível.';
      renderCategories();
      return;
    }

    ExamplesCatalog.load()
      .then(function(categories) {
        state.categories = categories;
        state.loading = false;
        renderCategories();
      })
      .catch(function(error) {
        console.error('[BitDogLab] Erro ao carregar catálogo de exemplos:', error);
        state.loading = false;
        state.error = error.message || 'Não foi possível carregar os exemplos.';
        renderCategories();
      });
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
    loadCatalog();
  };

  global.ExamplesPanel = ExamplesPanel;
  ExamplesPanel.init();
})(window);
