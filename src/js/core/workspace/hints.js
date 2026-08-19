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
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display (board screen) block to visualize the value on-screen.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🕹️ Joystick-Controlled LED <small>(or buzzer)</small><br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[' + nomeBloco + ']</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🕹️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED (tela da placa) para ver o número na tela!<br><br>' +
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
      '<strong style="font-size: 16px;">💡 How to use the last angle sent to the servo</strong><br><br>' +
      '📐 This value block needs a block that <strong>moves the servo</strong>.<br><br>' +
      'Use <strong>Move servo</strong>, <strong>Joystick controls servo</strong>, <strong>Increase servo angle</strong>, or <strong>Decrease servo angle</strong> with the <strong>same Connection</strong>.<br><br>' +
      'The value is the <strong>last angle commanded by the program</strong>; a regular servo does not measure its physical position.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ Increase servo angle on Connection 0<br>' +
      '2️⃣ Show value: <strong>[Last angle sent to servo on Connection 0]</strong><br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 Como usar o último ângulo enviado ao servo</strong><br><br>' +
      '📐 Este bloco de valor precisa de um bloco que <strong>mova o servo</strong>.<br><br>' +
      'Use <strong>Mover servo</strong>, <strong>Joystick controla servo</strong>, <strong>Aumentar o ângulo do servo</strong> ou <strong>Diminuir o ângulo do servo</strong> com a <strong>mesma Conexão</strong>.<br><br>' +
      'O valor representa o <strong>último ângulo enviado pelo programa</strong>; um servo comum não mede sua posição física.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Exemplo:</strong><br>' +
      '1️⃣ Aumentar o ângulo do servo na Conexão 0<br>' +
      '2️⃣ Mostrar valor: <strong>[Último ângulo enviado ao servo na Conexão 0]</strong><br>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'servoAngleNotification',
    closeId: closeId,
    background: '#00897b',
    maxWidth: '460px',
    html: html
  });
};

WorkspaceManager.showServoConnectionReminder = function(block) {
  var closeId = 'closeServoConnectionNotification';
  var boardImage = '../assets/images/devices/conexoes-externas.png';
  var servoImage = '../assets/images/devices/servo-motor.png';
  var wireRows = Code.LANG === 'en'
    ? '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">Servo wires</div>' +
      '<div style="display:grid; gap:7px; margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>Orange (signal)</strong> → V7: Connection 0 or 1 &nbsp;|&nbsp; V6: Connections 0, 1, 2 or 3</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>Red — electrical power (VCC)</strong> → board 5V-VSYS contact (5 V power)</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>Brown — negative/ground (GND)</strong> → board GND contact</div>' +
      '</div>'
    : '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">Cabos do servo</div>' +
      '<div style="display:grid; gap:7px; margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>Laranja — sinal do servo</strong> → placa V7: Conexão 0 ou 1 &nbsp;|&nbsp; placa V6: Conexão 0, 1, 2 ou 3</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>Vermelho — alimentação elétrica (VCC)</strong> → contato 5V-VSYS da placa — alimentação de 5 V</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>Marrom — negativo/terra (GND)</strong> → contato GND da placa</div>' +
      '</div>';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 How to connect the external servo</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="External connections" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + servoImage + '" alt="SG90 servo motor" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + wireRows +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Build this connection sequence:</strong> servo plug → male-to-male jumper → alligator clip → board contact.<br>' +
      'Turn the board off first and keep neighboring clips from touching.<br>' +
      '<strong>Insulate the jumper-to-alligator connection with electrical tape</strong> so exposed metal cannot cause a short circuit.</div>' +
      '<div style="margin-top:9px;"><strong>Important:</strong> do not connect the red wire to the board 3V3 contact (3.3 V power). Ask a teacher to check the wires before powering the board.</div>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 Como conectar o servo externo</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="Conexões externas" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + servoImage + '" alt="Servo motor SG90" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + wireRows +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Monte esta sequência de ligação:</strong> plugue do servo → jumper macho-macho → garra jacaré → contato da placa.<br>' +
      'Primeiro desligue a placa e não deixe garras vizinhas se encostarem.<br>' +
      '<strong>Isole a união do jumper com a garra jacaré usando fita isolante</strong> para nenhum metal exposto causar curto-circuito.</div>' +
      '<div style="margin-top:9px;"><strong>Importante:</strong> não ligue o fio vermelho no contato 3V3 da placa — alimentação de 3,3 V. Peça a um professor para conferir os fios antes de ligar a placa.</div>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'servoConnectionNotification',
    closeId: closeId,
    background: '#00695c',
    maxWidth: '680px',
    html: html
  });
};

WorkspaceManager.bindServoCategoryHint = function() {
  var toolbox = Code.workspace && Code.workspace.getToolbox
    ? Code.workspace.getToolbox()
    : null;
  var toolboxDiv = toolbox && toolbox.HtmlDiv;
  if (!toolboxDiv || toolboxDiv.__bitdoglabServoHintBound) return;

  toolboxDiv.__bitdoglabServoHintBound = true;
  toolboxDiv.addEventListener('click', function(event) {
    var clickTarget = event.target;
    while (clickTarget && clickTarget !== toolboxDiv && !clickTarget.id) {
      clickTarget = clickTarget.parentNode;
    }
    if (!clickTarget || !clickTarget.id || !toolbox.getToolboxItemById) return;

    var item = toolbox.getToolboxItemById(clickTarget.id);
    var categoryName = item && item.getName ? item.getName() : '';
    if (categoryName === 'Servo externo' || categoryName === 'External Servo') {
      Code.showServoConnectionReminder();
    }
  });
};

WorkspaceManager.showExternalContactReminder = function(block) {
  var closeId = 'closeExternalContactNotification';
  var boardImage = '../assets/images/devices/conexoes-externas.png';
  var contactImage = '../assets/images/devices/external-contacts.png';
  var warningText = block && block.__bitdoglabContractWarningText
    ? String(block.__bitdoglabContractWarningText)
    : '';
  var problemLine = warningText
    ? (Code.LANG === 'en'
      ? '<div style="background:#ffebee;color:#7f0000;padding:9px;border-radius:6px;margin-bottom:10px;"><strong>Why the program was blocked:</strong><br>' + warningText + '</div>'
      : '<div style="background:#ffebee;color:#7f0000;padding:9px;border-radius:6px;margin-bottom:10px;"><strong>Por que o programa foi bloqueado:</strong><br>' + warningText + '</div>')
    : '';
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:18px;">🔌 How to create touch contacts</strong>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="External Connections" style="width:55%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + contactImage + '" alt="Alligator clips making contact" style="width:40%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + problemLine +
      '<div style="background:#fff3e0;color:#4e342e;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Always start with Set up contacts.</strong><br>Place it near the beginning of the project. The other contact blocks will not compile without it.</div>' +
      '<div style="display:grid;gap:7px;margin-bottom:10px;">' +
      '<div style="background:#e8f5e9;color:#1b5e20;padding:9px;border-radius:6px;"><strong>GND — recommended:</strong> connect the shared piece of conductive material to GND. Connect each separate touch piece to Connection 0, 1, 2, or 3.</div>' +
      '<div style="background:#fff8e1;color:#5d4037;padding:9px;border-radius:6px;"><strong>3.3 V — alternative:</strong> choose 3.3 V in Set up contacts and connect the shared piece to 3V3. Never let 3V3 touch GND.</div>' +
      '</div>' +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:6px;margin-bottom:10px;">' +
      '<strong>What happens?</strong> The board senses when two conductive parts touch. You can use aluminium foil, conductive dough, fruit, graphite, or alligator clips.' +
      '</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Before using other peripherals:</strong> each Connection can have only one job. Do not use the same Connection for a contact and an external LED, servo, or DHT11. The program blocks if two peripherals share it. The LED Matrix contact test uses all four Connections and should be used by itself.</div>' +
      '<div style="background:#fff3e0;color:#4e342e;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Display on BitDogLab V7:</strong> the screen uses Connections 2 and 3. Contacts on 2 or 3 can interfere with the screen. Use 0 and 1 with the screen, or remove the display blocks when using four contacts.</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Other components:</strong> AHT20, MPU6050, and the robot battery meter also use the board\'s communication pins. Do not mix them with Contacts in the same project unless the teacher has checked the wiring. The program blocks combinations that can use the same pin.</div>' +
      '<div style="background:#e0f2f1;color:#004d40;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Example:</strong><br>1️⃣ Set up contacts using GND<br>2️⃣ When contact is made on Connection 0 → play a beep<br><em>You do not need a Repeat forever block; the workspace already repeats the project.</em></div>' +
      '<strong>Safety:</strong> turn the board off before changing wires. Use only one shared mode in the whole project. On BitDogLab V7, the display shares Connections 2 and 3, so use 0 or 1 when the display is active. Ask a teacher to check the circuit before powering the board.' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:18px;">🔌 Como criar contatos de toque</strong>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="Conexões externas" style="width:55%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + contactImage + '" alt="Garras jacaré fazendo contato" style="width:40%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + problemLine +
      '<div style="background:#fff3e0;color:#4e342e;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Sempre comece com Preparar contatos.</strong><br>Coloque esse bloco perto do começo do projeto. Os outros blocos de Contatos não serão compilados sem ele.</div>' +
      '<div style="display:grid;gap:7px;margin-bottom:10px;">' +
      '<div style="background:#e8f5e9;color:#1b5e20;padding:9px;border-radius:6px;"><strong>GND — recomendado:</strong> ligue a peça compartilhada de material condutor ao GND. Ligue cada peça de toque separada à Conexão 0, 1, 2 ou 3.</div>' +
      '<div style="background:#fff8e1;color:#5d4037;padding:9px;border-radius:6px;"><strong>3,3 V — alternativa:</strong> escolha 3,3 V em Preparar contatos e ligue a peça compartilhada ao 3V3. Nunca deixe o 3V3 encostar no GND.</div>' +
      '</div>' +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:6px;margin-bottom:10px;">' +
      '<strong>O que acontece?</strong> A placa percebe quando duas partes condutoras encostam. Você pode usar papel-alumínio, massinha condutiva, frutas, grafite ou garras jacaré.' +
      '</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Antes de usar outros periféricos:</strong> cada Conexão pode ter uma única função. Não use a mesma Conexão para um contato e um LED externo, servo ou DHT11. O programa será bloqueado se dois periféricos compartilharem o mesmo número. O teste de contatos na Matriz usa as quatro Conexões e deve ser usado sozinho.</div>' +
      '<div style="background:#fff3e0;color:#4e342e;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Display na BitDogLab V7:</strong> a tela usa as Conexões 2 e 3. Contatos em 2 ou 3 podem atrapalhar a tela. Use 0 e 1 junto com o Display ou retire os blocos do Display quando usar quatro contatos.</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Outros componentes:</strong> o AHT20, o MPU6050 e o medidor de bateria do robô também usam pinos de comunicação da placa. Não misture esses componentes com Contatos no mesmo projeto sem um professor conferir a montagem. O programa bloqueia combinações que podem usar o mesmo pino.</div>' +
      '<div style="background:#e0f2f1;color:#004d40;padding:10px;border-radius:6px;margin-bottom:10px;"><strong>Exemplo:</strong><br>1️⃣ Preparar contatos usando GND<br>2️⃣ Quando houver contato na Conexão 0 → tocar um bipe<br><em>Não precisa usar Repetir para sempre: o próprio workspace já repete o projeto.</em></div>' +
      '<strong>Segurança:</strong> desligue a placa antes de mudar os fios. Use somente um tipo de fio compartilhado em todo o projeto. Na BitDogLab V7, o Display compartilha as Conexões 2 e 3; use 0 ou 1 quando a tela estiver ativa. Peça a um professor para conferir a montagem antes de ligar a placa.' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'externalContactNotification',
    closeId: closeId,
    background: '#0f9d8a',
    maxWidth: '720px',
    html: html
  });
};

WorkspaceManager.bindExternalContactCategoryHint = function() {
  var toolbox = Code.workspace && Code.workspace.getToolbox ? Code.workspace.getToolbox() : null;
  var toolboxDiv = toolbox && toolbox.HtmlDiv;
  if (!toolboxDiv || toolboxDiv.__bitdoglabExternalContactHintBound) return;

  toolboxDiv.__bitdoglabExternalContactHintBound = true;
  toolboxDiv.addEventListener('click', function(event) {
    var clickTarget = event.target;
    var item = null;
    while (clickTarget && clickTarget !== toolboxDiv) {
      if (clickTarget.id && toolbox.getToolboxItemById) {
        item = toolbox.getToolboxItemById(clickTarget.id);
        if (item) break;
      }
      clickTarget = clickTarget.parentNode;
    }
    var categoryName = item && item.getName ? item.getName() : '';
    if (categoryName === 'Contatos' || categoryName === 'Contacts') {
      Code.showExternalContactReminder();
    }
  });
};

WorkspaceManager.externalLedChannelInfo = function(channel) {
  var info = {
    R: { pt: 'R (vermelho)', en: 'R (red)' },
    G: { pt: 'G (verde)', en: 'G (green)' },
    B: { pt: 'B (azul)', en: 'B (blue)' }
  };
  return info[channel] || info.R;
};

// RGB-specific version: the category is intentionally explicit for children
// and teachers who may not know that the letters are physical LED pins.
WorkspaceManager.showExternalLedConnectionReminder = function(block) {
  WorkspaceManager.showExternalLedWarningReminder(block || null);
};

WorkspaceManager.showExternalLedWarningReminder = function(block) {
  var closeId = 'closeExternalLedWarningNotification';
  var boardImage = '../assets/images/devices/conexoes-externas.png';
  var ledImage = '../assets/images/devices/ky-016.png';
  var commandTypes = [
    'led_externo_ligar',
    'led_externo_desligar',
    'led_externo_piscar_rapido',
    'led_externo_piscar_lento',
    'led_externo_criar_animacao'
  ];
  var channelLabels = {
    R: Code.LANG === 'en' ? 'R (red)' : 'R (vermelho)',
    G: Code.LANG === 'en' ? 'G (green)' : 'G (verde)',
    B: Code.LANG === 'en' ? 'B (blue)' : 'B (azul)'
  };
  var issue = Code.LANG === 'en'
    ? 'Check the KY-016 colour channels and board Connections before running.'
    : 'Confira os canais do KY-016 e as Conexões da placa antes de executar.';
  var channelConnectionMap = { R: [], G: [], B: [] };
  var connectionChannels = {};
  var workspace = block && block.workspace ? block.workspace : Code.workspace;
  var allBlocks = workspace && workspace.getAllBlocks ? workspace.getAllBlocks(false) : [];

  for (var i = 0; i < allBlocks.length; i++) {
    var candidate = allBlocks[i];
    if (commandTypes.indexOf(candidate.type) === -1 || !candidate.getFieldValue) continue;
    var candidateChannel = String(candidate.getFieldValue('CHANNEL') || '');
    var candidateConnection = String(candidate.getFieldValue('DIG') || '');
    if (!candidateConnection || !channelConnectionMap[candidateChannel]) continue;
    if (channelConnectionMap[candidateChannel].indexOf(candidateConnection) === -1) {
      channelConnectionMap[candidateChannel].push(candidateConnection);
    }
    if (!connectionChannels[candidateConnection]) connectionChannels[candidateConnection] = [];
    if (connectionChannels[candidateConnection].indexOf(candidateChannel) === -1) {
      connectionChannels[candidateConnection].push(candidateChannel);
    }
  }

  if (block && block.type === 'led_externo_desligar_todos') {
    issue = Code.LANG === 'en'
        ? 'This block checks all four board Connections: 0, 1, 2 and 3. On board V7, it cannot share them with a servo, DHT11, or the board display.'
        : 'Este bloco verifica as quatro Conexões da placa: 0, 1, 2 e 3. Na placa V7, ele não pode compartilhar essas Conexões com o servo, o DHT11 ou o Display (tela da placa).';
  } else if (block && block.getFieldValue) {
    var channel = String(block.getFieldValue('CHANNEL') || '');
    var channelConnections = channelConnectionMap[channel] || [];
    if (channelConnections.length > 1) {
      issue = Code.LANG === 'en'
        ? 'The ' + (channelLabels[channel] || channel) + ' channel appears on Connections ' + channelConnections.join(' and ') + '. Use only one Connection for each colour.'
        : 'O canal ' + (channelLabels[channel] || channel) + ' aparece nas Conexões ' + channelConnections.join(' e ') + '. Use somente uma Conexão para cada cor.';
    } else {
      var selectedConnection = String(block.getFieldValue('DIG') || '');
      var selectedChannels = connectionChannels[selectedConnection] || [];
      if (selectedChannels.length > 1) {
        issue = Code.LANG === 'en'
          ? 'Connections ' + selectedConnection + ' is being used by ' + selectedChannels.join(' and ') + '. Put each colour on a different Connection.'
          : 'A Conexão ' + selectedConnection + ' está sendo usada por ' + selectedChannels.join(' e ') + '. Coloque cada cor em uma Conexão diferente.';
      }
    }
  }

  function connectionDescription(channelName) {
    var connections = channelConnectionMap[channelName] || [];
    if (!connections.length) {
      return Code.LANG === 'en'
        ? 'choose one of the 4 board Connections: 0, 1, 2 or 3. Do not reuse another colour\'s Connection'
        : 'escolha uma das 4 Conexões da placa: 0, 1, 2 ou 3. Cada cor deve usar um número diferente';
    }
    if (connections.length === 1) {
      var selected = connections[0];
      var otherChannels = (connectionChannels[selected] || []).filter(function(otherChannel) {
        return otherChannel !== channelName;
      });
      if (otherChannels.length) {
        return (Code.LANG === 'en' ? 'Connection ' : 'Conexão ') + selected +
          (Code.LANG === 'en'
            ? ' — ERROR: also used by ' + otherChannels.join(' and ')
            : ' — ERRO: também usada por ' + otherChannels.join(' e '));
      }
      return (Code.LANG === 'en' ? 'Connection ' : 'Conexão ') + selected +
        (Code.LANG === 'en'
          ? '. Do not use this number for another colour'
          : '. Não use este número em outra cor');
    }
    return (Code.LANG === 'en' ? 'Connections ' : 'Conexões ') +
      connections.join(Code.LANG === 'en' ? ' and ' : ' e ') +
      (Code.LANG === 'en' ? ' — ERROR: choose only one' : ' — ERRO: escolha somente uma');
  }

  var wireRows = Code.LANG === 'en'
    ? '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">Where to connect each colour LED pin</div>' +
      '<div style="display:grid;gap:7px;margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>- (negative/ground)</strong> &rarr; board GND contact</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>R — red</strong> &rarr; ' + connectionDescription('R') + '</div>' +
      '<div style="background:#f8f9fa;color:#263238;padding:8px;border-radius:5px;"><strong>G — green</strong> &rarr; ' + connectionDescription('G') + '</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>B — blue</strong> &rarr; ' + connectionDescription('B') + '</div>' +
      '</div>'
    : '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">Onde ligar cada pino do LED colorido</div>' +
      '<div style="display:grid;gap:7px;margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>- (negativo/terra)</strong> &rarr; contato GND da placa</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>R — vermelho</strong> &rarr; ' + connectionDescription('R') + '</div>' +
      '<div style="background:#f8f9fa;color:#263238;padding:8px;border-radius:5px;"><strong>G — verde</strong> &rarr; ' + connectionDescription('G') + '</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>B — azul</strong> &rarr; ' + connectionDescription('B') + '</div>' +
      '</div>';
  var colourIntro = Code.LANG === 'en'
    ? '<div style="background:#fff3e0;color:#4e342e;padding:9px;border-radius:6px;margin-bottom:10px;"><strong>Each pin controls one colour.</strong> Choose R, G, or B in the block.</div>'
    : '<div style="background:#fff3e0;color:#4e342e;padding:9px;border-radius:6px;margin-bottom:10px;"><strong>Cada pino controla uma cor.</strong> Escolha R, G ou B no bloco.</div>';
  var problemLine = block
    ? (Code.LANG === 'en'
      ? '<strong>Problem found:</strong> ' + issue + '<br>'
      : '<strong>Problema encontrado:</strong> ' + issue + '<br>')
    : '';

  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 How to connect the colour LED module (KY-016)</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="External connections" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + ledImage + '" alt="KY-016 RGB LED module" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + colourIntro + wireRows +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Build this connection sequence:</strong> KY-016 pin &rarr; female end of the male-to-female jumper &rarr; male end held by the alligator clip &rarr; board contact.<br>' +
      'Turn the board off and remove the USB cable before touching the wires. Keep neighbouring clips from touching.<br>' +
      '<strong>Insulate the jumper-to-alligator connection with electrical tape</strong> so exposed metal cannot cause a short circuit.</div>' +
      '<div style="margin-top:9px;">' + problemLine + '<strong>Important:</strong> each colour uses one Connection and different colours cannot share the same number. On board V7, use Connections 0 and 1 when the board display is active. Ask a teacher to check the wires before powering the board.</div>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 Como conectar o módulo de LED colorido (KY-016)</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="Conexões externas" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + ledImage + '" alt="Módulo LED RGB KY-016" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + colourIntro + wireRows +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Monte esta sequência de ligação:</strong> pino do KY-016 &rarr; ponta fêmea do jumper macho-fêmea &rarr; ponta macho presa à garra jacaré &rarr; contato da placa.<br>' +
      'Desligue a placa e retire o cabo USB antes de mexer nos fios. Não deixe garras vizinhas se encostarem.<br>' +
      '<strong>Isole a união do jumper com a garra jacaré usando fita isolante</strong> para nenhum metal exposto causar curto-circuito.</div>' +
      '<div style="margin-top:9px;">' + problemLine + '<strong>Importante:</strong> cada cor usa uma Conexão e cores diferentes não podem usar o mesmo número. Na placa V7, use as Conexões 0 e 1 quando o Display (tela da placa) estiver ativo. Peça a um professor para conferir os fios antes de ligar a placa.</div>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'externalLedWarningNotification',
    closeId: closeId,
    background: '#e67e22',
    maxWidth: '700px',
    html: html
  });
};

WorkspaceManager.showExternalLedChannelReminder = function(channel) {
  var labels = {
    R: { pt: 'R (vermelho)', en: 'R (red)' },
    G: { pt: 'G (verde)', en: 'G (green)' },
    B: { pt: 'B (azul)', en: 'B (blue)' }
  };
  var selected = labels[channel] || labels.R;
  var label = Code.LANG === 'en' ? selected.en : selected.pt;
  var closeId = 'closeExternalLedChannel_' + String(channel || 'R');
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size:17px;">You chose ' + label + '</strong><br><br>' +
      'Connect the <strong>' + label + '</strong> pin on the KY-016 to one of the <strong>4 board Connections: 0, 1, 2 or 3</strong>, using the number selected in the block. Each colour must use a different number. Connect <strong>-</strong> to the negative/ground (GND) contact.'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size:17px;">Você escolheu ' + label + '</strong><br><br>' +
      'Ligue o pino <strong>' + label + '</strong> do módulo de LED colorido KY-016 a uma das <strong>4 Conexões da placa: 0, 1, 2 ou 3</strong>, usando o número escolhido no bloco. Cada cor precisa usar um número diferente. Ligue <strong>-</strong> ao contato negativo/terra (GND).';

  WorkspaceManager.createReminder({
    id: 'externalLedChannelNotification_' + String(channel || 'R'),
    closeId: closeId,
    background: '#d97706',
    maxWidth: '540px',
    html: html
  });
};

WorkspaceManager.bindExternalLedCategoryHint = function() {
  var toolbox = Code.workspace && Code.workspace.getToolbox ? Code.workspace.getToolbox() : null;
  var toolboxDiv = toolbox && toolbox.HtmlDiv;
  if (!toolboxDiv || toolboxDiv.__bitdoglabExternalLedHintBound) return;

  toolboxDiv.__bitdoglabExternalLedHintBound = true;
  toolboxDiv.addEventListener('click', function(event) {
    var clickTarget = event.target;
    while (clickTarget && clickTarget !== toolboxDiv && !clickTarget.id) {
      clickTarget = clickTarget.parentNode;
    }
    if (!clickTarget || !clickTarget.id || !toolbox.getToolboxItemById) return;
    var item = toolbox.getToolboxItemById(clickTarget.id);
    var categoryName = item && item.getName ? item.getName() : '';
    if (categoryName === 'LEDs Externos' || categoryName === 'External LEDs') {
      Code.showExternalLedConnectionReminder();
    }
  });
};

WorkspaceManager.showDht11ConnectionReminder = function(block) {
  var closeId = 'closeDht11ConnectionNotification';
  var boardImage = '../assets/images/devices/conexoes-externas.png';
  var dht11Image = '../assets/images/devices/dht11-pinout.png?ver=6';
  var aht20GuideImage = '../assets/images/devices/aht20-ligacao.svg';
  var warningText = block && block.__bitdoglabContractWarningText
    ? String(block.__bitdoglabContractWarningText)
    : '';
  var hasSensorConflict = warningText.indexOf('dois sensores') !== -1 ||
    warningText.indexOf('two sensors') !== -1;
  var wireRows = Code.LANG === 'en'
    ? '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">DHT11 wires</div>' +
      '<div style="display:grid; gap:7px; margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>Orange arrow — sensor reading (pin S)</strong> → left pin &nbsp;|&nbsp; board V7: Connection 0 or 1 &nbsp;|&nbsp; board V6: Connection 0, 1, 2 or 3</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>Red arrow — 3.3 V electrical power</strong> → center pin and board 3V3 contact</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>Black arrow — negative/ground (GND)</strong> → right pin, next to -, and board GND contact</div>' +
      '</div>'
    : '<div style="margin:10px 0 6px;font-size:15px;font-weight:bold;">Fios do DHT11</div>' +
      '<div style="display:grid; gap:7px; margin:0 0 10px;">' +
      '<div style="background:#fff3e0;color:#4e342e;padding:8px;border-radius:5px;"><strong>Seta laranja — sinal/leitura do sensor (pino S)</strong> → pino da esquerda. Esse fio leva a leitura até a placa.<br>Placa V7: Conexão 0 ou 1 &nbsp;|&nbsp; placa V6: Conexão 0, 1, 2 ou 3</div>' +
      '<div style="background:#ffebee;color:#7f0000;padding:8px;border-radius:5px;"><strong>Seta vermelha — alimentação elétrica de 3,3 V</strong> → pino do meio e contato 3V3 da placa</div>' +
      '<div style="background:#efebe9;color:#3e2723;padding:8px;border-radius:5px;"><strong>Seta preta — negativo/terra (GND)</strong> → pino da direita, ao lado de -, e contato GND da placa</div>' +
      '</div>';
  var conflictGuide = !hasSensorConflict ? '' : (Code.LANG === 'en'
    ? '<div style="margin:10px 0;background:#fff;padding:9px;border-radius:6px;color:#4e342e;"><strong>The two sensors need separate inputs.</strong><br>Ask your teacher to use the other Greenhouse sensor input shown in this guide.</div>' +
      '<img src="' + aht20GuideImage + '" alt="Guide showing the other Greenhouse sensor input" style="width:100%;max-height:250px;object-fit:contain;background:white;border-radius:6px;margin-bottom:10px;">'
    : '<div style="margin:10px 0;background:#fff;padding:9px;border-radius:6px;color:#4e342e;"><strong>Os dois sensores precisam de entradas separadas.</strong><br>Peça ao professor para usar a outra entrada do sensor da Estufa indicada neste guia.</div>' +
      '<img src="' + aht20GuideImage + '" alt="Guia indicando a outra entrada do sensor da Estufa" style="width:100%;max-height:250px;object-fit:contain;background:white;border-radius:6px;margin-bottom:10px;">');
  var html = Code.LANG === 'en'
    ? WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 How to connect the external DHT11</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="External connections" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + dht11Image + '" alt="DHT11 sensor module" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + wireRows + conflictGuide +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Build this connection sequence:</strong> DHT11 pin → female end of the male-to-female jumper → male end held by the alligator clip → board contact.<br>' +
      'Turn the board off and remove the USB cable before touching the wires. Keep neighboring clips from touching.<br>' +
      '<strong>Insulate the jumper-to-alligator connection with electrical tape</strong> so exposed metal cannot cause a short circuit.</div>' +
      '<div style="margin-top:9px;"><strong>Important:</strong> use the board 3V3 contact (3.3 V power), never 5V-VSYS (5 V power).<br><strong>If the temperature and humidity blocks use the same physical sensor:</strong> choose the same Connection in both blocks. Different numbers mean two separate sensors.<br>On board V7, the sensor reading can use only Connection 0 or 1. On board V6, use 0, 1, 2 or 3.<br>Ask a teacher to check the wires before powering the board.</div>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<div style="max-height:calc(100vh - 90px);overflow-y:auto;padding-right:4px;">' +
      '<strong style="font-size:17px;">🔌 Como conectar o DHT11 externo</strong><br>' +
      '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;">' +
      '<img src="' + boardImage + '" alt="Conexões externas" style="width:54%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '<img src="' + dht11Image + '" alt="Módulo sensor DHT11" style="width:42%;max-height:180px;object-fit:contain;background:white;border-radius:6px;">' +
      '</div>' + wireRows + conflictGuide +
      '<div style="background:rgba(0,0,0,.16);padding:10px;border-radius:5px;">' +
      '<strong>Monte esta sequência de ligação:</strong> pino do DHT11 → ponta fêmea do jumper macho-fêmea → ponta macho presa à garra jacaré → contato da placa.<br>' +
      'Desligue a placa e retire o cabo USB antes de mexer nos fios. Não deixe garras vizinhas se encostarem.<br>' +
      '<strong>Isole a união do jumper com a garra jacaré usando fita isolante</strong> para nenhum metal exposto causar curto-circuito.</div>' +
      '<div style="margin-top:9px;"><strong>Importante:</strong> use o contato 3V3 da placa — alimentação de 3,3 V. Nunca use o contato 5V-VSYS — alimentação de 5 V.<br><strong>Se os blocos de temperatura e umidade usam o mesmo sensor físico:</strong> escolha a mesma Conexão nos dois blocos. Números diferentes significam dois sensores separados.<br>Na placa V7, o fio de leitura do sensor só pode usar a Conexão 0 ou 1. Na placa V6, use 0, 1, 2 ou 3.<br>Peça a um professor para conferir os fios antes de ligar a placa.</div>' +
      '</div>';

  WorkspaceManager.createReminder({
    id: 'dht11ConnectionNotification',
    closeId: closeId,
    background: '#e67e22',
    maxWidth: '700px',
    html: html
  });
};

WorkspaceManager.bindDht11CategoryHint = function() {
  var toolbox = Code.workspace && Code.workspace.getToolbox
    ? Code.workspace.getToolbox()
    : null;
  var toolboxDiv = toolbox && toolbox.HtmlDiv;
  if (!toolboxDiv || toolboxDiv.__bitdoglabDht11HintBound) return;

  toolboxDiv.__bitdoglabDht11HintBound = true;
  toolboxDiv.addEventListener('click', function(event) {
    var clickTarget = event.target;
    while (clickTarget && clickTarget !== toolboxDiv && !clickTarget.id) {
      clickTarget = clickTarget.parentNode;
    }
    if (!clickTarget || !clickTarget.id || !toolbox.getToolboxItemById) return;

    var item = toolbox.getToolboxItemById(clickTarget.id);
    var categoryName = item && item.getName ? item.getName() : '';
    if (categoryName === 'Temperatura e umidade externo' || categoryName === 'External temperature and humidity') {
      Code.showDht11ConnectionReminder();
    }
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
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display (board screen) block to inspect the measured value.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🎙️ LED matrix sound-level meter<br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[🎙️ Sound Level]</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🎙️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED (tela da placa) para ver o número na tela!<br><br>' +
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
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display (board screen) block to inspect the percentage value.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 🖥️ OLED sound level meter  line: 3<br>' +
      '2️⃣ 📊 Show Numeric Value: <strong>[🎙️ Sound Intensity (%)]</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🖥️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED (tela da placa) para ver a porcentagem na tela!<br><br>' +
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
      '📊 Place it inside the <strong>"Show Numeric Value"</strong> OLED display (board screen) block to inspect the reading.<br><br>' +
      '<div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; margin-top: 8px;">' +
      '<strong>📝 Example:</strong><br>' +
      '1️⃣ 📊 Show Numeric Value: <strong>[' + nomeBloco + ']</strong> line 1<br>' +
      '</div>'
    : WorkspaceManager.closeButton(closeId) +
      '<strong style="font-size: 16px;">💡 IMPORTANTE!</strong><br><br>' +
      '🌡️ Este bloco <strong>sozinho não faz nada!</strong><br><br>' +
      '📊 Encaixe-o no bloco <strong>"Mostrar valor"</strong> do Display OLED (tela da placa) para ver o número na tela!<br><br>' +
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
  WorkspaceManager.bindExternalContactCategoryHint();
  WorkspaceManager.bindServoCategoryHint();
  WorkspaceManager.bindDht11CategoryHint();
  WorkspaceManager.bindExternalLedCategoryHint();

  Code.workspace.addChangeListener(function(event) {
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      var block = Code.workspace.getBlockById(event.blockId);
      if (!block) return;

      var blockType = block.type;
      var servoControllerBlocks = [
        'servo_mover',
        'servo_joystick_controlar',
        'servo_subir_gradualmente',
        'servo_descer_gradualmente'
      ];
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
      if (blockType === 'dht11_temperatura' || blockType === 'dht11_umidade') {
        Code.showDht11ConnectionReminder(block);
      }
      if (window.BitDogLabExternalLed &&
          window.BitDogLabExternalLed.allTypes.indexOf(blockType) !== -1 &&
          block.getFieldValue && block.getFieldValue('CHANNEL')) {
        Code.showExternalLedChannelReminder(block.getFieldValue('CHANNEL'));
      }
      if (servoControllerBlocks.indexOf(blockType) !== -1) {
        Code.showServoConnectionReminder(block);
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
