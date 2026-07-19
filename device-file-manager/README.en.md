# BitDogLab device file manager

[Leia em português](README.md) · **English**

This folder contains an independent window for viewing and organizing files stored on the board. It uses the WebSerial connection already available in the project and does not change the main BIPES architecture.

![File manager window connected to the board](images/connected-window.png)

_Example of the connected state; the displayed files vary according to the contents of each board._

When the board is connected, users can browse folders and open, download, move, rename, or delete files. CSV files are automatically organized as a spreadsheet, with an option to view the original text.

## Architecture

![Data flow between the file manager modules](images/architecture.svg)

The main file creates the interface and holds shared state. Each additional module contributes only the behavior related to its responsibility.

| File | Responsibility |
| --- | --- |
| `device-files.js` | Creates the window, stores shared state, and binds the main events. |
| `window.js` | Opens, closes, moves, maximizes, and resizes the window. |
| `connection.js` | Sends WebSerial commands and interprets responses from the board. |
| `browser.js` | Lists files, navigates through folders, and selects file icons. |
| `preview.js` | Opens text and displays CSV files as a table or as original text. |
| `operations.js` | Downloads, moves, renames, deletes, and creates folders. |
| `device-files.css` | Defines the minimalist neon appearance of the window. |

## Initialization

After all modules are loaded by `src/pages/index.html`, only one instance is created:

```js
var Files = new DeviceFilesManager('#fileList');
```

Feature modules use the extension point provided by the main class:

```js
DeviceFilesManager.extend({
  myAction() {
    // Behavior owned by this module.
  }
});
```

For this reason, `device-files.js` must load before `window.js`, `connection.js`, `browser.js`, `preview.js`, and `operations.js`.

## Basic flow

1. The child opens the window using the folder icon.
2. `browser.js` requests the file list.
3. `connection.js` communicates with the BitDogLab.
4. The selected file is sent to `preview.js`.
5. Changes such as moving or deleting go through `operations.js`.

> `main.py` and `boot.py` take part in board startup. File operations show additional warnings for these files.
