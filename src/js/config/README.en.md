# BitDogLab configuration

[Leia em português](README.md) · **English**

This folder centralizes hardware differences between BitDogLab revisions and defines the main Blockly toolbox. Generators read the active profile instead of scattering GPIO numbers and code assembly rules throughout the project.

## Architecture

![BitDogLab configuration architecture](images/architecture.png)

Revision V7 is loaded as the default configuration. The interface selector can replace the active object with V6 while preserving the structure expected by generators, the I²C scanner, and the core.

| File | Responsibility |
| --- | --- |
| `bitdoglab_v7.js` | Declares `BitdogLabConfig`, the default profile with V7 pins and peripherals. |
| `bitdoglab_v6.js` | Declares `BitdogLabConfig_V6` with the V6 pin, brightness, and bus differences. |
| `toolbox.xml` | Organizes the categories, blocks, shadows, and initial values displayed by Blockly. |

## Active profile

The bootstrap preserves the V7 profile and changes the global reference when users select another revision:

```js
var BitdogLabConfig_V7 = BitdogLabConfig;

BitdogLabConfig = (version === 'v6')
  ? BitdogLabConfig_V6
  : BitdogLabConfig_V7;
```

Both profiles expose equivalent sections such as `PINS`, `NEOPIXEL`, `JOYSTICK`, `DISPLAY`, `ROBOT`, `SENSOR`, `MARKERS`, and `SETUP_PATTERNS`.

## Basic flow

1. `src/pages/index.html` loads the V7 and V6 profiles.
2. `app.js` keeps `BitdogLabConfig` pointing to the selected revision.
3. Block generators read pins, peripherals, and rules from the active profile.
4. `codegen.js` uses markers and patterns to organize setup and loop code.
5. The I²C scanner uses the buses and known devices from the same profile.
6. In parallel, `toolbox.xml` is loaded, filtered by project, and applied to the workspace.

> A new revision should preserve the same structural contract as the existing configurations so consumers do not need board-specific conditionals.
