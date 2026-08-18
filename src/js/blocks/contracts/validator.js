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

  function format3(template, first, second, third) {
    return String(template)
      .replace('%1', first || '')
      .replace('%2', second || '')
      .replace('%3', third || '');
  }

  function getWorkspaceBlocks(workspace) {
    if (!workspace || !workspace.getAllBlocks) return [];
    return workspace.getAllBlocks(false).filter(function(block) {
      if (!block) return false;
      if (block.isInFlyout) return false;
      return true;
    });
  }

  function isBlockDisabled(block) {
    if (!block) return true;
    if (block.disabled) return true;
    if (block.isEnabled && !block.isEnabled()) return true;
    if (block.getInheritedDisabled && block.getInheritedDisabled()) return true;
    return false;
  }

  function isBlockEffectivelyEnabled(block) {
    var current = block;
    while (current) {
      if (isBlockDisabled(current)) return false;
      current = current.getParent ? current.getParent() : null;
    }
    return true;
  }

  function getAllBlocks(workspace) {
    return getWorkspaceBlocks(workspace).filter(isBlockEffectivelyEnabled);
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

  function isValueInput(input) {
    if (!input) return false;
    if (global.Blockly && typeof global.Blockly.VALUE_INPUT !== 'undefined') {
      return input.type === global.Blockly.VALUE_INPUT;
    }
    return input.type === 1;
  }

  function addWarning(warnings, block, text) {
    if (!block || !text) return;
    if (!warnings[block.id]) warnings[block.id] = [];
    if (warnings[block.id].indexOf(text) === -1) {
      warnings[block.id].push(text);
    }
  }

  // Notices are displayed on the block but do not prevent code generation.
  // They are used for editable labels and other guidance that is useful while
  // assembling a project but is not a physical or type-safety error.
  function addNotice(notices, block, text) {
    if (!block || !text) return;
    if (!notices[block.id]) notices[block.id] = [];
    if (notices[block.id].indexOf(text) === -1) {
      notices[block.id].push(text);
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

  function applyWarnings(blocks, warnings, notices) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var messages = [];
      if (warnings[block.id]) messages = messages.concat(warnings[block.id]);
      if (notices && notices[block.id]) messages = messages.concat(notices[block.id]);
      var warningText = messages.length ? messages.join('\n') : '';

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
      if (!contract || (!contract.requiredValueInputs && !contract.requiredValueInputPrefixes)) continue;

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
            if (!input.name || input.name.indexOf(prefix) !== 0 || !isValueInput(input) || !input.connection) continue;

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

  function hasExplicitRequiredValueRule(contract, inputName) {
    if (!contract || !inputName) return false;

    if (contract.requiredValueInputs &&
        contract.requiredValueInputs.hasOwnProperty(inputName)) {
      return true;
    }

    if (contract.requiredValueInputPrefixes) {
      for (var prefix in contract.requiredValueInputPrefixes) {
        if (contract.requiredValueInputPrefixes.hasOwnProperty(prefix) &&
            inputName.indexOf(prefix) === 0) {
          return true;
        }
      }
    }

    return false;
  }

  function validateTypedEmptyValueInputs(blocks, warnings) {
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var contract = Code.BlockContracts && Code.BlockContracts.get
        ? Code.BlockContracts.get(block.type)
        : null;
      if (!block.inputList) continue;

      for (var inputIndex = 0; inputIndex < block.inputList.length; inputIndex++) {
        var input = block.inputList[inputIndex];
        if (!isValueInput(input) || !input.connection || input.connection.targetConnection) continue;
        if (hasExplicitRequiredValueRule(contract, input.name)) continue;

        var checks = getConnectionChecks(input.connection);
        if (!checks.length) continue;

        var label = Code.BlockTypeDomains && Code.BlockTypeDomains.describeChecks
          ? Code.BlockTypeDomains.describeChecks(checks, Code.LANG || 'pt-br')
          : checks.join(', ');
        addWarning(warnings, block, format(msg('missingValueInput'), label));
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

  function isOledBlock(block) {
    if (!block) return false;
    if (block.type && block.type.indexOf('display_') === 0) return true;
    if (block.type === 'cronometro_mostrar') return true;
    return Boolean(block.getFieldValue && block.getFieldValue('DISPLAY_TYPE'));
  }

  function validateServoOledV7PinConflicts(blocks, warnings) {
    var config = global.BitdogLabConfig;
    if (!config || !config.PINS || !config.EXTERNAL || !config.EXTERNAL.DIG_PINS) return;
    if (!blocks.some(isOledBlock)) return;

    var oledPins = [config.PINS.I2C_SDA, config.PINS.I2C_SCL];
    var servoControllers = [
      'servo_mover',
      'servo_joystick_controlar',
      'servo_subir_gradualmente',
      'servo_descer_gradualmente'
    ];

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (servoControllers.indexOf(block.type) === -1 || !block.getFieldValue) continue;

      var dig = String(block.getFieldValue('DIG'));
      var servoPin = config.EXTERNAL.DIG_PINS[dig];
      if (oledPins.indexOf(servoPin) !== -1) {
        addWarning(warnings, block, msg('servoOledV7PinConflict'));
      }
    }
  }

  function validateDht11V7PinConflicts(blocks, warnings) {
    var config = global.BitdogLabConfig;
    if (!config || config.VERSION !== 'v7' || !config.EXTERNAL || !config.EXTERNAL.DHT11) return;
    var allowed = config.EXTERNAL.DHT11.ALLOWED_DIG || ['0', '1'];
    var dht11Types = ['dht11_temperatura', 'dht11_umidade'];

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (dht11Types.indexOf(block.type) === -1 || !block.getFieldValue) continue;

      var dig = String(block.getFieldValue('DIG'));
      if (allowed.indexOf(dig) === -1) {
        addWarning(warnings, block, format(msg('dht11V7PinConflict'), dig));
      }
    }
  }

  function validateDht11Aht20V7I2c0Conflicts(blocks, warnings) {
    var config = global.BitdogLabConfig;
    if (!config || config.VERSION !== 'v7' || !config.SENSOR || Number(config.SENSOR.I2C_BUS) !== 0) return;

    var dht11Types = ['dht11_temperatura', 'dht11_umidade'];
    var aht20Types = [
      'sensor_temperatura',
      'sensor_umidade',
      'sensor_estufa_comparar',
      'estufa_plotar'
    ];
    var dhtClaims = [];
    var aht20Blocks = [];

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block || !block.getFieldValue) continue;

      if (dht11Types.indexOf(block.type) !== -1) {
        var dig = String(block.getFieldValue('DIG'));
        if (dig === '0' || dig === '1') {
          dhtClaims.push({ block: block, connection: dig });
        }
      }

      if (aht20Types.indexOf(block.type) !== -1) {
        aht20Blocks.push(block);
      }
    }

    if (!dhtClaims.length || !aht20Blocks.length) return;

    for (var dhtIndex = 0; dhtIndex < dhtClaims.length; dhtIndex++) {
      addWarning(
        warnings,
        dhtClaims[dhtIndex].block,
        format(msg('dht11Aht20V7I2c0Conflict'), dhtClaims[dhtIndex].connection)
      );
    }

    var firstConnection = dhtClaims[0].connection;
    var ahtWarning = format(msg('dht11Aht20V7I2c0Conflict'), firstConnection);
    for (var ahtIndex = 0; ahtIndex < aht20Blocks.length; ahtIndex++) {
      addWarning(warnings, aht20Blocks[ahtIndex], ahtWarning);
    }
  }

  var EXTERNAL_LED_TYPES = [
    'led_externo_ligar',
    'led_externo_desligar',
    'led_externo_piscar_rapido',
    'led_externo_piscar_lento'
  ];
  var EXTERNAL_LED_GLOBAL_TYPES = ['led_externo_desligar_todos'];
  var EXTERNAL_LED_ANY_TYPES = EXTERNAL_LED_TYPES.concat([
    'led_externo_criar_animacao'
  ], EXTERNAL_LED_GLOBAL_TYPES);

  function validateExternalLedRules(blocks, warnings) {
    var config = global.BitdogLabConfig || {};
    var external = config.EXTERNAL || {};
    var ledConfig = external.EXTERNAL_LED || {};
    var allowed = (ledConfig.ALLOWED_DIG || Object.keys(external.DIG_PINS || {})).map(String);
    var pwmDig = (ledConfig.PWM_DIG || allowed).map(String);
    var channels = (ledConfig.CHANNELS || ['R', 'G', 'B']).map(String);
    var byChannel = {};
    var byDig = {};

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (EXTERNAL_LED_TYPES.indexOf(block.type) === -1 || !block.getFieldValue) continue;

      var dig = String(block.getFieldValue('DIG') || '');
      var channel = String(block.getFieldValue('CHANNEL') || '');
      if (allowed.indexOf(dig) === -1) {
        addWarning(warnings, block, msg('externalLedInvalidConnection'));
      }
      if (channels.indexOf(channel) === -1) {
        addWarning(warnings, block, msg('externalLedInvalidChannel'));
      }
      if (ledConfig.PWM_REQUIRED && allowed.indexOf(dig) !== -1 && pwmDig.indexOf(dig) === -1) {
        addWarning(warnings, block, format(msg('externalLedPwmRequired'), dig));
      }

      if (channels.indexOf(channel) === -1 || allowed.indexOf(dig) === -1) continue;
      if (!byChannel[channel]) byChannel[channel] = [];
      if (!byDig[dig]) byDig[dig] = [];
      byChannel[channel].push({ block: block, dig: dig });
      byDig[dig].push({ block: block, channel: channel });
    }

    for (var channelIndex = 0; channelIndex < channels.length; channelIndex++) {
      var currentChannel = channels[channelIndex];
      var channelClaims = byChannel[currentChannel] || [];
      var channelDigs = [];
      for (var claimIndex = 0; claimIndex < channelClaims.length; claimIndex++) {
        if (channelDigs.indexOf(channelClaims[claimIndex].dig) === -1) {
          channelDigs.push(channelClaims[claimIndex].dig);
        }
      }

      if (channelDigs.length > 1) {
        for (var channelWarningIndex = 0; channelWarningIndex < channelClaims.length; channelWarningIndex++) {
          addWarning(
            warnings,
            channelClaims[channelWarningIndex].block,
            format3(msg('externalLedDuplicateChannel'), currentChannel, channelDigs[0], channelDigs[1])
          );
        }
      }
    }

    for (var digKey in byDig) {
      if (!byDig.hasOwnProperty(digKey)) continue;
      var digClaims = byDig[digKey];
      var digChannels = [];
      for (var digIndex = 0; digIndex < digClaims.length; digIndex++) {
        if (digChannels.indexOf(digClaims[digIndex].channel) === -1) {
          digChannels.push(digClaims[digIndex].channel);
        }
      }
      if (digChannels.length < 2) continue;

      for (var duplicateIndex = 0; duplicateIndex < digClaims.length; duplicateIndex++) {
        addWarning(
          warnings,
          digClaims[duplicateIndex].block,
          format3(msg('externalLedDuplicateConnection'), digChannels[0], digChannels[1], digKey)
        );
      }
    }

  }

  function validateExternalLedOledV7PinConflicts(blocks, warnings, notices) {
    var config = global.BitdogLabConfig;
    if (!config || config.VERSION !== 'v7' || !config.PINS || !config.EXTERNAL || !config.EXTERNAL.DIG_PINS) return;
    if (!blocks.some(isOledBlock)) return;

    var externalLedBlocks = [];
    for (var externalIndex = 0; externalIndex < blocks.length; externalIndex++) {
      if (EXTERNAL_LED_ANY_TYPES.indexOf(blocks[externalIndex].type) !== -1) {
        externalLedBlocks.push(blocks[externalIndex]);
      }
    }
    if (externalLedBlocks.length) {
      addNotice(notices, externalLedBlocks[0], msg('externalLedOledV7Notice'));
    }

    for (var globalIndex = 0; globalIndex < blocks.length; globalIndex++) {
      if (EXTERNAL_LED_GLOBAL_TYPES.indexOf(blocks[globalIndex].type) !== -1) {
        addWarning(warnings, blocks[globalIndex], msg('externalLedGlobalOledV7Conflict'));
      }
    }

    var oledPins = [config.PINS.I2C_SDA, config.PINS.I2C_SCL];
    var channels = {};
    var ledConfig = config.EXTERNAL.EXTERNAL_LED || {};
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (EXTERNAL_LED_TYPES.indexOf(block.type) === -1 || !block.getFieldValue) continue;
      var dig = String(block.getFieldValue('DIG'));
      var channel = String(block.getFieldValue('CHANNEL') || '');
      if (channel) channels[channel] = true;
      var pin = config.EXTERNAL.DIG_PINS[dig];
      if (oledPins.indexOf(pin) !== -1) {
        addWarning(warnings, block, msg('externalLedOledV7PinConflict'));
      }
    }

    if (Object.keys(channels).length >= 3) {
      for (var fullIndex = 0; fullIndex < blocks.length; fullIndex++) {
        if (EXTERNAL_LED_TYPES.indexOf(blocks[fullIndex].type) !== -1) {
          addWarning(warnings, blocks[fullIndex], msg('externalLedRgbOledConflict'));
        }
      }
    }
  }

  function validateExternalResourceConflicts(blocks, warnings) {
    var config = global.BitdogLabConfig;
    var registry = Code.ExternalResources;
    if (!config || !registry || !registry.getClaims) return;

    var claimsByResource = {};
    for (var i = 0; i < blocks.length; i++) {
      var claims = registry.getClaims(blocks[i], config);
      for (var claimIndex = 0; claimIndex < claims.length; claimIndex++) {
        var claim = claims[claimIndex];
        if (!claimsByResource[claim.resourceKey]) claimsByResource[claim.resourceKey] = [];
        claimsByResource[claim.resourceKey].push(claim);
      }
    }

    for (var resourceKey in claimsByResource) {
      if (!claimsByResource.hasOwnProperty(resourceKey)) continue;
      var resourceClaims = claimsByResource[resourceKey];

      for (var leftIndex = 0; leftIndex < resourceClaims.length; leftIndex++) {
        for (var rightIndex = leftIndex + 1; rightIndex < resourceClaims.length; rightIndex++) {
          var left = resourceClaims[leftIndex];
          var right = resourceClaims[rightIndex];
          if (left.peripheralId === right.peripheralId) continue;

          addWarning(
            warnings,
            left.block,
            format2(msg('externalConnectionConflict'), left.connection, right.peripheralLabel)
          );
          addWarning(
            warnings,
            right.block,
            format2(msg('externalConnectionConflict'), right.connection, left.peripheralLabel)
          );
        }
      }
    }
  }

  function validateServoRules(blocks, warnings) {
    var controllerTypes = [
      'servo_mover',
      'servo_joystick_controlar',
      'servo_subir_gradualmente',
      'servo_descer_gradualmente'
    ];
    var controllerConnections = {};

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.getFieldValue) continue;

      if (controllerTypes.indexOf(block.type) !== -1) {
        controllerConnections[String(block.getFieldValue('DIG'))] = true;
      }

      if (block.type === 'servo_joystick_controlar' &&
          block.getFieldValue('DIR_INCREASE') === block.getFieldValue('DIR_DECREASE')) {
        addWarning(warnings, block, msg('servoJoystickSameDirection'));
      }

      if (block.type === 'servo_subir_gradualmente') {
        var raiseStart = Number(block.getFieldValue('START'));
        var raiseTarget = Number(block.getFieldValue('TARGET'));
        if (raiseStart >= raiseTarget) {
          addWarning(warnings, block, msg('servoRaiseAngleOrder'));
        }
      }

      if (block.type === 'servo_descer_gradualmente') {
        var lowerStart = Number(block.getFieldValue('START'));
        var lowerTarget = Number(block.getFieldValue('TARGET'));
        if (lowerStart <= lowerTarget) {
          addWarning(warnings, block, msg('servoLowerAngleOrder'));
        }
      }
    }

    if (Object.keys(controllerConnections).length === 0) return;

    for (var j = 0; j < blocks.length; j++) {
      var angleBlock = blocks[j];
      if (angleBlock.type !== 'servo_angulo_atual' || !angleBlock.getFieldValue) continue;

      var angleConnection = String(angleBlock.getFieldValue('DIG'));
      if (!controllerConnections[angleConnection]) {
        addWarning(
          warnings,
          angleBlock,
          format(msg('servoAngleConnectionMismatch'), angleConnection)
        );
      }
    }
  }

  function validateWorkspace(workspace) {
    var allBlocks = getWorkspaceBlocks(workspace);
    var blocks = allBlocks.filter(isBlockEffectivelyEnabled);
    var warnings = {};
    var notices = {};

    validateMissingGenerators(blocks, warnings);
    validateValuePlacement(blocks, warnings);
    validateContractRequirements(blocks, warnings);
    validateRequiredValueInputs(blocks, warnings);
    validateTypedEmptyValueInputs(blocks, warnings);
    validateContainers(blocks, warnings);
    validateDisplayTypeConflicts(blocks, warnings);
    validateServoRules(blocks, warnings);
    validateServoOledV7PinConflicts(blocks, warnings);
    validateDht11V7PinConflicts(blocks, warnings);
    validateDht11Aht20V7I2c0Conflicts(blocks, warnings);
    validateExternalLedRules(blocks, warnings);
    validateExternalLedOledV7PinConflicts(blocks, warnings, notices);
    validateExternalResourceConflicts(blocks, warnings);
    validateNearMissConnections(blocks, warnings);

    applyWarnings(allBlocks, warnings, notices);
    warnings.__bitdoglabNotices = notices;
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
    var notices = warnings.__bitdoglabNotices || {};
    var blocks = getAllBlocks(workspace);
    var blockById = {};
    var issues = [];
    var totalMessages = 0;

    for (var i = 0; i < blocks.length; i++) {
      blockById[blocks[i].id] = blocks[i];
    }

    for (var blockId in warnings) {
      if (blockId === '__bitdoglabNotices') continue;
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

    var noticeIssues = [];
    var noticeMessageCount = 0;
    for (var noticeBlockId in notices) {
      if (!notices.hasOwnProperty(noticeBlockId) || !notices[noticeBlockId].length) continue;
      var noticeBlock = blockById[noticeBlockId] || null;
      noticeMessageCount += notices[noticeBlockId].length;
      noticeIssues.push({
        blockId: noticeBlockId,
        blockType: noticeBlock ? noticeBlock.type : '',
        blockLabel: getBlockLabel(noticeBlock),
        messages: notices[noticeBlockId].slice(),
        severity: 'notice'
      });
    }

    return {
      valid: issues.length === 0,
      issueCount: issues.length,
      messageCount: totalMessages,
      issues: issues,
      noticeCount: noticeIssues.length,
      noticeMessageCount: noticeMessageCount,
      notices: noticeIssues
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
