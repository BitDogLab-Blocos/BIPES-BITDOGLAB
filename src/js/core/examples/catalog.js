'use strict';

(function(global) {
  var ExamplesCatalog = {};
  var catalogPromise = null;

  function resolvePath(value) {
    if (!value) return '';
    if (/^(https?:|data:|\/)/.test(value)) return value;
    return new URL('../../' + value.replace(/^\.\//, ''), document.baseURI).href;
  }

  function normalize(catalog) {
    var categories = catalog && Array.isArray(catalog.categories)
      ? catalog.categories
      : [];

    return categories.map(function(category) {
      var examples = Array.isArray(category.examples) ? category.examples : [];
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
            xml: resolvePath(example.xml),
            image: resolvePath(example.image)
          };
        })
      };
    }).filter(function(category) {
      return category.id && category.examples.length;
    });
  }

  ExamplesCatalog.load = function() {
    if (!catalogPromise) {
      catalogPromise = fetch('../../examples/catalog.json?ver=20260923robotExamples25x18')
        .then(function(response) {
          if (!response.ok) throw new Error('Não foi possível carregar o catálogo de exemplos.');
          return response.json();
        })
        .then(normalize);
    }
    return catalogPromise;
  };

  global.ExamplesCatalog = ExamplesCatalog;
})(window);
