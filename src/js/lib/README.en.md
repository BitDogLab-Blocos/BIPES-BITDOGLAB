# BIPES–BitDogLab browser libraries

[Leia em português](README.md) · **English**

`src/js/lib/` stores third-party distributions loaded directly by the page. The application works offline because Blockly, CodeMirror, FileSaver, and xterm are kept in the repository.

![Browser library architecture](images/architecture.png)

## Dependencies

| Path | API used by the application |
| --- | --- |
| `blockly/blockly_compressed.js` | Workspace, toolbox, connections, and XML serialization. |
| `blockly/python_compressed.js` | Base Python-generation infrastructure. |
| `blockly/msg/` | Original Blockly messages. |
| `codemirror/` | Editor, CSS, and Python syntax mode. |
| `filesaver/FileSaver.js` | Download of XML and other local content. |
| `xterm/xterm.js` | Terminal for serial input and output. |

BitDogLab-specific code does not belong here. Blockly extensions live in `src/js/blocks/`; terminal integration lives in `src/js/core/terminal.js`.

## Loading

Distributions expose globals through classic scripts:

```html
<script src="../js/lib/blockly/blockly_compressed.js"></script>
<script src="../js/lib/blockly/python_compressed.js"></script>
<script src="../js/lib/filesaver/FileSaver.js"></script>
<script src="../js/lib/xterm/xterm.js"></script>
<script src="../js/lib/codemirror/codemirror.js"></script>
```

Order matters: each library core loads before plugins, modes, messages, and local extensions.

## Change policy

- Do not patch minified files to fix application behavior.
- Do not run formatters over a vendored distribution.
- Preserve license headers, names, paths, and supporting files.
- Record source and version when updating a dependency.
- Update the complete official distribution, not one isolated file.
- Verify that the update still works without a CDN or network access.

An unavoidable adaptation should live in its own file outside `lib/`, load after the library, and be documented as compatibility code.

## Updating a library

1. Identify the current version and global APIs consumed by the application.
2. Download the new distribution from its official source.
3. Compare licenses, directory structure, and entry-point names.
4. Replace only the matching library tree.
5. Open the interface and validate old XML, toolbox, editor, and terminal behavior.
6. Run the full example and contract suite.
7. Check the Android package, which copies the same web assets.

## Compatibility risks

Blockly is the most sensitive dependency: types, XML fields, generator APIs, and connection behavior must remain compatible with saved projects. CodeMirror and xterm also expose styles and methods consumed by legacy code.

## Validation

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/**/*.test.js
node --test src/mobile/tests/*.test.js
```

Before publishing, test in a compatible browser with an empty cache and confirm that no library is fetched from an external URL.
