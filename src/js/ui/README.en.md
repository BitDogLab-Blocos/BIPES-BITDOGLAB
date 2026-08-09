# BIPES interface

[Leia em português](README.md) · **English**

This folder connects browser events to BIPES services and maintains the application's visual state. It controls panels, the project state used by storage, notifications, responsiveness, progress, workspace actions, and the presentation of Blockly contract warnings.

## Architecture

![BIPES interface architecture](images/architecture.png)

Classic components now live in files grouped by responsibility. `ui.js` only creates the global `UI` registry, while `block_warning_ui.js` adapts bubbles created by the block validator.

| Component | Responsibility |
| --- | --- |
| `panels.js` | Panels, communication channel, and responsive layout. |
| `notifications.js` | Temporary messages and diagnostic logs. |
| `progress.js` | Transmission and file-operation progress. |
| `workspace-controls.js` | Execution, connection, device, and XML controls. |
| `ui.js` | Creates the components and returns the registry used by bootstrap. |
| `block_warning_ui.js` | Wraps long text and styles contract warning bubbles. |
| `device-reference.js` | Loads and navigates the independent modules documented in `src/hardware-guides/README.md`. |

## Initialization

After the core, communication, terminal, and file services are available, `src/pages/index.html` creates the global registry:

```js
var UI = UIFactory.create();
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
