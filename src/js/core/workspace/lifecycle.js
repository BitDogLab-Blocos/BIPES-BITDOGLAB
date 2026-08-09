'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

Code.workspace = null;
Code._fullToolboxXml = null;

WorkspaceManager.loadBlocks = function(defaultXml) {
  var loadOnce = null;
  try {
    loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {}

  var interval_ = setInterval(function() {
    if (typeof UI !== 'undefined' && UI['workspace']) {
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

WorkspaceManager.tuneBlocklyControls = function() {
  if (Blockly.ZoomControls) {
    Blockly.ZoomControls.prototype.WIDTH_ = 38;
    Blockly.ZoomControls.prototype.HEIGHT_ = 38;
    Blockly.ZoomControls.prototype.SMALL_SPACING_ = 4;
    Blockly.ZoomControls.prototype.LARGE_SPACING_ = 12;
    Blockly.ZoomControls.prototype.MARGIN_VERTICAL_ = 24;
    Blockly.ZoomControls.prototype.MARGIN_HORIZONTAL_ = 24;
  }

  if (Blockly.Trashcan) {
    Blockly.Trashcan.prototype.WIDTH_ = 56;
    Blockly.Trashcan.prototype.BODY_HEIGHT_ = 52;
    Blockly.Trashcan.prototype.LID_HEIGHT_ = 19;
    Blockly.Trashcan.prototype.MARGIN_VERTICAL_ = 24;
    Blockly.Trashcan.prototype.MARGIN_HORIZONTAL_ = 24;
    Blockly.Trashcan.OPACITY_MIN_ = 0.78;
    Blockly.Trashcan.OPACITY_MAX_ = 1;
  }
};

WorkspaceManager.scaleSvgSpriteImages = function(selector, scale) {
  document.querySelectorAll(selector).forEach((image) => {
    ['width', 'height', 'x', 'y'].forEach((attribute) => {
      const value = Number(image.getAttribute(attribute));
      if (!Number.isNaN(value)) image.setAttribute(attribute, value * scale);
    });
  });
};

WorkspaceManager.enhanceBlocklyControls = function() {
  document.querySelectorAll('.blocklyZoom clipPath rect').forEach((rect) => {
    rect.setAttribute('width', 38);
    rect.setAttribute('height', 38);
  });

  WorkspaceManager.scaleSvgSpriteImages('.blocklyZoom image', 1.19);
  WorkspaceManager.scaleSvgSpriteImages('.blocklyTrash image', 1.18);
};

WorkspaceManager.initWorkspace = function() {
  var rtl = Code.isRtl();

  if (Code.startAutoGeneration) {
    Code.startAutoGeneration();
  }

  WorkspaceManager.importCategoryMessages();
  var toolboxXml = WorkspaceManager.loadToolboxXml();
  WorkspaceManager.tuneBlocklyControls();

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
  WorkspaceManager.enhanceBlocklyControls();

  var flyout = Code.workspace.getFlyout();
  if (flyout) flyout.width_ = 300;

  WorkspaceManager.bindWorkspaceHints();
  if (Code.initBlockValidation) {
    Code.initBlockValidation(Code.workspace);
  }
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

