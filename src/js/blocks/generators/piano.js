// ==========================================
// Interactive Piano UI for Piano Musical project
// ==========================================
'use strict';

var PianoManager = {};

// Shared sequence state for music sequencer (also used by timing.js)
window.MusicSequence = window.MusicSequence || { lastBlock: null };

window.MusicSequence._isUsableBlock = function(block) {
  if (!block || block.workspace !== Code.workspace) return false;
  if (typeof block.isDisposed === 'function') return !block.isDisposed();
  return !block.isDisposed;
};

window.MusicSequence._isSequenceBlock = function(block) {
  return Boolean(block && (
    block.type === 'piano_nota' ||
    block.type === 'parar_piano' ||
    block.type === 'esperar_milisegundos'
  ));
};

window.MusicSequence._findTail = function(block) {
  while (block && block.getNextBlock && block.getNextBlock()) {
    block = block.getNextBlock();
  }
  return block;
};

window.MusicSequence._findWorkspaceTail = function() {
  if (!Code.workspace || !Code.workspace.getTopBlocks) return null;

  var topBlocks = Code.workspace.getTopBlocks(true);
  var bestTail = null;
  var bestY = -Infinity;

  for (var i = 0; i < topBlocks.length; i++) {
    var tail = window.MusicSequence._findTail(topBlocks[i]);
    if (!tail || !window.MusicSequence._isSequenceBlock(tail) || !tail.nextConnection || !tail.previousConnection) continue;

    var xy = tail.getRelativeToSurfaceXY ? tail.getRelativeToSurfaceXY() : { x: 0, y: 0 };
    if (xy.y >= bestY) {
      bestY = xy.y;
      bestTail = tail;
    }
  }

  return bestTail;
};

window.MusicSequence._placeFirstBlock = function(block) {
  var m = Code.workspace.getMetrics ? Code.workspace.getMetrics() : null;
  var x = m ? m.viewLeft + 60 : 60;
  var y = m ? m.viewTop + 60 : 60;
  block.moveBy(x, y);
};

window.MusicSequence.chainBlock = function(block) {
  if (!block) return;

  var tail = window.MusicSequence._isUsableBlock(window.MusicSequence.lastBlock)
    ? window.MusicSequence._findTail(window.MusicSequence.lastBlock)
    : window.MusicSequence._findWorkspaceTail();

  if (tail && tail !== block && tail.nextConnection && !tail.nextConnection.targetConnection && block.previousConnection) {
    try {
      tail.nextConnection.connect(block.previousConnection);
    } catch (e) {
      window.MusicSequence._placeFirstBlock(block);
    }
  } else {
    window.MusicSequence._placeFirstBlock(block);
  }

  window.MusicSequence.lastBlock = window.MusicSequence._findTail(block);
};

// ── White keys ──
PianoManager.NOTES = [
  { label: 'C', name: 'Dó', freq: 262, value: 'C', color: '#EA2027' },
  { label: 'D', name: 'Ré', freq: 294, value: 'D', color: '#EE5A24' },
  { label: 'E', name: 'Mi', freq: 330, value: 'E', color: '#FFC312' },
  { label: 'F', name: 'Fá', freq: 349, value: 'F', color: '#C4E538' },
  { label: 'G', name: 'Sol', freq: 392, value: 'G', color: '#12CBC4' },
  { label: 'A', name: 'Lá', freq: 440, value: 'A', color: '#833471' },
  { label: 'B', name: 'Si', freq: 494, value: 'B', color: '#FD7272' }
];

// ── Black keys (sharps) ──
PianoManager.SHARPS = [
  { label: 'C#', left: 0.68, freq: 277, value: 'C#' },
  { label: 'D#', left: 1.68, freq: 311, value: 'D#' },
  { label: 'F#', left: 3.68, freq: 370, value: 'F#' },
  { label: 'G#', left: 4.68, freq: 415, value: 'G#' },
  { label: 'A#', left: 5.68, freq: 466, value: 'A#' }
];

// ── Show panel ──
PianoManager.show = function() {
  var existing = document.getElementById('interactive-piano-panel');
  if (existing) { existing.style.display = 'block'; return; }

  var panel = document.createElement('div');
  panel.id = 'interactive-piano-panel';
  panel.style.cssText = 'position:fixed; left:' + Math.max(20, (window.innerWidth - 820) / 2) + 'px; top:' + Math.max(20, (window.innerHeight - 340) / 2) + 'px; width:820px; height:340px; background:linear-gradient(180deg,#111827,#020617); border:4px solid #22c55e; border-radius:18px; box-shadow:0 16px 45px rgba(0,0,0,0.45); z-index:10001; display:flex; flex-direction:column; overflow:hidden; resize:both; min-width:360px; min-height:200px; max-width:1400px; font-family:Arial,sans-serif; color:white; user-select:none;';

  var header = document.createElement('div');
  header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 16px; cursor:grab; background:linear-gradient(90deg,#14532d,#22c55e); flex-shrink:0;';
  header.innerHTML = '<div><strong style="font-size:20px;">🎹 Piano Musical</strong></div>';

  var close = document.createElement('button');
  close.textContent = '\u00d7';
  close.style.cssText = 'background:rgba(255,255,255,.15); color:white; border:2px solid rgba(255,255,255,.4); border-radius:50%; width:34px; height:34px; font-size:24px; line-height:24px; cursor:pointer; flex-shrink:0;';
  close.addEventListener('click', function() { panel.style.display = 'none'; });
  header.appendChild(close);

  var dx, dy;
  header.addEventListener('mousedown', function(e) {
    if (e.target !== close) {
      panel.style.left = panel.offsetLeft + 'px';
      panel.style.top = panel.offsetTop + 'px';
      dx = e.clientX - panel.offsetLeft;
      dy = e.clientY - panel.offsetTop;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', offDrag);
    }
  });
  function onDrag(e) { panel.style.left = Math.max(0, e.clientX - dx) + 'px'; panel.style.top = Math.max(0, e.clientY - dy) + 'px'; }
  function offDrag() { document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', offDrag); }

  // ── Keyboard area ──
  var kbArea = document.createElement('div');
  kbArea.style.cssText = 'flex:1; display:flex; align-items:center; justify-content:center; padding:8px 10px; overflow:hidden;';

  var wrap = document.createElement('div');
  wrap.style.cssText = 'aspect-ratio:770/270; max-width:100%; max-height:100%; width:100%; position:relative; background:#020617; border-radius:12px; padding:12px; box-sizing:border-box;';

  // White keys
  var wk = document.createElement('div');
  wk.style.cssText = 'display:grid; grid-template-columns:repeat(7,1fr); gap:4px; height:100%;';

  PianoManager.NOTES.forEach(function(note, index) {
    var k = document.createElement('button');
    k.type = 'button';
    k.innerHTML = '<span style="font-size:clamp(10px,2vw,24px); font-weight:bold;">' + note.label + '</span><span style="font-size:clamp(8px,1.4vw,13px); color:' + note.color + ';">' + note.name + '</span>';
    k.style.cssText = 'display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%; width:100%; padding:0 2px clamp(16px,2.5vw,24px); background:linear-gradient(180deg,#ffffff,#e5e7eb); color:#111827; border:none; border-bottom:clamp(4px,1vw,10px) solid ' + note.color + '; border-radius:0 0 10px 10px; box-shadow:inset 0 -6px 12px rgba(0,0,0,.1); cursor:pointer; transition:transform .08s,filter .08s;';
    PianoManager._bindKey(k, function() {
      Code.playPianoNote(note.freq);
      PianoManager._createPianoBlock(note.value, index);
    });
    wk.appendChild(k);
  });

  // Black keys
  var bk = document.createElement('div');
  bk.style.cssText = 'position:absolute; left:12px; right:12px; top:12px; height:28%; pointer-events:none;';

  PianoManager.SHARPS.forEach(function(n) {
    var k = document.createElement('button');
    k.type = 'button';
    k.textContent = n.label;
    k.style.cssText = 'position:absolute; left:calc((100%/7)*' + n.left + '); width:calc(100%/7*.48); height:100%; transform:translateX(-50%); background:linear-gradient(180deg,#1f2937,#020617); color:#9ca3af; border:1px solid #000; border-bottom:clamp(2px,0.5vw,4px) solid #000; border-radius:0 0 4px 4px; box-shadow:0 3px 6px rgba(0,0,0,.5); font-weight:bold; font-size:clamp(6px,1vw,10px); display:flex; align-items:flex-end; justify-content:center; padding-bottom:clamp(4px,0.8vw,8px); cursor:pointer; pointer-events:auto; z-index:2; transition:transform .08s,filter .08s;';
    PianoManager._bindKey(k, function() {
      Code.playPianoNote(n.freq);
      PianoManager._createPianoBlock(n.value, 3);
    });
    bk.appendChild(k);
  });

  wrap.appendChild(wk);
  wrap.appendChild(bk);
  kbArea.appendChild(wrap);
  panel.appendChild(header);
  panel.appendChild(kbArea);

  // Resize hint
  var hint = document.createElement('div');
  hint.style.cssText = 'position:absolute; bottom:6px; right:10px; font-size:11px; color:rgba(255,255,255,.75); pointer-events:none; z-index:5;';
  hint.textContent = 'arraste o canto';
  panel.appendChild(hint);

  document.body.appendChild(panel);
};

PianoManager._lastNoteValue = null;
PianoManager._lastNoteName = null;

// ── Create piano_nota block (chained to sequence) ──
PianoManager._createPianoBlock = function(noteValue, index) {
  PianoManager._lastNoteValue = noteValue;
  PianoManager._lastNoteName = noteValue + ' (4ª oitava)';
  if (!Code.workspace || !Blockly.Blocks['piano_nota']) return;

  var block = Code.workspace.newBlock('piano_nota');
  block.initSvg();
  block.setFieldValue(noteValue, 'NOTE');
  block.setFieldValue('50', 'VOLUME');
  block.render();

  window.MusicSequence.chainBlock(block);
  block.select();
};

// ── Key bind helper ──
PianoManager._bindKey = function(key, action) {
  key.addEventListener('mousedown', function() { key.style.filter = 'brightness(.85)'; key.style.transform = 'translateY(3px)'; });
  key.addEventListener('mouseup', function() { key.style.filter = ''; key.style.transform = ''; });
  key.addEventListener('mouseleave', function() { key.style.filter = ''; key.style.transform = ''; });
  key.addEventListener('click', action);
};

// ── Audio ──
PianoManager.playNote = function(freq) {
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  var ctx = PianoManager._ctx || new AC();
  PianoManager._ctx = ctx;
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + 0.6);
};

// ── Expose ──
Code.showInteractivePiano = PianoManager.show;
Code.playPianoNote = PianoManager.playNote;
