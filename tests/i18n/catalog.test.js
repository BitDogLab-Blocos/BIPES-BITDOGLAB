'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');

function loadCatalog(language) {
  const Code = { LANG: language };
  const window = { Code, alert() {} };
  const sandbox = {
    Code,
    window,
    Blockly: { Msg: {} },
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(root, 'src/translations/catalog.js'), 'utf8'),
    sandbox
  );
  return { Code, sandbox };
}

function loadRuntime(language) {
  const { Code, sandbox } = loadCatalog(language);
  vm.runInContext(
    fs.readFileSync(path.join(root, 'src/js/core/i18n.js'), 'utf8'),
    sandbox
  );
  return { Code, sandbox };
}

test('central catalog provides both UI languages and only the used Blockly messages', () => {
  const portuguese = loadCatalog('pt-br');
  const english = loadCatalog('en');

  assert.equal(
    portuguese.sandbox.window.MSG.title,
    'BitDogLab - Aprenda Programação de Forma Divertida'
  );
  assert.equal(
    english.sandbox.window.MSG.title,
    'BitDogLab - Visual Programming for Embedded Systems'
  );
  assert.equal(portuguese.sandbox.Blockly.Msg.CAT_TIMING, 'Temporização');
  assert.equal(english.sandbox.Blockly.Msg.CAT_TIMING, undefined);
  assert.equal(portuguese.sandbox.Blockly.Msg.NEW_VARIABLE_TITLE, 'Nome da nova variável:');
  assert.equal(english.sandbox.Blockly.Msg.NEW_VARIABLE_TITLE, 'New variable name:');
  assert.equal(english.sandbox.Blockly.Msg.TEXT_PRINT_HELPURL, undefined);
  assert.equal(english.Code.TRANSLATION_CATALOG.en.app.saveMainLabel, 'Save to board');
  assert.equal(
    english.Code.TRANSLATION_CATALOG.en.text['💡 Ligar LED da cor'],
    '💡 Turn On LED Color'
  );

  const forbidden = /\b(iot|mqtt|wifi|webrepl|http|internet|ntp|dht|relay)\b/i;
  for (const language of ['pt-br', 'en']) {
    const locale = portuguese.Code.TRANSLATION_CATALOG[language];
    for (const section of [locale.app, locale.legacyApp, locale.text, locale.blockly]) {
      for (const [key, value] of Object.entries(section)) {
        assert.equal(forbidden.test(key) || forbidden.test(String(value)), false, `${language}: ${key}`);
      }
    }
  }
});

test('central catalog preserves MicroPython identifier translation rules', () => {
  const { Code } = loadRuntime('en');

  assert.equal(
    Code.translateGeneratedIdentifier('_matriz_brilho'),
    '_matrix_brightness'
  );
  assert.equal(
    Code.translateGeneratedIdentifier('_aht20_temp'),
    '_aht20_temperature'
  );
  assert.equal(Code.translateGeneratedIdentifier('sleep_ms'), 'sleep_ms');
  assert.equal(
    Code.translateGeneratedText('# brilho vermelho e temperatura'),
    '# brightness red e temperature'
  );
});

test('key-based translation uses the central app catalog with fallback', () => {
  const { Code } = loadRuntime('en');

  assert.equal(Code.t('app.runTooltip'), 'Execute the program generated from the workspace blocks.');
  assert.equal(Code.t('app.toolboxLoadError', { 1: 'network' }), 'Failed to load the toolbox: network');
  assert.equal(Code.t('app.keyThatDoesNotExist'), 'keyThatDoesNotExist');
});

test('Piano category, blocks, and dynamic panels translate completely', () => {
  const { Code } = loadRuntime('en');
  const translations = new Map([
    ['🎹 Controle Piano', '🎹 Piano Controls'],
    ['🎹 Piano interativo', '🎹 Interactive Piano'],
    ['♩ Temporização', '♩ Timing'],
    ['🎹 Tocar', '🎹 Play'],
    ['🔇 Parar piano', '🔇 Stop Piano'],
    ['🎹 Piano Musical', '🎹 Musical Piano'],
    ['Dó', 'C'],
    ['Ré', 'D'],
    ['Mi', 'E'],
    ['Fá', 'F'],
    ['Sol', 'G'],
    ['Lá', 'A'],
    ['Si', 'B'],
    ['Semibreve', 'Whole note'],
    ['Mínima', 'Half note'],
    ['Semínima', 'Quarter note'],
    ['Colcheia', 'Eighth note'],
    ['Semicolcheia', 'Sixteenth note'],
    ['arraste o canto', 'drag the corner']
  ]);

  for (const [portuguese, english] of translations) {
    assert.equal(Code.translateText(portuguese), english, portuguese);
  }

  assert.equal(Code.t('app.projectPianoTitle'), 'Musical Piano');
  assert.equal(
    Code.t('app.projectPianoDescription'),
    'Play notes on the piano, view the score, and generate buzzer code'
  );
});

test('device file manager translates board file UI and dynamic messages', () => {
  const { Code } = loadRuntime('en');
  const translations = new Map([
    ['Arquivos da placa', 'Board Files'],
    ['Atualizar arquivos da placa', 'Refresh board files'],
    ['Aguardando conexão…', 'Waiting for connection…'],
    ['Selecione um arquivo', 'Select a file'],
    ['Visualização em tabela', 'Table preview'],
    ['Renomear arquivo', 'Rename file'],
    ['Criar nova pasta', 'Create new folder'],
    ['Mover para cá', 'Move here'],
    ['Conecte a BitDogLab para acessar os arquivos gravados na placa.', 'Connect BitDogLab to access files stored on the board.'],
    ['Pasta main.py', 'Folder main.py'],
    ['Abrir programa.py…', 'Open programa.py…'],
    ['Lendo a raiz da placa…', 'Reading the board root…'],
    ['1 item nesta pasta.', '1 item in this folder.'],
    ['3 itens nesta pasta.', '3 items in this folder.'],
    ['Coluna 2', 'Column 2'],
    ['1 linha · 2 colunas · separado por vírgula', '1 row · 2 columns · separated by comma'],
    ['# Este arquivo é binário e não pode ser exibido como código.\n# Você ainda pode baixá-lo para o computador.', '# This file is binary and cannot be displayed as code.\n# You can still download it to your computer.'],
    ['Arquivo renomeado para novo.py.', 'File renamed to novo.py.'],
    ['dados.txt será removido definitivamente da placa.', 'dados.txt will be permanently removed from the board.'],
    ['main.py participa da inicialização da placa. Apagar esse arquivo pode impedir o projeto de iniciar automaticamente.', 'main.py participates in board startup. Deleting this file may prevent the project from starting automatically.']
  ]);

  for (const [portuguese, english] of translations) {
    assert.equal(Code.translateText(portuguese), english, portuguese);
  }
});
