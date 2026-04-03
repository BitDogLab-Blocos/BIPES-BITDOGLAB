'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = {};

Code.workspace = null;
Code._fullToolboxXml = null;

WorkspaceManager.loadBlocks = function(defaultXml) {
  var loadOnce = null;
  try {
    loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {}

  var interval_ = setInterval(function() {
    if (typeof UI !== 'undefined' && UI['workspace'].devices.constructor.name === 'Object') {
      var restored = false;
      if (loadOnce) {
        delete window.sessionStorage.loadOnceBlocks;
        var xml = Blockly.Xml.textToDom(loadOnce);
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
        restored = true;
      } else if (window.SimpleStorage && typeof window.SimpleStorage.restoreLastSession === 'function') {
        restored = !!window.SimpleStorage.restoreLastSession();
      } else if (defaultXml) {
        var xmlDefault = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xmlDefault, Code.workspace);
        restored = true;
      }

      if (!restored && defaultXml) {
        var fallbackXml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(fallbackXml, Code.workspace);
      }
      clearInterval(interval_);
    }
  }, 500);
};

WorkspaceManager.reloadToolbox = function(XML_) {
  try {
    if (typeof XML_ === 'string') {
      XML_ = Blockly.Xml.textToDom(XML_);
    }

    if (XML_ && XML_.nodeName) {
      if (Code.translateToolboxXml) {
        XML_ = Code.translateToolboxXml(XML_);
      }
      Code.workspace.updateToolbox(XML_);
      UI['notify'].send(MSG['toolboxReloaded'] || 'Toolbox recarregada com sucesso!');
    } else {
      var request = new XMLHttpRequest();
      request.open('GET', 'toolbox/default.xml', false);
      request.send(null);

      if (request.status === 200) {
        var toolboxXml = Blockly.Xml.textToDom(request.responseText);
        if (Code.translateToolboxXml) {
          toolboxXml = Code.translateToolboxXml(toolboxXml);
        }
        Code.workspace.updateToolbox(toolboxXml);
        UI['notify'].send(MSG['toolboxDefaultLoaded'] || 'Toolbox padrão carregada!');
      }
    }

    Code.workspace.scrollCenter();
  } catch (e) {
    console.error('Erro ao recarregar a toolbox:', e);
    UI['notify'].send((MSG['toolboxLoadError'] || 'Erro ao carregar a toolbox: %1').replace('%1', e.message));
  }
};

WorkspaceManager.filterToolboxByProject = function(project) {
  if (!Code._fullToolboxXml) return;

  var filtered = Code._fullToolboxXml.cloneNode(true);
  var categories = filtered.getElementsByTagName('category');
  for (var i = categories.length - 1; i >= 0; i--) {
    var cat = categories[i];
    var dataProject = cat.getAttribute('data-project');
    if (dataProject) {
      var projects = dataProject.split(',').map(function(s) { return s.trim(); });
      if (projects.indexOf(project) === -1) {
        cat.parentNode.removeChild(cat);
      }
    }
  }

  try {
    if (Code.translateToolboxXml) {
      filtered = Code.translateToolboxXml(filtered);
    }
    Code.workspace.updateToolbox(filtered);
  } catch (e) {
    console.error('[BitdogLab] Erro ao filtrar toolbox:', e);
  }
};

WorkspaceManager.PROJECT_NAMES = {
  'basico': 'projectBasic',
  'robo': 'projectRobot',
  'estufa': 'projectGreenhouse'
};

WorkspaceManager.initProjectSelector = function() {
  var btn = document.getElementById('projectButton');
  var modal = document.getElementById('project-modal');
  var closeBtn = document.getElementById('closeProjectModal');
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
      console.log('[BitdogLab] Projeto selecionado:', project);
    });
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
};

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
      if (blockType === 'estufa_toggle_sensor1' || blockType === 'estufa_toggle_sensor2') {
        Code.showEstufaToggleReminder(blockType);
      }
      if (blockType === 'estufa_plotar') {
        Code.showGraficoReminder();
      }
    }
  });
};

WorkspaceManager.loadToolboxXml = function() {
  var toolboxXml;
  var request = new XMLHttpRequest();
  request.open('GET', 'toolbox/default.xml', false);
  request.send(null);

  if (request.status === 200) {
    toolboxXml = Blockly.Xml.textToDom(request.responseText);
  } else {
    toolboxXml = Blockly.Xml.textToDom("<xml><category name='Básico' colour='%{BKY_LOGIC_HUE}'><block type='controls_if'></block><block type='logic_compare'></block><block type='controls_repeat_ext'></block><block type='math_number'></block><block type='math_arithmetic'></block><block type='text'></block><block type='text_print'></block></category></xml>");
  }

  if (Code.translateToolboxXml) {
    toolboxXml = Code.translateToolboxXml(toolboxXml);
  }
  return toolboxXml;
};

WorkspaceManager.importCategoryMessages = function() {
  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') === 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }
};

WorkspaceManager.initWorkspace = function() {
  var rtl = Code.isRtl();

  if (Code.startAutoGeneration) {
    Code.startAutoGeneration();
  }

  WorkspaceManager.importCategoryMessages();
  var toolboxXml = WorkspaceManager.loadToolboxXml();

  Code.workspace = Blockly.inject('content_blocks', {
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    media: '../assets/media/',
    rtl: rtl,
    toolbox: toolboxXml,
    oneBasedIndex: false,
    zoom: {
      controls: true,
      wheel: true
    }
  });

  Code.loadBlocks('');

  var flyout = Code.workspace.getFlyout();
  if (flyout) flyout.width_ = 300;

  WorkspaceManager.bindWorkspaceHints();
};

WorkspaceManager.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 || window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

Code.loadBlocks = WorkspaceManager.loadBlocks;
Code.reloadToolbox = WorkspaceManager.reloadToolbox;
Code.filterToolboxByProject = WorkspaceManager.filterToolboxByProject;
Code.PROJECT_NAMES = WorkspaceManager.PROJECT_NAMES;
Code.initProjectSelector = WorkspaceManager.initProjectSelector;
Code.localizeRuntimePanel = WorkspaceManager.localizeRuntimePanel;
Code.showJoystickGetterReminder = WorkspaceManager.showJoystickGetterReminder;
Code.showJoystickSeletorReminder = WorkspaceManager.showJoystickSeletorReminder;
Code.showMicGetterReminder = WorkspaceManager.showMicGetterReminder;
Code.showBarraGetterReminder = WorkspaceManager.showBarraGetterReminder;
Code.showPalmasGetterReminder = WorkspaceManager.showPalmasGetterReminder;
Code.showSensorReminder = WorkspaceManager.showSensorReminder;
Code.showEstufaToggleReminder = WorkspaceManager.showEstufaToggleReminder;
Code.showGraficoReminder = WorkspaceManager.showGraficoReminder;
Code.initWorkspace = WorkspaceManager.initWorkspace;
Code.discard = WorkspaceManager.discard;
