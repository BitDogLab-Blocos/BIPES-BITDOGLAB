// ==========================================
// Timing / Rhythm Panel for Piano Musical project
// ==========================================
'use strict';

var TimingManager = {};

TimingManager.FIGURES = [
  { symbol: '\uD834\uDD5D', name: 'Semibreve', beats: 4, ms: 1600, color: '#6ee7b7' },
  { symbol: '\uD834\uDD65', name: 'M\u00ednima',   beats: 2, ms: 800,  color: '#fde68a' },
  { symbol: '\u2669',       name: 'Sem\u00ednima', beats: 1, ms: 400,  color: '#fca5a5' },
  { symbol: '\u266A',       name: 'Colcheia', beats: 0.5, ms: 200, color: '#93c5fd' },
  { symbol: '\uD834\uDD6F', name: 'Semicolcheia', beats: 0.25, ms: 100, color: '#d8b4fe' }
];

TimingManager.show = function() {
  var existing = document.getElementById('timing-panel');
  if (existing) { existing.style.display = 'block'; return; }

  var panel = document.createElement('div');
  panel.id = 'timing-panel';
  panel.style.cssText = 'position:fixed; left:' + Math.max(20, (window.innerWidth - 640) / 2) + 'px; top:' + Math.max(20, (window.innerHeight - 320) / 2 + 60) + 'px; width:640px; height:300px; background:linear-gradient(180deg,#111827,#020617); border:4px solid #f59e0b; border-radius:18px; box-shadow:0 16px 45px rgba(0,0,0,0.45); z-index:10002; display:flex; flex-direction:column; overflow:hidden; resize:both; min-width:320px; min-height:200px; max-width:1200px; font-family:Arial,sans-serif; color:white; user-select:none;';

  var header = document.createElement('div');
  header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 16px; cursor:grab; background:linear-gradient(90deg,#92400e,#f59e0b); flex-shrink:0;';
  header.innerHTML = '<div><strong style="font-size:20px;">\u2669 Temporiza\u00e7\u00e3o</strong></div>';

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

  var body = document.createElement('div');
  body.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:14px; overflow:hidden;';

  var info = document.createElement('div');
  info.style.cssText = 'font-size:13px; color:rgba(255,255,255,.6); margin-bottom:14px;';
  info.innerHTML = 'Clique numa figura para criar um bloco de espera. Se voc\u00ea clicou numa nota do piano primeiro, ela ser\u00e1 combinada com a dura\u00e7\u00e3o.';

  var grid = document.createElement('div');
  grid.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; justify-content:center; flex:1; align-items:center;';

  TimingManager.FIGURES.forEach(function(fig) {
    var card = document.createElement('button');
    card.type = 'button';
    card.style.cssText = 'flex:1; min-width:100px; display:flex; flex-direction:column; align-items:center; gap:4px; padding:18px 6px; background:rgba(255,255,255,.06); border-bottom:8px solid ' + fig.color + '; border-radius:12px; cursor:pointer; color:white; box-shadow:inset 0 -6px 12px rgba(0,0,0,.15); transition:transform .1s,filter .1s;';
    card.innerHTML = '<span style="font-size:clamp(22px,4vw,44px);">' + fig.symbol + '</span><span style="font-size:clamp(10px,1.4vw,14px); font-weight:bold;">' + fig.name + '</span><span style="font-size:clamp(9px,1.2vw,12px); color:' + fig.color + ';">' + fig.beats + ' tempo' + (fig.beats !== 1 ? 's' : '') + '</span>';
    card.addEventListener('mouseenter', function() { card.style.filter = 'brightness(1.2)'; card.style.transform = 'translateY(-2px)'; });
    card.addEventListener('mouseleave', function() { card.style.filter = ''; card.style.transform = ''; });
    card.addEventListener('click', function() { TimingManager._createTimingBlocks(fig); });
    grid.appendChild(card);
  });

  body.appendChild(info);
  body.appendChild(grid);
  panel.appendChild(header);
  panel.appendChild(body);

  var hint = document.createElement('div');
  hint.style.cssText = 'position:absolute; bottom:6px; right:10px; font-size:11px; color:rgba(255,255,255,.75); pointer-events:none; z-index:5;';
  hint.textContent = 'arraste o canto';
  panel.appendChild(hint);

  document.body.appendChild(panel);
  if (Code.translateDom) Code.translateDom(panel);
};

TimingManager._chainBlock = function(block) {
  if (window.MusicSequence && window.MusicSequence.chainBlock) {
    window.MusicSequence.chainBlock(block);
    return;
  }

  var m = Code.workspace.getMetrics ? Code.workspace.getMetrics() : null;
  var x = m ? m.viewLeft + 60 : 60;
  var y = m ? m.viewTop + 60 : 60;
  block.moveBy(x, y);
};

TimingManager._createTimingBlocks = function(fig) {
  if (!Code.workspace || !Blockly.Blocks['esperar_milisegundos']) return;

  var delayBlock = Code.workspace.newBlock('esperar_milisegundos');
  var numBlock = Code.workspace.newBlock('math_number');
  delayBlock.initSvg(); numBlock.initSvg();
  numBlock.setFieldValue(String(fig.ms), 'NUM');
  delayBlock.getInput('TIME').connection.connect(numBlock.outputConnection);
  delayBlock.render(); numBlock.render();
  TimingManager._chainBlock(delayBlock);
  delayBlock.select();
};

Code.showTimingPanel = TimingManager.show;
