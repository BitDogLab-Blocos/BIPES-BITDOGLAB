'use strict';

var Code = window.Code || (window.Code = {});
var AppBootstrap = {};

AppBootstrap.deviceProfiles = {
  v6: BitdogLabConfig_V6,
  v7: BitdogLabConfig
};

AppBootstrap.applyDeviceProfile = function(device) {
  if (!AppBootstrap.deviceProfiles[device]) return false;

  BitdogLabConfig = AppBootstrap.deviceProfiles[device];
  var selector = document.getElementById('device_selector');
  if (selector) selector.value = device;
  return true;
};

AppBootstrap.initVersionSelector = function() {
  var versionSelector = document.getElementById('device_selector');
  if (!versionSelector) return;

  versionSelector.addEventListener('change', function() {
    AppBootstrap.applyDeviceProfile(this.value);
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
  AppBootstrap.initVersionSelector();
};

Code.init = AppBootstrap.init;
