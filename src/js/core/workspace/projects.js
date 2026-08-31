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

WorkspaceManager.EXTERNAL_PROJECT_WARNING = {
  pt: {
    eyebrow: 'Antes de abrir o projeto',
    title: 'Prepare o kit de Conexões Externas',
    intro: 'Você não precisa usar tudo ao mesmo tempo. Para explorar todas as categorias, separe o componente pedido em cada atividade.',
    componentsTitle: 'Componentes externos',
    components: [
      'Módulo de LED colorido KY-016',
      'Sensor de luz LDR KY-018',
      'Sensor DHT11, preferencialmente o módulo KY-015',
      'Servo motor PWM de três fios, como o SG90',
      'Acelerômetro e giroscópio MPU6050',
      'Sensor ultrassônico HC-SR04 com suporte ao modo I2C, endereço 0x57'
    ],
    materialsTitle: 'Materiais para as conexões',
    materials: [
      'Cabos com garras jacaré',
      'Jumpers macho–fêmea',
      'Jumpers macho–macho',
      'Fita isolante para proteger partes metálicas',
      'Papel-alumínio, massinha condutiva ou outro material para Contatos'
    ],
    sensorNote: 'Atenção ao sensor de distância: o modelo esperado é o HC-SR04 na versão com suporte ao modo I2C, configurado no endereço 0x57 e ligado por SDA e SCL. O HC-SR04 convencional, usado somente com TRIG e ECHO, não funciona com estes blocos.',
    safety: 'Faça a montagem com a placa desligada e o cabo USB desconectado. Recomendamos que todas as conexões sejam feitas pelo professor ou sob a supervisão direta de alguém experiente em eletrônica. Antes de ligar, confira principalmente 3V3, 5V-VSYS e GND.',
    cancel: 'Voltar aos projetos',
    confirm: 'Entendi, abrir Conexões Externas'
  },
  en: {
    eyebrow: 'Before opening the project',
    title: 'Prepare the External Connections kit',
    intro: 'You do not need to use everything at once. To explore every category, prepare the component requested by each activity.',
    componentsTitle: 'External components',
    components: [
      'KY-016 colour LED module',
      'KY-018 LDR light sensor',
      'DHT11 sensor, preferably the KY-015 module',
      'Three-wire PWM servo motor, such as the SG90',
      'MPU6050 accelerometer and gyroscope',
      'HC-SR04 ultrasonic sensor with I2C mode support at address 0x57'
    ],
    materialsTitle: 'Connection materials',
    materials: [
      'Cables with alligator clips',
      'Male-to-female jumper wires',
      'Male-to-male jumper wires',
      'Electrical tape to cover exposed metal',
      'Aluminium foil, conductive dough, or another material for Contacts'
    ],
    sensorNote: 'Distance sensor warning: use the HC-SR04 version that supports I2C mode, configured at address 0x57 and connected through SDA and SCL. The conventional HC-SR04 used only through TRIG and ECHO does not work with these blocks.',
    safety: 'Assemble everything with the board turned off and the USB cable disconnected. All connections should be made by a teacher or under the direct supervision of someone experienced in electronics. Before powering the board, carefully check 3V3, 5V-VSYS, and GND.',
    cancel: 'Back to projects',
    confirm: 'I understand, open External Connections'
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
  var externalWarning = document.getElementById('external-project-warning');
  var cancelExternalProject = document.getElementById('cancelExternalProject');
  var confirmExternalProject = document.getElementById('confirmExternalProject');
  var cards = document.querySelectorAll('.project-card');
  if (!btn || !modal) return;

  var saved = localStorage.getItem('bitdoglab_project') || 'basico';
  btn.textContent = Code.getProjectLabel ? Code.getProjectLabel(saved) : (WorkspaceManager.PROJECT_NAMES[saved] || 'Básico');

  function highlightCard(project) {
    cards.forEach(function(card) {
      card.classList.toggle('selected', card.getAttribute('data-project') === project);
    });
  }

  function activateProject(project) {
    localStorage.setItem('bitdoglab_project', project);
    btn.textContent = Code.getProjectLabel ? Code.getProjectLabel(project) : (WorkspaceManager.PROJECT_NAMES[project] || project);
    Code.filterToolboxByProject(project);
    modal.style.display = 'none';
    WorkspaceManager.showProjectHardwareNotice(project);
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
      externalProjectMaterialsTitle: copy.materialsTitle,
      externalProjectSensorNote: copy.sensorNote,
      externalProjectSafety: copy.safety,
      cancelExternalProject: copy.cancel,
      confirmExternalProject: copy.confirm
    };
    Object.keys(fields).forEach(function(id) {
      var element = document.getElementById(id);
      if (element) element.textContent = fields[id];
    });
    fillList('externalProjectComponents', copy.components);
    fillList('externalProjectMaterials', copy.materials);
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
      activateProject(project);
    });
  });

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
