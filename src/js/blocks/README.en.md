# BitDogLab block system

[Leia em português](README.md) · **English**

This folder implements the visual blocks used by BIPES and transforms each block into Python for MicroPython. It also defines semantic contracts that prevent incompatible combinations and display warnings before code generation or execution.

## Architecture

![Block system architecture](images/architecture.png)

The toolbox selects the blocks available to users. Definitions control shape and connections, contracts validate the workspace, and generators produce the code executed by the BitDogLab.

| Path | Responsibility |
| --- | --- |
| `definitions/` | Registers Blockly block appearance, fields, inputs, outputs, and connections. |
| `generators/` | Converts each block type into Python imports, setup, and instructions. |
| `contracts/types.js` | Declares semantic domains and connection compatibility. |
| `contracts/registry.js` | Maps block types to requirements, dependencies, and bilingual messages. |
| `contracts/validator.js` | Analyzes the workspace, applies warnings, and blocks invalid code. |
| `sensor_libs.js` | Stores embedded MicroPython drivers for displays and sensors. |

## Registering a block

A definition and its generator share the same identifier:

```js
Blockly.Blocks['my_block'] = {
  init: function() {
    // Block shape and connections.
  }
};

Blockly.Python['my_block'] = function(block) {
  return 'print("BitDogLab")\n';
};
```

To make it available in the interface, include the identifier in `src/js/config/toolbox.xml`. If it has usage restrictions, add its domain to `contracts/types.js` and its contract to `contracts/registry.js`.

## Basic flow

1. `toolbox.xml` provides the available categories and blocks.
2. `definitions/` creates the blocks inside the Blockly workspace.
3. `contracts/` checks types, required inputs, ancestors, and dependencies.
4. `generators/` transforms valid blocks into Python.
5. `sensor_libs.js` provides embedded drivers when a generator needs them.
6. The core organizes the final Python and sends it to the board.

> Script order in `src/pages/index.html` matters: types come before definitions, contracts before validation, and definitions before their matching generators.
