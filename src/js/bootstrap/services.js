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

    global.UI = UIFactory.create();

    return {
      Channel: Channel,
      Files: Files,
      UI: UI,
      terminal: terminal
    };
  };

  global.AppServices = AppServices;
})(window);

