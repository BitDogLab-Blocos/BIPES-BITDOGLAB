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
const dht11DefinitionsPath = path.join(root, 'src', 'js', 'blocks', 'definitions', 'dht11.js');
const dht11GeneratorsPath = path.join(root, 'src', 'js', 'blocks', 'generators', 'dht11.js');
const sensorLibsPath = path.join(root, 'src', 'js', 'blocks', 'sensor_libs.js');
const dht11PinoutPath = path.join(root, 'src', 'assets', 'images', 'devices', 'dht11-pinout.png');
const v6ProfilePath = path.join(root, 'src', 'js', 'config', 'profiles', 'v6.js');
const v7ProfilePath = path.join(root, 'src', 'js', 'config', 'profiles', 'v7.js');
const dht11Definitions = fs.readFileSync(dht11DefinitionsPath, 'utf8');
const dht11Generators = fs.readFileSync(dht11GeneratorsPath, 'utf8');
const sensorLibs = fs.readFileSync(sensorLibsPath, 'utf8');
const v6Profile = fs.readFileSync(v6ProfilePath, 'utf8');
const v7Profile = fs.readFileSync(v7ProfilePath, 'utf8');
const servoDefinitions = fs.readFileSync(servoDefinitionsPath, 'utf8');
const servoGenerators = fs.readFileSync(servoGeneratorsPath, 'utf8');
const workspaceHints = fs.readFileSync(workspaceHintsPath, 'utf8');

const expectedNames = [
  'LEDs externos',
  'Luz e sombra com LDR',
  'Temperatura externa com DHT11',
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
  if (category !== externalCategories[2] && category !== externalCategories[4]) {
    assert.ok(!/<block\b/.test(category.body), 'Somente as categorias DHT11 e servo devem possuir blocos nesta etapa.');
  }
});

const dht11BlockTypes = Array.from(
  externalCategories[2].body.matchAll(/<block\s+[^>]*type="([^"]+)"/g),
  (match) => match[1]
);
assert.deepStrictEqual(dht11BlockTypes, [
  'dht11_temperatura',
  'display_mostrar_valor',
  'dht11_temperatura',
  'dht11_umidade',
  'display_mostrar_valor',
  'dht11_umidade',
  'dht11_plotar',
  'dht11_temperatura',
  'dht11_plotar',
  'dht11_umidade'
], 'A categoria DHT11 deve oferecer valores, displays pré-montados e gráficos.');

assert.match(dht11Definitions, /dht11_temperatura/);
assert.match(dht11Definitions, /dht11_umidade/);
assert.match(dht11Definitions, /dht11_plotar/);
assert.match(dht11Definitions, /gráfico da estufa com AHT20/);
assert.match(dht11Generators, /SensorLibs\.DHT11/);
assert.match(dht11Generators, /dht11_temperature/);
assert.match(dht11Generators, /dht11_humidity/);
assert.match(sensorLibs, /class DHT11:/);
assert.match(sensorLibs, /self\.pin\.init\(Pin\.OUT\)/);
assert.match(sensorLibs, /time\.sleep_ms\(1000\)/);
assert.match(sensorLibs, /pin\.init\(Pin\.IN, Pin\.PULL_UP\)/);
assert.match(sensorLibs, /self\.buf\[1\] \/ 10\.0/);
assert.match(sensorLibs, /self\.buf\[3\] \/ 10\.0/);
assert.match(dht11Generators, /AHT20 greenhouse project/);
assert.match(dht11Definitions, /external\.DHT11/);
assert.match(dht11Generators, /ALLOWED_DIG/);
assert.match(dht11Generators, /MIN_INTERVAL_MS/);
assert.match(v7Profile, /VERSION: 'v7'/);
assert.match(v7Profile, /DHT11:\s*\{[\s\S]*?ALLOWED_DIG: \['0', '1'\]/);
assert.match(v7Profile, /DHT11:\s*\{[\s\S]*?MIN_INTERVAL_MS: 2000/);
assert.match(v6Profile, /VERSION: 'v6'/);
assert.match(v6Profile, /DHT11:\s*\{[\s\S]*?ALLOWED_DIG: \['0', '1', '2', '3'\]/);
assert.match(v6Profile, /DHT11:\s*\{[\s\S]*?MIN_INTERVAL_MS: 2000/);

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
assert.match(workspaceHints, /WorkspaceManager\.showDht11ConnectionReminder = function\(block\)/);
assert.match(workspaceHints, /WorkspaceManager\.bindDht11CategoryHint = function\(\)/);
assert.match(workspaceHints, /categoryName === 'Temperatura externa com DHT11'/);
assert.match(workspaceHints, /categoryName === 'External Temperature with DHT11'/);
assert.match(workspaceHints, /Code\.showDht11ConnectionReminder\(\)/);
assert.match(workspaceHints, /dht11-pinout\.png/);
assert.ok(fs.existsSync(dht11PinoutPath), 'A imagem de pinagem do DHT11 deve existir.');
assert.match(workspaceHints, /Fios do DHT11/);
assert.match(workspaceHints, /Seta laranja.*DADOS/);
assert.match(workspaceHints, /Seta vermelha.*VCC \/ 3\.3V/);
assert.match(workspaceHints, /Seta preta.*GND/);
assert.match(workspaceHints, /garra jacaré/);
assert.match(workspaceHints, /Na V7.*DADOS.*0 ou 1/);
assert.match(workspaceHints, /Na V6.*0, 1, 2 ou 3/);
assert.match(workspaceHints, /Mesmo DHT11.*mesma Conexão.*dois módulos DHT11/);
assert.match(workspaceHints, /professor para conferir os fios/);
assert.match(workspaceHints, /peça ajuda ao professor/);
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
assert.match(workspaceHints, /ponta fêmea do jumper macho-fêmea/);
assert.match(workspaceHints, /jumper macho-macho.*garra/);
assert.match(workspaceHints, /fita isolante/);
assert.match(workspaceHints, /peça ajuda ao professor/);
assert.match(contracts, /servoOledV7PinConflict:/);
assert.match(contracts, /servoAngleConnectionMismatch:/);
assert.match(contracts, /servoJoystickSameDirection:/);
assert.match(contracts, /servoRaiseAngleOrder:/);
assert.match(contracts, /servoLowerAngleOrder:/);
assert.match(contracts, /dht11V7PinConflict:/);
assert.match(contracts, /dht11Aht20V7I2c0Conflict:/);
assert.match(contractValidator, /function validateServoOledV7PinConflicts\(blocks, warnings\)/);
assert.match(contractValidator, /function validateDht11V7PinConflicts\(blocks, warnings\)/);
assert.match(contractValidator, /function validateDht11Aht20V7I2c0Conflicts\(blocks, warnings\)/);
assert.match(contractValidator, /config\.VERSION !== 'v7'/);
assert.match(contractValidator, /function validateServoRules\(blocks, warnings\)/);
assert.match(contractValidator, /block\.getFieldValue\('DIR_INCREASE'\) === block\.getFieldValue\('DIR_DECREASE'\)/);
assert.match(contractValidator, /raiseStart >= raiseTarget/);
assert.match(contractValidator, /lowerStart <= lowerTarget/);
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
