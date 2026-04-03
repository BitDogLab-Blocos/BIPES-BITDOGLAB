'use strict';

var Code = window.Code || (window.Code = {});
var LanguageManager = {};

LanguageManager.LANGUAGE_NAME = {
  'en': 'English',
  'pt-br': 'Português Brasileiro',
  'es': 'Español',
  'it': 'Italiano',
  'fr': 'Français',
  'de': 'Deutsch',
  'zh-hans': 'Chinese (simplified)',
  'zh-hant': 'Chinese (traditional)'
};

LanguageManager.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

LanguageManager.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

LanguageManager.getLang = function() {
  var storedLang = null;
  try {
    storedLang = window.localStorage.getItem('bitdoglab_lang');
  } catch (e) {}

  var lang = LanguageManager.getStringParamFromUrl('lang', storedLang || 'pt-br');
  if (LanguageManager.LANGUAGE_NAME[lang] === undefined) {
    lang = 'pt-br';
  }
  return lang;
};

LanguageManager.isRtl = function() {
  return LanguageManager.LANGUAGE_RTL.indexOf(Code.LANG) !== -1;
};

LanguageManager.changeLanguage = function(newLang) {
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var targetLang = newLang || Code.LANG;
  if (LanguageManager.LANGUAGE_NAME[targetLang] === undefined) {
    targetLang = 'pt-br';
  }

  try {
    window.localStorage.setItem('bitdoglab_lang', targetLang);
  } catch (e) {}

  var encodedLang = encodeURIComponent(targetLang);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + encodedLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + encodedLang);
  } else {
    search = search.replace(/\?/, '?lang=' + encodedLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

LanguageManager.initLanguage = function() {
  var rtl = LanguageManager.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);
  document.title = MSG['title'] || document.title;

  var languages = [];
  for (var lang in LanguageManager.LANGUAGE_NAME) {
    languages.push([LanguageManager.LANGUAGE_NAME[lang], lang]);
  }
  languages.sort(function(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  if (document.getElementById('tab_blocks')) document.getElementById('tab_blocks').textContent = MSG['blocks'];
  if (document.getElementById('tab_console')) document.getElementById('tab_console').textContent = MSG['console'] || 'Mensagens';
  if (document.getElementById('tab_files')) document.getElementById('tab_files').textContent = MSG['files'];
  if (document.getElementById('tab_device')) document.getElementById('tab_device').textContent = MSG['device'];
  if (document.getElementById('tab_databoard')) document.getElementById('tab_databoard').textContent = MSG['databoard'] || 'Dados';

  if (document.getElementById('linkButton')) document.getElementById('linkButton').title = MSG['linkTooltip'];
  if (document.getElementById('runButton')) document.getElementById('runButton').title = MSG['runTooltip'];
  if (document.getElementById('saveButton')) document.getElementById('saveButton').title = MSG['saveTooltip'];
  if (document.getElementById('loadButton')) document.getElementById('loadButton').title = MSG['loadTooltip'];
  if (document.getElementById('notificationButton')) document.getElementById('notificationButton').title = MSG['notificationTooltip'];
  if (document.getElementById('toolbarButton')) document.getElementById('toolbarButton').title = MSG['toolbarTooltip'];

  if (Code.translateDom) {
    Code.translateDom(document.body);
  }
  if (Code.bindLanguageControls) {
    Code.bindLanguageControls();
  }

  var project = localStorage.getItem('bitdoglab_project') || 'basico';
  var projectButton = document.getElementById('projectButton');
  if (projectButton && Code.getProjectLabel) {
    projectButton.textContent = Code.getProjectLabel(project);
  }

  var deviceFrame = document.getElementById('deviceReferenceFrame');
  if (deviceFrame) {
    deviceFrame.src = 'device-reference.html?lang=' + encodeURIComponent(Code.LANG);
  }
};

Code.LANGUAGE_NAME = LanguageManager.LANGUAGE_NAME;
Code.LANGUAGE_RTL = LanguageManager.LANGUAGE_RTL;
Code.getStringParamFromUrl = LanguageManager.getStringParamFromUrl;
Code.getLang = LanguageManager.getLang;
Code.isRtl = LanguageManager.isRtl;
Code.changeLanguage = LanguageManager.changeLanguage;
Code.initLanguage = LanguageManager.initLanguage;
Code.LANG = LanguageManager.getLang();

if (!Code._translationScriptsInjected) {
  Code._translationScriptsInjected = true;
  document.write('<script src="../translations/app/' + Code.LANG + '.js"></script>\n');
  document.write('<script src="../translations/blockly/languages/' + Code.LANG + '.js"></script>\n');
  document.write('<script src="../translations/custom/' + Code.LANG + '.js"></script>\n');
}
