# BIPES–BitDogLab web core

[Leia em português](README.md) · **English**

`src/js/core/` coordinates Blockly, Python generation, execution, navigation, language, and persistence. The core connects modules; it must not reimplement blocks, serial transport, or visual components.

![Core module architecture](images/architecture.png)

## Module map

| Path | Responsibility |
| --- | --- |
| `app.js` | Core initialization and V6/V7 selection. |
| `workspace/` | Blockly lifecycle, toolbox, projects, and hints. |
| `codegen/` | Validation, Python organization, and automatic generation. |
| `execution/` | Run, stop, reset, and save `main.py`. |
| `i18n/` | Interface, Blockly, and safe generated-code translation. |
| `tabs.js` | Panel state, rendering, and resizing. |
| `language.js` | Active language, page direction, and catalog. |
| `storage.js` | Projects, backups, and latest-session restoration. |
| `terminal.js` | Terminal instance and integration. |
| `dom.js` | Small, domain-specific DOM and animation helpers. |
| `utils.js` | Legacy entry point that keeps older consumers working. |

## Submodules

### `workspace/`

- `lifecycle.js`: creates, loads, resizes, and clears the workspace;
- `toolbox.js`: loads XML and filters categories by project;
- `projects.js`: selector, persistence, and hardware notices;
- `hints.js`: contextual reminders for special blocks;
- `index.js`: publishes the compatible `Code` facade.

### `codegen/`

- `python-organizer.js`: separates setup, loop, imports, and definitions;
- `generator.js`: validates the workspace and assembles final Python;
- `auto-generation.js`: refreshes code after changes;
- `index.js`: publishes `Code.generateCode` and automatic generation.

### `execution/`

- `runner.js`: run, stop, and reset operations;
- `main-file.js`: ordered protocol for writing `main.py`;
- `index.js`: preserves the global `Tool` facade.

### `i18n/`

- `interface.js`: DOM, toolbox, and language controls;
- `generated-code.js`: MicroPython identifiers, comments, and strings;
- `index.js`: public translation API.

## Initialization

Classic scripts extend one shared namespace:

```js
var Code = window.Code || (window.Code = {});
```

After scripts load, `bootstrap/page.js` calls `Code.init()`. `app.js` activates language, workspace, tabs, automatic generation, storage, and the file manager. Order in `src/pages/index.html` is contractual: every module must load before the bootstrap that consumes it.

## Public facades

| Global | Consumers |
| --- | --- |
| `Code` | page, Blockly, projects, tabs, and language. |
| `Tool` | run and save controls. |
| `term` | communication and message panel. |
| `DOM` / `Animate` | compatibility for existing components. |

Do not rename or replace these facades without migration. New modules should publish only the smallest required API.

## Where new code belongs

- workspace behavior → `workspace/`;
- Python transformation → `codegen/`;
- command sent to the board → `execution/` or `communication/`;
- translation → `i18n/` and `src/translations/catalog.js`;
- visual behavior → `src/js/ui/`;
- block-specific rule → `src/js/blocks/`.

Avoid new generic `utils.js` files. Domain names make discovery, testing, and maintenance easier.

## Invariants

- `Code.generateCode()` remains the generation entry point.
- Saved XML keeps its Blockly types and fields.
- Final Python keeps setup before the loop.
- Language switching never changes MicroPython APIs.
- V6/V7 switching changes only the active `BitdogLabConfig`.
- Run and save operations use the existing serial protocol.

## Validation

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/i18n/*.test.js tests/communication/*.test.js
```

For interface changes, open the application and validate onboarding, projects, tabs, languages, V6/V7, generation, and execution with no page errors.
