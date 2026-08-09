# BIPES–BitDogLab translations

[Leia em português](README.md) · **English**

`src/translations/` is the source for Brazilian Portuguese and English text used by the web interface, Blockly, generated MicroPython, guides, and Android WebView.

## Structure

```text
src/translations/
├── catalog.js
└── blockly/
    ├── messages.js
    └── data/
        ├── constants.json
        ├── en.json
        ├── pt-br.json
        └── synonyms.json
```

| Part | Responsibility |
| --- | --- |
| `catalog.js` | Application-owned messages and generated-code translation rules. |
| `blockly/messages.js` | Source and metadata for Blockly-originated messages. |
| `blockly/data/*.json` | Derived data consumed by Blockly message tooling. |

## Catalog layers

`Code.TRANSLATION_CATALOG` separates content with different risks:

| Layer | Example consumer |
| --- | --- |
| `app` | `Code.t('app.saveMainLabel')` and `data-i18n`. |
| `blockly` | Editor labels, categories, and messages. |
| `text` | Compatibility with old source-text translations. |
| `generated` | Identifiers, comments, and strings emitted in MicroPython. |

New interface text should use keys. Text-based translation remains only to preserve old blocks and projects.

## Adding an interface message

1. Choose a stable key that describes meaning, not visual position.
2. Add Portuguese and English values to `APP_MESSAGES`.
3. Preserve placeholders such as `%1`, `%2`, and line breaks in both languages.
4. Consume the key from JavaScript:

```js
UI.notify.send(Code.t('app.versionChanged'));
```

or HTML:

```html
<span data-i18n="app.saveMainLabel">Salvar na placa</span>
```

Original HTML copy should remain useful when the catalog is unavailable.

## Translating generated code

MicroPython has names that must never change, including modules, classes, methods, and API arguments. `core/i18n/generated-code.js` uses explicit lists and conservative rules to distinguish educational copy from executable syntax.

When adding a generated-code translation:

- never change imports, module names, or MicroPython attributes;
- preserve pins, numbers, and functional literal values;
- keep names shared between setup and loop consistent;
- test compound identifiers and reserved words;
- inspect output for both V6 and V7.

## Blockly messages

JSON files under `blockly/data/` are not a second BitDogLab catalog. They support Blockly's message set. When changing that source, update languages and derived data together, following comments in `blockly/messages.js`.

## Hardware guides

Tutorials register translations in their own `tutorial.js` because each module loads independently. The i18n test ensures that every `data-copy` key has an English value.

## Checklist

- Portuguese and English load without visible keys;
- placeholders appear in the same count and order;
- long text fits buttons and narrow panels;
- `alt` attributes, titles, and dynamic messages are translated;
- generated Python preserves APIs and executability;
- Android WebView presents the same catalog as the web app.

## Validation

```powershell
node --test tests/i18n/*.test.js
node tests/examples_generation_smoke.js
node --test src/mobile/tests/*.test.js
```
