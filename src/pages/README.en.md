# BIPES–BitDogLab pages

[Leia em português](README.md) · **English**

`src/pages/` contains the HTML documents that serve as application entry points. Pages define structure and loading order; reusable behavior must remain in JavaScript and CSS modules.

## Entry points

| Page | Purpose |
| --- | --- |
| `index.html` | Main interface: Blockly, toolbar, projects, terminal, and device. |
| `device-reference.html` | Lightweight host for modular hardware guides. |

The APK also loads `index.html` from `/assets/src/pages/index.html?mobile=1`.

## HTML responsibilities

- declare structural elements and accessibility attributes;
- load CSS, libraries, and scripts in the correct order;
- provide useful fallback copy before translations apply;
- preserve IDs consumed by components and tests;
- provide mount points for Blockly, terminal, files, and guides.

Do not place generation, communication, or persistent-state rules in inline scripts. The small ES module used for `DeviceFileManager` is a legacy integration and should move only with compatibility tests.

## Script order in `index.html`

```text
libraries → storage/execution → profiles → core
→ communication → UI → i18n → blocks/generators
→ terminal/editor → bootstrap
```

Classic scripts share globals; moving one tag can break startup even when every file is still present.

## Stable contracts

- IDs such as `content_blocks`, `term`, `device_selector`, and toolbar buttons;
- Blockly types and fields stored in XML;
- relative paths resolved from `src/pages/`;
- `mobile` and `lang` parameters;
- paths and hashes protected by the mobile boundary.

## Changing a page

1. Find the JavaScript component that owns the behavior.
2. Preserve public IDs or implement migration in the same change.
3. Update `data-i18n`, labels, and ARIA attributes.
4. Resolve paths from the host page, not from an inserted fragment.
5. Test web and Android whenever `index.html` changes.

## Validation

```powershell
node tests/examples_generation_smoke.js
node --test tests/i18n/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```

In the browser, verify zero page errors, no asset 404s, onboarding, projects, tabs, themes, languages, and V6/V7.
