'use strict';

class Tool extends ExecutionRunner {}

Tool.saveAsMainPy = MainFileService.saveAsMainPy;
Tool._doSaveAsMainPy = MainFileService._doSaveAsMainPy;

Tool.unix2date = function(timestamp) {
  var date = timestamp === undefined ? new Date() : new Date(timestamp);
  var hours = date.getHours();
  var minutes = '0' + date.getMinutes();
  var seconds = '0' + date.getSeconds();
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};

Tool.uid = function() {
  return (+new Date()).toString(36) + Math.random().toString(36).substr(2);
};

globalThis.Tool = Tool;
