(function (registry) {
  'use strict';

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
    en: {
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

  var hotspots = [
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

  function initBoard(context) {
    var root = context.root;
    var items = boardItems[context.lang] || boardItems['pt-br'];
    var container = root.querySelector('#boardHotspots');
    var panel = root.querySelector('#boardInfoPanel');
    var title = root.querySelector('#boardInfoTitle');
    var text = root.querySelector('#boardInfoText');
    var close = root.querySelector('#boardInfoClose');
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

    hotspots.forEach(function (hotspot) {
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

    close.textContent = context.lang === 'en' ? 'Close' : 'Fechar';
    close.setAttribute('aria-label', context.lang === 'en' ? 'Close explanation' : 'Fechar explicação');
    close.addEventListener('click', hideInfo);
  }

  registry.register({
    id: 'bitdoglab',
    order: 1,
    template: '../hardware-guides/bitdoglab/tutorial.html',
    menu: {
      'pt-br': {title: 'BitDogLab padrão', description: 'Placa e componentes integrados'},
      en: {title: 'Standard BitDogLab', description: 'Board and integrated components'}
    },
    translations: {
      en: {
        boardEyebrow: 'STANDARD BITDOGLAB',
        boardTitle: 'Meet the BitDogLab V7 board',
        boardArticleIntro: 'Before adding an external project, identify what is already on the board. BitDogLab combines the RP2040 microcontroller, display, buttons, joystick, LED matrix, microphone, buzzer and power circuit on one board.',
        boardImageAlt: 'BitDogLab V7 with its components identified',
        boardCaption: 'Click a component or its name in the image to open an explanation.',
        externalConnectionsTitle: 'Where external components connect',
        externalConnectionsText: 'Two white I2C connectors at the top are intended for sensors such as the AHT20 and MPU6050. The larger 14-pin bus at the bottom carries control, power and H-bridge signals.',
        i2cTitle: 'Upper I2C connectors',
        i2cProse: 'Each connector provides SCL, SDA, 3V3 and GND. I2C0 uses SDA on GP0 and SCL on GP1. I2C1 uses SDA on GP2 and SCL on GP3. The system checks both buses and automatically recognizes where the sensor is connected. Use SDA and SCL from the same pair.',
        busTitle: 'Lower expansion bus',
        busProse: 'The lower connector exposes GPIO and power pins. The H-bridge uses this area. Because different signals and voltages are adjacent, always check the board silkscreen before inserting a jumper.',
        integratedTitle: 'Components already on the board',
        displayTerm: 'OLED display', displayDefinition: 'Displays text, sensor readings and runtime messages.',
        controlsTerm: 'Joystick and buttons', controlsDefinition: 'Provide interaction for games, menus and projects.',
        lightTerm: 'LED matrix and RGB LED', lightDefinition: 'Produce drawings, animations, colors and visual signals.',
        soundTerm: 'Microphone and buzzer', soundDefinition: 'Detect sound and produce alerts or melodies.',
        powerTerm: 'Power and monitoring', powerDefinition: 'The battery and voltage/current monitor are already integrated into BitDogLab; no extra sensor is needed for this function.'
      }
    },
    init: initBoard
  });
})(window.DeviceHardwareGuides);
