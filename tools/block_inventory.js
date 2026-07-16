#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const blockDirs = [
  path.join(root, 'src', 'js', 'blocks', 'definitions'),
  path.join(root, 'src', 'js', 'blocks', 'generators')
];

function walkJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJsFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function addOccurrence(map, name, file, lineNumber) {
  if (!map.has(name)) map.set(name, []);
  map.get(name).push({ file: relative(file), line: lineNumber });
}

function scanFile(file, state) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  let currentBlock = null;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const blockMatch = line.match(/Blockly\.Blocks\[['"]([^'"]+)['"]\]/);
    const generatorMatch = line.match(/Blockly\.Python\[['"]([^'"]+)['"]\]/);

    if (blockMatch) {
      currentBlock = blockMatch[1];
      addOccurrence(state.definitions, currentBlock, file, lineNumber);
    }

    if (generatorMatch) {
      addOccurrence(state.generators, generatorMatch[1], file, lineNumber);
    }

    if (line.includes('setCheck(null)')) {
      state.looseChecks.push({
        block: currentBlock,
        file: relative(file),
        line: lineNumber,
        code: line.trim()
      });
    }

    if (line.match(/setOutput\(\s*true\s*\)/)) {
      state.untypedOutputs.push({
        block: currentBlock,
        file: relative(file),
        line: lineNumber,
        code: line.trim()
      });
    }
  });
}

function toSortedArray(map) {
  return Array.from(map.keys()).sort();
}

function buildReport() {
  const state = {
    definitions: new Map(),
    generators: new Map(),
    looseChecks: [],
    untypedOutputs: []
  };

  blockDirs.flatMap(walkJsFiles).forEach((file) => scanFile(file, state));

  const definitions = toSortedArray(state.definitions);
  const generators = toSortedArray(state.generators);
  const definitionSet = new Set(definitions);
  const generatorSet = new Set(generators);
  const internalBlockPattern = /(_container|_item)$/;

  const missingGenerators = definitions
    .filter((name) => !generatorSet.has(name))
    .map((name) => ({
      name,
      likelyInternal: internalBlockPattern.test(name),
      locations: state.definitions.get(name)
    }));

  const orphanGenerators = generators
    .filter((name) => !definitionSet.has(name))
    .map((name) => ({
      name,
      locations: state.generators.get(name)
    }));

  return {
    summary: {
      definitions: definitions.length,
      pythonGenerators: generators.length,
      missingGenerators: missingGenerators.length,
      orphanGenerators: orphanGenerators.length,
      looseChecks: state.looseChecks.length,
      untypedOutputs: state.untypedOutputs.length
    },
    missingGenerators,
    orphanGenerators,
    looseChecks: state.looseChecks,
    untypedOutputs: state.untypedOutputs
  };
}

function printText(report) {
  console.log('Block inventory');
  console.log('===============');
  Object.entries(report.summary).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  function printSection(title, items, limit, formatter) {
    console.log(`\n${title}`);
    console.log('-'.repeat(title.length));
    items.slice(0, limit).forEach((item) => console.log(formatter(item)));
    if (items.length > limit) console.log(`... ${items.length - limit} more`);
  }

  printSection('Missing Python generators', report.missingGenerators, 30, (item) => {
    const location = item.locations[0];
    const suffix = item.likelyInternal ? ' (likely internal mutator)' : '';
    return `${item.name}${suffix} - ${location.file}:${location.line}`;
  });

  printSection('Python generators without local definition', report.orphanGenerators, 30, (item) => {
    const location = item.locations[0];
    return `${item.name} - ${location.file}:${location.line}`;
  });

  printSection('Loose setCheck(null) inputs', report.looseChecks, 30, (item) => {
    return `${item.block || '<unknown>'} - ${item.file}:${item.line}`;
  });

  printSection('Untyped outputs', report.untypedOutputs, 30, (item) => {
    return `${item.block || '<unknown>'} - ${item.file}:${item.line}`;
  });
}

const report = buildReport();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printText(report);
}
