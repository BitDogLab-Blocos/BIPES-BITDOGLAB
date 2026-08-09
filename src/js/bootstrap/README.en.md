# BIPES–BitDogLab bootstrap

[Leia em português](README.md) · **English**

`src/js/bootstrap/` starts the page after libraries and domain modules have loaded. Bootstrap only connects existing services; business rules remain under `core/`, `communication/`, and `ui/`.

## Files

| File | Responsibility |
| --- | --- |
| `onboarding.js` | Welcome, partnership notice, initial tutorial, and first-visit state. |
| `services.js` | Creates `Channel`, terminal, `Files`, and the `UI` registry. |
| `page.js` | Calls `Code.init()`, starts services, and loads the project toolbox. |

## Initialization order

```text
domain scripts
      ↓
onboarding.js
      ↓
services.js → AppServices.init()
      ↓
page.js → Code.init() → toolbox → project selector
```

The three scripts load at the end of `src/pages/index.html`. Changing this order may call classes before they exist.

## Published facades

- `BitDogLabOnboarding.init()` reinitializes welcome listeners;
- `AppServices.init()` creates and returns global services;
- `PageBootstrap.init()` starts core and services;
- `PageBootstrap.loadProjectToolbox()` validates and applies `toolbox.xml`.

These names are contracts for the page and integration tests. Do not move transport or workspace implementations into this folder.

## Safe changes

- visual onboarding belongs in `onboarding.js`;
- global service creation belongs in `services.js`;
- startup sequence and initial loading belong in `page.js`;
- service behavior must change in the module that defines that service.

## Validation

Open the interface with empty storage and check welcome flow, tutorial, toolbox, saved project, and absence of page errors. Then run:

```powershell
node tests/examples_generation_smoke.js
node src/mobile/scripts/check-web-boundary.mjs
```
