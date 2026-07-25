(function (registry) {
  'use strict';

  var boardItems = {
    'pt-br': {
      sensorConnector: {title: 'Conectores I²C', body: 'I²C é um tipo de comunicação com componentes externos. SDA transmite os dados e SCL sincroniza a comunicação.'},
      expansionPort: {title: 'Porta de expansão', body: 'É um conjunto de conexões usado para fornecer alimentação e trocar sinais com componentes externos.'},
      microphone: {title: 'Microfone', body: 'Mede a intensidade do som ambiente e permite criar projetos que respondem a palmas, ruídos ou outros eventos sonoros.'},
      display: {title: 'Display OLED', body: 'Apresenta textos, números, desenhos, menus e informações produzidas pelo programa.'},
      powerButtonMain: {title: 'Botão liga/desliga', body: 'Controla a alimentação principal da placa.'},
      powerButtonSmall: {title: 'Chave ON/OFF', body: 'Permite ligar ou desligar a alimentação da BitDogLab.'},
      joystick: {title: 'Joystick', body: 'Percebe movimentos para os lados, para cima e para baixo. Também possui um botão central que pode ser pressionado.'},
      motorConnector: {title: 'Barramento de expansão', body: 'É um conjunto de pinos usado para fornecer alimentação e sinais de controle a componentes externos.'},
      ledMatrix: {title: 'Matriz de LEDs', body: 'Conjunto de 25 LEDs RGB usado para desenhos, números, animações e sinais visuais.'},
      buzzer: {title: 'Buzzer', body: 'Produz bipes, alertas, notas musicais e melodias.'},
      greenButton: {title: 'Botão verde', body: 'Botão programável que pode iniciar, confirmar ou executar uma ação.'},
      redButton: {title: 'Botão vermelho', body: 'Botão programável que pode parar, cancelar ou voltar.'},
      blueButton: {title: 'Botão azul', body: 'Botão programável disponível para qualquer ação definida no projeto.'},
      interactionButton: {title: 'Botões de interação', body: 'Entradas programáveis para controlar o comportamento do projeto.'},
      rgbLed: {title: 'LED RGB', body: 'Indicador que combina vermelho, verde e azul para produzir diferentes cores.'}
    },
    en: {
      sensorConnector: {title: 'I2C connectors', body: 'I2C is a communication method for external components. SDA carries data, and SCL synchronizes communication.'},
      expansionPort: {title: 'Expansion port', body: 'A group of connections used to provide a power supply and exchange signals with external components.'},
      microphone: {title: 'Microphone', body: 'Measures ambient sound intensity for projects that react to claps, noise or other sound events.'},
      display: {title: 'OLED display', body: 'Shows text, numbers, drawings, menus and information produced by the program.'},
      powerButtonMain: {title: 'Power button', body: 'Controls the board main power supply.'},
      powerButtonSmall: {title: 'ON/OFF switch', body: 'Switches BitDogLab power on or off.'},
      joystick: {title: 'Joystick', body: 'Detects movement left, right, up and down. It also has a center button that can be pressed.'},
      motorConnector: {title: 'Expansion bus', body: 'A group of pins used to provide a power supply and control signals to external components.'},
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
        boardTitle: 'First steps with BitDogLab V7',
        boardArticleIntro: 'Before assembling a project, learn the parts of the board. BitDogLab already has the main components used in the activities: screen, buttons, joystick, lights, microphone and buzzer. The RP2040 runs the program and controls all these parts.',
        firstContactTitle: 'Start here',
        firstContact1: 'Keep the board powered off and disconnect the USB cable.',
        firstContact2: 'Place BitDogLab on a dry table with its components facing up.',
        firstContact3: 'Look at the image below. Click each marked area to learn the component name and purpose.',
        firstContact4: 'Locate the I2C connectors at the top and the expansion bus at the bottom. They will be used in the next assemblies.',
        boardImageAlt: 'BitDogLab V7 with its components identified',
        boardCaption: 'Click a component or its name to discover what it does.',
        externalConnectionsTitle: 'Where to connect external components',
        externalConnectionsText: 'The board has two main areas for connecting external components: the I2C connectors at the top and the expansion bus at the bottom.',
        i2cTitle: 'Upper I2C connectors',
        i2cProse: 'I2C is a communication method used by BitDogLab to exchange information with external components. Each connector has four pins: 3V3 provides the 3.3-volt supply for the component; GND is the electrical reference and circuit return; SDA carries data; and SCL synchronizes communication. Always use all four pins from the same connector.',
        busTitle: 'Lower expansion bus',
        busProse: 'A bus is a group of connection pins. The lower bus provides a power supply and control signals to external components. These signals control how the component operates. Because each pin has a specific purpose, read its printed label before connecting a wire.',
        connectionWarning: 'Warning: do not select a pin by its position or wire color. Always match the component label to the BitDogLab label.',
        integratedTitle: 'What is already on the board',
        displayTerm: 'OLED display (screen)', displayDefinition: 'Shows text, numbers, drawings and program messages.',
        controlsTerm: 'Joystick and buttons', controlsDefinition: 'Provide interaction for games, menus and projects.',
        lightTerm: 'LED matrix and RGB LED', lightDefinition: 'Produce drawings, animations, colors and visual signals.',
        soundTerm: 'Microphone and buzzer', soundDefinition: 'The microphone detects sounds. The buzzer produces beeps, alerts and musical notes.',
        powerTerm: 'Battery and monitoring', powerDefinition: 'The battery powers the board. BitDogLab also measures voltage and electric current to monitor the power-supply conditions and circuit consumption.'
      }
    },
    init: initBoard
  });
})(window.DeviceHardwareGuides);
