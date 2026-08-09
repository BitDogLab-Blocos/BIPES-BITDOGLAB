'use strict';

var Code = window.Code || (window.Code = {});

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
    externos: 'projectExternalConnections',
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

