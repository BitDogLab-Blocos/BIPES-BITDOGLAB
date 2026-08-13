'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const toolboxPath = path.join(root, 'src', 'js', 'config', 'toolbox.xml');
const catalogPath = path.join(root, 'src', 'translations', 'catalog.js');
const toolbox = fs.readFileSync(toolboxPath, 'utf8');
const catalog = fs.readFileSync(catalogPath, 'utf8');

const expectedNames = [
  'LEDs externos',
  'Luz e sombra com LDR',
  'Temperatura externa com NTC',
  'Distância e presença com ultrassônico',
  'Servo Motor Externo'
];

const externalCategories = Array.from(
  toolbox.matchAll(/<category\s+([^>]*\bdata-project="externos"[^>]*)>([\s\S]*?)<\/category>/g),
  (match) => ({ attributes: match[1], body: match[2] })
);

function attribute(attributes, name) {
  const match = attributes.match(new RegExp('\\b' + name + '="([^"]*)"'));
  return match ? match[1] : null;
}

const actualNames = externalCategories.map((category) => attribute(category.attributes, 'name'));
assert.deepStrictEqual(actualNames, expectedNames, 'As cinco categorias externas devem existir na ordem planejada.');

externalCategories.forEach((category) => {
  assert.strictEqual(attribute(category.attributes, 'data-project'), 'externos');
  if (category !== externalCategories[4]) {
    assert.ok(!/<block\b/.test(category.body), 'Somente a categoria de servo deve possuir blocos nesta etapa.');
  }
});

const servoBlockTypes = Array.from(
  externalCategories[4].body.matchAll(/<block\s+[^>]*type="([^"]+)"/g),
  (match) => match[1]
);
assert.deepStrictEqual(servoBlockTypes, [
  'servo_mover',
  'servo_angulo_atual',
  'servo_joystick_controlar',
  'servo_subir_gradualmente',
  'servo_descer_gradualmente',
  'display_mostrar_valor',
  'servo_angulo_atual'
], 'A categoria de servo deve oferecer cinco blocos e uma composição pronta de display.');

function visibleExternalCategories(project) {
  return externalCategories.filter((category) => {
    return attribute(category.attributes, 'data-project').split(',').map((value) => value.trim()).includes(project);
  });
}

assert.strictEqual(visibleExternalCategories('externos').length, 5);
['basico', 'robo', 'estufa', 'piano'].forEach((project) => {
  assert.strictEqual(visibleExternalCategories(project).length, 0, 'Categorias externas apareceram no projeto ' + project + '.');
});

expectedNames.forEach((name) => {
  assert.ok(catalog.includes(JSON.stringify(name) + ':'), 'Tradução ausente para a categoria: ' + name);
});

console.log('OK: 5 categorias exclusivas do projeto de conexões externas.');
