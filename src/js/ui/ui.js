'use strict';

function get(element) {
  return document.querySelector(element);
}

var $em = 16;
var UIFactory = {};

UIFactory.create = function() {
  var registry = {};
  registry['responsive'] = new responsive();
  registry['notify'] = new notify();
  registry['progress'] = new progress();
  registry['account'] = new account();
  registry['language-panel'] = new panel('#languageButton', '.language-panel');
  registry['channel-panel'] = new channelPanel('#channelButton', '.channel-panel');
  registry['toolbar'] = new panel('#toolbarButton', '.toolbar');
  registry['workspace'] = new workspace();
  return registry;
};

globalThis.UIFactory = UIFactory;
