'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const scriptPath = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'res',
  'raw',
  'mobile_workspace.js'
);

function createClassList(initial = []) {
  const values = new Set(initial);
  return {
    add(value) { values.add(value); },
    contains(value) { return values.has(value); },
    remove(value) { values.delete(value); },
    toggle(value, enabled) {
      if (enabled) values.add(value);
      else values.delete(value);
    }
  };
}

function createElement() {
  const listeners = {};
  const attributes = {};
  return {
    classList: createClassList(),
    hidden: false,
    offsetWidth: 40,
    style: {},
    addEventListener(type, listener) { listeners[type] = listener; },
    click() { listeners.click(); },
    getAttribute(name) { return attributes[name] || null; },
    setAttribute(name, value) { attributes[name] = value; },
    getBoundingClientRect() { return { right: 180 }; }
  };
}

test('mobile category control collapses the toolbox and restores workspace width', () => {
  const documentElement = createElement();
  documentElement.setAttribute('lang', 'pt-br');
  const toolbox = createElement();
  const blocksContent = createElement();
  blocksContent.classList.add('on');
  const bodyChildren = [];
  const stored = new Map();
  let resizeCalls = 0;

  const document = {
    body: { appendChild(element) { bodyChildren.push(element); } },
    documentElement,
    readyState: 'complete',
    createElement,
    getElementById(id) {
      return id === 'content_blocks' ? blocksContent : null;
    },
    querySelector(selector) {
      return selector === '.blocklyToolboxDiv' ? toolbox : null;
    }
  };
  class MutationObserver {
    constructor(callback) { this.callback = callback; }
    observe() {}
  }
  const window = {
    Blockly: { svgResize() { resizeCalls += 1; } },
    Code: { workspace: {} },
    MutationObserver,
    addEventListener() {},
    document,
    innerWidth: 412,
    localStorage: {
      getItem(key) { return stored.get(key) || null; },
      setItem(key, value) { stored.set(key, value); }
    },
    navigator: { language: 'pt-br' },
    requestAnimationFrame(callback) { callback(); }
  };

  vm.runInContext(
    fs.readFileSync(scriptPath, 'utf8'),
    vm.createContext({
      window,
      MutationObserver
    }),
    { filename: scriptPath }
  );

  assert.equal(bodyChildren.length, 1);
  const button = bodyChildren[0];
  assert.equal(button.title, 'Recolher categorias de blocos');
  assert.equal(button.hidden, false);
  assert.equal(button.style.left, '180px');

  button.click();

  assert.equal(
    documentElement.classList.contains('bipes-mobile-toolbox-collapsed'),
    true
  );
  assert.equal(toolbox.getAttribute('aria-hidden'), 'true');
  assert.equal(button.title, 'Mostrar categorias de blocos');
  assert.equal(stored.get('bitdoglab.mobile.toolboxCollapsed'), 'true');
  assert.equal(resizeCalls, 1);

  button.click();

  assert.equal(
    documentElement.classList.contains('bipes-mobile-toolbox-collapsed'),
    false
  );
  assert.equal(toolbox.getAttribute('aria-hidden'), 'false');
  assert.equal(button.title, 'Recolher categorias de blocos');
  assert.equal(resizeCalls, 2);
});
