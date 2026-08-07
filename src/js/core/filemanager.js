'use strict';

var Code = window.Code || (window.Code = {});
var FileManager = {};

FileManager.prepareFilesPanel = function() {
  if (Files.editor.init === undefined) {
    Files.editor.setValue(new Array(9).fill('\r\n').join(''));
    setTimeout(function() {
      Files.editor.setValue('');
      Files.editor.init = true;
    }, 10);
  }
  Files.handleCurrentProject();
};

FileManager.generateXML = function(workspace) {
  var activeWorkspace = workspace || Code.workspace;
  var xmlDom = Blockly.Xml.workspaceToDom(activeWorkspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  return UI['workspace'].writeWorkspace(xmlText, true);
};

Code.prepareFilesPanel = FileManager.prepareFilesPanel;
Code.generateXML = FileManager.generateXML;
