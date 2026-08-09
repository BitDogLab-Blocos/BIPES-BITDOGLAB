'use strict';

(function(global) {
  var PageBootstrap = {};

  PageBootstrap.loadProjectToolbox = function() {
    try {
      if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace()) {
        return;
      }

      var request = new XMLHttpRequest();
      request.open('GET', '../js/config/toolbox.xml?ver=20260718a1', true);
      request.onreadystatechange = function() {
        if (request.readyState !== 4 || request.status !== 200) {
          return;
        }

        Code._fullToolboxXml = Blockly.Xml.textToDom(request.responseText);
        if (Code.BlockRegistry) {
          var registryReport = Code.BlockRegistry.validateToolbox(Code._fullToolboxXml);
          if (!registryReport.valid) {
            console.warn('[BitDogLab] Toolbox registry issues:', registryReport);
          }
        }
        var project = localStorage.getItem('bitdoglab_project') || 'basico';
        Code.filterToolboxByProject(project);
        Code.initProjectSelector();

        console.log('[BitdogLab] Toolbox loaded, project:', project);
        Blockly.svgResize(Blockly.getMainWorkspace());
      };
      request.send(null);
    } catch (error) {
      console.error('Toolbox load error:', error);
    }
  };

  PageBootstrap.init = function() {
    Code.init();
    AppServices.init();
    Tool.clearQueue();
  };

  PageBootstrap.init();
  global.addEventListener('load', PageBootstrap.loadProjectToolbox);
  global.PageBootstrap = PageBootstrap;
})(window);
