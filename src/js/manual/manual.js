(function(window, document) {
  'use strict';

  var data = window.BitDogLabManualData || { categories: [] };
  var nav = document.getElementById('categoryNav');
  var article = document.getElementById('manualArticle');
  var state = {
    categoryId: 'leds',
    lesson: 'intro',
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
    return data.categories.find(function(category) {
      return category.id === state.categoryId;
    }) || data.categories[0];
  }

  function getBlock(category) {
    return (category.blocks || []).find(function(block) {
      return block.type === state.itemId;
    });
  }

  function list(items) {
    return '<ul>' + (items || []).map(function(item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  function buttonClass(kind, id) {
    var active = state.lesson === kind && (id ? state.itemId === id : !state.itemId);
    return active ? ' active' : '';
  }

  function renderNav() {
    nav.innerHTML = data.categories.map(function(category) {
      var activeCategory = category.id === state.categoryId;
      var disabled = category.disabled || !category.blocks;
      var html = (
        '<button class="category-row' + (activeCategory ? ' active' : '') + '" data-category="' + escapeHtml(category.id) + '"' +
          (disabled ? ' disabled' : '') +
          ' style="--category-color:' + escapeHtml(category.color || '#4b2e83') + '">' +
          '<span>' + escapeHtml(category.number || '') + '</span>' +
          '<strong>' + escapeHtml(category.title) + '</strong>' +
        '</button>'
      );

      if (!activeCategory || disabled) return html;

      html += '<div class="lesson-list">';
      html += '<button class="lesson-row' + buttonClass('intro') + '" data-lesson="intro">Teoria do LED</button>';
      category.blocks.forEach(function(block, index) {
        html += (
          '<button class="lesson-row' + buttonClass('block', block.type) + '" data-lesson="block" data-item="' + escapeHtml(block.type) + '">' +
            '<span>' + (index + 1) + '.</span>' +
            '<em>' + escapeHtml(block.shortName || block.name) + '</em>' +
          '</button>'
        );
      });
      html += '<button class="lesson-row' + buttonClass('projects') + '" data-lesson="projects">Exemplos prontos</button>';
      html += '</div>';
      return html;
    }).join('');
  }

  function renderIntro(category) {
    var intro = category.intro;
    return (
      '<header class="lesson-header">' +
        '<span class="lesson-kicker">' + escapeHtml(category.number) + '. ' + escapeHtml(category.title) + '</span>' +
        '<h1>' + escapeHtml(intro.title) + '</h1>' +
        '<p>' + escapeHtml(intro.subtitle) + '</p>' +
      '</header>' +
      '<figure class="main-figure">' +
        '<img src="' + escapeHtml(intro.image) + '" alt="Imagem explicando LED RGB">' +
      '</figure>' +
      '<section class="lesson-text">' +
        intro.text.map(function(paragraph) {
          return '<p>' + escapeHtml(paragraph) + '</p>';
        }).join('') +
      '</section>' +
      '<section class="teacher-note">' +
        '<strong>Para o professor</strong>' +
        '<p>' + escapeHtml(intro.teacher) + '</p>' +
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
      '<div class="lesson-media">' +
        '<figure class="block-figure">' +
          '<img src="' + escapeHtml(block.screenshot) + '" alt="Print real do bloco ' + escapeHtml(block.name) + '">' +
          '<figcaption>O bloco como aparece na interface.</figcaption>' +
        '</figure>' +
        '<figure class="concept-figure">' +
          '<img src="' + escapeHtml(block.conceptImage) + '" alt="Imagem teorica do conceito">' +
          '<figcaption>Ideia por tras do bloco.</figcaption>' +
        '</figure>' +
      '</div>' +
      '<section class="lesson-text">' +
        '<h2>Como montar</h2>' +
        list(block.how) +
        '<h2>Experimente</h2>' +
        '<p>' + escapeHtml(block.tryIt) + '</p>' +
      '</section>' +
      '<section class="question-note">' +
        '<strong>Perguntas que podem aparecer</strong>' +
        list(block.questions) +
      '</section>' +
      '<section class="teacher-note">' +
        '<strong>Para o professor</strong>' +
        '<p>' + escapeHtml(block.teacher) + '</p>' +
      '</section>'
    );
  }

  function renderProjects(category) {
    return (
      '<header class="lesson-header">' +
        '<span class="lesson-kicker">' + escapeHtml(category.title) + '</span>' +
        '<h1>Exemplos prontos</h1>' +
        '<p>Use depois que a turma ja conheceu alguns blocos.</p>' +
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
    if (!category || category.disabled) {
      article.innerHTML = '<div class="empty-state">Esta categoria ainda vai ganhar tutorial.</div>';
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
      state.categoryId = categoryButton.getAttribute('data-category');
      state.lesson = 'intro';
      state.itemId = null;
      renderNav();
      renderArticle();
    }
  });

  renderNav();
  renderArticle();
})(window, document);
