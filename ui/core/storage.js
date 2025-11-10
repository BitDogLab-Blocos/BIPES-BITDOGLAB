// Simple auto-save storage - saves blocks automatically
(function() {
  'use strict';

  var STORAGE_KEY = 'bipes_workspace_backup';
  var saveTimeout;

  // Save workspace to localStorage
  function saveWorkspace() {
    try {
      var workspace = Blockly.getMainWorkspace();
      if (!workspace) return;

      var xml = Blockly.Xml.workspaceToDom(workspace);
      var xmlText = Blockly.Xml.domToText(xml);
      localStorage.setItem(STORAGE_KEY, xmlText);
    } catch (e) {
      console.error('[SimpleStorage] Save error:', e);
    }
  }

  // Load workspace from localStorage
  function loadWorkspace() {
    try {
      var xmlText = localStorage.getItem(STORAGE_KEY);
      if (!xmlText) return;

      var workspace = Blockly.getMainWorkspace();
      if (!workspace) return;

      workspace.clear();
      var xml = Blockly.Xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xml, workspace);
    } catch (e) {
      console.error('[SimpleStorage] Load error:', e);
    }
  }

  // Auto-save on changes (debounced)
  function setupAutoSave() {
    var workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      setTimeout(setupAutoSave, 500);
      return;
    }

    // Load saved workspace first
    loadWorkspace();

    workspace.addChangeListener(function(event) {
      if (event.type === Blockly.Events.BLOCK_CHANGE ||
          event.type === Blockly.Events.BLOCK_CREATE ||
          event.type === Blockly.Events.BLOCK_DELETE ||
          event.type === Blockly.Events.BLOCK_MOVE) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveWorkspace, 500);
      }
    });
  }

  // Save on page unload
  window.addEventListener('beforeunload', saveWorkspace);

  // Setup auto-save when workspace is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoSave);
  } else {
    setupAutoSave();
  }

  // Expose load function globally
  window.SimpleStorage = {
    load: loadWorkspace,
    save: saveWorkspace
  };
})();
