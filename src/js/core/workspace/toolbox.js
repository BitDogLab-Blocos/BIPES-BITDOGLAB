'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

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
    if (Code.translateDom) {
      setTimeout(function() { Code.translateDom(document.body); }, 0);
    }
  } catch (e) {
    console.error('[BitdogLab] Erro ao filtrar toolbox:', e);
  }
};
WorkspaceManager.loadToolboxXml = function() {
  var toolboxXml;
  var request = new XMLHttpRequest();
  request.open('GET', '../js/config/toolbox.xml', false);
  request.send(null);

  if (request.status === 200) {
    toolboxXml = Blockly.Xml.textToDom(request.responseText);
  } else {
    toolboxXml = Blockly.Xml.textToDom("<xml><category name='Básico' colour='%{BKY_LOGIC_HUE}'><block type='controls_repeat_simple'></block><block type='controls_repeat_forever'></block><block type='controls_if'></block><block type='logic_compare'></block><block type='math_number'></block><block type='math_arithmetic'></block><block type='text'></block></category></xml>");
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
