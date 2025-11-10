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
      console.log('[SimpleStorage] Workspace saved');
    } catch (e) {
      console.error('[SimpleStorage] Save error:', e);
    }
  }

  // Load workspace from localStorage
  function loadWorkspace() {
    try {
      var xmlText = localStorage.getItem(STORAGE_KEY);
      if (!xmlText) {
        console.log('[SimpleStorage] No saved workspace found');
        return;
      }

      var workspace = Blockly.getMainWorkspace();
      if (!workspace) return;

      workspace.clear();
      var xml = Blockly.Xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xml, workspace);
      console.log('[SimpleStorage] Workspace loaded');
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

    console.log('[SimpleStorage] Auto-save enabled');
  }

  // Save on page unload
  window.addEventListener('beforeunload', saveWorkspace);
  window.addEventListener('unload', saveWorkspace);

  // Setup auto-save when workspace is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(setupAutoSave, 1000);
    });
  } else {
    setTimeout(setupAutoSave, 1000);
  }

  // Expose load function globally
  window.SimpleStorage = {
    load: loadWorkspace,
    save: saveWorkspace
  };
})();
