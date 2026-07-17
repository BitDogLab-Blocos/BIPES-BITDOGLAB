// Presentation layer for contract warning bubbles.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  function getWrapLimit(warning) {
    var workspace = warning && warning.block_ && warning.block_.workspace;
    var viewWidth = 520;

    try {
      var metrics = workspace && workspace.getMetricsManager
        ? workspace.getMetricsManager().getViewMetrics(true)
        : null;
      if (metrics && typeof metrics.width === 'number') viewWidth = metrics.width;
    } catch (e) {}

    return Math.max(30, Math.min(62, Math.floor((viewWidth - 56) / 7.2)));
  }

  function splitLongWord(word, limit) {
    var pieces = [];
    while (word.length > limit) {
      pieces.push(word.slice(0, limit));
      word = word.slice(limit);
    }
    if (word) pieces.push(word);
    return pieces;
  }

  function wrapParagraph(paragraph, limit) {
    var words = String(paragraph || '').trim().split(/\s+/).filter(Boolean);
    var lines = [];
    var current = '';

    for (var i = 0; i < words.length; i++) {
      var parts = words[i].length > limit ? splitLongWord(words[i], limit) : [words[i]];

      for (var p = 0; p < parts.length; p++) {
        var candidate = current ? current + ' ' + parts[p] : parts[p];
        if (candidate.length <= limit) {
          current = candidate;
        } else {
          if (current) lines.push(current);
          current = parts[p];
        }
      }
    }

    if (current) lines.push(current);
    return lines.length ? lines : [''];
  }

  function wrapWarningText(text, limit) {
    var paragraphs = String(text || '').split('\n');
    var lines = [];

    for (var i = 0; i < paragraphs.length; i++) {
      lines = lines.concat(wrapParagraph(paragraphs[i], limit));
    }

    return lines.join('\n');
  }

  function decorateBubble(warning) {
    if (!warning || !warning.bubble_ || !warning.bubble_.getSvgRoot) return;
    var root = warning.bubble_.getSvgRoot();
    if (!root) return;

    root.classList.add('bitdoglab-contract-warning-bubble');

    var surfaceGroup = root.firstElementChild;
    if (surfaceGroup) {
      surfaceGroup.classList.add('bitdoglab-warning-surface-group');
      surfaceGroup.removeAttribute('filter');
    }

    var arrow = root.querySelector('path');
    if (arrow) arrow.classList.add('bitdoglab-warning-arrow');

    var surface = root.querySelector('rect.blocklyDraggable');
    if (surface) {
      surface.classList.add('bitdoglab-warning-surface');
      surface.setAttribute('rx', '10');
      surface.setAttribute('ry', '10');
    }

    if (warning.paragraphElement_) {
      warning.paragraphElement_.classList.add('bitdoglab-warning-text');
      var lines = warning.paragraphElement_.querySelectorAll('tspan');
      for (var i = 0; i < lines.length; i++) lines[i].setAttribute('x', '12');
    }

    if (warning.bubble_.getBubbleSize && warning.bubble_.setBubbleSize) {
      var size = warning.bubble_.getBubbleSize();
      warning.bubble_.setBubbleSize(size.width + 12, size.height + 10);
    }
  }

  function install() {
    if (!global.Blockly || !global.Blockly.Warning || !global.Blockly.Bubble) return;
    var prototype = global.Blockly.Warning.prototype;
    if (prototype.__bitdoglabWarningUiInstalled) return;

    var originalCreateBubble = prototype.createBubble_;
    prototype.createBubble_ = function() {
      if (!this.block_ || !this.block_.__bitdoglabContractWarningText) {
        return originalCreateBubble.call(this);
      }

      var wrappedText = wrapWarningText(this.getText(), getWrapLimit(this));
      this.paragraphElement_ = global.Blockly.Bubble.textToDom(wrappedText);
      this.bubble_ = global.Blockly.Bubble.createNonEditableBubble(
        this.paragraphElement_,
        this.block_,
        this.iconXY_
      );
      this.applyColour();
      decorateBubble(this);
    };

    prototype.__bitdoglabWarningUiInstalled = true;
  }

  Code.BlockWarningUI = {
    install: install,
    wrapWarningText: wrapWarningText
  };

  install();
})(window);
