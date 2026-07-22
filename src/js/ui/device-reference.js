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
    mpuTitle: 'Accelerometer and gyroscope', mpuIntro: 'The MPU6050 may be connected to either upper I2C connector. The system checks both buses, automatically recognizes where the module is connected and works the same way on either one. Use one complete pair from the table.', mpuPin: 'MPU6050 pin', or: 'or',
    robotMaterials: 'Manual connections', robotMaterial1: '10 jumpers for H-bridge control and power', robotMaterial2: '4 jumpers for the MPU6050',
    robotMaterial3: 'Current-appropriate wire for all four motors', robotMaterial4: 'Soldered header pins if the module ships without them',
    beforePower: 'BEFORE POWER-UP', safetyTitle: 'Required review', safety1: 'Keep the board powered off throughout assembly',
    safety2: '5V only to VM; 3V3 only to logic VCC', safety3: 'All grounds connected together', safety4: 'No loose wire touching neighboring pins',
    sidebarTitle: 'Devices', sidebarIntro: 'Choose the project you want to explore or assemble.',
    menuBoardText: 'Board and integrated components', menuGreenhouseText: 'Temperature and humidity', menuRobotText: 'H-bridge, motors and MPU6050',
    sidebarNote: 'Always assemble circuits with the board powered off. Check the labels printed on each module before connecting power.',
    boardArticleIntro: 'Before adding an external project, identify what is already on the board. BitDogLab combines the RP2040 microcontroller, display, buttons, joystick, LED matrix, microphone, buzzer and power circuit on one board.',
    boardCaption: 'Click a component or its name in the image to open an explanation.',
    externalConnectionsTitle: 'Where external components connect',
    externalConnectionsText: 'Two white I2C connectors at the top are intended for sensors such as the AHT20 and MPU6050. The larger 14-pin bus at the bottom carries control, power and H-bridge signals.',
    i2cProse: 'Each connector provides SCL, SDA, 3V3 and GND. I2C0 uses SDA on GP0 and SCL on GP1. I2C1 uses SDA on GP2 and SCL on GP3. The system checks both buses and automatically recognizes where the sensor is connected. Use SDA and SCL from the same pair.',
    busProse: 'The lower connector exposes GPIO and power pins. The H-bridge uses this area. Because different signals and voltages are adjacent, always check the board silkscreen before inserting a jumper.',
    integratedTitle: 'Components already on the board', displayTerm: 'OLED display', displayDefinition: 'Displays text, sensor readings and runtime messages.',
    controlsTerm: 'Joystick and buttons', controlsDefinition: 'Provide interaction for games, menus and projects.',
    lightTerm: 'LED matrix and RGB LED', lightDefinition: 'Produce drawings, animations, colors and visual signals.',
    soundTerm: 'Microphone and buzzer', soundDefinition: 'Detect sound and produce alerts or melodies.',
    powerTerm: 'Power and monitoring', powerDefinition: 'The battery and voltage/current monitor are already integrated into BitDogLab; no extra sensor is needed for this function.',
    greenhouseTitle: 'Measuring temperature and humidity with AHT20',
    greenhouseArticleIntro: 'This project uses the AHT20 to measure air temperature and humidity. It communicates with BitDogLab over I2C and needs only four connections: power, ground, data and clock.',
    whatIsAhtTitle: 'What is the AHT20?', whatIsAhtText: 'AHT20 is a digital sensor that measures temperature and humidity in one module. Its readings can be shown on the display or used by logic blocks.',
    ahtPinsText: 'The module has VCC, GND, SDA and SCL pins. Pin order may vary by manufacturer, so follow the printed labels rather than relying only on wire order or color in a photo.',
    ahtPhotoCaption: 'AHT20 sensor used in the greenhouse project.',
    pcbRecommendationTitle: 'Recommended assembly: adapter PCB and polarized cable',
    pcbRecommendationText: 'The project uses and recommends an adapter PCB with polarized cables. The PCB organizes all four signals, and the polarized connector only fits in the correct orientation. This reduces the chance of reversing 3V3 and GND, misplacing a signal or causing a short circuit.',
    withoutPcbTitle: 'If you do not have the PCB',
    withoutPcbAhtText: 'The same connection can be made with four female-to-female Dupont jumpers. Keep BitDogLab powered off and connect each AHT20 pin to the matching signal on either upper I2C connector.',
    ahtBusChoice: 'You may connect the AHT20 to either I2C connector. The system searches both buses and recognizes the sensor automatically. If the project uses two AHT20 modules, the blocks identify I2C1 — SDA GP2 and SCL GP3 — as Sensor 1, and I2C0 — SDA GP0 and SCL GP1 — as Sensor 2. Keep SDA and SCL on the same bus for each sensor.',
    assemblyOrderTitle: 'Assembly order', ahtProcedure1: 'Power BitDogLab off and disconnect the USB cable.',
    ahtProcedure2: 'Locate VCC, GND, SDA and SCL on the AHT20.', ahtProcedure3: 'Choose one upper I2C connector and attach the four jumpers according to the table.',
    ahtProcedure4: 'Double-check 3V3 and GND before powering the board.', ahtProcedure5: 'Connect the board and test it with the temperature and humidity blocks.',
    robotTitle: 'Assembling the mobile robot',
    robotArticleIntro: 'The robot uses four DC motors, a TB6612FNG H-bridge to control them, and an MPU6050 to measure acceleration and rotation. BitDogLab is the main board and already includes the battery and electrical monitoring required by the project.',
    robotPartsTitle: 'How the assembly is organized',
    robotPartsText: 'The four motors form two groups: two on the left and two on the right. The H-bridge receives commands from BitDogLab and controls each side’s direction and speed. MPU6050 connects to an upper I2C port and provides angular-control measurements.',
    robotPowerIntegrated: 'The battery and voltage/current sensor are already on BitDogLab. They do not need to be purchased or connected as separate modules.',
    robotPcbRecommendationTitle: 'Recommended assembly: PCBs and polarized ribbon cable',
    robotPcbRecommendationText: 'In the lab assembly, adapter PCBs and the polarized 14-pin IDC ribbon cable group the connections and prevent reversed insertion. We recommend this arrangement because it is safer, cleaner and more durable for classroom use.',
    manualRobotTitle: 'Manual assembly without the PCBs',
    manualRobotText: 'If the PCBs are unavailable, use individual jumpers between the H-bridge and BitDogLab lower bus. Do not use a wire illustration as your only reference: read every pin name on the module and follow the table one row at a time.',
    motorIndependenceText: 'A DC motor has no fixed operating polarity: swapping both wires only reverses rotation. Connect the two left motors in parallel to AO1 and AO2, and the two right motors in parallel to BO1 and BO2. Keep both motors on each side oriented alike. If only one turns backward, swap that motor’s two wires.',
    robotProcedureTitle: 'Before the first test', robotProcedure1: 'Install every wire with BitDogLab powered off.',
    robotProcedure2: 'Confirm VM is on 5V, VCC is on 3V3 and all grounds are common.', robotProcedure3: 'Check all seven H-bridge control signals against the table.',
    robotProcedure4: 'Check for loose wires or terminals touching neighboring pins.', robotProcedure5: 'For the first test, raise the wheels off the surface and use a low speed.'
  };

  var boardItems = {
    'pt-br': {
      sensorConnector: {title: 'Conectores para sensores', body: 'Recebem módulos externos que usam alimentação, GPIO ou comunicação I²C, como o AHT20 e o MPU6050.'},
      expansionPort: {title: 'Porta de expansão', body: 'Disponibiliza conexões para módulos, circuitos adicionais e experiências de hardware.'},
      microphone: {title: 'Microfone', body: 'Mede a intensidade do som ambiente e permite criar projetos que respondem a palmas, ruídos ou outros eventos sonoros.'},
      display: {title: 'Display OLED', body: 'Apresenta textos, números, desenhos, menus e informações produzidas pelo programa.'},
      powerButtonMain: {title: 'Botão liga/desliga', body: 'Controla a alimentação principal da placa.'},
      powerButtonSmall: {title: 'Chave ON/OFF', body: 'Permite ligar ou desligar a alimentação da BitDogLab.'},
      joystick: {title: 'Joystick', body: 'Possui dois eixos analógicos e um botão central. Pode controlar jogos, robôs e menus.'},
      motorConnector: {title: 'Barramento inferior', body: 'Expõe GPIOs, 3V3, 5V e GND. É a região usada para conectar a ponte H do robô e outros periféricos.'},
      ledMatrix: {title: 'Matriz de LEDs', body: 'Conjunto de 25 LEDs RGB usado para desenhos, números, animações e sinais visuais.'},
      buzzer: {title: 'Buzzer', body: 'Produz bipes, alertas, notas musicais e melodias.'},
      greenButton: {title: 'Botão verde', body: 'Botão programável que pode iniciar, confirmar ou executar uma ação.'},
      redButton: {title: 'Botão vermelho', body: 'Botão programável que pode parar, cancelar ou voltar.'},
      blueButton: {title: 'Botão azul', body: 'Botão programável disponível para qualquer ação definida no projeto.'},
      interactionButton: {title: 'Botões de interação', body: 'Entradas programáveis para controlar o comportamento do projeto.'},
      rgbLed: {title: 'LED RGB', body: 'Indicador que combina vermelho, verde e azul para produzir diferentes cores.'}
    },
    'en': {
      sensorConnector: {title: 'Sensor connectors', body: 'Connect external modules that use power, GPIO or I2C communication, such as AHT20 and MPU6050.'},
      expansionPort: {title: 'Expansion port', body: 'Provides connections for modules, additional circuits and hardware experiments.'},
      microphone: {title: 'Microphone', body: 'Measures ambient sound intensity for projects that react to claps, noise or other sound events.'},
      display: {title: 'OLED display', body: 'Shows text, numbers, drawings, menus and information produced by the program.'},
      powerButtonMain: {title: 'Power button', body: 'Controls the board main power supply.'},
      powerButtonSmall: {title: 'ON/OFF switch', body: 'Switches BitDogLab power on or off.'},
      joystick: {title: 'Joystick', body: 'Provides two analog axes and a center button for games, robots and menus.'},
      motorConnector: {title: 'Lower expansion bus', body: 'Exposes GPIO, 3V3, 5V and GND. It connects the robot H-bridge and other peripherals.'},
      ledMatrix: {title: 'LED matrix', body: 'A set of 25 RGB LEDs for drawings, numbers, animations and visual signals.'},
      buzzer: {title: 'Buzzer', body: 'Produces beeps, alerts, musical notes and melodies.'},
      greenButton: {title: 'Green button', body: 'A programmable button that can start, confirm or perform an action.'},
      redButton: {title: 'Red button', body: 'A programmable button that can stop, cancel or go back.'},
      blueButton: {title: 'Blue button', body: 'A programmable button available for any project action.'},
      interactionButton: {title: 'Interaction buttons', body: 'Programmable inputs that control project behavior.'},
      rgbLed: {title: 'RGB LED', body: 'An indicator that combines red, green and blue to produce different colors.'}
    }
  };

  var boardHotspotData = [
    {x: 645, y: 8, w: 440, h: 70, item: 'sensorConnector'},
    {x: 666, y: 157, w: 130, h: 60, item: 'expansionPort'},
    {x: 975, y: 152, w: 116, h: 76, item: 'expansionPort'},
    {x: 133, y: 248, w: 314, h: 47, item: 'microphone'},
    {x: 579, y: 239, w: 94, h: 82, item: 'microphone'},
    {x: 933, y: 325, w: 267, h: 363, item: 'display'},
    {x: 1336, y: 489, w: 249, h: 42, item: 'display'},
    {x: 1341, y: 641, w: 245, h: 100, item: 'powerButtonMain'},
    {x: 1203, y: 647, w: 46, h: 46, item: 'powerButtonSmall'},
    {x: 77, y: 669, w: 269, h: 53, item: 'joystick'},
    {x: 498, y: 599, w: 251, h: 199, item: 'joystick'},
    {x: 68, y: 787, w: 330, h: 135, item: 'motorConnector'},
    {x: 585, y: 817, w: 244, h: 70, item: 'motorConnector'},
    {x: 147, y: 408, w: 307, h: 139, item: 'ledMatrix'},
    {x: 574, y: 365, w: 191, h: 214, item: 'ledMatrix'},
    {x: 1363, y: 255, w: 208, h: 49, item: 'buzzer'},
    {x: 1089, y: 236, w: 69, h: 62, item: 'buzzer'},
    {x: 1023, y: 710, w: 108, h: 91, item: 'greenButton'},
    {x: 923, y: 809, w: 112, h: 104, item: 'redButton'},
    {x: 1100, y: 814, w: 111, h: 105, item: 'blueButton'},
    {x: 1325, y: 804, w: 348, h: 97, item: 'interactionButton'},
    {x: 1050, y: 846, w: 47, h: 51, item: 'rgbLed'},
    {x: 1109, y: 959, w: 343, h: 101, item: 'rgbLed'}
  ];

  function initBoardHotspots() {
    var container = document.getElementById('boardHotspots');
    var panel = document.getElementById('boardInfoPanel');
    var title = document.getElementById('boardInfoTitle');
    var text = document.getElementById('boardInfoText');
    var close = document.getElementById('boardInfoClose');
    var items = boardItems[lang] || boardItems['pt-br'];
    if (!container || !panel || !title || !text || !close) return;

    function hideInfo() {
      panel.hidden = true;
      container.querySelectorAll('.board-hotspot').forEach(function (button) {
        button.setAttribute('aria-expanded', 'false');
      });
    }

    function showInfo(itemKey, button) {
      var item = items[itemKey];
      if (!item) return;
      title.textContent = item.title;
      text.textContent = item.body;
      panel.hidden = false;
      container.querySelectorAll('.board-hotspot').forEach(function (hotspot) {
        hotspot.setAttribute('aria-expanded', hotspot === button ? 'true' : 'false');
      });
    }

    boardHotspotData.forEach(function (hotspot) {
      var button = document.createElement('button');
      var item = items[hotspot.item];
      button.type = 'button';
      button.className = 'board-hotspot';
      button.title = item.title;
      button.setAttribute('aria-label', item.title);
      button.setAttribute('aria-expanded', 'false');
      button.style.left = (hotspot.x / 17.5) + '%';
      button.style.top = (hotspot.y / 10.8) + '%';
      button.style.width = (hotspot.w / 17.5) + '%';
      button.style.height = (hotspot.h / 10.8) + '%';
      button.addEventListener('click', function () { showInfo(hotspot.item, button); });
      container.appendChild(button);
    });

    close.textContent = lang === 'en' ? 'Close' : 'Fechar';
    close.setAttribute('aria-label', lang === 'en' ? 'Close explanation' : 'Fechar explicação');
    close.addEventListener('click', hideInfo);
  }

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
      if (activePanel) {
        if (window.matchMedia('(max-width: 860px)').matches) {
          activePanel.scrollIntoView({behavior: 'smooth', block: 'start'});
        } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    }
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { selectProject(card.dataset.project, true); });
  });

  applyLanguage();
  initBoardHotspots();
  selectProject(window.location.hash.replace('#', '') || 'bitdoglab', false);
})();
