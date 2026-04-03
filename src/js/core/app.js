'use strict';

var Code = window.Code || (window.Code = {});
var AppBootstrap = {};

AppBootstrap.initVersionSelector = function() {
  var versionSelector = document.getElementById('device_selector');
  if (!versionSelector) return;

  var BitdogLabConfig_V7 = BitdogLabConfig;
  versionSelector.addEventListener('change', function() {
    BitdogLabConfig = (this.value === 'v6') ? BitdogLabConfig_V6 : BitdogLabConfig_V7;
    Code.renderContent();
    if (typeof mux !== 'undefined' && mux.connected && mux.connected()) {
      Tool.stopPython();
      alert(
        (MSG['versionChanged'] || 'Versão alterada para %1!').replace('%1', this.value.toUpperCase()) +
        '\n\n' +
        (MSG['reconnectUsbPins'] || 'Desconecte e reconecte a placa USB para aplicar a nova pinagem.')
      );
    }
  });
};

AppBootstrap.initLinkButton = function() {
  var linkButton = document.getElementById('linkButton');
  if (linkButton) {
    linkButton.className = 'disabled';
  }
};

AppBootstrap.init = function() {
  if (Code.ensureMessages) {
    Code.ensureMessages();
  }
  if (Code.initWorkspace) {
    Code.initWorkspace();
  }
  if (Code.initLanguage) {
    Code.initLanguage();
  }
  if (Code.initTabs) {
    Code.initTabs();
  }
  if (Code.initFileManager) {
    Code.initFileManager();
  }

  AppBootstrap.initVersionSelector();
  AppBootstrap.initLinkButton();
};

Code.init = AppBootstrap.init;
