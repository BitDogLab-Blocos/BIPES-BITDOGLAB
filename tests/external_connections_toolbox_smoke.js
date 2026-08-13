'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const toolboxPath = path.join(root, 'src', 'js', 'config', 'toolbox.xml');
const catalogPath = path.join(root, 'src', 'translations', 'catalog.js');
const contractsPath = path.join(root, 'src', 'js', 'blocks', 'contracts', 'registry.js');
const contractValidatorPath = path.join(root, 'src', 'js', 'blocks', 'contracts', 'validator.js');
const servoDefinitionsPath = path.join(root, 'src', 'js', 'blocks', 'definitions', 'servo.js');
const servoGeneratorsPath = path.join(root, 'src', 'js', 'blocks', 'generators', 'servo.js');
const workspaceHintsPath = path.join(root, 'src', 'js', 'core', 'workspace', 'hints.js');
const toolbox = fs.readFileSync(toolboxPath, 'utf8');
const catalog = fs.readFileSync(catalogPath, 'utf8');
const contracts = fs.readFileSync(contractsPath, 'utf8');
const contractValidator = fs.readFileSync(contractValidatorPath, 'utf8');
const servoDefinitions = fs.readFileSync(servoDefinitionsPath, 'utf8');
const servoGenerators = fs.readFileSync(servoGeneratorsPath, 'utf8');
const workspaceHints = fs.readFileSync(workspaceHintsPath, 'utf8');

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

assert.match(externalCategories[4].body, /<field name="DIR_INCREASE">UP<\/field>/);
assert.match(externalCategories[4].body, /<field name="DIR_DECREASE">DOWN<\/field>/);
assert.doesNotMatch(externalCategories[4].body, /<field name="(?:AXIS|INCREASE_DIRECTION)">/);
assert.match(servoDefinitions, /graus \(limite: 0°–180°\)/);
assert.match(servoGenerators, /function sequentialAngleDisplayCode\(block, dig\)/);
assert.match(servoGenerators, /Number\(valueBlock\.getFieldValue\('DIG'\)\) !== dig/);
assert.match(workspaceHints, /WorkspaceManager\.showServoAngleReminder = function\(\)/);
assert.match(workspaceHints, /blockType === 'servo_angulo_atual'/);
assert.match(workspaceHints, /WorkspaceManager\.showServoConnectionReminder = function\(block\)/);
assert.match(workspaceHints, /WorkspaceManager\.bindServoCategoryHint = function\(\)/);
assert.match(workspaceHints, /categoryName === 'Servo Motor Externo'/);
assert.match(workspaceHints, /categoryName === 'External Servo Motor'/);
assert.match(workspaceHints, /Code\.showServoConnectionReminder\(\)/);
assert.match(workspaceHints, /conexoes-externas\.png/);
assert.match(workspaceHints, /servo-motor\.png/);
assert.match(workspaceHints, /Laranja \(sinal\).*Conexão/);
assert.match(workspaceHints, /Vermelho \(VCC\).*5V-VSYS/);
assert.match(workspaceHints, /Marrom \(GND\).*GND/);
assert.match(workspaceHints, /Cabos do servo/);
assert.match(workspaceHints, /Laranja \(sinal\).*V7: Conexão 0 ou 1.*V6: Conexões 0, 1, 2 ou 3/);
assert.match(workspaceHints, /jumper macho-macho/);
assert.match(workspaceHints, /fita isolante/);
assert.match(workspaceHints, /peça ajuda ao professor/);
assert.match(contracts, /servoOledV7PinConflict:/);
assert.match(contracts, /servoAngleConnectionMismatch:/);
assert.match(contracts, /servoJoystickSameDirection:/);
assert.match(contractValidator, /function validateServoOledV7PinConflicts\(blocks, warnings\)/);
assert.match(contractValidator, /function validateServoRules\(blocks, warnings\)/);
assert.match(contractValidator, /block\.getFieldValue\('DIR_INCREASE'\) === block\.getFieldValue\('DIR_DECREASE'\)/);
assert.match(contractValidator, /config\.PINS\.I2C_SDA, config\.PINS\.I2C_SCL/);

[
  ['servo_mover', 'statement'],
  ['servo_angulo_atual', 'value'],
  ['servo_joystick_controlar', 'statement'],
  ['servo_subir_gradualmente', 'statement'],
  ['servo_descer_gradualmente', 'statement']
].forEach(([blockType, kind]) => {
  const escapedType = blockType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const contractMatch = contracts.match(new RegExp(
    escapedType + ':\\s*\\{([\\s\\S]*?)\\n\\s*\\},'
  ));
  assert.ok(contractMatch, 'Contrato explícito ausente para ' + blockType + '.');
  assert.match(contractMatch[1], new RegExp("kind:\\s*'" + kind + "'"));
  assert.doesNotMatch(
    contractMatch[1],
    /requiredValueInputs/,
    blockType + ' usa campos internos e não deve exigir blocos numéricos encaixados.'
  );
});

const servoAngleContract = contracts.match(/servo_angulo_atual:\s*\{([\s\S]*?)\n\s*\},/);
assert.ok(servoAngleContract);
[
  'servo_mover',
  'servo_joystick_controlar',
  'servo_subir_gradualmente',
  'servo_descer_gradualmente'
].forEach((driverType) => {
  assert.match(servoAngleContract[1], new RegExp("'" + driverType + "'"));
});

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
