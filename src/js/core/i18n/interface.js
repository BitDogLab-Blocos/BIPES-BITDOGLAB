'use strict';

var Code = window.Code || (window.Code = {});

Code.applyTranslations = function(root) {
  if (!root || !root.querySelectorAll) {
    return;
  }

  var nodes = root.querySelectorAll('[data-i18n], [data-i18n-title], [data-i18n-placeholder], [data-i18n-aria-label], [data-i18n-alt]');
  for (var i = 0; i < nodes.length; i++) {
    var messageKey = nodes[i].getAttribute('data-i18n');
    if (messageKey) {
      nodes[i].textContent = Code.t(messageKey);
    }
  }

  var attributes = ['title', 'placeholder', 'aria-label', 'alt'];
  for (var n = 0; n < nodes.length; n++) {
    for (var a = 0; a < attributes.length; a++) {
      var attr = attributes[a];
      var key = nodes[n].getAttribute('data-i18n-' + attr);
      if (key) {
        nodes[n].setAttribute(attr, Code.t(key));
      }
    }
  }
};

Code.translateDom = function(root) {
  if (!root) {
    return;
  }

  Code.applyTranslations(root);
  if (Code.LANG === 'pt-br') {
    return;
  }

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (!node.parentElement) {
        return NodeFilter.FILTER_REJECT;
      }
      var tag = node.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  var currentNode;
  while ((currentNode = walker.nextNode())) {
    currentNode.nodeValue = Code.translateText(currentNode.nodeValue);
  }

  var attrs = ['title', 'placeholder', 'alt', 'aria-label'];
  var nodes = root.querySelectorAll ? root.querySelectorAll('*') : [];
  for (var n = 0; n < nodes.length; n++) {
    for (var a = 0; a < attrs.length; a++) {
      if (nodes[n].hasAttribute(attrs[a])) {
        nodes[n].setAttribute(attrs[a], Code.translateText(nodes[n].getAttribute(attrs[a])));
      }
    }
  }
};

Code.translateToolboxXml = function(xml) {
  if (!xml || Code.LANG === 'pt-br') {
    return xml;
  }

  var categories = xml.getElementsByTagName('category');
  for (var i = 0; i < categories.length; i++) {
    var name = categories[i].getAttribute('name');
    if (name) {
      categories[i].setAttribute('name', Code.translateText(name));
    }
  }
  var labels = xml.getElementsByTagName('label');
  for (var j = 0; j < labels.length; j++) {
    var text = labels[j].getAttribute('text');
    if (text) {
      labels[j].setAttribute('text', Code.translateText(text));
    }
  }
  return xml;
};

Code.refreshLanguageUI = function() {
  var button = document.getElementById('languageButton');
  var label = document.getElementById('languageButtonLabel');
  var panelTitle = document.getElementById('languagePanelTitle');
  var ptLabel = document.getElementById('languageOptionPtLabel');
  var enLabel = document.getElementById('languageOptionEnLabel');
  var options = document.querySelectorAll('.language-option');

  if (button) {
    button.title = MSG.languageTooltip || 'Change language.';
  }
  if (label) {
    label.textContent = Code.getLanguageCodeLabel(Code.LANG);
  }
  if (panelTitle) {
    panelTitle.textContent = MSG.languagePanelTitle || 'Interface language';
  }
  if (ptLabel) {
    ptLabel.textContent = MSG.languagePortuguese || 'Português (Brasil)';
  }
  if (enLabel) {
    enLabel.textContent = MSG.languageEnglish || 'English';
  }
  for (var i = 0; i < options.length; i++) {
    var lang = options[i].getAttribute('data-lang');
    options[i].classList.toggle('active', lang === Code.LANG);
  }
};

Code.bindLanguageControls = function() {
  var options = document.querySelectorAll('.language-option');
  for (var i = 0; i < options.length; i++) {
    if (!options[i].dataset.i18nBound) {
      options[i].dataset.i18nBound = 'true';
      options[i].addEventListener('click', function() {
        Code.changeLanguage(this.getAttribute('data-lang'));
      });
    }
  }
  Code.refreshLanguageUI();
};

Code.patchBlocklyI18n = function() {
  if (!window.Blockly || Code._blocklyI18nPatched) {
    return;
  }

  var appendField = Blockly.Input.prototype.appendField;
  Blockly.Input.prototype.appendField = function(field, name) {
    if (typeof field === 'string') {
      field = Code.translateText(field);
    }
    return appendField.call(this, field, name);
  };

  var setTooltip = Blockly.Block.prototype.setTooltip;
  Blockly.Block.prototype.setTooltip = function(newTip) {
    if (typeof newTip === 'string') {
      newTip = Code.translateText(newTip);
    }
    return setTooltip.call(this, newTip);
  };

  var OriginalDropdown = Blockly.FieldDropdown;
  Blockly.FieldDropdown = function(menuGenerator, validator) {
    if (Array.isArray(menuGenerator)) {
      menuGenerator = menuGenerator.map(function(entry) {
        if (Array.isArray(entry) && typeof entry[0] === 'string') {
          return [Code.translateText(entry[0]), entry[1]];
        }
        return entry;
      });
    }
    return new OriginalDropdown(menuGenerator, validator);
  };
  Blockly.FieldDropdown.prototype = OriginalDropdown.prototype;
  Object.setPrototypeOf(Blockly.FieldDropdown, OriginalDropdown);

  var OriginalTextInput = Blockly.FieldTextInput;
  Blockly.FieldTextInput = function(text, validator, config) {
    if (typeof text === 'string') {
      text = Code.translateText(text);
    }
    return new OriginalTextInput(text, validator, config);
  };
  Blockly.FieldTextInput.prototype = OriginalTextInput.prototype;
  Object.setPrototypeOf(Blockly.FieldTextInput, OriginalTextInput);

  Code._blocklyI18nPatched = true;
};

(function() {
  Code.ensureMessages();
  Code.patchBlocklyI18n();

  var nativeAlert = window.alert.bind(window);
  window.alert = function(message) {
    nativeAlert(Code.translateText(String(message)));
  };
})();
