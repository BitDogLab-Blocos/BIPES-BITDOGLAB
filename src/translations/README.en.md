# Project translations

[Leia em português](README.md) · **English**

This folder centralizes translated text used by the web application, Blockly, and the Android WebView. The catalog maintains Brazilian Portuguese and English without changing identifiers that must remain stable in generated code.

## Organization

```text
src/translations/
├── catalog.js                 # main application catalog
└── blockly/
    ├── messages.js            # Blockly source messages and metadata
    └── data/
        ├── constants.json     # constants shared by Blockly
        ├── en.json            # English data
        ├── pt-br.json         # Brazilian Portuguese data
        └── synonyms.json      # equivalences used by Blockly tooling
```

## Application catalog

`catalog.js` contains BitDogLab's own messages in the `pt-br` and `en` maps and exposes the result through the global `Code` namespace. Loading starts in `src/js/core/language.js`; the interface layer uses `Code.t(...)` and `data-i18n` attributes to look up messages.

When adding a new text:

1. create a stable key and add it in both languages;
2. use `Code.t('app.keyName')` in JavaScript or `data-i18n="app.keyName"` in HTML;
3. preserve placeholders such as `%1` and `%2` exactly in both versions;
4. keep identifiers, variable names, pins, and values that must appear in generated MicroPython unchanged.

The legacy text-based translator remains in the catalog to preserve older blocks and projects while the migration to stable keys continues.

## Blockly data

`blockly/messages.js` follows Blockly's message format and records the rules used to generate the JSON files. When changing messages from this source, follow the instructions in the file and regenerate the corresponding data; do not edit only one locale and leave derived files out of sync.

The data files are not a second BitDogLab interface catalog. They support Blockly's text and metadata, while `catalog.js` contains the project's own messages.

## Translation checklist

- Check the interface in Portuguese and English in the browser.
- Confirm that translated text does not change block names, fields, variables, or generated identifiers.
- Test placeholders, line breaks, and special characters.
- Also validate the Android WebView when the change affects messages loaded during startup.
