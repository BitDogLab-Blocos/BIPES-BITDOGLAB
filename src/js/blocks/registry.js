'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  function collectToolboxTypes(toolboxXml) {
    if (!toolboxXml || !toolboxXml.getElementsByTagName) {
      return [];
    }

    var nodes = toolboxXml.getElementsByTagName('block');
    var types = [];
    for (var i = 0; i < nodes.length; i++) {
      var type = nodes[i].getAttribute('type');
      if (type && types.indexOf(type) === -1) {
        types.push(type);
      }
    }
    return types.sort();
  }

  function inspectTypes(types) {
    var definitions = global.Blockly && global.Blockly.Blocks || {};
    var generators = global.Blockly && global.Blockly.Python || {};
    var missingDefinitions = [];
    var missingGenerators = [];

    (types || []).forEach(function(type) {
      if (!definitions[type]) {
        missingDefinitions.push(type);
      }
      if (typeof generators[type] !== 'function') {
        missingGenerators.push(type);
      }
    });

    return {
      valid: missingDefinitions.length === 0 && missingGenerators.length === 0,
      checkedTypes: (types || []).slice(),
      missingDefinitions: missingDefinitions,
      missingGenerators: missingGenerators
    };
  }

  function validateToolbox(toolboxXml) {
    var report = inspectTypes(collectToolboxTypes(toolboxXml));
    Code.BlockRegistry.lastReport = report;
    return report;
  }

  Code.BlockRegistry = {
    collectToolboxTypes: collectToolboxTypes,
    inspectTypes: inspectTypes,
    validateToolbox: validateToolbox,
    lastReport: null
  };
})(window);
