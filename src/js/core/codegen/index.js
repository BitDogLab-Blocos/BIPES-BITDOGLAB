'use strict';

var Code = window.Code || (window.Code = {});
var CodeGeneratorManager = window.CodeGeneratorManager || (window.CodeGeneratorManager = {});

Code.auto_mode = false;

Code.wrapWithInfiniteLoop = CodeGeneratorManager.wrapWithInfiniteLoop;
Code.generateCode = CodeGeneratorManager.generateCode;
Code.startAutoGeneration = CodeGeneratorManager.startAutoGeneration;
