'use strict';

var Code = window.Code || (window.Code = {});
var CodeGeneratorManager = window.CodeGeneratorManager || (window.CodeGeneratorManager = {});

CodeGeneratorManager.startAutoGeneration = function() {
  setTimeout(function() {
    Code._generationInterval = setInterval(Code.generateCode, 250);
    Code.auto_mode = true;
  }, 500);
};

