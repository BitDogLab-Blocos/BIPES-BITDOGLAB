(function () {
  'use strict';

  var supportedLanguages = {'pt-br': true, en: true};
  var params = new URLSearchParams(window.location.search);
  var storedLanguage = null;
  var templateCache = Object.create(null);
  var selectionVersion = 0;

  try { storedLanguage = window.localStorage.getItem('bitdoglab_lang'); } catch (error) {}

  var requestedLanguage = params.get('lang');
  var lang = supportedLanguages[requestedLanguage]
    ? requestedLanguage
    : (supportedLanguages[storedLanguage] ? storedLanguage : 'pt-br');

  var shellTranslations = {
    en: {
      eyebrow: 'HARDWARE GUIDE',
      sidebarTitle: 'Devices',
      sidebarIntro: 'Choose the project you want to explore or assemble.',
      sidebarNote: 'Always assemble circuits with the board powered off. Check the labels printed on each module before connecting power.',
      loading: 'Loading tutorial…',
      loadError: 'The tutorial could not be loaded. Check its files and try again.',
      menuLabel: 'Choose a project'
    }
  };

  var menu = document.getElementById('hardwareGuideMenu');
  var content = document.getElementById('hardwareGuideContent');

  function loadScript(source) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = source + (source.indexOf('?') === -1 ? '?ver=20260722b1' : '&ver=20260722b1');
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Could not load guide module: ' + source)); };
      document.head.appendChild(script);
    });
  }

  function loadGuideModules() {
    var scripts = window.DeviceHardwareGuideScripts || [];
    return Promise.all(scripts.map(loadScript));
  }

  function applyShellLanguage() {
    document.documentElement.lang = lang;
    if (lang !== 'en') return;

    document.title = 'Devices and assembly — BitDogLab';
    document.querySelectorAll('[data-shell-copy]').forEach(function (node) {
      var value = shellTranslations.en[node.getAttribute('data-shell-copy')];
      if (value) node.textContent = value;
    });
    if (menu) menu.setAttribute('aria-label', shellTranslations.en.menuLabel);
  }

  function applyGuideLanguage(guide) {
    if (lang !== 'en') return;
    var translations = (guide.translations && guide.translations.en) || {};

    content.querySelectorAll('[data-copy]').forEach(function (node) {
      var value = translations[node.getAttribute('data-copy')];
      if (value) node.textContent = value;
    });
    content.querySelectorAll('[data-copy-alt]').forEach(function (node) {
      var value = translations[node.getAttribute('data-copy-alt')];
      if (value) node.alt = value;
    });
  }

  function setProjectStylesheet(guide) {
    var current = document.getElementById('hardwareGuideProjectStyles');
    if (!guide.stylesheet) {
      if (current) current.remove();
      return;
    }

    if (current && current.getAttribute('href') === guide.stylesheet) return;
    if (current) current.remove();

    var stylesheet = document.createElement('link');
    stylesheet.id = 'hardwareGuideProjectStyles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = guide.stylesheet;
    document.head.appendChild(stylesheet);
  }

  function renderMenu(guides) {
    menu.textContent = '';
    guides.forEach(function (guide, index) {
      var copy = guide.menu[lang] || guide.menu['pt-br'];
      var button = document.createElement('button');
      var number = document.createElement('span');
      var labels = document.createElement('span');
      var title = document.createElement('strong');
      var description = document.createElement('small');

      button.type = 'button';
      button.className = 'project-menu-item';
      button.setAttribute('data-project', guide.id);
      button.setAttribute('aria-pressed', 'false');
      number.className = 'menu-number';
      number.textContent = String(index + 1).padStart(2, '0');
      title.textContent = copy.title;
      description.textContent = copy.description;
      labels.appendChild(title);
      labels.appendChild(description);
      button.appendChild(number);
      button.appendChild(labels);
      button.addEventListener('click', function () { selectProject(guide.id, true); });
      menu.appendChild(button);
    });
  }

  function setMenuSelection(project) {
    menu.querySelectorAll('[data-project]').forEach(function (button) {
      var active = button.getAttribute('data-project') === project;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function showLoadError(error) {
    console.error('[Hardware guides]', error);
    var message = document.createElement('p');
    message.className = 'guide-error';
    message.textContent = lang === 'en'
      ? shellTranslations.en.loadError
      : 'Não foi possível carregar o tutorial. Confira os arquivos do projeto e tente novamente.';
    content.replaceChildren(message);
  }

  function fetchTemplate(guide) {
    if (templateCache[guide.id]) return Promise.resolve(templateCache[guide.id]);
    return fetch(guide.template).then(function (response) {
      if (!response.ok) throw new Error('Could not load template for "' + guide.id + '": HTTP ' + response.status);
      return response.text();
    }).then(function (html) {
      templateCache[guide.id] = html;
      return html;
    });
  }

  function selectProject(project, shouldFocus) {
    var guides = window.DeviceHardwareGuides.list();
    var guide = window.DeviceHardwareGuides.get(project) || guides[0];
    if (!guide) return;

    var currentVersion = ++selectionVersion;
    setMenuSelection(guide.id);
    setProjectStylesheet(guide);
    content.innerHTML = '<p class="guide-loading">' + (lang === 'en' ? shellTranslations.en.loading : 'Carregando tutorial…') + '</p>';

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + guide.id);
    }

    fetchTemplate(guide).then(function (html) {
      if (currentVersion !== selectionVersion) return;
      content.innerHTML = html;
      applyGuideLanguage(guide);
      if (typeof guide.init === 'function') guide.init({root: content, lang: lang});

      if (shouldFocus) {
        if (window.matchMedia('(max-width: 860px)').matches) {
          content.scrollIntoView({behavior: 'smooth', block: 'start'});
        } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    }).catch(showLoadError);
  }

  function init() {
    if (!menu || !content || !window.DeviceHardwareGuides) return;
    applyShellLanguage();

    loadGuideModules().then(function () {
      var guides = window.DeviceHardwareGuides.list();
      if (!guides.length) throw new Error('No hardware guides were registered.');
      renderMenu(guides);
      selectProject(window.location.hash.replace('#', '') || guides[0].id, false);

      window.addEventListener('hashchange', function () {
        selectProject(window.location.hash.replace('#', ''), false);
      });
    }).catch(showLoadError);
  }

  init();
})();
