// Browser-level integration checks for the external contact category.
'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const browserPaths = [
  process.env.PLAYWRIGHT_BROWSER_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);

const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml'
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  const file = path.join(root, path.normalize(pathname).replace(/^[/\\]+/, ''));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

function listen() {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function compilePython(code) {
  return spawnSync(
    'python',
    ['-c', 'import sys; compile(sys.stdin.read(), "generated.py", "exec")'],
    { input: code, encoding: 'utf8' }
  );
}

(async () => {
  const port = await listen();
  const executablePath = browserPaths.find((candidate) => fs.existsSync(candidate));
  const browser = await chromium.launch(executablePath ? { executablePath, headless: true } : { headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`http://127.0.0.1:${port}/src/pages/index.html?lang=pt-br`);
    await page.waitForFunction(() => (
      window.Code &&
      window.Code.workspace &&
      window.Code.BlockContractValidator &&
      window.Blockly &&
      window.Blockly.Python
    ), null, { timeout: 15000 });

    const result = await page.evaluate(() => {
      const Blockly = window.Blockly;
      const Code = window.Code;
      const workspace = Code.workspace;

      function load(xml) {
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
        return {
          report: Code.BlockContractValidator.getReport(workspace),
          code: Blockly.Python.workspaceToCode(workspace),
          generated: Code.generateCode()
        };
      }

      const action = '<block type="bipe_curto"><field name="VOLUME">30</field></block>';
      const event = (dig, next) => (
        '<block type="external_contact_when_closed"><field name="DIG">' + dig + '</field>' +
        '<statement name="DO">' + action + '</statement>' + (next || '') + '</block>'
      );
      const gnd = load('<xml>' + event(0) + '</xml>');
      const threeVolt = load(
        '<xml><block type="external_contact_prepare"><field name="COMMON">3V3</field></block>' +
        event(1) + '</xml>'
      );
      const booleanContact = load(
        '<xml><block type="controls_if"><value name="IF0">' +
        '<block type="external_contact_is_closed"><field name="DIG">0</field></block>' +
        '</value><statement name="DO0">' + action + '</statement></block></xml>'
      );
      const matrixTest = load('<xml><block type="external_contact_test_matrix"></block></xml>');
      const standaloneEvent = load('<xml>' + event(0) + '</xml>');
      const conflictingPreparation = load(
        '<xml><block type="external_contact_prepare"><field name="COMMON">GND</field></block>' +
        '<block type="external_contact_prepare"><field name="COMMON">3V3</field></block></xml>'
      );
      const duplicatePreparation = load(
        '<xml><block type="external_contact_prepare"><field name="COMMON">GND</field></block>' +
        '<block type="external_contact_prepare"><field name="COMMON">GND</field></block></xml>'
      );
      const servoConflict = load(
        '<xml><block type="controls_if"><value name="IF0"><block type="external_contact_is_closed">' +
        '<field name="DIG">0</field></block></value><statement name="DO0">' + action + '</statement></block>' +
        '<block type="servo_mover"><field name="DIG">0</field><field name="ANGLE">90</field></block></xml>'
      );
      const oledConflict = load(
        '<xml><block type="controls_if"><value name="IF0"><block type="external_contact_is_closed">' +
        '<field name="DIG">2</field></block></value><statement name="DO0">' + action + '</statement></block>' +
        '<block type="display_testar_conexao"></block></xml>'
      );
      const matrixOledConflict = load(
        '<xml><block type="external_contact_test_matrix"></block><block type="display_testar_conexao"></block></xml>'
      );
      const secondEvent = '<next>' + event(0) + '</next>';
      const sharedConnectionEvents = load('<xml>' + event(0, secondEvent) + '</xml>');

      return {
        definitions: [
          'external_contact_prepare',
          'external_contact_when_closed',
          'external_contact_is_closed',
          'external_contact_test_matrix'
        ].every((type) => !!Blockly.Blocks[type] && typeof Blockly.Python[type] === 'function'),
        gnd,
        threeVolt,
        booleanContact,
        matrixTest,
        standaloneEvent,
        conflictingPreparation,
        duplicatePreparation,
        servoConflict,
        oledConflict,
        matrixOledConflict,
        sharedConnectionEvents
      };
    });

    assert.strictEqual(result.definitions, true);
    assert.strictEqual(result.gnd.report.valid, true);
    assert.match(result.gnd.code, /_contact_pull = Pin\.PULL_UP/);
    assert.match(result.gnd.code, /_contact_active_level = 0/);
    assert.match(result.gnd.code, /_contact_debounce_ms = 50/);
    assert.match(result.gnd.code, /_contact_take_event\(0, "contact_/);
    assert.strictEqual(result.threeVolt.report.valid, true);
    assert.match(result.threeVolt.code, /_contact_pull = Pin\.PULL_DOWN/);
    assert.match(result.threeVolt.code, /_contact_active_level = 1/);
    assert.strictEqual(result.booleanContact.report.valid, true);
    assert.match(result.booleanContact.code, /if _contact_is_closed\(0\):/);
    assert.strictEqual(result.matrixTest.report.valid, true);
    assert.match(result.matrixTest.code, /_contact_test_button/);
    assert.match(result.matrixTest.code, /\(0, 0\), \(1, 1\), \(2, 3\), \(3, 4\)/);
    assert.strictEqual(result.standaloneEvent.report.valid, true);
    assert.match(result.standaloneEvent.generated, /while True:/);
    assert.doesNotMatch(result.standaloneEvent.generated, /Codigo nao gerado/);
    assert.strictEqual(result.conflictingPreparation.report.valid, false);
    assert.ok(result.conflictingPreparation.report.issues.some((issue) => /GND/.test(issue.messages.join('\n'))));
    assert.strictEqual(result.duplicatePreparation.report.valid, true);
    assert.strictEqual(result.duplicatePreparation.report.noticeCount, 1);
    assert.strictEqual(result.servoConflict.report.valid, false);
    assert.ok(result.servoConflict.report.issues.some((issue) => /servo/i.test(issue.messages.join('\n'))));
    assert.strictEqual(result.oledConflict.report.valid, false);
    assert.ok(result.oledConflict.report.issues.some((issue) => /Display/.test(issue.messages.join('\n'))));
    assert.strictEqual(result.matrixOledConflict.report.valid, false);
    assert.strictEqual(result.sharedConnectionEvents.report.valid, true);
    const eventKeys = Array.from(result.sharedConnectionEvents.code.matchAll(/_contact_take_event\(0, "([^"]+)"\)/g), (match) => match[1]);
    assert.strictEqual(eventKeys.length, 2);
    assert.notStrictEqual(eventKeys[0], eventKeys[1]);

    [result.gnd.code, result.threeVolt.code, result.booleanContact.code, result.matrixTest.code].forEach((code) => {
      const compiled = compilePython(code);
      assert.strictEqual(compiled.status, 0, compiled.stderr || compiled.stdout);
    });

    assert.ok(fs.existsSync(path.join(root, 'src', 'assets', 'images', 'devices', 'external-contacts.png')));
    console.log('OK: external contacts blocks, Python generation, debounce, modes, events, and conflicts.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exit(1);
});
