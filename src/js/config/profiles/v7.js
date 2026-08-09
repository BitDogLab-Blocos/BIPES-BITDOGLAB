'use strict';

// BitDogLab V7 uses the shared defaults without pin overrides.
var BitdogLabConfig = createProfile(BitdogLabProfileBase, {});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig;
}

