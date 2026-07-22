(function () {
  'use strict';

  var supported = {'pt-br': true, 'en': true};
  var params = new URLSearchParams(window.location.search);
  var stored = null;
  try { stored = window.localStorage.getItem('bitdoglab_lang'); } catch (e) {}
  var lang = supported[params.get('lang')] ? params.get('lang') : (supported[stored] ? stored : 'pt-br');

  var english = {
    eyebrow: 'HARDWARE GUIDE', title: 'Choose what you want to build',
    intro: 'Explore the BitDogLab or follow a tutorial to assemble the greenhouse and mobile robot without the lab adapter PCBs.',
    cardBoardTitle: 'Standard BitDogLab', cardBoardText: 'Explore the board, connectors and integrated resources.',
    cardGreenhouseTitle: 'AHT20 greenhouse', cardGreenhouseText: 'Connect temperature and humidity using only four jumpers.',
    cardRobotTitle: 'Mobile robot', cardRobotText: 'Set up the H-bridge, four motors and MPU6050 without polarized cables.',
    learnMore: 'Learn more →', openTutorial: 'Open tutorial →', boardEyebrow: 'THE BOARD',
    boardTitle: 'BitDogLab V7: the starting point',
    boardIntro: 'The board combines the RP2040, user interface, display and power circuit. External projects use two main areas: the upper I2C connectors and the lower expansion bus.',
    boardImageAlt: 'BitDogLab V7 with its peripherals identified', topLabel: 'TOP EDGE', i2cTitle: 'Two I2C connectors',
    i2cText: 'They connect sensors such as the AHT20 and MPU6050. Each connector carries power and communication signals.',
    pairNote: 'Always use a complete pair. Do not mix SDA from one bus with SCL from the other.', bottomLabel: 'BOTTOM EDGE',
    busTitle: '14-pin expansion bus', busText: 'This is the larger connector used by the H-bridge and other external circuits. It exposes GPIO, 3V3, 5V and GND.',
    busWarning: 'Read the silkscreen next to the connector before inserting any jumper.', featureDisplay: 'OLED display',
    featureDisplayText: 'Shows text, data and runtime feedback.', featureInput: 'Joystick and buttons', featureInputText: 'Ready-to-use interaction and control inputs.',
    featureLight: 'Matrix and RGB LEDs', featureLightText: 'Visual outputs integrated into the board.', featurePower: 'Battery and INA226',
    featurePowerText: 'Power and voltage/current monitoring are already part of the assembly.', greenhouseEyebrow: 'GREENHOUSE PROJECT',
    greenhouseTitle: 'AHT20 without an adapter PCB', greenhouseIntro: 'The AHT20 measures temperature and humidity. Without the adapter board, make the same connection manually with four female-to-female jumpers.',
    ahtDiagramAlt: 'Educational AHT20 to BitDogLab connection diagram', diagramCaption: 'Educational overview. Before power-up, check the labels printed on your module and the table below.',
    materialsLabel: 'YOU WILL NEED', greenhouseMaterials: 'Materials', ahtMaterial1: '1 BitDogLab V7 board',
    ahtMaterial2: '1 AHT20 module with VCC, GND, SDA and SCL pins', ahtMaterial3: '4 female-to-female Dupont jumpers', ahtMaterial4: 'USB cable to program the board',
    ahtPhotoAlt: 'AHT20 module used in the project', connectionsLabel: 'CONNECTIONS', ahtTableTitle: 'AHT20 → upper I2C connector',
    ahtPin: 'AHT20 pin', boardPin: 'BitDogLab', purpose: 'Purpose', logicPower: 'Logic power', ground: 'Common ground', i2cData: 'I2C data', i2cClock: 'I2C clock',
    chooseBus: 'Choose either complete pair:', pcbTitle: 'What does the adapter PCB do?',
    pcbText: 'The PCB organizes signals in a polarized connector that only fits in the correct orientation, reducing the chance of reversed power or a short circuit. Without it, jumpers make the same electrical connection, but every wire must be checked individually.',
    ahtStep1Title: 'Power the board off', ahtStep1Text: 'Disconnect USB and switch power off before touching the wires.',
    ahtStep2Title: 'Read the labels', ahtStep2Text: 'Check VCC, GND, SDA and SCL on your AHT20; physical order can vary by manufacturer.',
    ahtStep3Title: 'Connect four jumpers', ahtStep3Text: 'Use only one upper I2C connector and follow the table.',
    ahtStep4Title: 'Review and power on', ahtStep4Text: 'Double-check 3V3 and GND, then power on and use the temperature and humidity blocks.',
    robotEyebrow: 'MOBILE ROBOT PROJECT', robotTitle: 'Robot with H-bridge and MPU6050',
    robotIntro: 'There is no wire drawing here: use the photos to identify parts and the tables as the connection reference.',
    robotMountedAlt: 'Assembled mobile robot with BitDogLab installed', robotMountedCaption: 'Assembled unit: main board over the chassis.',
    robotElectronicsAlt: 'H-bridge and MPU6050 installed on the chassis', robotElectronicsCaption: 'Underside: H-bridge and MPU6050 with the lab adapter PCBs.',
    robotChassisAlt: 'Chassis with four motors, H-bridge and MPU6050', robotChassisCaption: 'The PCBs make assembly easier, but are not required.',
    robotPcbTitle: 'Without PCB or ribbon cable', robotPcbText: 'In the lab, PCBs and the 14-pin IDC cable group and polarize the connections. For manual assembly, replace them with individual jumpers from the lower bus to the H-bridge, checking one pin at a time.',
    driverLabel: 'H-BRIDGE — CONTROL AND POWER', driverPin: 'TB6612FNG pin', motorPower: 'Motor power from the board',
    leftDirection1: 'Channel A direction — input 1', leftDirection2: 'Channel A direction — input 2', leftSpeed: 'Channel A speed',
    rightDirection1: 'Channel B direction — input 1', rightDirection2: 'Channel B direction — input 2', rightSpeed: 'Channel B speed', standby: 'Enables the H-bridge',
    powerNote: 'The battery and INA226 are already integrated into the BitDogLab. Do not add another INA226 or connect an external battery directly to GPIO or 3V3.',
    motorsLabel: 'MOTORS — NO FIXED POLARITY', motorsTitle: 'H-bridge outputs', driverOutput: 'Output', motorGroup: 'Motor group', howConnect: 'Connection',
    leftMotors: '2 left-side motors', rightMotors: '2 right-side motors', parallel: 'In parallel',
    motorIndependenceTitle: 'A DC motor does not depend on a fixed two-wire orientation.',
    motorIndependenceText: 'Swapping both wires only reverses rotation. Keep both motors on the same side oriented alike. If only one runs backward, swap that motor’s two wires. If a whole side runs backward, swap the corresponding AO1/AO2 or BO1/BO2 pair.',
    motorWireWarning: 'Use heavier, insulated wire for motors and power. Dupont jumpers are intended for control signals.',
    mpuTitle: 'Accelerometer and gyroscope', mpuIntro: 'The MPU6050 may use either upper I2C connector. As with the AHT20, choose one complete pair.', mpuPin: 'MPU6050 pin', or: 'or',
    robotMaterials: 'Manual connections', robotMaterial1: '10 jumpers for H-bridge control and power', robotMaterial2: '4 jumpers for the MPU6050',
    robotMaterial3: 'Current-appropriate wire for all four motors', robotMaterial4: 'Soldered header pins if the module ships without them',
    beforePower: 'BEFORE POWER-UP', safetyTitle: 'Required review', safety1: 'Keep the board powered off throughout assembly',
    safety2: '5V only to VM; 3V3 only to logic VCC', safety3: 'All grounds connected together', safety4: 'No loose wire touching neighboring pins'
  };

  function applyLanguage() {
    document.documentElement.lang = lang;
    if (lang !== 'en') return;
    document.title = 'Devices and assembly — BitDogLab';
    document.querySelectorAll('[data-copy]').forEach(function (node) {
      var value = english[node.getAttribute('data-copy')];
      if (value) node.textContent = value;
    });
    document.querySelectorAll('[data-copy-alt]').forEach(function (node) {
      var value = english[node.getAttribute('data-copy-alt')];
      if (value) node.alt = value;
    });
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));

  function selectProject(project, shouldFocus) {
    var exists = panels.some(function (panel) { return panel.dataset.panel === project; });
    if (!exists) project = 'bitdoglab';
    cards.forEach(function (card) {
      var active = card.dataset.project === project;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var active = panel.dataset.panel === project;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + project);
    }
    if (shouldFocus) {
      var activePanel = document.querySelector('[data-panel="' + project + '"]');
      if (activePanel) activePanel.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { selectProject(card.dataset.project, true); });
  });

  applyLanguage();
  selectProject(window.location.hash.replace('#', '') || 'bitdoglab', false);
})();
