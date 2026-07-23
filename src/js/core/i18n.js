'use strict';

Code.ensureMessages = function() {
  if (typeof MSG !== 'object') {
    return;
  }
  Object.assign(MSG, Code.APP_MESSAGES[Code.LANG] || Code.APP_MESSAGES['pt-br']);
};

Code.getProjectLabel = function(project) {
  var keys = {
    basico: 'projectBasic',
    robo: 'projectRobot',
    estufa: 'projectGreenhouse',
    piano: 'projectPiano'
  };
  return MSG[keys[project]] || project;
};

Code.escapeRegex = function(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

Code.getLanguageCodeLabel = function(lang) {
  return lang === 'en' ? (MSG.languageCodeEn || 'EN') : (MSG.languageCodePt || 'PT');
};

Code.getCustomTranslationMap = function() {
  var base = {};
  if (Code.CUSTOM_OVERRIDES && Code.CUSTOM_OVERRIDES[Code.LANG]) {
    Object.assign(base, Code.CUSTOM_OVERRIDES[Code.LANG]);
  }
  return base;
};

Code.t = function(key, params) {
  var lang = Code.LANG || 'pt-br';
  var locale = Code.TRANSLATION_CATALOG && Code.TRANSLATION_CATALOG[lang];
  var fallback = Code.TRANSLATION_CATALOG && Code.TRANSLATION_CATALOG['pt-br'];
  var value;

  if (key && key.indexOf('app.') === 0) {
    key = key.slice(4);
  }
  if (locale && locale.app && locale.app[key] !== undefined) {
    value = locale.app[key];
  } else if (fallback && fallback.app && fallback.app[key] !== undefined) {
    value = fallback.app[key];
  } else {
    value = key;
  }

  if (!params) {
    return value;
  }
  Object.keys(params).forEach(function(name) {
    value = value.split('%{' + name + '}').join(String(params[name]));
    value = value.split('%' + name).join(String(params[name]));
  });
  return value;
};

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

Code.translateText = function(text) {
  if (typeof text !== 'string' || Code.LANG === 'pt-br') {
    return text;
  }

  var map = Code.getCustomTranslationMap();
  if (map[text] !== undefined) {
    return map[text];
  }

  var leading = text.match(/^\s*/);
  var trailing = text.match(/\s*$/);
  var prefix = leading ? leading[0] : '';
  var suffix = trailing ? trailing[0] : '';
  var core = text.slice(prefix.length, text.length - suffix.length);

  if (map[core] !== undefined) {
    return prefix + map[core] + suffix;
  }

  var keys = Object.keys(map).sort(function(a, b) {
    return b.length - a.length;
  });
  var replaced = core;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (replaced.indexOf(key) === -1) {
      continue;
    }

    if (/^[\p{L}\p{N}_]+$/u.test(key)) {
      if (key.length < 4) {
        continue;
      }
      var standalonePattern = new RegExp('(^|[^\\p{L}\\p{N}_])(' + Code.escapeRegex(key) + ')(?=$|[^\\p{L}\\p{N}_])', 'gu');
      replaced = replaced.replace(standalonePattern, function(match, prefix) {
        return prefix + map[key];
      });
    } else {
      replaced = replaced.split(key).join(map[key]);
    }
  }
  return prefix + replaced + suffix;
};

Code.normalizeAuditText = function(text) {
  if (typeof text !== 'string') {
    return '';
  }
  var normalized = text.toLowerCase();
  if (normalized.normalize) {
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return normalized;
};

Code.translateGeneratedIdentifierPart = function(part) {
  if (Code.LANG !== 'en' || typeof part !== 'string' || !part) {
    return part;
  }

  var componentMap = Code.GENERATED_IDENTIFIER_COMPONENTS[Code.LANG] || {};
  var lowerPart = part.toLowerCase();

  if (componentMap[lowerPart] !== undefined) {
    var directTranslation = componentMap[lowerPart];
    if (part === part.toUpperCase()) {
      return directTranslation.toUpperCase();
    }
    if (part.charAt(0) === part.charAt(0).toUpperCase() && part.slice(1) === part.slice(1).toLowerCase()) {
      return directTranslation.charAt(0).toUpperCase() + directTranslation.slice(1);
    }
    return directTranslation;
  }

  var suffixMatch = part.match(/^([A-Za-z]+)(\d+)$/);
  if (suffixMatch && componentMap[suffixMatch[1].toLowerCase()] !== undefined) {
    return componentMap[suffixMatch[1].toLowerCase()] + suffixMatch[2];
  }

  return part;
};

Code.translateGeneratedIdentifier = function(token) {
  if (Code.LANG !== 'en' || typeof token !== 'string') {
    return token;
  }

  var config = Code.GENERATED_IDENTIFIER_OVERRIDES[Code.LANG];
  if (!config) {
    return token;
  }

  var reserved = Code.GENERATED_IDENTIFIER_RESERVED[Code.LANG] || {};
  if (reserved[token]) {
    return token;
  }

  if (config.exact && config.exact[token] !== undefined) {
    return config.exact[token];
  }

  var translated = token;
  var fragmentKeys = Object.keys(config.fragments || {}).sort(function(a, b) {
    return b.length - a.length;
  });

  for (var i = 0; i < fragmentKeys.length; i++) {
    var fragment = fragmentKeys[i];
    if (translated.indexOf(fragment) !== -1) {
      translated = translated.split(fragment).join(config.fragments[fragment]);
    }
  }

  if (translated.indexOf('_') !== -1) {
    var leadingUnderscores = translated.match(/^_+/);
    var trailingUnderscores = translated.match(/_+$/);
    var prefix = leadingUnderscores ? leadingUnderscores[0] : '';
    var suffix = trailingUnderscores ? trailingUnderscores[0] : '';
    var core = translated.slice(prefix.length, translated.length - suffix.length);

    if (core) {
      var parts = core.split('_');
      var mappedParts = [];
      for (var p = 0; p < parts.length; p++) {
        mappedParts.push(Code.translateGeneratedIdentifierPart(parts[p]));
      }
      translated = prefix + mappedParts.join('_') + suffix;
    }
  } else {
    translated = Code.translateGeneratedIdentifierPart(translated);
  }

  return translated;
};

Code.shouldTranslateGeneratedIdentifier = function(token) {
  if (Code.LANG !== 'en' || typeof token !== 'string') {
    return false;
  }

  var reserved = Code.GENERATED_IDENTIFIER_RESERVED[Code.LANG] || {};
  if (reserved[token]) {
    return false;
  }

  var config = Code.GENERATED_IDENTIFIER_OVERRIDES[Code.LANG] || {};
  if (config.exact && config.exact[token] !== undefined) {
    return true;
  }

  var fragmentKeys = Object.keys(config.fragments || {});
  for (var i = 0; i < fragmentKeys.length; i++) {
    if (token.indexOf(fragmentKeys[i]) !== -1) {
      return true;
    }
  }

  if (token.indexOf('_') === -1) {
    return false;
  }

  var normalizedToken = Code.normalizeAuditText(token);
  var rules = Code.GENERATED_CODE_AUDIT_RULES[Code.LANG];
  if (!rules) {
    return false;
  }

  for (var j = 0; j < rules.identifierPatterns.length; j++) {
    if (rules.identifierPatterns[j].test(normalizedToken)) {
      return true;
    }
  }

  return false;
};

Code.translateGeneratedText = function(text) {
  if (Code.LANG !== 'en' || typeof text !== 'string') {
    return text;
  }

  var map = Code.GENERATED_TEXT_COMPONENTS &&
    Code.GENERATED_TEXT_COMPONENTS[Code.LANG];
  if (!map) {
    return text;
  }

  var keys = Object.keys(map).sort(function(a, b) {
    return b.length - a.length;
  });
  var translated = text;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = map[key];
    if (/^[\p{L}\p{N}_]+$/u.test(key)) {
      var pattern = new RegExp(
        '(^|[^\\p{L}\\p{N}_])(' + Code.escapeRegex(key) + ')(?=$|[^\\p{L}\\p{N}_])',
        'giu'
      );
      translated = translated.replace(pattern, function(match, prefix) {
        return prefix + value;
      });
    } else {
      translated = translated.split(key).join(value);
    }
  }
  return translated;
};

Code.translateGeneratedStringLiterals = function(code) {
  if (Code.LANG !== 'en' || typeof code !== 'string') {
    return code;
  }

  return code.replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, function(literal) {
    var quote = literal.charAt(0);
    var content = literal.slice(1, -1);
    var translated = Code.translateGeneratedText(Code.translateText(content));

    if (translated === content) {
      return literal;
    }

    translated = translated.replace(new RegExp(Code.escapeRegex(quote), 'g'), '\\' + quote);
    return quote + translated + quote;
  });
};

Code.auditGeneratedCode = function(code) {
  if (Code.LANG !== 'en' || typeof code !== 'string') {
    return {ok: true, identifiers: [], text: []};
  }

  var rules = Code.GENERATED_CODE_AUDIT_RULES[Code.LANG];
  if (!rules) {
    return {ok: true, identifiers: [], text: []};
  }

  var identifierMatches = [];
  var textMatches = [];
  var identifierTokens = code.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [];

  for (var i = 0; i < identifierTokens.length; i++) {
    var normalizedToken = Code.normalizeAuditText(identifierTokens[i]);
    for (var j = 0; j < rules.identifierPatterns.length; j++) {
      if (rules.identifierPatterns[j].test(normalizedToken)) {
        identifierMatches.push(identifierTokens[i]);
        break;
      }
    }
  }

  var lines = code.split('\n');
  for (var l = 0; l < lines.length; l++) {
    var normalizedLine = Code.normalizeAuditText(lines[l]);
    for (var t = 0; t < rules.textPatterns.length; t++) {
      if (rules.textPatterns[t].test(normalizedLine)) {
        textMatches.push(lines[l].trim());
        break;
      }
    }
  }

  identifierMatches = Array.from(new Set(identifierMatches)).sort();
  textMatches = Array.from(new Set(textMatches)).sort();

  return {
    ok: identifierMatches.length === 0 && textMatches.length === 0,
    identifiers: identifierMatches,
    text: textMatches
  };
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

Code.translateGeneratedCode = function(code) {
  if (Code.LANG !== 'en' || typeof code !== 'string') {
    return code;
  }

  code = code.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, function(token) {
    if (!Code.shouldTranslateGeneratedIdentifier(token)) {
      return token;
    }
    return Code.translateGeneratedIdentifier(token);
  });

  code = Code.translateGeneratedStringLiterals(code);

  code = code.split('\n').map(function(line) {
    var match = line.match(/^(.*?#\s*)(.*)$/);
    return match ? match[1] + Code.translateGeneratedText(Code.translateText(match[2])) : line;
  }).join('\n');

  var audit = Code.auditGeneratedCode(code);
  Code._lastGeneratedCodeAudit = audit;
  if (!audit.ok) {
    var signature = audit.identifiers.join('|') + '||' + audit.text.join('|');
    if (Code._lastGeneratedCodeAuditSignature !== signature && typeof console !== 'undefined' && console.warn) {
      console.warn('[BitDogLab i18n] Remaining Portuguese fragments in generated English code:', audit);
    }
    Code._lastGeneratedCodeAuditSignature = signature;
  } else {
    Code._lastGeneratedCodeAuditSignature = '';
  }

  return code;
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
