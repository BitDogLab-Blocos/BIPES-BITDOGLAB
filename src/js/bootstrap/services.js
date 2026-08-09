'use strict';

(function(global) {
  var AppServices = {};

  AppServices.init = function() {
    global.Channel = {};
    Channel['webserial'] = new webserial();
    Channel['mux'] = new mux();

    global.terminal = new Terminal();
    term.init('#term');

    global.Files = new DeviceFilesManager('#fileList');

    global.UI = {};
    UI['responsive'] = new responsive();
    UI['notify'] = new notify();
    UI['progress'] = new progress();
    UI['account'] = new account();
    UI['language-panel'] = new panel('#languageButton', '.language-panel');
    UI['channel-panel'] = new channelPanel('#channelButton', '.channel-panel');
    UI['toolbar'] = new panel('#toolbarButton', '.toolbar');
    UI['workspace'] = new workspace();

    return {
      Channel: Channel,
      Files: Files,
      UI: UI,
      terminal: terminal
    };
  };

  global.AppServices = AppServices;
})(window);

