'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

WorkspaceManager.PROJECT_NAMES = {
  'basico': 'projectBasic',
  'robo': 'projectRobot',
  'robo_setas': 'projectRobotArrows',
  'externos': 'projectExternalConnections',
  'estufa': 'projectGreenhouse',
  'piano': 'projectPiano'
};

WorkspaceManager.EXTERNAL_PROJECT_WARNING = {
  pt: {
    eyebrow: 'Antes de abrir o projeto',
    title: 'Laboratório de Sensores',
    intro: 'Confira a placa e separe os componentes necessários:',
    imageAlt: 'Placa PCB de Conexões Externas montada com sensores e componentes',
    componentsTitle: 'Componentes',
    components: [
      'LED RGB',
      'Sensor ultrassônico HC-SR04 I2C',
      'LDR',
      'MPU6050',
      'Servo motor',
      'DHT11',
      '2 resistores de 10 kΩ',
      '3 resistores de 220 Ω',
      'Cabos com garras jacaré'
    ],
    safety: 'Peça ajuda ao seu orientador para soldar a placa. Faça as conexões com a placa desligada.',
    cancel: 'Voltar aos projetos',
    confirm: 'Entendi, abrir o laboratório'
  },
  en: {
    eyebrow: 'Before opening the project',
    title: 'Sensors and Actuators Lab',
    intro: 'Check the board and gather the required components:',
    imageAlt: 'External Connections PCB assembled with sensors and components',
    componentsTitle: 'Components',
    components: [
      'RGB LED',
      'HC-SR04 I2C ultrasonic sensor',
      'LDR',
      'MPU6050',
      'Servo motor',
      'DHT11',
      '2 10 kΩ resistors',
      '3 220 Ω resistors',
      'Alligator clip cables'
    ],
    safety: 'Ask your advisor to help solder the board. Make connections while it is turned off.',
    cancel: 'Back to projects',
    confirm: 'I understand, open the lab'
  }
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

WorkspaceManager.PROJECT_HARDWARE_GUIDES.robo_setas = WorkspaceManager.PROJECT_HARDWARE_GUIDES.robo;

WorkspaceManager.updateRobotLedLegend = function(project) {
  var legend = document.getElementById('robotLedLegend');
  if (!legend) return;
  legend.hidden = project !== 'robo' && project !== 'robo_setas';
  var notices = document.getElementById('robotWorkspaceNotices');
  if (notices) notices.hidden = legend.hidden;
  legend.setAttribute('data-board-version', BitdogLabConfig.VERSION);
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

WorkspaceManager.selectProject = function(project) {
  if (!Object.prototype.hasOwnProperty.call(WorkspaceManager.PROJECT_NAMES, project)) return false;
  var changed = localStorage.getItem('bitdoglab_project') !== project;
  localStorage.setItem('bitdoglab_project', project);
  var button = document.getElementById('projectButton');
  if (button) {
    button.textContent = Code.getProjectLabel ? Code.getProjectLabel(project) : WorkspaceManager.PROJECT_NAMES[project];
  }
  if (WorkspaceManager._toolboxProject !== project ||
      (project === 'robo_setas' && WorkspaceManager.arrowCategoriesExpanded)) {
    Code.filterToolboxByProject(project);
  }
  if (changed) WorkspaceManager.showProjectHardwareNotice(project);
  if (WorkspaceManager.refreshExternalInfo) WorkspaceManager.refreshExternalInfo();
  return true;
};

WorkspaceManager.initProjectSelector = function() {
  var btn = document.getElementById('projectButton');
  var modal = document.getElementById('project-modal');
  var closeBtn = document.getElementById('closeProjectModal');
  var closeHardwareNotice = document.getElementById('closeProjectHardwareNotice');
  var hardwareNotice = document.getElementById('project-hardware-notice');
  var hardwareNoticeLink = document.getElementById('projectHardwareNoticeLink');
  var externalWarning = document.getElementById('external-project-warning');
  var cancelExternalProject = document.getElementById('cancelExternalProject');
  var confirmExternalProject = document.getElementById('confirmExternalProject');
  var robotModeSelector = document.getElementById('robot-mode-selector');
  var closeRobotModeSelector = document.getElementById('closeRobotModeSelector');
  var selectCompleteRobotMode = document.getElementById('selectCompleteRobotMode');
  var selectArrowRobotMode = document.getElementById('selectArrowRobotMode');
  var arrowModeIntro = document.getElementById('arrow-mode-intro');
  var startArrowMode = document.getElementById('startArrowMode');
  var cards = document.querySelectorAll('.project-card');
  if (!btn || !modal) return;

  var saved = localStorage.getItem('bitdoglab_project') || 'basico';
  btn.textContent = Code.getProjectLabel ? Code.getProjectLabel(saved) : (WorkspaceManager.PROJECT_NAMES[saved] || 'Básico');

  function highlightCard(project) {
    var highlightedProject = project === 'robo_setas' ? 'robo' : project;
    cards.forEach(function(card) {
      card.classList.toggle('selected', card.getAttribute('data-project') === highlightedProject);
    });
  }

  function activateProject(project) {
    WorkspaceManager.selectProject(project);
    modal.style.display = 'none';
    console.log('[BitdogLab] Projeto selecionado:', project);
  }

  function warningCopy() {
    var language = ((Code && Code.LANG) || document.documentElement.lang || 'pt-br').toLowerCase();
    return language.indexOf('en') === 0
      ? WorkspaceManager.EXTERNAL_PROJECT_WARNING.en
      : WorkspaceManager.EXTERNAL_PROJECT_WARNING.pt;
  }

  function fillList(elementId, items) {
    var list = document.getElementById(elementId);
    if (!list) return;
    list.replaceChildren();
    items.forEach(function(item) {
      var entry = document.createElement('li');
      entry.textContent = item;
      list.appendChild(entry);
    });
  }

  function renderExternalWarning() {
    var copy = warningCopy();
    var fields = {
      externalProjectWarningEyebrow: copy.eyebrow,
      externalProjectWarningTitle: copy.title,
      externalProjectWarningIntro: copy.intro,
      externalProjectComponentsTitle: copy.componentsTitle,
      externalProjectSafety: copy.safety,
      cancelExternalProject: copy.cancel,
      confirmExternalProject: copy.confirm
    };
    Object.keys(fields).forEach(function(id) {
      var element = document.getElementById(id);
      if (element) element.textContent = fields[id];
    });
    var image = document.getElementById('externalProjectWarningImage');
    if (image) image.alt = copy.imageAlt;
    fillList('externalProjectComponents', copy.components);
  }

  function openExternalWarning() {
    if (!externalWarning) {
      activateProject('externos');
      return;
    }
    renderExternalWarning();
    modal.style.display = 'none';
    externalWarning.hidden = false;
    document.body.classList.add('bitdoglab-external-project-warning-open');
    if (confirmExternalProject) confirmExternalProject.focus();
  }

  function closeExternalWarning() {
    if (externalWarning) externalWarning.hidden = true;
    document.body.classList.remove('bitdoglab-external-project-warning-open');
  }

  function openRobotModeSelector() {
    if (!robotModeSelector) {
      activateProject('robo');
      return;
    }
    modal.style.display = 'none';
    robotModeSelector.hidden = false;
    document.body.classList.add('bitdoglab-robot-mode-selector-open');
    if (selectCompleteRobotMode) selectCompleteRobotMode.focus();
  }

  function closeRobotModeSelection(showProjects) {
    if (robotModeSelector) robotModeSelector.hidden = true;
    document.body.classList.remove('bitdoglab-robot-mode-selector-open');
    if (showProjects) {
      highlightCard(localStorage.getItem('bitdoglab_project') || 'basico');
      modal.style.display = 'flex';
    }
  }

  function openArrowModeIntro() {
    if (!arrowModeIntro) return;
    arrowModeIntro.hidden = false;
    document.body.classList.add('bitdoglab-arrow-mode-intro-open');
    if (startArrowMode) startArrowMode.focus();
  }

  function closeArrowModeIntro() {
    if (arrowModeIntro) arrowModeIntro.hidden = true;
    document.body.classList.remove('bitdoglab-arrow-mode-intro-open');
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
      if (project === 'externos') {
        openExternalWarning();
        return;
      }
      if (project === 'robo') {
        openRobotModeSelector();
        return;
      }
      activateProject(project);
    });
  });

  if (closeRobotModeSelector) {
    closeRobotModeSelector.addEventListener('click', function() {
      closeRobotModeSelection(true);
    });
  }

  if (selectCompleteRobotMode) {
    selectCompleteRobotMode.addEventListener('click', function() {
      closeRobotModeSelection(false);
      activateProject('robo');
    });
  }

  if (selectArrowRobotMode) {
    selectArrowRobotMode.addEventListener('click', function() {
      closeRobotModeSelection(false);
      activateProject('robo_setas');
      openArrowModeIntro();
    });
  }

  if (startArrowMode) {
    startArrowMode.addEventListener('click', closeArrowModeIntro);
  }

  if (arrowModeIntro) {
    arrowModeIntro.addEventListener('click', function(event) {
      if (event.target === arrowModeIntro) closeArrowModeIntro();
    });
  }

  if (robotModeSelector) {
    robotModeSelector.addEventListener('click', function(event) {
      if (event.target === robotModeSelector) closeRobotModeSelection(true);
    });
  }

  if (cancelExternalProject) {
    cancelExternalProject.addEventListener('click', function() {
      closeExternalWarning();
      highlightCard(localStorage.getItem('bitdoglab_project') || 'basico');
      modal.style.display = 'flex';
    });
  }

  if (confirmExternalProject) {
    confirmExternalProject.addEventListener('click', function() {
      closeExternalWarning();
      activateProject('externos');
    });
  }

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
