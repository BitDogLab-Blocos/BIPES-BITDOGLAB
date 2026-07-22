'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repositoryRoot = path.resolve(__dirname, '..', '..');

function loadBrowserScript(relativePath, globals, exportExpression) {
  const filename = path.join(repositoryRoot, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    TextEncoder,
    TextDecoder,
    TextDecoderStream,
    ReadableStream,
    WritableStream,
    btoa,
    ...globals
  };

  vm.createContext(sandbox);
  vm.runInContext(
    `${source}\n;globalThis.__testExports = (${exportExpression});`,
    sandbox,
    { filename }
  );

  return {
    exports: sandbox.__testExports,
    sandbox
  };
}

async function waitFor(predicate, message, timeoutMs = 1000) {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt >= timeoutMs) {
      throw new Error(message || 'Timed out waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

module.exports = {
  loadBrowserScript,
  waitFor
};
