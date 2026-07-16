// Workspace validator for BitDogLab block contracts.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});
  var VALIDATION_ID = 'bitdoglab-contract';

  function msg(key) {
    if (Code.BlockContracts && Code.BlockContracts.getMessage) {
      return Code.BlockContracts.getMessage(key);
    }
    return key;
  }

  function format(template, value) {
    return String(template).replace('%1', value || '');
  }

  function getAllBlocks(workspace) {
    if (!workspace || !workspace.getAllBlocks) return [];
    return workspace.getAllBlocks(false).filter(function(block) {
      if (!block) return false;
      if (block.isInFlyout) return false;
      if (block.disabled || (block.isEnabled && !block.isEnabled())) return false;
      return true;
    });
  }

  function hasBlockType(blocks, types) {
    if (!types || !types.length) return true;
    for (var i = 0; i < blocks.length; i++) {
      if (types.indexOf(blocks[i].type) !== -1) return true;
    }
    return false;
  }

  function hasAncestor(block, types) {
    var parent = block && block.getSurroundParent ? block.getSurroundParent() : null;
    while (parent) {
      if (types.indexOf(parent.type) !== -1) return true;
      parent = parent.getSurroundParent ? parent.getSurroundParent() : null;
    }
    return false;
  }

  function getStatementInputChildren(block, inputName) {
    var children = [];
    var child = block.getInputTargetBlock && block.getInputTargetBlock(inputName);
    while (child) {
      children.push(child);
      child = child.getNextBlock ? child.getNextBlock() : null;
    }
    return children;
  }

  function addWarning(warnings, block, text) {
    if (!block || !text) return;
    if (!warnings[block.id]) warnings[block.id] = [];
    if (warnings[block.id].indexOf(text) === -1) {
      warnings[block.id].push(text);
    }
  }

  function clearContractWarning(block) {
    if (block && block.setWarningText) {
      block.setWarningText(null, VALIDATION_ID);
    }
  }

  function applyWarnings(blocks, warnings) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      clearContractWarning(block);
      if (warnings[block.id] && warnings[block.id].length) {
        block.setWarningText(warnings[block.id].join('\n'), VALIDATION_ID);
      }
    }
  }

  function validateValuePlacement(blocks, warnings) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.outputConnection) continue;
      if (!block.getParent || block.getParent()) continue;
      addWarning(warnings, block, msg('valueNeedsParent'));
    }
  }

  function validateContractRequirements(blocks, warnings) {
    if (!Code.BlockContracts) return;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var contract = Code.BlockContracts.get(block.type);
      if (!contract) continue;

      if (contract.requiresAnyBlock && !hasBlockType(blocks, contract.requiresAnyBlock)) {
        addWarning(
          warnings,
          block,
          format(msg('missingDriver'), contract.requiresLabel || contract.requiresAnyBlock.join(', '))
        );
      }

      if (contract.requiredAncestorAny &&
          !hasAncestor(block, contract.requiredAncestorAny)) {
        addWarning(
          warnings,
          block,
          format(msg('needsAncestor'), contract.requiredAncestorLabel || contract.requiredAncestorAny.join(', '))
        );
      }
    }
  }

  function validateMissingGenerators(blocks, warnings) {
    var generator = global.Blockly && global.Blockly.Python;
    if (!generator) return;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!generator[block.type]) {
        addWarning(warnings, block, msg('missingGenerator'));
      }
    }
  }

  function validateRequiredValueInputs(blocks, warnings) {
    if (!Code.BlockContracts) return;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var contract = Code.BlockContracts.get(block.type);
      if (!contract || !contract.requiredValueInputs) continue;

      for (var inputName in contract.requiredValueInputs) {
        if (!contract.requiredValueInputs.hasOwnProperty(inputName)) continue;
        var hasValue = block.getInputTargetBlock && block.getInputTargetBlock(inputName);
        if (!hasValue) {
          addWarning(
            warnings,
            block,
            format(msg('missingValueInput'), contract.requiredValueInputs[inputName])
          );
        }
      }
    }
  }
  function validateContainers(blocks, warnings) {
    if (!Code.BlockContracts) return;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var contract = Code.BlockContracts.get(block.type);
      if (!contract || !contract.inputs) continue;

      for (var inputName in contract.inputs) {
        if (!contract.inputs.hasOwnProperty(inputName)) continue;
        var rule = contract.inputs[inputName];
        var children = getStatementInputChildren(block, inputName);

        if (children.length === 0) {
          if (block.type === 'joystick_seletor') {
            addWarning(warnings, block, msg('emptyJoystickSelector'));
          } else {
            addWarning(warnings, block, msg('emptyStatementInput'));
          }
          continue;
        }

        for (var c = 0; c < children.length; c++) {
          if (rule.allow && rule.allow.indexOf(children[c].type) === -1) {
            addWarning(
              warnings,
              children[c],
              format(msg('wrongContainerChild'), rule.label)
            );
          }
        }
      }
    }
  }

  function validateDisplayTypeConflicts(blocks, warnings) {
    var displayTypes = {};
    var displayBlocks = [];

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.getFieldValue) continue;
      var displayType = block.getFieldValue('DISPLAY_TYPE');
      if (!displayType) continue;
      displayTypes[displayType] = true;
      displayBlocks.push(block);
    }

    if (Object.keys(displayTypes).length <= 1) return;

    for (var j = 0; j < displayBlocks.length; j++) {
      addWarning(warnings, displayBlocks[j], msg('displayTypeConflict'));
    }
  }

  function validateWorkspace(workspace) {
    var blocks = getAllBlocks(workspace);
    var warnings = {};

    validateMissingGenerators(blocks, warnings);
    validateValuePlacement(blocks, warnings);
    validateContractRequirements(blocks, warnings);
    validateRequiredValueInputs(blocks, warnings);
    validateContainers(blocks, warnings);
    validateDisplayTypeConflicts(blocks, warnings);

    applyWarnings(blocks, warnings);
    return warnings;
  }

  function getBlockLabel(block) {
    if (!block) return '';
    try {
      if (block.toString) {
        var label = block.toString(40);
        if (label) return label;
      }
    } catch (e) {}
    return block.type || '';
  }

  function getValidationReport(workspace) {
    var warnings = validateWorkspace(workspace);
    var blocks = getAllBlocks(workspace);
    var blockById = {};
    var issues = [];
    var totalMessages = 0;

    for (var i = 0; i < blocks.length; i++) {
      blockById[blocks[i].id] = blocks[i];
    }

    for (var blockId in warnings) {
      if (!warnings.hasOwnProperty(blockId) || !warnings[blockId].length) continue;
      var block = blockById[blockId] || null;
      totalMessages += warnings[blockId].length;
      issues.push({
        blockId: blockId,
        blockType: block ? block.type : '',
        blockLabel: getBlockLabel(block),
        messages: warnings[blockId].slice()
      });
    }

    return {
      valid: issues.length === 0,
      issueCount: issues.length,
      messageCount: totalMessages,
      issues: issues
    };
  }

  function getSummaryText(report, limit) {
    if (!report || report.valid) return '';
    var maxItems = limit || 3;
    var lines = [msg('workspaceHasIssues')];

    for (var i = 0; i < report.issues.length && i < maxItems; i++) {
      var issue = report.issues[i];
      var label = issue.blockLabel || issue.blockType || issue.blockId;
      lines.push('- ' + label + ': ' + issue.messages.join(' '));
    }

    if (report.issues.length > maxItems) {
      lines.push(format(msg('moreIssues'), String(report.issues.length - maxItems)));
    }

    return lines.join('\n');
  }

  function shouldValidateEvent(event) {
    if (!event || !global.Blockly || !global.Blockly.Events) return true;
    var events = global.Blockly.Events;
    return event.type === events.BLOCK_CREATE ||
           event.type === events.BLOCK_DELETE ||
           event.type === events.BLOCK_MOVE ||
           event.type === events.BLOCK_CHANGE ||
           event.type === events.FINISHED_LOADING;
  }

  function init(workspace) {
    if (!workspace || workspace.__bitdoglabContractValidation) return;
    workspace.__bitdoglabContractValidation = true;

    var timer = null;
    function schedule(event) {
      if (!shouldValidateEvent(event)) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        validateWorkspace(workspace);
      }, 120);
    }

    workspace.addChangeListener(schedule);
    setTimeout(function() {
      validateWorkspace(workspace);
    }, 500);
  }

  Code.BlockContractValidator = {
    VALIDATION_ID: VALIDATION_ID,
    init: init,
    getReport: getValidationReport,
    getSummaryText: getSummaryText,
    validateWorkspace: validateWorkspace
  };

  Code.initBlockValidation = init;
})(window);
