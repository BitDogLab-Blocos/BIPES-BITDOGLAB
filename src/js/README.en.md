# BIPES–BitDogLab JavaScript

[Leia em português](README.md) · **English**

`src/js/` contains the application executed by the browser and Android WebView. The project uses classic scripts and global facades for compatibility with Blockly, saved projects, and the published version.

## Modules

| Folder | Responsibility | Guide |
| --- | --- | --- |
| `bootstrap/` | Startup sequence and service creation. | [README](bootstrap/README.en.md) |
| `blocks/` | Definitions, contracts, and MicroPython generators. | [README](blocks/README.en.md) |
| `communication/` | Queue, Web Serial, and I²C scanner. | [README](communication/README.en.md) |
| `config/` | V6/V7 profiles and Blockly toolbox. | [README](config/README.en.md) |
| `core/` | Workspace, generation, execution, tabs, language, and storage. | [README](core/README.en.md) |
| `lib/` | Vendored third-party dependencies. | [README](lib/README.en.md) |
| `ui/` | Components, events, feedback, and themes. | [README](ui/README.en.md) |

## Layer dependencies

```text
lib + config
      ↓
blocks + communication
      ↓
core
      ↓
ui
      ↓
bootstrap
```

The diagram shows availability order, not permission for circular dependencies. A UI component may call a core facade; the core should not know that component's visual details.

## Stable facades

| Global | Role |
| --- | --- |
| `Code` | Workspace, generation, tabs, and internationalization. |
| `UI` | Interface component registry. |
| `Tool` | Run, stop, reset, and `main.py` writes. |
| `Channel` | Serial transport and protocol multiplexer. |
| `Files` | Board file manager. |
| `BitdogLabConfig` | Active hardware profile. |

Modules may extend these facades but must not replace or rename them without migration.

## Conventions

- each file must have a responsibility explainable in one sentence;
- prefer domain folders over new generic `utils.js` files;
- preserve Blockly types, XML fields, and translation keys;
- read hardware from `BitdogLabConfig`;
- keep external values out of `innerHTML`;
- confirm script order in `src/pages/index.html`;
- keep browser and Android WebView on the same shared path.

## Choosing the correct module

- block shape or Python → `blocks/`;
- GPIO, revision, or category → `config/`;
- program transformation → `core/codegen/`;
- serial command or state → `communication/` and `core/execution/`;
- DOM and visual interaction → `ui/`;
- initial assembly → `bootstrap/`.

## Validation

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/**/*.test.js
node --test src/mobile/tests/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```
