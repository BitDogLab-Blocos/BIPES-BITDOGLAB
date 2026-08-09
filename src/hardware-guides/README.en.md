# BIPES–BitDogLab hardware guides

[Leia em português](README.md) · **English**

Tutorials shown in the **Device** tab live under `src/hardware-guides/`. Each guide owns its content, translations, and interactions without depending on another project.

![Modular hardware guide architecture](images/architecture.svg)

## Loading flow

```text
manifest.js
    ↓ lists modules
<project>/tutorial.js
    ↓ registers metadata and behavior
registry.js
    ↓ validates and sorts
device-reference.js
    ↓ loads the template and applies language
<project>/tutorial.html
```

| Part | Responsibility |
| --- | --- |
| `manifest.js` | Lists tutorial scripts loaded by the page. |
| `registry.js` | Validates, registers, and sorts modules. |
| `<project>/tutorial.html` | Original Portuguese content and translation markers. |
| `<project>/tutorial.js` | Menu, template, translations, and project-only behavior. |
| `<project>/tutorial.css` | Optional style isolated to one project. |
| `src/js/ui/device-reference.js` | Navigation, loading, language, and lifecycle. |
| `src/styles/device-reference.css` | Shared visual components. |

## Existing projects

```text
hardware-guides/
├── bitdoglab/         # board overview
├── estufa/            # AHT20 and greenhouse assembly
├── robo/              # chassis, H-bridge, and MPU6050
├── images/            # images used by this documentation
├── manifest.js
└── registry.js
```

Removing a script from the manifest removes only that menu item. Project directories never import one another.

## Module contract

Each `tutorial.js` registers an object through `DeviceHardwareGuides.register`:

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Lowercase identifier used by the menu and URL hash. |
| `template` | Yes | HTML fragment path relative to the hosting page. |
| `menu` | Yes | Title and description in `pt-br` and `en`. |
| `order` | Recommended | Numeric menu position. |
| `translations.en` | For English | Text matching every `data-copy` key. |
| `init(context)` | No | Initializes controls owned by the guide. |
| `stylesheet` | No | Stylesheet loaded only for this module. |

`init` receives `{ root, lang }`. Every DOM query must start from `context.root` to prevent collisions between tutorials.

## Create a guide

The example below adds `sensor-luz`.

### 1. Create the files

```text
hardware-guides/sensor-luz/
├── tutorial.html
└── tutorial.js
```

The directory name and `id` must match and use lowercase letters without spaces or accents.

### 2. Write the Portuguese HTML

```html
<section class="project-panel is-active"
         id="sensor-luz"
         data-panel="sensor-luz">
  <header class="article-header">
    <p class="article-index" data-copy="eyebrow">PROJETO SENSOR DE LUZ</p>
    <h2 data-copy="title">Medindo a luminosidade</h2>
    <p data-copy="intro">Aprenda a conectar e testar o sensor.</p>
  </header>

  <figure class="component-figure">
    <img src="../assets/images/devices/sensor-luz.png"
         alt="Sensor de luz"
         data-copy-alt="imageAlt">
    <figcaption data-copy="imageCaption">Sensor usado no projeto.</figcaption>
  </figure>
</section>
```

Template rules:

- keep useful content when JavaScript is unavailable;
- place `data-copy` only on the element whose `textContent` is replaced;
- use `data-copy-alt` for image alternative text;
- resolve assets from `src/pages/device-reference.html`, which renders the fragment.

### 3. Register metadata and translations

```js
(function (registry) {
  'use strict';

  registry.register({
    id: 'sensor-luz',
    order: 4,
    template: '../hardware-guides/sensor-luz/tutorial.html',
    menu: {
      'pt-br': { title: 'Sensor de luz', description: 'Luminosidade ambiente' },
      en: { title: 'Light sensor', description: 'Ambient light' }
    },
    translations: {
      en: {
        eyebrow: 'LIGHT SENSOR PROJECT',
        title: 'Measuring light levels',
        intro: 'Learn how to connect and test the sensor.',
        imageAlt: 'Light sensor',
        imageCaption: 'Sensor used by the project.'
      }
    }
  });
})(window.DeviceHardwareGuides);
```

### 4. Add the script to the manifest

```js
window.DeviceHardwareGuideScripts = [
  '../hardware-guides/bitdoglab/tutorial.js',
  '../hardware-guides/estufa/tutorial.js',
  '../hardware-guides/robo/tutorial.js',
  '../hardware-guides/sensor-luz/tutorial.js'
];
```

Do not create menu buttons manually; the interface derives them from registrations.

### 5. Add interaction only when needed

```js
init: function (context) {
  var button = context.root.querySelector('#testLightSensor');
  if (!button) return;

  button.addEventListener('click', function () {
    button.textContent = context.lang === 'en' ? 'Reviewed' : 'Conferido';
  });
}
```

Reuse `device-reference.css` before adding styles. For a unique need, declare `stylesheet: '../hardware-guides/sensor-luz/tutorial.css'`.

## Validation

Serve the project over HTTP and open:

```text
src/pages/device-reference.html#sensor-luz
src/pages/device-reference.html?lang=en#sensor-luz
```

Check menu order, URL hash, Portuguese, English, images, responsive layout, and the absence of residual events or styles after navigating away. Then run:

```powershell
node --test tests/i18n/*.test.js
node tests/examples_generation_smoke.js
```

## A guide is not a Blockly category

The manifest creates content in the **Device** tab. To expose the same hardware under **Projects**, separately register its card in `src/pages/index.html`, categories in `src/js/config/toolbox.xml`, and name in `WorkspaceManager.PROJECT_NAMES`.
