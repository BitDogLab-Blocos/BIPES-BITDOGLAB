# BIPES–BitDogLab styles

[Leia em português](README.md) · **English**

`src/styles/` defines the shared appearance of the web application. APK-only styles live in `src/mobile/android/app/src/main/res/raw/mobile_layout.css`; library styles remain with their distributions.

## Files

| File | Responsibility |
| --- | --- |
| `main.css` | Main tokens, layout, toolbar, panels, modals, and web responsiveness. |
| `visual-themes.css` | Theme selector and theme-specific surfaces. |
| `device-reference.css` | Sidebar, content, and hardware-guide components. |
| `libs.css` | External-component adjustments and licenses, especially terminal styles. |

## Layers

```text
:root tokens
   ↓
page structure
   ↓
components and states
   ↓
visual theme
   ↓
mobile adaptation injected by the APK
```

`--bitdoglab-*` variables are the contract between the default appearance and alternative themes. Prefer tokens over repeated literal values.

## Where a rule belongs

- general `index.html` behavior → `main.css`;
- theme and appearance panel → `visual-themes.css`;
- **Device** page → `device-reference.css`;
- library-specific correction → `libs.css` with an origin comment;
- Android only → `mobile_layout.css`, never `main.css`.

Avoid selectors tied to an excessively deep HTML tree. Component classes and state attributes are more stable.

## Responsiveness and accessibility

- test narrow widths, landscape, and zoom;
- respect Android safe areas;
- keep focus and contrast visible;
- never use color as the only state signal;
- preserve adequate touch targets;
- consider `prefers-reduced-motion` for new animations.

## Adding a theme

1. Register metadata in `src/js/ui/visual-themes.js`.
2. Define tokens and surfaces in `visual-themes.css`.
3. Add the illustration under `src/assets/images/themes/`.
4. Check Blockly, Messages, modals, notifications, and guides.
5. Verify persistence and PT/EN labels.

## Validation

Open the application on desktop and mobile viewports, switch through all six themes, and check toolbar, toolbox, terminal, modals, and text. Also run:

```powershell
node tests/examples_generation_smoke.js
node --test src/mobile/tests/mobile-workspace.test.js src/mobile/tests/mobile-device-files-layout.test.js
```
