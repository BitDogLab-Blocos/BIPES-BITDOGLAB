'use strict';

var Code = window.Code || (window.Code = {});
var FileManager = {};

FileManager.bindClick = function(el, func) {
  if (typeof el === 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
};

FileManager.importPrettify = function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
  document.head.appendChild(script);
};

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

FileManager.initFileManager = function() {
  window.setTimeout(FileManager.importPrettify, 1);
};

Code.bindClick = FileManager.bindClick;
Code.importPrettify = FileManager.importPrettify;
Code.prepareFilesPanel = FileManager.prepareFilesPanel;
Code.generateXML = FileManager.generateXML;
Code.initFileManager = FileManager.initFileManager;
