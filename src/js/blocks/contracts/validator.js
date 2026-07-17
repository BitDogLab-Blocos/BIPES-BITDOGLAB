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

  function format2(template, first, second) {
    return String(template)
      .replace('%1', first || '')
      .replace('%2', second || '');
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

  function isStatementInput(input) {
    if (!input) return false;
    if (global.Blockly && typeof global.Blockly.STATEMENT_INPUT !== 'undefined') {
      return input.type === global.Blockly.STATEMENT_INPUT;
    }
    return input.type === 3;
  }

  function addWarning(warnings, block, text) {
    if (!block || !text) return;
    if (!warnings[block.id]) warnings[block.id] = [];
    if (warnings[block.id].indexOf(text) === -1) {
      warnings[block.id].push(text);
    }
  }

  function getConnectionChecks(connection) {
    if (!connection || !connection.getCheck) return [];
    return connection.getCheck() || [];
  }

  function checksAreCompatible(a, b) {
    if (!a || !a.length || !b || !b.length) return true;
    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) !== -1) return true;
    }
    return false;
  }

  function getConnectionXY(connection) {
    if (!connection) return null;
    var x = typeof connection.x_ === 'number' ? connection.x_ : connection.x;
    var y = typeof connection.y_ === 'number' ? connection.y_ : connection.y;
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    return { x: x, y: y };
  }

  function getOpenSourceConnections(block) {
    var connections = [];
    if (block.previousConnection && !block.previousConnection.targetConnection) {
      connections.push(block.previousConnection);
    }
    if (block.outputConnection && !block.outputConnection.targetConnection) {
      connections.push(block.outputConnection);
    }
    return connections;
  }

  function getOpenInputConnections(blocks) {
    var targets = [];
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.inputList) continue;

      for (var inputIndex = 0; inputIndex < block.inputList.length; inputIndex++) {
        var input = block.inputList[inputIndex];
        if (!input.connection || input.connection.targetConnection) continue;
        targets.push({
          block: block,
          input: input,
          connection: input.connection
        });
      }
    }
    return targets;
  }

  function distanceSquared(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function clearContractWarning(block) {
    if (block && block.setWarningText && block.__bitdoglabContractWarningText) {
      block.setWarningText(null, VALIDATION_ID);
      block.__bitdoglabContractWarningText = '';
    }
  }

  function applyWarnings(blocks, warnings) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var warningText = warnings[block.id] && warnings[block.id].length
        ? warnings[block.id].join('\n')
        : '';

      if (!warningText) {
        clearContractWarning(block);
      } else if (block.__bitdoglabContractWarningText !== warningText) {
        block.setWarningText(warningText, VALIDATION_ID);
        block.__bitdoglabContractWarningText = warningText;
      }
    }
  }

  function validateValuePlacement(blocks, warnings) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.outputConnection) continue;
      if (!block.getParent || block.getParent()) continue;
      var warning = Code.BlockTypeDomains && Code.BlockTypeDomains.getOutputWarning
        ? Code.BlockTypeDomains.getOutputWarning(block, Code.LANG || 'pt-br')
        : msg('valueNeedsParent');
      addWarning(warnings, block, warning);
    }
  }

  function validateNearMissConnections(blocks, warnings) {
    var targets = getOpenInputConnections(blocks);
    if (!targets.length) return;

    var maxDistance = 90;
    var maxDistanceSq = maxDistance * maxDistance;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.getParent || block.getParent()) continue;

      var sourceConnections = getOpenSourceConnections(block);
      if (!sourceConnections.length) continue;

      var nearest = null;
      var nearestSourceChecks = null;

      for (var s = 0; s < sourceConnections.length; s++) {
        var sourceConnection = sourceConnections[s];
        var sourceXY = getConnectionXY(sourceConnection);
        if (!sourceXY) continue;
        var sourceChecks = getConnectionChecks(sourceConnection);

        for (var t = 0; t < targets.length; t++) {
          if (targets[t].block === block) continue;

          var targetConnection = targets[t].connection;
          var targetXY = getConnectionXY(targetConnection);
          if (!targetXY) continue;

          var distSq = distanceSquared(sourceXY, targetXY);
          if (distSq > maxDistanceSq) continue;

          var targetChecks = getConnectionChecks(targetConnection);
          if (checksAreCompatible(sourceChecks, targetChecks)) continue;

          if (!nearest || distSq < nearest.distanceSq) {
            nearest = {
              distanceSq: distSq,
              targetBlock: targets[t].block,
              targetChecks: targetChecks
            };
            nearestSourceChecks = sourceChecks;
          }
        }
      }

      if (nearest) {
        var expected = Code.BlockTypeDomains && Code.BlockTypeDomains.describeChecks
          ? Code.BlockTypeDomains.describeChecks(nearest.targetChecks, Code.LANG || 'pt-br')
          : nearest.targetChecks.join(', ');
        var sourceChecks = nearestSourceChecks || [];
        if (sourceChecks.length > 1 && sourceChecks.indexOf('ProgramCommand') !== -1) {
          sourceChecks = sourceChecks.filter(function(check) {
            return check !== 'ProgramCommand';
          });
        }
        var received = Code.BlockTypeDomains && Code.BlockTypeDomains.describeChecks
          ? Code.BlockTypeDomains.describeChecks(sourceChecks, Code.LANG || 'pt-br')
          : sourceChecks.join(', ');
        addWarning(warnings, nearest.targetBlock, format2(msg('nearIncompatibleConnection'), expected, received));
      }
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

      if (contract.requiredValueInputPrefixes && block.inputList) {
        for (var prefix in contract.requiredValueInputPrefixes) {
          if (!contract.requiredValueInputPrefixes.hasOwnProperty(prefix)) continue;

          for (var inputIndex = 0; inputIndex < block.inputList.length; inputIndex++) {
            var input = block.inputList[inputIndex];
            if (!input.name || input.name.indexOf(prefix) !== 0 || !input.connection) continue;

            var hasPrefixedValue = block.getInputTargetBlock && block.getInputTargetBlock(input.name);
            if (!hasPrefixedValue) {
              addWarning(
                warnings,
                block,
                format(msg('missingValueInput'), contract.requiredValueInputPrefixes[prefix])
              );
            }
          }
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

      if (contract.dynamicStatementInputs && block.inputList) {
        for (var r = 0; r < contract.dynamicStatementInputs.length; r++) {
          var dynamicRule = contract.dynamicStatementInputs[r];

          for (var inputIndex = 0; inputIndex < block.inputList.length; inputIndex++) {
            var input = block.inputList[inputIndex];
            if (!input.name || input.name.indexOf(dynamicRule.prefix) !== 0 || !isStatementInput(input)) {
              continue;
            }

            var dynamicChildren = getStatementInputChildren(block, input.name);
            if (dynamicChildren.length === 0) {
              addWarning(warnings, block, msg('emptyStatementInput'));
              continue;
            }

            for (var d = 0; d < dynamicChildren.length; d++) {
              if (dynamicRule.allow && dynamicRule.allow.indexOf(dynamicChildren[d].type) === -1) {
                addWarning(
                  warnings,
                  dynamicChildren[d],
                  format(msg('wrongContainerChild'), dynamicRule.label)
                );
              }
            }
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
    validateNearMissConnections(blocks, warnings);

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
