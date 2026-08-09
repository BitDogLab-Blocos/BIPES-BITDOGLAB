# BIPES–BitDogLab interface

[Leia em português](README.md) · **English**

`src/js/ui/` connects browser events to application services. This layer may update the DOM and forward actions; Blockly rules, Python generation, protocol state, and serial transport remain in their own modules.

![BIPES–BitDogLab interface architecture](images/architecture.png)

## Components

| File | Responsibility |
| --- | --- |
| `ui.js` | Creates the global `UI` registry and connects components. |
| `panels.js` | Toolbar, channel panel, language, and responsiveness. |
| `notifications.js` | Temporary messages and diagnostic history. |
| `progress.js` | Transmission and file-operation progress. |
| `workspace-controls.js` | Connection, execution, device, XML save, and XML load. |
| `visual-themes.js` | Theme catalog, persistence, and application. |
| `block_warning_ui.js` | Appearance and wrapping of warnings attached to blocks. |
| `device-reference.js` | Hardware-guide menu, loading, and navigation. |

## Global registry

The bootstrap creates one collection:

```js
var UI = UIFactory.create();
```

Existing consumers use stable keys:

```js
UI.notify.send(message);
UI.progress.start(total);
UI.workspace.save();
```

Some modules still use `UI['notify']`; both forms must remain valid. `UI.account` also remains available to legacy storage code.

## Action flow

```text
DOM event → UI component → domain service → result → notify/progress/DOM
```

For example, the **Run** button does not implement the protocol: `workspace-controls.js` asks `Tool`, which uses execution and communication. This separation allows service testing without reproducing the entire screen.

## Creating or splitting a component

1. Identify one visual state or cohesive control group.
2. Keep selectors and listeners in the component file.
3. Use existing services instead of copying their logic.
4. Expose only methods consumed by other modules.
5. Register the instance in `UIFactory.create()` when it must be public.
6. Confirm script order in `src/pages/index.html`.

Do not create a component for a short stateless function. A split should make behavior easier to locate.

## Visual themes

`visual-themes.js` controls interface tokens and classes. Theme images live under `src/assets/images/themes/`. A new theme needs a stable identifier, bilingual label, readable contrast, and persistence compatible with existing saved values.

## Hardware guides

`device-reference.js` is only the host. Tutorial content and interactions belong to `src/hardware-guides/<project>/`; shared styles live in `src/styles/device-reference.css`.

## Global dependencies

The layer still communicates with `Code`, `Channel`, `Files`, `Tool`, `term`, and the `UI` registry. Preserve these facades while classic scripts remain supported. Make new dependencies explicit at creation time whenever possible.

## Accessibility and security

- keep `aria-expanded`, `aria-hidden`, and focus synchronized with panels;
- use `textContent` for external values and device messages;
- never rely on color alone to indicate state;
- verify keyboard use, narrow screens, and zoom;
- notifications must not inject untrusted HTML.

## Validation

```powershell
node tests/examples_generation_smoke.js
node --test tests/i18n/*.test.js
node --test src/mobile/tests/mobile-workspace.test.js src/mobile/tests/mobile-security.test.js
```

In the browser, validate onboarding, toolbar, projects, V6/V7, themes, languages, tabs, and resizing with no page errors.
