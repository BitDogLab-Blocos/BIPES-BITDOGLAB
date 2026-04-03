'use strict';

var Code = window.Code || (window.Code = {});
var TabsManager = {};

Code.TABS_ = ['blocks', 'console', 'files', 'device', 'databoard'];
Code.current = ['blocks', '', ''];

TabsManager.getDataboardWindow = function() {
  var iframe = document.getElementById('databoard_iframe');
  return iframe ? iframe.contentWindow : null;
};

TabsManager.handleLink = function(_navigation, _pos) {
  var _pos0 = _pos === 2 ? 1 : 2;
  var crt = Code.current;

  var turnOff = function(elem, pos) {
    var _tab = get('#content_' + elem);
    var _nav = get('#tab_' + elem);
    Code.deinitContent(elem);
    _nav.classList.remove('on');
    if (pos === 1) _tab.classList.add('_pos1');
    if (pos === 2) _tab.classList.add('_pos2');
    _tab.classList.remove('pos' + pos);
    Animate.off(_tab);
  };

  var turnOn = function(elem, pos) {
    var _tab = get('#content_' + elem);
    var _nav = get('#tab_' + elem);
    Code.renderContent(elem);

    _nav.classList.add('on');
    Animate.on(_tab);
    _tab.classList.remove('_pos1', '_pos2');
    if (pos !== 0) _tab.classList.add('pos' + pos);
  };

  if (_pos === 0) {
    turnOn(_navigation, 0);
    Code.current = [_navigation, '', ''];
    return;
  }

  if (crt[_pos0] === _navigation) {
    var _tab = get('#content_' + crt[_pos]);
    var _tab0 = get('#content_' + crt[_pos0]);

    _tab.classList.remove('pos' + _pos);
    _tab.classList.add('pos' + _pos0);
    _tab0.classList.remove('pos' + _pos0);
    _tab0.classList.add('pos' + _pos);
    Code.current = ['', crt[2], crt[1]];
    return;
  }

  if (crt[0] === _navigation && crt[1] === '' && crt[2] === '') {
    return;
  }

  if (_pos === 1 && crt[0] !== '') {
    turnOff(crt[0], 0);
    crt[0] = _navigation;
    turnOn(crt[0], 0);
    Code.resizeContent();
    return;
  }

  if (_pos === 1) {
    if (crt[_pos] === _navigation && crt[_pos0] !== '') {
      turnOff(crt[_pos0], _pos0);
      get('#content_' + crt[_pos]).classList.remove('pos' + _pos);
      Code.current = [_navigation, '', ''];
      Code.resizeContent();
      return;
    }
  }

  if (_pos === 2) {
    if (crt[_pos] === _navigation && crt[_pos0] !== '') {
      turnOff(crt[_pos], _pos);
      get('#content_' + crt[_pos0]).classList.remove('pos' + _pos0);
      Code.current = [crt[_pos0], '', ''];
      Code.resizeContent();
      return;
    }
  }

  if (crt[_pos] !== _navigation && crt[0] === '') {
    if (crt[_pos] !== '') {
      turnOff(crt[_pos], _pos);
    }
    turnOn(_navigation, _pos);
    Code.current[_pos] = _navigation;
    Code.resizeContent();
    return;
  }

  if (_pos === 2 && crt[_pos] !== _navigation && crt[0] !== '') {
    get('#content_' + crt[0]).classList.add('pos1');
    turnOn(_navigation, 2);
    Code.current = ['', crt[0], _navigation];
    Code.resizeContent();
  }
};

TabsManager.renderContent = function(_navigation) {
  if (typeof _navigation === 'undefined') {
    return;
  }

  var content = get('#content_' + _navigation);
  switch (_navigation) {
    case 'databoard':
      setTimeout(function() {
        var databoardWindow = TabsManager.getDataboardWindow();
        if (!databoardWindow) return;

        if (!databoardWindow.inited) {
          if (typeof databoardWindow.modules === 'object' && typeof databoardWindow.modules.Workspaces === 'object') {
            databoardWindow.initDataStorage();
          } else {
            var interval = setInterval(function() {
              if (typeof databoardWindow.modules === 'object' && typeof databoardWindow.modules.Workspaces === 'object') {
                databoardWindow.initDataStorage();
                if (databoardWindow.inited) {
                  clearInterval(interval);
                }
              }
            }, 500);
          }
        } else {
          databoardWindow.initGrid();
        }
      }, 10);
      break;
    case 'blocks':
      Code.workspace.setVisible(true);
      Code.auto_mode = true;
      Blockly.svgResize(Code.workspace);
      break;
    case 'files':
      if (Code.prepareFilesPanel) {
        Code.prepareFilesPanel();
      }
      break;
    case 'console':
      term.resize();
      break;
    case 'device':
      break;
  }

  content.focus();
};

TabsManager.resizeContent = function() {
  Code.current.forEach(function(key) {
    switch (key) {
      case 'blocks':
        setTimeout(function() { Blockly.svgResize(Code.workspace); }, 250);
        break;
      case 'files':
        Files.resize();
        break;
      case 'console':
        term.resize();
        break;
      case 'databoard':
      case 'device':
        break;
    }
  });
};

TabsManager.deinitContent = function(_navigation) {
  switch (_navigation) {
    case 'databoard':
      var databoardWindow = TabsManager.getDataboardWindow();
      if (databoardWindow && databoardWindow.grid_inited) {
        databoardWindow.deinitGrid();
      }
      break;
    case 'blocks':
      Code.workspace.setVisible(false);
      Code.auto_mode = false;
      break;
  }
};

TabsManager.initTabs = function() {
  for (var i = 0; i < Code.TABS_.length; i++) {
    (function(name) {
      var tab = get('#tab_' + name);
      tab.addEventListener('click', function(ev) {
        ev.preventDefault();
        Code.handleLink(name, 1);
      });
      tab.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        Code.handleLink(name, 2);
      });
    })(Code.TABS_[i]);
  }

  Code.handleLink(Code.current[0], 0);
  Blockly.svgResize(Code.workspace);
};

Code.handleLink = TabsManager.handleLink;
Code.renderContent = TabsManager.renderContent;
Code.resizeContent = TabsManager.resizeContent;
Code.deinitContent = TabsManager.deinitContent;
Code.initTabs = TabsManager.initTabs;
