(function (global) {
  'use strict';

  var guides = Object.create(null);

  function validate(guide) {
    if (!guide || typeof guide !== 'object') throw new Error('Hardware guide must be an object.');
    if (!guide.id || typeof guide.id !== 'string') throw new Error('Hardware guide must have a string id.');
    if (!guide.template || typeof guide.template !== 'string') throw new Error('Hardware guide "' + guide.id + '" must define a template.');
    if (!guide.menu || !guide.menu['pt-br']) throw new Error('Hardware guide "' + guide.id + '" must define Portuguese menu text.');
  }

  global.DeviceHardwareGuides = {
    register: function (guide) {
      validate(guide);
      if (guides[guide.id]) throw new Error('Hardware guide already registered: ' + guide.id);
      guides[guide.id] = guide;
    },

    get: function (id) {
      return guides[id] || null;
    },

    list: function () {
      return Object.keys(guides).map(function (id) {
        return guides[id];
      }).sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
    }
  };
})(window);
