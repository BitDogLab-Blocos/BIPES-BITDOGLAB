'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

WorkspaceManager.ensureReminderStyle = function() {
  if (document.getElementById('runtime-reminder-style')) return;
  var style = document.createElement('style');
  style.id = 'runtime-reminder-style';
  style.textContent = '@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
  document.head.appendChild(style);
};

WorkspaceManager.createReminder = function(options) {
  if (document.getElementById(options.id)) {
    return;
  }

  WorkspaceManager.ensureReminderStyle();

  var notification = document.createElement('div');
  notification.id = options.id;
  notification.style.cssText = [
    'position: fixed',
    'top: 20px',
    'right: 20px',
    'background: ' + options.background,
    'color: white',
    'padding: 18px 45px 18px 20px',
    'border-radius: 8px',
    'box-shadow: 0 4px 12px rgba(0,0,0,0.3)',
    'z-index: 10000',
    'max-width: ' + (options.maxWidth || '450px'),
    'font-family: Arial, sans-serif',
    'font-size: 14px',
    'line-height: 1.6',
    'animation: slideIn 0.3s ease-out'
  ].join('; ');
  notification.innerHTML = options.html;

  if (Code.localizeRuntimePanel) {
    Code.localizeRuntimePanel(notification);
  }
  document.body.appendChild(notification);

  var closeBtn = document.getElementById(options.closeId);
  closeBtn.addEventListener('click', function() {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(function() {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  });
  closeBtn.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(0,0,0,0.4)';
  });
  closeBtn.addEventListener('mouseleave', function() {
    this.style.background = 'rgba(0,0,0,0.2)';
  });
};

WorkspaceManager.closeButton = function(id) {
  return '<button id="' + id + '" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.2); border: none; color: white; font-size: 20px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>';
};

WorkspaceManager.localizeRuntimePanel = function(element) {
  if (Code.translateDom) {
    Code.translateDom(element);
  }
};

WorkspaceManager.showJoystickGetterReminder = function(blockType) {
  var closeId = 'closeJoystickNotification';
  var nomeBloco = blockType === 'joystick_intensidade_atual'
    ? '🕹️ Intensidade LED %'
    : '🕹️ Frequência Buzzer Hz';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🕹️ This block <strong>does nothing on its own!</strong><br><br>' +
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display block to visualize the value on-screen.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🕹️ Joystick-Controlled LED <small>(or buzzer)</small><br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[' + nomeBloco + ']</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🕹️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver o número na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🕹️ Joystick controla LED <small>(ou Buzzer)</small><br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[' + nomeBloco + ']</strong> linha 1<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'joystickGetterNotification',
    closeId: closeId,
    background: '#1565c0',
    html: html
  });
};

WorkspaceManager.showServoAngleReminder = function() {
  var closeId = 'closeServoAngleNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 How to use the current servo angle</strong><br><br>' +
      '📐 This value block needs a block that <strong>moves the servo</strong>.<br><br>' +
      'Use <strong>Move servo</strong>, <strong>Joystick controls servo</strong>, <strong>Raise servo</strong>, or <strong>Lower servo</strong> with the <strong>same Connection</strong>.<br><br>' +
      'The value is the <strong>last angle commanded by the program</strong>; a regular servo does not measure its physical position.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ Raise servo on Connection 0<br>' +
      '2️⃣ Show value: <strong>[Current servo angle on Connection 0]</strong><br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 Como usar o ângulo atual do servo</strong><br><br>' +
      '📐 Este bloco de valor precisa de um bloco que <strong>mova o servo</strong>.<br><br>' +
      'Use <strong>Mover servo</strong>, <strong>Joystick controla servo</strong>, <strong>Subir servo</strong> ou <strong>Descer servo</strong> com a <strong>mesma Conexão</strong>.<br><br>' +
      'O valor representa o <strong>último ângulo enviado pelo programa</strong>; um servo comum não mede sua posição física.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ Subir servo na Conexão 0<br>' +
      '2️⃣ Mostrar valor: <strong>[Ângulo atual do servo na Conexão 0]</strong><br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'servoAngleNotification',
    closeId: closeId,
    background: '#00897b',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showJoystickSeletorReminder = function() {
  var closeId = 'closeJoystickSeletorNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 How to use: Switch LED matrix emojis</strong><br><br>' +
      '🕹️ Place <strong>emoji</strong> blocks inside this container.<br>' +
      'Use the joystick to <strong>switch between them</strong>.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 4px;">' +
      '<strong>📝 Example:</strong><br>' +
      '🕹️ Switch LED Matrix Emoji<br>' +
      '&nbsp;&nbsp;&nbsp;😊 Show Emoji: <strong>heart</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Show Emoji: <strong>happy face</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Show Emoji: <strong>arrow</strong><br><br>' +
      '⚠️ <strong>The order you place them in defines the selection order.</strong><br>' +
      'Joystick → next emoji &nbsp;|&nbsp; ← previous emoji' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 Como usar: Trocar emoji na Matriz de LED</strong><br><br>' +
      '🕹️ Encaixe blocos de <strong>emoji</strong> dentro deste bloco.<br>' +
      'Use o joystick para <strong>trocar entre eles</strong>!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 4px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '🕹️ Trocar emoji na Matriz de LED<br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>coração</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>carinha feliz</strong><br>' +
      '&nbsp;&nbsp;&nbsp;😊 Mostrar emoji: <strong>seta</strong><br><br>' +
      '⚠️ <strong>A ordem que você colocar é a ordem de troca!</strong><br>' +
      'Joystick → próximo emoji &nbsp;|&nbsp; ← anterior' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'joystickSeletorNotification',
    closeId: closeId,
    background: '#1565c0',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showMicGetterReminder = function() {
  var closeId = 'closeMicGetterNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🎙️ This block <strong>does nothing on its own!</strong><br><br>' +
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display block to inspect the measured value.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🎙️ LED matrix sound-level meter<br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[🎙️ Sound Level]</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🎙️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver o número na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🎙️ Acender matriz de LEDs com barulho<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🎙️ Nível do som]</strong> linha 1<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'micGetterNotification',
    closeId: closeId,
    background: '#e74c3c',
    html: html
  });
};

WorkspaceManager.showBarraGetterReminder = function() {
  var closeId = 'closeBarraGetterNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🖥️ This block <strong>does nothing on its own!</strong><br><br>' +
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display block to inspect the percentage value.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🖥️ OLED sound level meter  line: 3<br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[🎙️ Sound Intensity (%)]</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🖥️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver a porcentagem na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🖥️ Medidor de barulho no Display  linha: 3<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🎙️ Intensidade do barulho (%)]</strong> linha 1<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'barraGetterNotification',
    closeId: closeId,
    background: '#e74c3c',
    html: html
  });
};

WorkspaceManager.showPalmasGetterReminder = function() {
  var closeId = 'closePalmasGetterNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🖐️ This block <strong>does nothing on its own!</strong><br><br>' +
      '📊 Use it inside <strong>"Show Numeric Value"</strong> to display the count, or inside conditions such as <strong>"if total claps = 3"</strong>.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🖐️ Clap Counter  sensitivity: medium  line: 1<br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[🖐️ Total Claps]</strong> line 2<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🖐️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Use-o no bloco <strong>"Mostrar valor"</strong> para ver o número, ou em condições como <strong>"se total de palmas = 3"</strong>.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🖐️ Contar palmas  sensibilidade: média  linha: 1<br>' +
      '2️⃣ 📊 Mostrar valor: <strong>[🖐️ Total de palmas]</strong> linha 2<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'palmasGetterNotification',
    closeId: closeId,
    background: '#e74c3c',
    html: html
  });
};

WorkspaceManager.showSensorReminder = function(blockType) {
  var closeId = 'closeSensorGetterNotification';
  var nomeBloco = Code.LANG === 'en'
    ? (blockType === 'sensor_temperatura' ? '🌡️ Temperature (°C)' : '💧 Humidity (%)')
    : (blockType === 'sensor_temperatura' ? '🌡️ Temperatura (°C)' : '💧 Umidade (%)');
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🌡️ This block <strong>does nothing on its own!</strong><br><br>' +
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display block to inspect the reading.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 📊 Show Numeric Value: <strong>[' + nomeBloco + ']</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🌡️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED para ver o número na tela!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 📊 Mostrar valor: <strong>[' + nomeBloco + ']</strong> linha 1<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'sensorGetterNotification',
    closeId: closeId,
    background: '#16a085',
    html: html
  });
};

WorkspaceManager.showRobotRotationReminder = function() {
  var closeId = 'closeRobotRotationNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🧭 This block <strong>does nothing on its own!</strong><br><br>' +
      '🤖 Use <strong>Initialize robot</strong> before reading this value, including inside a button action.<br><br>' +
      '🧮 Use it inside <strong>Mathematics</strong>, <strong>if</strong> blocks, and comparisons to make decisions from the robot rotation.<br><br>' +
      '📊 To show it on the display, use the ready-made <strong>Show Numeric Value + Robot rotation</strong> example in this category.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Examples:</strong><br>' +
      '1️⃣ If <strong>[🧭 Robot rotation] &gt; 45</strong>, turn on an LED<br>' +
      '2️⃣ Compare <strong>[🧭 Robot rotation]</strong> with 90 to know if the turn is complete<br>' +
      '3️⃣ Use <strong>[🧭 Robot rotation] + 10</strong> in a Mathematics block<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🧭 Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '🤖 Use <strong>Inicializar robô</strong> antes de ler este valor, inclusive dentro da ação de um botão.<br><br>' +
      '🧮 Use dentro de blocos de <strong>Matemática</strong>, <strong>se</strong> e comparações para tomar decisões pelo giro do robô.<br><br>' +
      '📊 Para mostrar no display, use o exemplo pronto <strong>Mostrar valor + Giro do robô</strong> desta categoria.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplos:</strong><br>' +
      '1️⃣ Se <strong>[🧭 Giro do robô] &gt; 45</strong>, acender um LED<br>' +
      '2️⃣ Comparar <strong>[🧭 Giro do robô]</strong> com 90 para saber se terminou o giro<br>' +
      '3️⃣ Usar <strong>[🧭 Giro do robô] + 10</strong> em um bloco de Matemática<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'robotRotationNotification',
    closeId: closeId,
    background: '#8e44ad',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showRobotAccelerationReminder = function(blockType) {
  var closeId = 'closeRobotAccelerationNotification';
  var isY = blockType === 'robo_aceleracao_y';
  var isZ = blockType === 'robo_aceleracao_z';
  var nomeBloco = Code.LANG === 'en'
    ? (isZ ? '⬆️ Acceleration Z' : (isY ? '↕️ Acceleration Y' : '↔️ Acceleration X'))
    : (isZ ? '⬆️ Aceleração Z' : (isY ? '↕️ Aceleração Y' : '↔️ Aceleração X'));
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '↔️ This block <strong>does nothing on its own!</strong><br><br>' +
      '🤖 Use <strong>Initialize robot</strong> before reading this value, including inside a button action.<br><br>' +
      '🧮 Use it inside <strong>Mathematics</strong>, <strong>if</strong> blocks, and comparisons to make decisions from the robot movement or tilt.<br><br>' +
      '📊 To show it on the display, use the ready-made <strong>Show Numeric Value + Acceleration X</strong> example in this category.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Examples:</strong><br>' +
      '1️⃣ If <strong>[' + nomeBloco + '] &gt; 0.5</strong>, turn on an LED<br>' +
      '2️⃣ Compare <strong>[' + nomeBloco + ']</strong> with 0 to discover the direction of the tilt<br>' +
      '3️⃣ Use <strong>[' + nomeBloco + '] * 10</strong> in a Mathematics block<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '↔️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '🤖 Use <strong>Inicializar robô</strong> antes de ler este valor, inclusive dentro da ação de um botão.<br><br>' +
      '🧮 Use dentro de blocos de <strong>Matemática</strong>, <strong>se</strong> e comparações para tomar decisões pelo movimento ou inclinação do robô.<br><br>' +
      '📊 Para mostrar no display, use o exemplo pronto <strong>Mostrar valor + Aceleração X</strong> desta categoria.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplos:</strong><br>' +
      '1️⃣ Se <strong>[' + nomeBloco + '] &gt; 0.5</strong>, acender um LED<br>' +
      '2️⃣ Comparar <strong>[' + nomeBloco + ']</strong> com 0 para descobrir o lado da inclinação<br>' +
      '3️⃣ Usar <strong>[' + nomeBloco + '] * 10</strong> em um bloco de Matemática<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'robotAccelerationNotification',
    closeId: closeId,
    background: '#8e44ad',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showRobotInstrumentDisplayReminder = function() {
  var closeId = 'closeRobotInstrumentDisplayNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🤖 These robot values only work after the robot has been initialized.<br><br>' +
      'Place <strong>Initialize robot</strong> before these display blocks, or inside the button action before the movement and readings.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ Initialize robot<br>' +
      '2️⃣ Move or turn the robot<br>' +
      '3️⃣ Show Numeric Value: <strong>[Robot rotation]</strong> or <strong>[Acceleration X]</strong><br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🤖 Estes valores do robô só funcionam depois que o robô foi inicializado.<br><br>' +
      'Coloque <strong>Inicializar robô</strong> antes destes blocos de display, ou dentro da ação do botão antes dos movimentos e leituras.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ Inicializar robô<br>' +
      '2️⃣ Andar ou girar o robô<br>' +
      '3️⃣ Mostrar valor: <strong>[Giro do robô]</strong> ou <strong>[Aceleração X]</strong><br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'robotInstrumentDisplayNotification',
    closeId: closeId,
    background: '#8e44ad',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showRobotBatteryVoltageReminder = function() {
  var closeId = 'closeRobotBatteryVoltageNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🔋 This block <strong>does nothing on its own!</strong><br><br>' +
      '🧮 Use it inside <strong>Mathematics</strong>, <strong>if</strong> blocks, and comparisons to make decisions from the robot battery voltage.<br><br>' +
      '📊 To show it on the display, use the ready-made <strong>Show Numeric Value + Battery voltage</strong> example in this category.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Examples:</strong><br>' +
      '1️⃣ If <strong>[🔋 Battery voltage] &lt; 6</strong>, show a warning<br>' +
      '2️⃣ Compare <strong>[🔋 Battery voltage]</strong> before and after the robot moves<br>' +
      '3️⃣ Use <strong>[🔋 Battery voltage] + 1</strong> in a Mathematics block<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🔋 Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '🧮 Use dentro de blocos de <strong>Matemática</strong>, <strong>se</strong> e comparações para tomar decisões pela tensão da bateria do robô.<br><br>' +
      '📊 Para mostrar no display, use o exemplo pronto <strong>Mostrar valor + Tensão da bateria (V)</strong> desta categoria.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplos:</strong><br>' +
      '1️⃣ Se <strong>[🔋 Tensão da bateria (V)] &lt; 6</strong>, mostrar um aviso<br>' +
      '2️⃣ Comparar <strong>[🔋 Tensão da bateria (V)]</strong> antes e depois do robô andar<br>' +
      '3️⃣ Usar <strong>[🔋 Tensão da bateria (V)] + 1</strong> em um bloco de Matemática<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'robotBatteryVoltageNotification',
    closeId: closeId,
    background: '#27ae60',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showRobotCurrentReminder = function() {
  var closeId = 'closeRobotCurrentNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '⚡ This block <strong>does nothing on its own!</strong><br><br>' +
      '🧮 Use it inside <strong>Mathematics</strong>, <strong>if</strong> blocks, and comparisons to make decisions from the robot current use.<br><br>' +
      '📊 To show it on the display, use the ready-made <strong>Show Numeric Value + Robot current</strong> example in this category.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Examples:</strong><br>' +
      '1️⃣ If <strong>[⚡ Robot current] &gt; 1</strong>, stop the robot<br>' +
      '2️⃣ Compare <strong>[⚡ Robot current]</strong> while stopped and while moving<br>' +
      '3️⃣ Use <strong>[⚡ Robot current] * 10</strong> in a Mathematics block<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '⚡ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '🧮 Use dentro de blocos de <strong>Matemática</strong>, <strong>se</strong> e comparações para tomar decisões pela corrente usada pelo robô.<br><br>' +
      '📊 Para mostrar no display, use o exemplo pronto <strong>Mostrar valor + Corrente do robô (A)</strong> desta categoria.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplos:</strong><br>' +
      '1️⃣ Se <strong>[⚡ Corrente do robô (A)] &gt; 1</strong>, parar o robô<br>' +
      '2️⃣ Comparar <strong>[⚡ Corrente do robô (A)]</strong> parado e andando<br>' +
      '3️⃣ Usar <strong>[⚡ Corrente do robô (A)] * 10</strong> em um bloco de Matemática<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'robotCurrentNotification',
    closeId: closeId,
    background: '#27ae60',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showEstufaToggleReminder = function(blockType) {
  var closeId = 'closeEstufaToggleNotification';
  var nomeSensor;
  var nomeBotao;
  if (Code.LANG === 'en') {
    nomeSensor = blockType === 'estufa_toggle_sensor1' ? 'Sensor 1 (left side)' : 'Sensor 2 (right side)';
    nomeBotao = blockType === 'estufa_toggle_sensor1' ? 'Button A' : 'Button B';
  } else {
    nomeSensor = blockType === 'estufa_toggle_sensor1' ? 'Sensor 1 (esquerda)' : 'Sensor 2 (direita)';
    nomeBotao = blockType === 'estufa_toggle_sensor1' ? 'Botão A' : 'Botão B';
  }
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '🌱 This block <strong>toggles</strong> the <strong>' + nomeSensor + '</strong> measurement on the display.<br><br>' +
      '🔘 Place it inside a <strong>button</strong> block so the readout can be turned on and off with a button press.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🌱 Greenhouse Experiment - Compare 2 Sensors<br>' +
      '2️⃣ 🔘 When <strong>' + nomeBotao + '</strong> is pressed:<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;🌱 Show/Hide ' + nomeSensor + ' Measurement<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🌱 Este bloco <strong>liga/desliga</strong> a medição do <strong>' + nomeSensor + '</strong> no display.<br><br>' +
      '🔘 Coloque dentro de um bloco de <strong>botão</strong> para ligar e desligar apertando!<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🌱 Efeito Estufa — Comparar 2 sensores<br>' +
      '2️⃣ 🔘 Quando <strong>' + nomeBotao + '</strong> apertado:<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;🌱 Mostrar/Ocultar medição ' + nomeSensor + '<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'estufaToggleNotification',
    closeId: closeId,
    background: '#16a085',
    html: html
  });
};

WorkspaceManager.showGraficoReminder = function() {
  var closeId = 'closeGraficoNotification';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANT!</strong><br><br>' +
      '📊 You can <strong>add, subtract, multiply, or divide</strong> sensor data.<br><br>' +
      '🧮 Use <strong>Mathematics</strong> blocks to combine sensor values. Example: Temperature Sensor 1 <strong>+</strong> Temperature Sensor 2<br><br>' +
      '📺 Use <strong>Top Half</strong> and <strong>Bottom Half</strong> to display <strong>2 graphs at the same time.</strong><br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🔁 Repeat forever:<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;📊 Plot Graph <strong>[Temp S1 + Temp S2]</strong> type Sum Temp on the Top Half<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;📊 Plot Graph <strong>[Humidity S1]</strong> type Humidity 1 on the Bottom Half<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '📊 Você pode <strong>somar, subtrair, multiplicar ou dividir</strong> os dados dos sensores!<br><br>' +
      '🧮 Use os blocos de <strong>Matemática</strong> para combinar sensores. Exemplo: Temperatura Sensor 1 <strong>+</strong> Temperatura Sensor 2<br><br>' +
      '📺 Use <strong>Metade de Cima</strong> e <strong>Metade de Baixo</strong> para ver <strong>2 gráficos ao mesmo tempo!</strong><br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ 🔁 Repetir para sempre:<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;📊 Mostrar Gráfico <strong>[Temp S1 + Temp S2]</strong> tipo Soma Temp na Metade de Cima<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;📊 Mostrar Gráfico <strong>[Umidade S1]</strong> tipo Umidade 1 na Metade de Baixo<br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'graficoNotification',
    closeId: closeId,
    background: '#2980b9',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.bindWorkspaceHints = function() {
  Code.workspace.addChangeListener(function(event) {
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      var block = Code.workspace.getBlockById(event.blockId);
      if (!block) return;

      var blockType = block.type;
      var joystickGetterBlocks = [
        'joystick_intensidade_atual',
        'joystick_frequencia_atual',
        'joystick_posicao_x',
        'joystick_posicao_y'
      ];

      if (joystickGetterBlocks.indexOf(blockType) !== -1) {
        Code.showJoystickGetterReminder(blockType);
      }
      if (blockType === 'servo_angulo_atual') {
        Code.showServoAngleReminder();
      }
      if (blockType === 'joystick_seletor') {
        Code.showJoystickSeletorReminder();
      }
      if (blockType === 'microfone_nivel_atual') {
        Code.showMicGetterReminder();
      }
      if (blockType === 'microfone_barra_pct') {
        Code.showBarraGetterReminder();
      }
      if (blockType === 'microfone_total_palmas') {
        Code.showPalmasGetterReminder();
      }
      if (blockType === 'sensor_temperatura' || blockType === 'sensor_umidade') {
        Code.showSensorReminder(blockType);
      }
      if (blockType === 'robo_giro_valor') {
        Code.showRobotRotationReminder();
      }
      if (blockType === 'robo_aceleracao_x') {
        Code.showRobotAccelerationReminder(blockType);
      }
      if (blockType === 'robo_aceleracao_y') {
        Code.showRobotAccelerationReminder(blockType);
      }
      if (blockType === 'robo_aceleracao_z') {
        Code.showRobotAccelerationReminder(blockType);
      }
      if (blockType === 'robo_transferidor_360') {
        Code.showRobotInstrumentDisplayReminder();
      }
      if (blockType === 'robo_tensao_bateria') {
        Code.showRobotBatteryVoltageReminder();
      }
      if (blockType === 'robo_corrente_robo') {
        Code.showRobotCurrentReminder();
      }
      if (blockType === 'display_mostrar_valor') {
        var valorBlock = block.getInputTargetBlock && block.getInputTargetBlock('VALOR');
        if (valorBlock && valorBlock.type === 'robo_giro_valor') {
          Code.showRobotInstrumentDisplayReminder();
        }
        if (valorBlock && (
          valorBlock.type === 'robo_aceleracao_x' ||
          valorBlock.type === 'robo_aceleracao_y' ||
          valorBlock.type === 'robo_aceleracao_z'
        )) {
          Code.showRobotInstrumentDisplayReminder();
        }
        if (valorBlock && valorBlock.type === 'robo_tensao_bateria') {
          Code.showRobotBatteryVoltageReminder();
        }
        if (valorBlock && valorBlock.type === 'robo_corrente_robo') {
          Code.showRobotCurrentReminder();
        }
        if (valorBlock && valorBlock.type === 'servo_angulo_atual') {
          Code.showServoAngleReminder();
        }
      }
      if (blockType === 'estufa_toggle_sensor1' || blockType === 'estufa_toggle_sensor2') {
        Code.showEstufaToggleReminder(blockType);
      }
      if (blockType === 'estufa_plotar') {
        Code.showGraficoReminder();
      }
      if (blockType === 'piano_interativo') {
        Code.showInteractivePiano();
      }
      if (blockType === 'temporizacao') {
        Code.showTimingPanel();
      }
    }
  });
};
