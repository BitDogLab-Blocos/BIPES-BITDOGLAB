# Hardware guides

[Leia em português](README.md) · **English**

This folder contains the tutorials shown in the **Device** tab. Each project keeps its content, translations, and behavior in an independent folder. A tutorial never imports or changes another tutorial's code.

## Architecture

![Modular hardware guide architecture](images/architecture.svg)

The shared flow is intentionally small: `manifest.js` declares which modules are loaded, `registry.js` validates and registers them, and `src/js/ui/device-reference.js` builds the menu and displays only the tutorial selected by the URL.

| File or folder | Responsibility |
| --- | --- |
| `manifest.js` | Lists each available project's `tutorial.js`. |
| `registry.js` | Exposes `register`, `get`, and `list`, validating the minimum module contract. |
| `<project>/tutorial.html` | Stores Portuguese content and translation markers. |
| `<project>/tutorial.js` | Registers menu text, template, English translations, and project-only behavior. |
| `<project>/tutorial.css` | Optional; used only when shared CSS is not enough. |
| `src/js/ui/device-reference.js` | Loads modules and templates, builds the menu, routes by hash, and applies language. |
| `src/styles/device-reference.css` | Defines the shared visual language for every tutorial. |
| `src/pages/device-reference.html` | Provides only the outer shell: sidebar and content region. |

## Current structure

```text
src/hardware-guides/
├── images/
│   └── architecture.svg
├── bitdoglab/
│   ├── tutorial.html
│   └── tutorial.js
├── estufa/
│   ├── tutorial.html
│   └── tutorial.js
├── robo/
│   ├── tutorial.html
│   └── tutorial.js
├── manifest.js
├── registry.js
├── README.md
└── README.en.md
```

The `bitdoglab`, `estufa`, and `robo` modules do not depend on one another. Removing one from the manifest does not change the others.

## Tutorial contract

Each `tutorial.js` calls `DeviceHardwareGuides.register` with these properties:

| Property | Required | Purpose |
| --- | --- | --- |
| `id` | Yes | Space-free identifier used by the menu and URL hash. |
| `order` | Recommended | Sets the tutorial's menu position. |
| `template` | Yes | Path to `tutorial.html`, relative to `src/pages/device-reference.html`. |
| `menu` | Yes | Button title and description in Portuguese and English. |
| `translations` | For English | Maps every `data-copy` or `data-copy-alt` key to English. |
| `init(context)` | No | Initializes project-only interaction after inserting the HTML. |
| `stylesheet` | No | Loads project-only CSS while that tutorial is open. |

The `context` passed to `init` contains the tutorial `root` element and current `lang`. Always query through `context.root` to keep behavior isolated.

## Complete example: add a guide

The example below creates a fictional `sensor-luz` project.

### 1. Create the folder

```text
src/hardware-guides/sensor-luz/
├── tutorial.html
└── tutorial.js
```

Use a short lowercase ID without spaces or accents. The folder and `id` must match.

### 2. Write the Portuguese template

Create `sensor-luz/tutorial.html`:

```html
<section class="project-panel is-active"
         id="sensor-luz"
         data-panel="sensor-luz">
  <header class="article-header">
    <p class="article-index" data-copy="eyebrow">
      PROJETO SENSOR DE LUZ
    </p>
    <h2 data-copy="title">Medindo a luminosidade</h2>
    <p data-copy="intro">
      Este tutorial explica como conectar e testar o sensor de luz.
    </p>
  </header>

  <figure class="component-figure">
    <img src="../assets/images/devices/sensor-luz.png"
         alt="Sensor de luz usado no projeto"
         data-copy-alt="imageAlt">
    <figcaption data-copy="imageCaption">
      Módulo utilizado para medir a luz ambiente.
    </figcaption>
  </figure>
</section>
```

Keep the original content in Portuguese, mark translated text with `data-copy`, and mark image alternatives with `data-copy-alt`. Translation replaces `textContent`, so place the attribute directly on the textual element. Image URLs start with `../assets/` because the fragment is rendered by `src/pages/device-reference.html`.

### 3. Register the module

Create `sensor-luz/tutorial.js`:

```js
(function (registry) {
  'use strict';

  registry.register({
    id: 'sensor-luz',
    order: 4,
    template: '../hardware-guides/sensor-luz/tutorial.html',

    menu: {
      'pt-br': {
        title: 'Sensor de luz',
        description: 'Luminosidade ambiente'
      },
      en: {
        title: 'Light sensor',
        description: 'Ambient light'
      }
    },

    translations: {
      en: {
        eyebrow: 'LIGHT SENSOR PROJECT',
        title: 'Measuring light levels',
        intro: 'This tutorial explains how to connect and test the light sensor.',
        imageAlt: 'Light sensor used in the project',
        imageCaption: 'Module used to measure ambient light.'
      }
    }
  });
})(window.DeviceHardwareGuides);
```

The menu is generated automatically from `order` and `menu`. Do not add buttons manually to `device-reference.html`.

### 4. Add one manifest entry

Add the new script to `manifest.js`:

```js
window.DeviceHardwareGuideScripts = [
  '../hardware-guides/bitdoglab/tutorial.js',
  '../hardware-guides/estufa/tutorial.js',
  '../hardware-guides/robo/tutorial.js',
  '../hardware-guides/sensor-luz/tutorial.js'
];
```

This is the only shared file that must change for a guide to appear in the **Device** tab.

### 5. Add optional behavior

Static text, images, and tables do not need `init`. For interactive elements, add this property to the registered object:

```js
init: function (context) {
  var button = context.root.querySelector('#testLightSensor');
  var result = context.root.querySelector('#lightSensorResult');
  if (!button || !result) return;

  button.addEventListener('click', function () {
    result.textContent = context.lang === 'en'
      ? 'Connection reviewed.'
      : 'Ligação conferida.';
  });
}
```

Keep this logic inside the project's `tutorial.js`, never in the shared loader.

### 6. Add optional CSS

Reuse `src/styles/device-reference.css` first. If the tutorial needs a unique component, create `sensor-luz/tutorial.css` and register:

```js
stylesheet: '../hardware-guides/sensor-luz/tutorial.css'
```

The loader adds this stylesheet when opening the tutorial and removes it when navigating away.

### 7. Test both languages

Serve the platform over HTTP and open:

```text
src/pages/device-reference.html#sensor-luz
src/pages/device-reference.html?lang=en#sensor-luz
```

Verify the menu, translations, image requests, responsive layout, URL hash, optional interactions, and that switching to another tutorial leaves no project-only styles behind.

## Hardware guide versus Blockly project

Adding a folder and manifest entry creates a guide in the **Device** tab. It does not create a Blockly project category.

If the hardware must also become a selectable **Projects** mode, separately register its card in `src/pages/index.html`, categories in `src/js/config/toolbox.xml`, name in `WorkspaceManager.PROJECT_NAMES`, and optionally its tutorial notice in `WorkspaceManager.PROJECT_HARDWARE_GUIDES`.

This separation is intentional: a hardware guide can exist without new blocks, and a Blockly category can reuse already documented hardware.
