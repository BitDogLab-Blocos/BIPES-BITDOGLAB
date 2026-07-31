# Application assets

[Leia em português](README.md) · **English**

This folder contains the static files used by the web interface: images, icons, cursors, favicons, and Blockly-compatible resources. The files are served with `src/pages/` and are usually referenced through relative paths such as `../assets/...`.

## Organization

```text
src/assets/
├── cursors/            # cursors used while dragging blocks
├── favicons/           # application favicon and icons
├── icons/              # SVG sprites and interface controls
├── images/
│   ├── blockly/        # helper images for the Blockly editor
│   ├── devices/        # device photos and diagrams
│   ├── logos/          # BIPES and BitDogLab branding
│   └── themes/         # visual-theme previews
└── media/              # copies at the legacy path expected by Blockly
```

## Rules by type

- **`cursors/`** contains the hand cursors used while moving blocks; preserve the names expected by Blockly.
- **`favicons/`** contains the icons loaded by `src/pages/index.html`.
- **`icons/`** contains SVG sprites and symbols shared by the CSS and interface components.
- **`images/devices/`** is the place for board, sensor, and assembly images used by hardware guides.
- **`images/logos/`** stores the branding displayed in the interface and guides.
- **`images/themes/`** stores the previews used by visual themes.
- **`media/`** keeps copies for older Blockly integrations. When changing a duplicated resource, check both paths before publishing.

## Adding a resource

Choose the subfolder according to the file's role, use a stable name, and update the code that references it. For images used by new tutorials, prefer `images/devices/`; for example and validation images, use the corresponding folders under the project-root `images/` directory.

Do not place translations, JavaScript code, or XML projects here. Translations belong in `src/translations/`, and application code should remain in the responsible modules under `src/`.
