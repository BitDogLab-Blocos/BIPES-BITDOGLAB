# BIPES application core

[Leia em português](README.md) · **English**

This folder contains the main coordination layer for the browser application. Its modules share the global `Code` namespace to initialize the interface, manage the Blockly workspace, generate Python, navigate between panels, persist projects, and apply the selected language.

## Architecture

![Core module architecture](images/architecture.png)

Each file owns one responsibility and publishes only the required entry points through `Code` or, for storage and utilities, through dedicated global APIs.

| File | Responsibility |
| --- | --- |
| `app.js` | Runs the bootstrap process and coordinates subsystem initialization. |
| `workspace/` | Separates Blockly lifecycle, toolbox, projects, and hints while publishing the `Code` API. |
| `codegen/` | Separates validation, Python organization, and automatic generation. |
| `execution/` | Runs, stops, resets, and saves `main.py` through the `Tool` facade. |
| `tabs.js` | Switches, splits, renders, and resizes the application panels. |
| `language.js` | Selects the language, loads translations, and configures page direction. |
| `i18n/` | Separates interface, Blockly, and generated-code translation. |
| `storage.js` | Saves browser projects and workspace backups, then restores the latest session. |
| `terminal.js` and `dom.js` | Integrate the terminal and contain small visual helpers. |
| `utils.js` | Temporary compatibility path; its implementation has been extracted. |

## Initialization

The modules use the same global object without replacing extensions that have already been registered:

```js
var Code = window.Code || (window.Code = {});
```

After the scripts have loaded, `src/pages/index.html` starts the core with a single call:

```js
Code.init();
```

`app.js` then prepares messages, the workspace, language, tabs, and the file manager. The script order declared by the page matters because the bootstrap calls functions published by earlier modules.

## Basic flow

1. `app.js` starts the services available in the `Code` namespace.
2. `workspace/` creates Blockly and loads the block categories.
3. Workspace changes are persisted by `storage.js`.
4. `codegen/` turns blocks into Python; `execution/` sends it to the board.
5. `tabs.js` displays Blockly, the console, files, the board reference, or the data panel.
6. `language.js` and `i18n/` keep the interface, toolbox, and generated code in the selected language.

> This code uses classic scripts and shared globals. When adding a module, preserve the `Code` namespace and check its position in `src/pages/index.html`.
