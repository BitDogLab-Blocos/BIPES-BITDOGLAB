(function(window, document) {
  'use strict';

  var data = window.BitDogLabManualData || { categories: [] };
  var nav = document.getElementById('categoryNav');
  var article = document.getElementById('manualArticle');
  var state = {
    categoryId: null,
    lesson: 'welcome',
    itemId: null
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCategory() {
    if (!state.categoryId) return null;
    return data.categories.find(function(category) {
      return category.id === state.categoryId;
    }) || null;
  }

  function getBlock(category) {
    return (category.blocks || []).find(function(block) {
      return block.type === state.itemId;
    });
  }

  function list(items) {
    if (!items || !items.length) return '';
    return '<ul>' + items.map(function(item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  function buttonClass(kind, id) {
    var active = state.lesson === kind && (id ? state.itemId === id : !state.itemId);
    return active ? ' active' : '';
  }

  function fact(label, value) {
    if (!value) return '';
    return (
      '<span class="fact-pill">' +
        '<strong>' + escapeHtml(label) + '</strong>' +
        '<em>' + escapeHtml(value) + '</em>' +
      '</span>'
    );
  }

  function renderNav() {
    nav.innerHTML = data.categories.map(function(category) {
      var activeCategory = category.id === state.categoryId;
      var disabled = category.disabled || !category.blocks;
      var status = disabled ? 'Em breve' : (activeCategory ? 'Fechar' : 'Abrir');
      var html = (
        '<button class="category-row' + (activeCategory ? ' active' : '') + '" data-category="' + escapeHtml(category.id) + '"' +
          (disabled ? ' disabled' : '') +
          ' aria-expanded="' + (activeCategory && !disabled ? 'true' : 'false') + '"' +
          ' style="--category-color:' + escapeHtml(category.color || '#4b2e83') + '">' +
          '<span class="category-number">' + escapeHtml(category.number || '') + '</span>' +
          '<strong>' + escapeHtml(category.title) + '</strong>' +
          '<small>' + escapeHtml(status) + '</small>' +
        '</button>'
      );

      if (!activeCategory || disabled) return html;

      html += '<div class="lesson-list">';
      html += '<button class="lesson-row' + buttonClass('intro') + '" data-lesson="intro">Comece aqui</button>';
      category.blocks.forEach(function(block, index) {
        html += (
          '<button class="lesson-row' + buttonClass('block', block.type) + '" data-lesson="block" data-item="' + escapeHtml(block.type) + '">' +
            '<span>' + (index + 1) + '.</span>' +
            '<em>' + escapeHtml(block.shortName || block.name) + '</em>' +
          '</button>'
        );
      });
      html += '<button class="lesson-row' + buttonClass('projects') + '" data-lesson="projects">Projetos prontos</button>';
      html += '</div>';
      return html;
    }).join('');
  }

  function renderWelcome() {
    return (
      '<header class="lesson-header welcome-header">' +
        '<span class="lesson-kicker">Manual BitDogLab</span>' +
        '<h1>Escolha uma categoria</h1>' +
        '<p>Clique em uma categoria do lado esquerdo para abrir os blocos. Clique nela de novo para fechar.</p>' +
      '</header>' +
      '<section class="welcome-steps" aria-label="Como usar o manual">' +
        '<article>' +
          '<strong>1</strong>' +
          '<h2>Abra</h2>' +
          '<p>Comece clicando em LEDs.</p>' +
        '</article>' +
        '<article>' +
          '<strong>2</strong>' +
          '<h2>Escolha</h2>' +
          '<p>Toque no nome de um bloco para ver como ele funciona.</p>' +
        '</article>' +
        '<article>' +
          '<strong>3</strong>' +
          '<h2>Teste</h2>' +
          '<p>Monte a missão na área de blocos e olhe o que acontece na placa.</p>' +
        '</article>' +
      '</section>'
    );
  }

  function renderIntro(category) {
    var intro = category.intro;
    return (
      '<header class="lesson-header">' +
        '<span class="lesson-kicker">' + escapeHtml(category.number) + '. ' + escapeHtml(category.title) + '</span>' +
        '<h1>' + escapeHtml(intro.title) + '</h1>' +
        '<p>' + escapeHtml(intro.subtitle) + '</p>' +
      '</header>' +
      '<div class="intro-layout">' +
        '<figure class="main-figure">' +
          '<img src="' + escapeHtml(intro.image) + '" alt="Imagem explicando as partes de um LED RGB">' +
        '</figure>' +
        '<section class="lesson-text">' +
          intro.text.map(function(paragraph) {
            return '<p>' + escapeHtml(paragraph) + '</p>';
          }).join('') +
        '</section>' +
      '</div>' +
      '<section class="intro-cards">' +
        (intro.cards || []).map(function(card) {
          return (
            '<article>' +
              '<h2>' + escapeHtml(card.title) + '</h2>' +
              '<p>' + escapeHtml(card.text) + '</p>' +
            '</article>'
          );
        }).join('') +
      '</section>' +
      '<section class="mission-box">' +
        '<h2>Missão rápida</h2>' +
        list(intro.mission) +
      '</section>'
    );
  }

  function renderBlock(block) {
    return (
      '<header class="lesson-header">' +
        '<span class="lesson-kicker">Tutorial do bloco</span>' +
        '<h1>' + escapeHtml(block.name) + '</h1>' +
        '<p>' + escapeHtml(block.child) + '</p>' +
      '</header>' +
      '<div class="fact-row">' +
        fact('Tipo', block.kind) +
        fact('Usa', block.needs) +
        fact('Lugar', block.place) +
      '</div>' +
      '<div class="lesson-media">' +
        '<figure class="block-figure">' +
          '<img src="' + escapeHtml(block.screenshot) + '" alt="Print real do bloco ' + escapeHtml(block.name) + '">' +
          '<figcaption>Assim ele aparece na área de blocos.</figcaption>' +
        '</figure>' +
        '<figure class="concept-figure">' +
          '<img src="' + escapeHtml(block.conceptImage) + '" alt="Imagem explicando a ideia do bloco">' +
          '<figcaption>A ideia por trás do bloco.</figcaption>' +
        '</figure>' +
      '</div>' +
      '<section class="lesson-text two-column-text">' +
        '<article>' +
          '<h2>O que ele pensa</h2>' +
          '<p>' + escapeHtml(block.idea) + '</p>' +
        '</article>' +
        '<article>' +
          '<h2>Onde encaixa</h2>' +
          '<p>' + escapeHtml(block.fits) + '</p>' +
        '</article>' +
      '</section>' +
      '<section class="lesson-text">' +
        '<h2>Passo a passo</h2>' +
        list(block.steps) +
      '</section>' +
      '<section class="try-box">' +
        '<div>' +
          '<h2>Olhe na placa</h2>' +
          '<p>' + escapeHtml(block.watch) + '</p>' +
        '</div>' +
        '<div>' +
          '<h2>Missão</h2>' +
          '<p>' + escapeHtml(block.mission) + '</p>' +
        '</div>' +
      '</section>'
    );
  }

  function renderProjects(category) {
    return (
      '<header class="lesson-header">' +
        '<span class="lesson-kicker">' + escapeHtml(category.title) + '</span>' +
        '<h1>Projetos prontos</h1>' +
        '<p>Escolha um exemplo para treinar os blocos que você acabou de conhecer.</p>' +
      '</header>' +
      '<div class="project-list">' +
        (category.projects || []).map(function(project) {
          return (
            '<article class="project-item">' +
              '<img src="' + escapeHtml(project.screenshot) + '" alt="Print real do exemplo ' + escapeHtml(project.title) + '">' +
              '<div>' +
                '<h2>' + escapeHtml(project.title) + '</h2>' +
                '<p>' + escapeHtml(project.text) + '</p>' +
              '</div>' +
            '</article>'
          );
        }).join('') +
      '</div>'
    );
  }

  function renderArticle() {
    var category = getCategory();
    if (!category) {
      article.innerHTML = renderWelcome();
      return;
    }

    if (category.disabled) {
      article.innerHTML = '<div class="empty-state">Essa categoria ainda vai ganhar tutorial.</div>';
      return;
    }

    if (state.lesson === 'block') {
      article.innerHTML = renderBlock(getBlock(category) || category.blocks[0]);
      return;
    }

    if (state.lesson === 'projects') {
      article.innerHTML = renderProjects(category);
      return;
    }

    article.innerHTML = renderIntro(category);
  }

  nav.addEventListener('click', function(event) {
    var lessonButton = event.target.closest('[data-lesson]');
    var categoryButton = event.target.closest('[data-category]');

    if (lessonButton) {
      state.lesson = lessonButton.getAttribute('data-lesson');
      state.itemId = lessonButton.getAttribute('data-item') || null;
      renderNav();
      renderArticle();
      return;
    }

    if (categoryButton && !categoryButton.disabled) {
      var nextCategoryId = categoryButton.getAttribute('data-category');
      var closingCurrentCategory = state.categoryId === nextCategoryId;

      state.categoryId = closingCurrentCategory ? null : nextCategoryId;
      state.lesson = closingCurrentCategory ? 'welcome' : 'intro';
      state.itemId = null;

      renderNav();
      renderArticle();
    }
  });

  renderNav();
  renderArticle();
})(window, document);
