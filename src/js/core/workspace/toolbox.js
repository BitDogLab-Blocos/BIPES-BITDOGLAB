'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

WorkspaceManager.updateArrowCategoryToggle = function(project) {
  var button = document.getElementById('arrowCategoriesToggle');
  if (!button) return;
  button.hidden = project !== 'robo_setas';
  var expanded = WorkspaceManager.arrowCategoriesExpanded;
  var label = expanded ? MSG.arrowCategoriesCollapse : MSG.arrowCategoriesExpand;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', String(!!expanded));
  button.querySelector('span').textContent = expanded ? '‹' : '›';

  var toolbox = Code.workspace.getToolbox();
  var toolboxDiv = toolbox && toolbox.HtmlDiv;
  if (toolboxDiv) {
    if (!toolboxDiv.id) toolboxDiv.id = 'arrowCategoryList';
    button.setAttribute('aria-controls', toolboxDiv.id);
    var position = function() {
      button.style.left = toolboxDiv.offsetLeft + toolboxDiv.offsetWidth + 'px';
    };
    position();
    if (!WorkspaceManager._arrowCategoryObserver && typeof ResizeObserver !== 'undefined') {
      WorkspaceManager._arrowCategoryObserver = new ResizeObserver(position);
      WorkspaceManager._arrowCategoryObserver.observe(toolboxDiv);
    }
  }

  if (!button.__arrowCategoriesBound) {
    button.__arrowCategoriesBound = true;
    var dragStart = null;
    var suppressClick = false;
    button.addEventListener('pointerdown', function(event) {
      if (event.button !== 0) return;
      dragStart = event.clientX;
      suppressClick = false;
      button.setPointerCapture(event.pointerId);
      button.classList.add('is-dragging');
    });
    button.addEventListener('pointerup', function(event) {
      if (dragStart === null) return;
      var distance = event.clientX - dragStart;
      dragStart = null;
      button.classList.remove('is-dragging');
      suppressClick = Math.abs(distance) >= 24;
      if (suppressClick && WorkspaceManager._toolboxProject === 'robo_setas') {
        WorkspaceManager.filterToolboxByProject('robo_setas', distance > 0);
      }
    });
    button.addEventListener('pointercancel', function() {
      dragStart = null;
      suppressClick = false;
      button.classList.remove('is-dragging');
    });
    button.addEventListener('click', function() {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      if (WorkspaceManager._toolboxProject !== 'robo_setas') return;
      WorkspaceManager.filterToolboxByProject('robo_setas', !WorkspaceManager.arrowCategoriesExpanded);
    });
  }
};

WorkspaceManager.filterToolboxByProject = function(project, expandArrowCategories) {
  if (WorkspaceManager.updateRobotLedLegend) {
    WorkspaceManager.updateRobotLedLegend(project);
  }
  if (!Code._fullToolboxXml) return;

  var projectChanged = WorkspaceManager._toolboxProject !== project;
  WorkspaceManager._toolboxProject = project;
  // In arrow mode, scroll through the vertical mission; Ctrl+wheel still zooms.
  Code.workspace.options.moveOptions.wheel = project === 'robo_setas' &&
    Code.workspace.getTopBlocks(false).some(function(block) {
      return block.type === 'robo_setas_iniciar';
    });
  WorkspaceManager.arrowCategoriesExpanded = project === 'robo_setas' && !!expandArrowCategories;
  var arrowsOnly = project === 'robo_setas' && !WorkspaceManager.arrowCategoriesExpanded;
  document.getElementById('content_blocks').classList.toggle('is-arrow-toolbox-collapsed', arrowsOnly);

  var filtered = Code._fullToolboxXml.cloneNode(true);
  var categories = filtered.getElementsByTagName('category');
  for (var i = categories.length - 1; i >= 0; i--) {
    var cat = categories[i];
    var dataProject = cat.getAttribute('data-project');
    if (arrowsOnly && !dataProject) {
      cat.parentNode.removeChild(cat);
      continue;
    }
    if (dataProject) {
      var projects = dataProject.split(',').map(function(s) { return s.trim(); });
      if (projects.indexOf(project) === -1) {
        cat.parentNode.removeChild(cat);
      } else if (arrowsOnly) {
        cat.setAttribute('name', cat.getAttribute('data-visual-icon') || cat.getAttribute('name'));
      }
    }
  }

  try {
    if (Code.translateToolboxXml) {
      filtered = Code.translateToolboxXml(filtered);
    }
    Code.workspace.updateToolbox(filtered);
    WorkspaceManager.updateArrowCategoryToggle(project);
    if (arrowsOnly) {
      var toolbox = Code.workspace.getToolbox();
      toolbox.clearSelection();
      var visualCategories = toolbox.HtmlDiv.querySelectorAll('[role="treeitem"]');
      visualCategories.forEach(function(category, index) {
        var label = index === 0 ? MSG.projectRobotArrows : MSG.arrowFeedbackCategory;
        category.setAttribute('aria-label', label);
        category.title = label;
      });
    }
    Blockly.svgResize(Code.workspace);
    if (projectChanged && WorkspaceManager.focusArrowSequence) {
      WorkspaceManager.focusArrowSequence();
    }
    if (Code.BlockContractValidator) {
      Code.BlockContractValidator.validateWorkspace(Code.workspace);
    }
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
  request.open('GET', '../js/config/toolbox.xml?ver=20261006oledOrder1', false);
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
