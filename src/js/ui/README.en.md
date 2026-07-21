# BIPES interface

[Leia em português](README.md) · **English**

This folder connects browser events to BIPES services and maintains the application's visual state. It controls panels, projects, notifications, responsiveness, progress, workspace actions, and the presentation of Blockly contract warnings.

## Architecture

![BIPES interface architecture](images/architecture.png)

`ui.js` contains the classic components registered in the global `UI` object. `block_warning_ui.js` is a smaller specialized layer that adapts only the bubbles created by the block validator.

| Component | Responsibility |
| --- | --- |
| `panel` | Opens and closes shared side panels. |
| `account` | Creates, imports, lists, opens, and removes local projects. |
| `channelPanel` | Displays and selects the serial communication channel. |
| `notify` | Displays translated messages and keeps a log history. |
| `responsive` | Adjusts the layout and closes panels from outside areas. |
| `progress` | Displays transmission and file operation progress. |
| `workspace` | Connects buttons to execution, connection, device, and XML file actions. |
| `block_warning_ui.js` | Wraps long text and styles contract warning bubbles. |

## Initialization

After the core, communication, terminal, and file services are available, `src/pages/index.html` creates the global registry:

```js
var UI = {};
UI['responsive'] = new responsive();
UI['notify'] = new notify();
UI['progress'] = new progress();
UI['account'] = new account('#accountButton', '.account-panel');
UI['workspace'] = new workspace();
```

Other modules access these components by key, for example `UI['notify'].send(message)` and `UI['progress'].start(total)`.

## Basic flow

1. Clicks and selection changes reach components in `ui.js`.
2. The component updates the DOM and calls the core, storage, or communication layer when needed.
3. `notify` translates and displays responses to the user.
4. `progress` tracks queues and transfers.
5. The contract validator writes warnings on blocks.
6. `block_warning_ui.js` formats the warning bubble for the workspace.

> This layer depends on several legacy globals such as `Code`, `Channel`, `Files`, `Tool`, and `mux`. Preserve load order when splitting or adding components.
