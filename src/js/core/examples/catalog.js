'use strict';

(function(global) {
  var ExamplesCatalog = {};
  var catalogPromise = null;

  function resolvePath(value) {
    if (!value) return '';
    if (/^(https?:|data:|\/)/.test(value)) return value;
    return new URL('../../' + value.replace(/^\.\//, ''), document.baseURI).href;
  }

  function normalizeDisplays(catalog) {
    var displays = catalog && Array.isArray(catalog.displays)
      ? catalog.displays
      : [];
    return displays.map(function(display) {
      return {
        id: String(display.id || ''),
        type: String(display.type || ''),
        title: String(display.title || display.id || 'Display'),
        description: String(display.description || ''),
        image: resolvePath(display.image)
      };
    }).filter(function(display) {
      return display.id && display.image;
    });
  }

  function normalize(catalog, displayId) {
    var categories = catalog && Array.isArray(catalog.categories)
      ? catalog.categories
      : [];

    return categories.map(function(category) {
      var examples = Array.isArray(category.examples) ? category.examples : [];
      examples = examples.filter(function(example) {
        return !example.displays || example.displays[displayId];
      });
      return {
        id: String(category.id || ''),
        title: String(category.title || category.id || 'Exemplos'),
        icon: String(category.icon || '□'),
        cssIcon: String(category.cssIcon || ''),
        examples: examples.map(function(example) {
          return {
            number: Number(example.number) || 0,
            title: String(example.title || 'Exemplo'),
            description: String(example.description || ''),
            icon: String(example.icon || category.icon || '□'),
            xml: resolvePath(example.displays
              ? example.displays[displayId]
              : example.xml),
            image: resolvePath(example.image)
          };
        })
      };
    }).filter(function(category) {
      return category.id && category.examples.length;
    });
  }

  function loadRawCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch('../../examples/catalog.json?ver=20260923displayFamilies2')
        .then(function(response) {
          if (!response.ok) throw new Error('Não foi possível carregar o catálogo de exemplos.');
          return response.json();
        });
    }
    return catalogPromise;
  }

  ExamplesCatalog.getDisplays = function() {
    return loadRawCatalog().then(normalizeDisplays);
  };

  ExamplesCatalog.load = function(displayId) {
    return loadRawCatalog().then(function(catalog) {
      var displays = normalizeDisplays(catalog);
      var selectedId = String(displayId || (displays[0] && displays[0].id) || 'pequeno');
      if (!displays.some(function(display) { return display.id === selectedId; })) {
        throw new Error('O modelo de display selecionado não existe no catálogo.');
      }
      return normalize(catalog, selectedId);
    });
  };

  global.ExamplesCatalog = ExamplesCatalog;
})(window);
