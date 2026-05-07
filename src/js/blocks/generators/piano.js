// ==========================================
// Interactive Piano UI for Piano Musical project
// ==========================================
'use strict';

var PianoManager = {};

PianoManager.NOTES = [
  { label: 'C', name: 'Dó', type: 'nota_do', frequency: 262, color: '#EA2027' },
  { label: 'D', name: 'Ré', type: 'nota_re', frequency: 294, color: '#EE5A24' },
  { label: 'E', name: 'Mi', type: 'nota_mi', frequency: 330, color: '#FFC312' },
  { label: 'F', name: 'Fá', type: 'nota_fa', frequency: 349, color: '#C4E538' },
  { label: 'G', name: 'Sol', type: 'nota_sol', frequency: 392, color: '#12CBC4' },
  { label: 'A', name: 'Lá', type: 'nota_la', frequency: 440, color: '#833471' },
  { label: 'B', name: 'Si', type: 'nota_si', frequency: 494, color: '#FD7272' }
];

PianoManager.BLACK_KEYS = [
  { label: 'C#', left: 0.68, frequency: 277 },
  { label: 'D#', left: 1.68, frequency: 311 },
  { label: 'F#', left: 3.68, frequency: 370 },
  { label: 'G#', left: 4.68, frequency: 415 },
  { label: 'A#', left: 5.68, frequency: 466 }
];

PianoManager.show = function() {
  var existing = document.getElementById('interactive-piano-panel');
  if (existing) {
    existing.style.display = 'block';
    return;
  }

  var panel = document.createElement('div');
  panel.id = 'interactive-piano-panel';
  panel.style.cssText = [
    'position: fixed',
    'left: 50%',
    'bottom: 28px',
    'transform: translateX(-50%)',
    'width: min(980px, 94vw)',
    'background: linear-gradient(180deg, #111827, #020617)',
    'border: 4px solid #22c55e',
    'border-radius: 18px',
    'box-shadow: 0 16px 45px rgba(0,0,0,0.42)',
    'z-index: 10001',
    'padding: 18px 18px 22px',
    'font-family: Arial, sans-serif',
    'color: white'
  ].join('; ');

  var header = document.createElement('div');
  header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:12px;';
  header.innerHTML = '<div><strong style="font-size:22px;">🎹 Piano Musical</strong><div style="font-size:14px; opacity:.9; margin-top:4px;">Clique numa tecla: ela toca no navegador e cria o bloco Tocar nota já montado.</div></div>';

  var close = document.createElement('button');
  close.textContent = '\u00d7';
  close.style.cssText = 'background:rgba(255,255,255,.12); color:white; border:2px solid rgba(255,255,255,.35); border-radius:50%; width:38px; height:38px; font-size:28px; line-height:28px; cursor:pointer;';
  close.addEventListener('click', function() {
    panel.style.display = 'none';
  });
  header.appendChild(close);

  var piano = document.createElement('div');
  piano.style.cssText = [
    'position: relative',
    'height: 270px',
    'background: #020617',
    'border-radius: 12px',
    'padding: 14px',
    'box-shadow: inset 0 0 18px rgba(255,255,255,.08)'
  ].join('; ');

  var whiteKeys = document.createElement('div');
  whiteKeys.style.cssText = 'display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; height:100%;';

  PianoManager.NOTES.forEach(function(note, index) {
    var key = document.createElement('button');
    key.type = 'button';
    key.innerHTML = '<span style="font-size:30px; font-weight:bold;">' + note.label + '</span><span style="font-size:15px; margin-top:6px; color:' + note.color + ';">' + note.name + '</span>';
    key.setAttribute('data-note-type', note.type);
    key.style.cssText = [
      'display:flex',
      'flex-direction:column',
      'justify-content:flex-end',
      'align-items:center',
      'height:100%',
      'padding:0 4px 24px',
      'background:linear-gradient(180deg, #ffffff, #e5e7eb)',
      'color:#111827',
      'border:1px solid #9ca3af',
      'border-bottom:14px solid #cbd5e1',
      'border-radius:0 0 12px 12px',
      'box-shadow: inset 0 -12px 20px rgba(0,0,0,.16)',
      'cursor:pointer',
      'transition: transform .08s ease, filter .08s ease'
    ].join('; ');
    PianoManager.bindKey(key, function() {
      Code.playPianoNote(note.frequency);
      Code.createNoteBlockFromPiano(note.type, index);
    });
    whiteKeys.appendChild(key);
  });

  var blackLayer = document.createElement('div');
  blackLayer.style.cssText = 'position:absolute; left:14px; right:14px; top:14px; height:150px; pointer-events:none;';

  PianoManager.BLACK_KEYS.forEach(function(note) {
    var key = document.createElement('button');
    key.type = 'button';
    key.textContent = note.label;
    key.style.cssText = [
      'position:absolute',
      'left:calc((100% / 7) * ' + note.left + ')',
      'width:calc(100% / 7 * .62)',
      'height:150px',
      'transform:translateX(-50%)',
      'background:linear-gradient(180deg, #111827, #020617)',
      'color:#e5e7eb',
      'border:1px solid #000',
      'border-bottom:10px solid #000',
      'border-radius:0 0 8px 8px',
      'box-shadow: 0 8px 12px rgba(0,0,0,.45)',
      'font-weight:bold',
      'padding-top:90px',
      'cursor:pointer',
      'pointer-events:auto',
      'z-index:2',
      'transition: transform .08s ease, filter .08s ease'
    ].join('; ');
    PianoManager.bindKey(key, function() {
      Code.playPianoNote(note.frequency);
    });
    blackLayer.appendChild(key);
  });

  piano.appendChild(whiteKeys);
  piano.appendChild(blackLayer);
  panel.appendChild(header);
  panel.appendChild(piano);

  // Resize handle
  var resizeHandle = document.createElement('div');
  resizeHandle.style.cssText = [
    'position: relative',
    'height: 14px',
    'margin-top: 10px',
    'cursor: ns-resize',
    'display: flex',
    'align-items: center',
    'justify-content: center',
    'gap: 5px',
    'color: rgba(255,255,255,.25)',
    'font-size: 14px',
    'user-select: none'
  ].join('; ');
  resizeHandle.innerHTML = '\u2550\u2550\u2550  Arrastar para redimensionar  \u2550\u2550\u2550';

  var startY, startH;
  resizeHandle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    startY = e.clientY;
    startH = piano.offsetHeight;
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'ns-resize';
  });
  function onResize(e) {
    var delta = startY - e.clientY;
    var newH = Math.max(160, Math.min(500, startH + delta));
    piano.style.height = newH + 'px';
    blackLayer.style.height = (newH * 150 / 270) + 'px';
    PianoManager._currentHeight = newH;
  }
  function stopResize() {
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
  }

  panel.appendChild(resizeHandle);
  document.body.appendChild(panel);
};

PianoManager.bindKey = function(key, action) {
  key.addEventListener('mousedown', function() {
    key.style.transform = key.style.transform ? key.style.transform + ' translateY(5px)' : 'translateY(5px)';
    key.style.filter = 'brightness(.9)';
  });
  key.addEventListener('mouseup', function() {
    key.style.transform = key.style.transform.replace(' translateY(5px)', '').replace('translateY(5px)', '');
    key.style.filter = '';
  });
  key.addEventListener('mouseleave', function() {
    key.style.transform = key.style.transform.replace(' translateY(5px)', '').replace('translateY(5px)', '');
    key.style.filter = '';
  });
  key.addEventListener('click', action);
};

PianoManager.playNote = function(frequency) {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  var context = PianoManager.audioContext || new AudioContext();
  PianoManager.audioContext = context;

  var oscillator = context.createOscillator();
  var gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.28, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.6);
};

PianoManager.createNoteBlock = function(type, index) {
  if (!Code.workspace || !Blockly.Blocks[type] || !Blockly.Blocks['tocar_nota']) return;

  var playBlock = Code.workspace.newBlock('tocar_nota');
  var noteBlock = Code.workspace.newBlock(type);
  playBlock.initSvg();
  noteBlock.initSvg();

  var connection = playBlock.getInput('NOTA').connection;
  connection.connect(noteBlock.outputConnection);

  playBlock.render();
  noteBlock.render();

  var metrics = Code.workspace.getMetrics ? Code.workspace.getMetrics() : null;
  var x = metrics ? metrics.viewLeft + 60 + (index % 3) * 240 : 60 + (index % 3) * 240;
  var y = metrics ? metrics.viewTop + 60 + Math.floor(index / 3) * 100 : 60 + Math.floor(index / 3) * 100;
  playBlock.moveBy(x, y);
  playBlock.select();
};

// Expose piano functions via Code namespace (used by workspace bindWorkspaceHints)
Code.showInteractivePiano = PianoManager.show;
Code.playPianoNote = PianoManager.playNote;
Code.createNoteBlockFromPiano = PianoManager.createNoteBlock;
