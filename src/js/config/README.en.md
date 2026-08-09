# BIPES–BitDogLab profiles and toolbox

[Leia em português](README.md) · **English**

`src/js/config/` answers two questions: which physical resources exist in each BitDogLab revision and which blocks appear in the editor. Generators must never carry their own GPIO numbers.

![BitDogLab configuration architecture](images/architecture.png)

## Organization

| File | Responsibility |
| --- | --- |
| `profiles/base.js` | Copy, merge, validation, and shared generation rules; it contains no pins. |
| `profiles/v7.js` | Complete V7 GPIO and peripheral reference; creates `BitdogLabConfig`. |
| `profiles/v6.js` | Complete V6 GPIO and peripheral reference; creates `BitdogLabConfig_V6`. |
| `toolbox.xml` | Categories, blocks, initial values, and project filters. |

## Why profiles repeat values

Every version file is self-contained. A pin shared by V6 and V7 appears in both files. This duplication is intentional: developers can inspect one complete board without following implicit inheritance or comparing several files.

`base.js` shares only behavior that does not describe physical wiring:

- names used by generated Python;
- LED initialization;
- cooperative loop delay;
- setup and loop markers;
- setup-line recognition;
- deep copy, merge, and structural validation.

## Profile contract

Every final profile must expose:

| Section | Contents |
| --- | --- |
| `PINS` | GPIOs for LEDs, buttons, joystick, matrix, I²C, and microphone. |
| `NEOPIXEL` | Count, brightness, and physical matrix mapping. |
| `JOYSTICK` | Center, dead zone, and axis inversion. |
| `DISPLAY` | Bus, frequency, and resolution. |
| `ROBOT` | MPU6050, H-bridge, PWM, and movement parameters. |
| `ROBOT_POWER` | INA226 bus and calibration. |
| `SENSOR` | Buses and known I²C addresses. |
| `LED`, `LED_INIT`, `LOOP`, `MARKERS`, `SETUP_PATTERNS` | Shared generation rules. |

`createProfile` validates this contract while scripts load. An incomplete profile must fail early, before users assemble blocks.

## Revision selection

The page loads V7 by default and preserves its reference:

```js
var BitdogLabConfig_V7 = BitdogLabConfig;

BitdogLabConfig = (version === 'v6')
  ? BitdogLabConfig_V6
  : BitdogLabConfig_V7;
```

Generators, the I²C scanner, and execution read only `BitdogLabConfig`, without version conditionals.

## Adding a revision

1. Copy the closest profile and rename its global variable.
2. Review every GPIO and peripheral section, including equal values.
3. Preserve the structural contract validated by `base.js`.
4. Load the new script from `src/pages/index.html`.
5. Add the selector option and switching logic in `core/app.js`.
6. Generate examples for the revision and compare their Python output.

## Toolbox is a separate responsibility

`toolbox.xml` controls availability and initial values, not pin mapping. Categories may use `data-project` and are filtered by `core/workspace/toolbox.js`. A type may enter the toolbox only after its definition and generator are registered.

## Validation

```powershell
node tests/block_contracts_smoke.js
node tests/examples_generation_smoke.js
node src/mobile/scripts/check-web-boundary.mjs
```

After a hardware change, explicitly switch between V6 and V7 and inspect generated Python for LEDs, buttons, displays, sensors, and robot blocks.
