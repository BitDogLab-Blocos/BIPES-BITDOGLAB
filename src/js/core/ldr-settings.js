// Persistent scale orientation for KY-018 and compatible LDR modules.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});
  var STORAGE_KEY = 'bitdoglab_ldr_scale_orientation';
  var DIRECT = 'direct';
  var INVERTED = 'inverted';
  var DEFAULT_ORIENTATION = INVERTED;
  var memoryOrientation = DEFAULT_ORIENTATION;

  function validOrientation(value) {
    return value === DIRECT || value === INVERTED;
  }

  function readOrientation() {
    try {
      var stored = global.localStorage.getItem(STORAGE_KEY);
      if (validOrientation(stored)) {
        memoryOrientation = stored;
      }
    } catch (error) {}
    return memoryOrientation;
  }

  function setOrientation(orientation) {
    if (!validOrientation(orientation)) {
      orientation = DEFAULT_ORIENTATION;
    }
    memoryOrientation = orientation;
    try {
      global.localStorage.setItem(STORAGE_KEY, orientation);
    } catch (error) {}
    return orientation;
  }

  function percentageFromRaw(rawValue, orientation) {
    var raw = Number(rawValue);
    if (!isFinite(raw)) raw = 0;
    raw = Math.max(0, Math.min(65535, raw));

    var percentage = Math.round(raw * 100 / 65535);
    if ((orientation || readOrientation()) === INVERTED) {
      percentage = 100 - percentage;
    }
    return Math.max(0, Math.min(100, percentage));
  }

  Code.LdrSettings = {
    STORAGE_KEY: STORAGE_KEY,
    DIRECT: DIRECT,
    INVERTED: INVERTED,
    getOrientation: readOrientation,
    setOrientation: setOrientation,
    isInverted: function() {
      return readOrientation() === INVERTED;
    },
    setInverted: function(inverted) {
      return setOrientation(inverted ? INVERTED : DIRECT);
    },
    toggle: function() {
      return setOrientation(readOrientation() === INVERTED ? DIRECT : INVERTED);
    },
    percentageFromRaw: percentageFromRaw
  };
})(window);
