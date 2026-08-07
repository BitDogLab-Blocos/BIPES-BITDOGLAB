'use strict';

var Code = window.Code || (window.Code = {});
var FileManager = {};

FileManager.generateXML = function(workspace) {
  var activeWorkspace = workspace || Code.workspace;
  var xmlDom = Blockly.Xml.workspaceToDom(activeWorkspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  return UI['workspace'].writeWorkspace(xmlText, true);
};

Code.generateXML = FileManager.generateXML;
