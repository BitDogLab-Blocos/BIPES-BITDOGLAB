# BIPES application core

[Leia em português](README.md) · **English**

This folder contains the main coordination layer for the browser application. Its modules share the global `Code` namespace to initialize the interface, manage the Blockly workspace, generate Python, navigate between panels, persist projects, and apply the selected language.

## Architecture

![Core module architecture](images/architecture.png)

Each file owns one responsibility and publishes only the required entry points through `Code` or, for storage and utilities, through dedicated global APIs.

| File | Responsibility |
| --- | --- |
| `app.js` | Runs the bootstrap process and coordinates subsystem initialization. |
| `workspace.js` | Creates Blockly, loads the toolbox, filters projects, and displays usage reminders. |
| `codegen.js` | Validates generators, organizes generated Python, and maintains automatic generation. |
| `tabs.js` | Switches, splits, renders, and resizes the application panels. |
| `filemanager.js` | Prepares the files panel and serializes the workspace as XML. |
| `language.js` | Selects the language, loads translations, and configures page direction. |
| `i18n.js` | Translates the interface, toolbox, and generated-code identifiers, then audits the result. |
| `storage.js` | Saves browser projects and workspace backups, then restores the latest session. |
| `utils.js` | Provides execution, board file, terminal, DOM, and animation operations. |

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
2. `workspace.js` creates Blockly and loads the block categories.
3. Workspace changes are persisted by `storage.js`.
4. `codegen.js` turns blocks into Python and applies runtime adjustments.
5. `tabs.js` displays Blockly, the console, files, the board reference, or the data panel.
6. `language.js` and `i18n.js` keep the interface, toolbox, and generated code in the selected language.

> This code uses classic scripts and shared globals. When adding a module, preserve the `Code` namespace and check its position in `src/pages/index.html`.
