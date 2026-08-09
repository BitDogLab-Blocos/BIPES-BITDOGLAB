'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

WorkspaceManager.PROJECT_NAMES = {
  'basico': 'projectBasic',
  'robo': 'projectRobot',
  'externos': 'projectExternalConnections',
  'estufa': 'projectGreenhouse',
  'piano': 'projectPiano'
};
WorkspaceManager.PROJECT_HARDWARE_GUIDES = {
  'estufa': {
    href: 'device-reference.html#estufa',
    pt: {
      title: 'Antes de começar o projeto Estufa',
      text: 'Confira como conectar o sensor AHT20 à BitDogLab antes de usar os blocos deste projeto.',
      link: 'Ver tutorial de hardware',
      close: 'Fechar aviso'
    },
    en: {
      title: 'Before starting the Greenhouse project',
      text: 'See how to connect the AHT20 sensor to BitDogLab before using this project\'s blocks.',
      link: 'View hardware tutorial',
      close: 'Close notice'
    }
  },
  'robo': {
    href: 'device-reference.html#robo',
    pt: {
      title: 'Antes de começar o projeto Robô móvel',
      text: 'Confira a montagem da ponte H, dos quatro motores e do MPU6050 antes de usar os blocos deste projeto.',
      link: 'Ver tutorial de hardware',
      close: 'Fechar aviso'
    },
    en: {
      title: 'Before starting the Mobile Robot project',
      text: 'Review the H-bridge, four motors, and MPU6050 assembly before using this project\'s blocks.',
      link: 'View hardware tutorial',
      close: 'Close notice'
    }
  }
};

WorkspaceManager.showProjectHardwareNotice = function(project) {
  var notice = document.getElementById('project-hardware-notice');
  var guide = WorkspaceManager.PROJECT_HARDWARE_GUIDES[project];
  if (!notice) return;

  if (!guide) {
    notice.hidden = true;
    return;
  }

  var language = ((Code && Code.LANG) || document.documentElement.lang || 'pt-br').toLowerCase();
  var copy = language.indexOf('en') === 0 ? guide.en : guide.pt;
  var title = document.getElementById('projectHardwareNoticeTitle');
  var text = document.getElementById('projectHardwareNoticeText');
  var link = document.getElementById('projectHardwareNoticeLink');
  var close = document.getElementById('closeProjectHardwareNotice');

  if (title) title.textContent = copy.title;
  if (text) text.textContent = copy.text;
  if (link) {
    link.textContent = copy.link;
    link.href = guide.href;
    link.setAttribute('data-project', project);
  }
  if (close) close.setAttribute('aria-label', copy.close);

  notice.hidden = false;
};

WorkspaceManager.initProjectSelector = function() {
  var btn = document.getElementById('projectButton');
  var modal = document.getElementById('project-modal');
  var closeBtn = document.getElementById('closeProjectModal');
  var closeHardwareNotice = document.getElementById('closeProjectHardwareNotice');
  var hardwareNotice = document.getElementById('project-hardware-notice');
  var hardwareNoticeLink = document.getElementById('projectHardwareNoticeLink');
  var cards = document.querySelectorAll('.project-card');
  if (!btn || !modal) return;

  var saved = localStorage.getItem('bitdoglab_project') || 'basico';
  btn.textContent = Code.getProjectLabel ? Code.getProjectLabel(saved) : (WorkspaceManager.PROJECT_NAMES[saved] || 'Básico');

  function highlightCard(project) {
    cards.forEach(function(card) {
      card.classList.toggle('selected', card.getAttribute('data-project') === project);
    });
  }

  btn.addEventListener('click', function() {
    highlightCard(localStorage.getItem('bitdoglab_project') || 'basico');
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var project = card.getAttribute('data-project');
      localStorage.setItem('bitdoglab_project', project);
      btn.textContent = Code.getProjectLabel ? Code.getProjectLabel(project) : (WorkspaceManager.PROJECT_NAMES[project] || project);
      Code.filterToolboxByProject(project);
      modal.style.display = 'none';
      WorkspaceManager.showProjectHardwareNotice(project);
      console.log('[BitdogLab] Projeto selecionado:', project);
    });
  });

  if (closeHardwareNotice && hardwareNotice) {
    closeHardwareNotice.addEventListener('click', function() {
      hardwareNotice.hidden = true;
    });
  }

  if (hardwareNoticeLink && hardwareNotice) {
    hardwareNoticeLink.addEventListener('click', function(event) {
      var project = hardwareNoticeLink.getAttribute('data-project');
      var deviceFrame = document.getElementById('deviceReferenceFrame');
      if (!project || !deviceFrame || typeof Code.handleLink !== 'function') return;

      event.preventDefault();
      deviceFrame.src = 'device-reference.html#' + encodeURIComponent(project);
      Code.handleLink('device', 1);
      hardwareNotice.hidden = true;
    });
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
};
