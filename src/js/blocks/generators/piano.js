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
  if (existing) { existing.style.display = 'block'; return; }

  var panel = document.createElement('div');
  panel.id = 'interactive-piano-panel';
  panel.style.cssText = 'position:fixed; left:' + Math.max(20, (window.innerWidth - 820) / 2) + 'px; top:' + Math.max(20, (window.innerHeight - 340) / 2) + 'px; width:820px; height:340px; background:linear-gradient(180deg,#111827,#020617); border:4px solid #22c55e; border-radius:18px; box-shadow:0 16px 45px rgba(0,0,0,0.45); z-index:10001; display:flex; flex-direction:column; overflow:hidden; resize:both; min-width:360px; min-height:180px; max-width:1400px; font-family:Arial,sans-serif; color:white; user-select:none;';

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

  var center = document.createElement('div');
  center.style.cssText = 'flex:1; display:flex; align-items:center; justify-content:center; padding:10px; overflow:hidden;';

  var wrap = document.createElement('div');
  wrap.style.cssText = 'aspect-ratio:770/270; max-width:100%; max-height:100%; width:100%; position:relative; background:#020617; border-radius:12px; padding:12px; box-sizing:border-box;';

  var wk = document.createElement('div');
  wk.style.cssText = 'display:grid; grid-template-columns:repeat(7,1fr); gap:4px; height:100%;';

  PianoManager.NOTES.forEach(function(note, index) {
    var k = document.createElement('button');
    k.type = 'button';
    k.innerHTML = '<span style="font-size:clamp(10px,2vw,24px); font-weight:bold;">' + note.label + '</span><span style="font-size:clamp(8px,1.4vw,13px); color:' + note.color + ';">' + note.name + '</span>';
    k.style.cssText = 'display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%; width:100%; padding:0 2px clamp(16px,2.5vw,24px); background:linear-gradient(180deg,#ffffff,#e5e7eb); color:#111827; border:none; border-bottom:clamp(4px,1vw,10px) solid ' + note.color + '; border-radius:0 0 10px 10px; box-shadow:inset 0 -6px 12px rgba(0,0,0,.1); cursor:pointer; transition:transform .08s,filter .08s;';
    PianoManager._bindKey(k, function() { Code.playPianoNote(note.frequency); Code.createNoteBlockFromPiano(note.type, index); });
    wk.appendChild(k);
  });

  var bk = document.createElement('div');
  bk.style.cssText = 'position:absolute; left:12px; right:12px; top:12px; height:28%; pointer-events:none;';

  PianoManager.BLACK_KEYS.forEach(function(n) {
    var k = document.createElement('button');
    k.type = 'button';
    k.textContent = n.label;
    k.style.cssText = 'position:absolute; left:calc((100%/7)*' + n.left + '); width:calc(100%/7*.48); height:100%; transform:translateX(-50%); background:linear-gradient(180deg,#1f2937,#020617); color:#9ca3af; border:1px solid #000; border-bottom:clamp(2px,0.5vw,4px) solid #000; border-radius:0 0 4px 4px; box-shadow:0 3px 6px rgba(0,0,0,.5); font-weight:bold; font-size:clamp(6px,1vw,10px); display:flex; align-items:flex-end; justify-content:center; padding-bottom:clamp(4px,0.8vw,8px); cursor:pointer; pointer-events:auto; z-index:2; transition:transform .08s,filter .08s;';
    PianoManager._bindKey(k, function() { Code.playPianoNote(n.frequency); });
    bk.appendChild(k);
  });

  wrap.appendChild(wk);
  wrap.appendChild(bk);
  center.appendChild(wrap);
  panel.appendChild(header);
  panel.appendChild(center);
  document.body.appendChild(panel);
};

PianoManager._bindKey = function(key, action) {
  key.addEventListener('mousedown', function() { key.style.filter = 'brightness(.85)'; key.style.transform = 'translateY(3px)'; });
  key.addEventListener('mouseup', function() { key.style.filter = ''; key.style.transform = ''; });
  key.addEventListener('mouseleave', function() { key.style.filter = ''; key.style.transform = ''; });
  key.addEventListener('click', action);
};

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

PianoManager.createNoteBlock = function(type, index) {
  if (!Code.workspace || !Blockly.Blocks[type] || !Blockly.Blocks['tocar_nota']) return;
  var p = Code.workspace.newBlock('tocar_nota');
  var n = Code.workspace.newBlock(type);
  p.initSvg(); n.initSvg();
  p.getInput('NOTA').connection.connect(n.outputConnection);
  p.render(); n.render();
  var m = Code.workspace.getMetrics ? Code.workspace.getMetrics() : null;
  var x = m ? m.viewLeft + 60 + (index % 3) * 240 : 60;
  var y = m ? m.viewTop + 60 + Math.floor(index / 3) * 100 : 60;
  p.moveBy(x, y); p.select();
};

Code.showInteractivePiano = PianoManager.show;
Code.playPianoNote = PianoManager.playNote;
Code.createNoteBlockFromPiano = PianoManager.createNoteBlock;
