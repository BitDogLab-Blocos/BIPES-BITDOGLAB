# Browser libraries

[Leia em português](README.md) · **English**

This folder stores local copies of the third-party libraries required to run BIPES directly in the browser. They provide the visual editor, Python generation, text editing, downloads, and terminal without requiring a runtime package manager.

## Architecture

![Browser library architecture](images/architecture.png)

The libraries are independent of one another and expose global APIs consumed by the application. `src/pages/index.html` controls the order in which JavaScript and CSS files are loaded.

| Path | Responsibility |
| --- | --- |
| `blockly/blockly_compressed.js` | Provides the workspace, blocks, connections, toolbox, and XML serialization. |
| `blockly/python_compressed.js` | Adds the base Python generator used by BitDogLab modules. |
| `codemirror/` | Provides the code editor, its CSS, and the Python syntax mode. |
| `filesaver/FileSaver.js` | Enables downloads of files created in the browser. |
| `xterm/xterm.js` | Renders the terminal used for serial connection input and output. |

## Loading

The libraries are included as classic scripts and expose global objects:

```html
<script src="../js/lib/blockly/blockly_compressed.js"></script>
<script src="../js/lib/blockly/python_compressed.js"></script>
<script src="../js/lib/filesaver/FileSaver.js"></script>
<script src="../js/lib/xterm/xterm.js"></script>
<script src="../js/lib/codemirror/codemirror.js"></script>
```

CodeMirror's Python mode is loaded after the editor core, while `codemirror.css` is included in the page header.

## Basic flow

1. Blockly creates the visual environment and provides Python generation infrastructure.
2. Modules in `src/js/blocks/` register project-specific blocks and generators.
3. CodeMirror displays files and code in a syntax-highlighted editor.
4. xterm.js displays the terminal connected to the Web Serial flow.
5. FileSaver.js allows users to download content produced by the application.

> These files are vendored builds, and many are minified. Prefer updating a library from its official distribution instead of manually editing generated files.
