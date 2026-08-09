# BIPES–BitDogLab visual assets

[Leia em português](README.md) · **English**

`src/assets/` contains only static files consumed by the web interface. Application logic belongs in `src/js/`, styles in `src/styles/`, and translatable copy in `src/translations/`.

## Directory map

```text
src/assets/
├── cursors/          # cursors expected by Blockly while dragging
├── favicons/         # icons displayed by the browser
├── icons/            # interface-owned symbols and sprites
├── images/
│   ├── devices/      # photos and diagrams used by hardware guides
│   ├── logos/        # official brands displayed by the product
│   └── themes/       # visual-theme illustrations
└── media/            # files at the legacy path expected by Blockly
```

## Ownership by group

| Path | Main consumer | Maintenance rule |
| --- | --- | --- |
| `cursors/` | Blockly and CSS | Preserve filenames; they are part of the editor contract. |
| `favicons/` | `src/pages/index.html` | Replace only when the application's official identity changes. |
| `icons/` | components and stylesheets | Reuse existing symbols before adding another sprite. |
| `images/devices/` | hardware guides | Use technically accurate images with a known origin. |
| `images/logos/` | header, guides, and identity | Do not redraw or recompress official brands without authorization. |
| `images/themes/` | appearance selector | Keep each filename aligned with its theme identifier. |
| `media/` | legacy Blockly integration | Treat names and dimensions as an external compatibility contract. |

## Adding or replacing an asset

1. Choose the subfolder by consumer, not only by file format.
2. Use a lowercase, descriptive, stable filename.
3. Prefer SVG for icons and diagrams; use PNG/JPEG for captures and photographs.
4. Find and update every reference with `rg "file-name" src`.
5. Open the interface and verify loading, aspect ratio, and contrast.
6. Run the example tests when the resource appears inside Blockly.

## Keep source and generated files separate

Interface assets and documentation images have different lifecycles. Architecture diagrams belong to the documented module's `images/` folder. Generated example images live under the repository-root `images/` directory. Never edit copies under `src/mobile/android/app/build/`; the Android build recreates them.

## Quick verification

```powershell
rg -n "\.png|\.jpe?g|\.gif|\.svg" src/pages src/js src/styles
node tests/examples_generation_smoke.js
```

An asset change is ready when no reference is broken, the browser reports no loading error, and the asset remains readable in both light and dark themes.
