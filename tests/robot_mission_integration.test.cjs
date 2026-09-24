'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/robot_mixed_mission.xml'), 'utf8');
const readyFixture = fs.readFileSync(path.join(__dirname, 'fixtures/robot_mixed_mission_ready.xml'), 'utf8');
const completeFixture = fs.readFileSync(path.join(root, 'examples/display_pequeno/robo_movel/07_vai_e_volta.xml'), 'utf8');
const buttonFixture = fs.readFileSync(path.join(root, 'examples/display_pequeno/robo_movel_setas/13_botao_a_inicia_a_missao.xml'), 'utf8');
const repeatFixture = fs.readFileSync(path.join(root, 'examples/display_pequeno/robo_movel_setas/11_repetir_caminho.xml'), 'utf8');
const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

for (const profile of ['v6', 'v7']) test(`robot missions and joystick validation on ${profile}`, async () => {
  const server = http.createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + requested);
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) return response.writeHead(404).end();
      const ext = path.extname(file);
      response.setHeader('Content-Type', ext === '.js' ? 'text/javascript' : ext === '.xml' ? 'application/xml' : ext === '.css' ? 'text/css' : 'text/html');
      response.end(data);
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const executablePath = browserPaths.find((file) => fs.existsSync(file));
  let browser;
  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/src/pages/index.html?lang=pt-br`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Code && Code.workspace && Code.BlockContractValidator);
    assert.equal(await page.evaluate((version) => AppBootstrap.applyDeviceProfile(version), profile), true);
    const catalog = await page.evaluate(async () => {
      const categories = await ExamplesCatalog.load();
      const robot = categories.filter((item) => item.id === 'robo_movel' || item.id === 'robo_movel_setas');
      return Promise.all(robot.map(async (item) => ({
        id: item.id,
        numbers: item.examples.map((example) => example.number),
        status: await Promise.all(item.examples.map(async (example) => (await fetch(example.xml)).status))
      })));
    });
    assert.deepEqual(catalog.map((item) => item.numbers.length), [25, 18]);
    for (const item of catalog) {
      assert.deepEqual(item.numbers, Array.from({ length: item.numbers.length }, (_, index) => index + 1));
      assert.ok(item.status.every((status) => status === 200), `${item.id} contains a missing XML`);
    }
    const result = await page.evaluate((xml) => {
      if (Code._generationInterval) clearInterval(Code._generationInterval);
      localStorage.setItem('bitdoglab_project', 'robo_setas');
      const workspace = Code.workspace;
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
      const report = Code.BlockContractValidator.getReport(workspace);
      Code.auto_mode = true;
      const blockedCode = Code.generateCode();
      const raw = Blockly.Python.workspaceToCode(workspace);
      const code = Code.wrapWithInfiniteLoop(raw, workspace);
      const selector = workspace.getAllBlocks(false).find((block) => block.type === 'joystick_seletor');
      selector.dispose(true);
      const cleanedReport = Code.BlockContractValidator.getReport(workspace);
      const cleanedCode = Code.generateCode();
      let filteredToolbox = '';
      const updateToolbox = workspace.updateToolbox;
      workspace.updateToolbox = function(dom) {
        filteredToolbox = Blockly.Xml.domToText(dom);
        return updateToolbox.call(this, dom);
      };
      Code.filterToolboxByProject('robo_setas');
      workspace.updateToolbox = updateToolbox;
      const addedTypes = [
        'joystick_controlar_led', 'joystick_posicao_x',
        'servo_joystick_controlar', 'robo_joystick',
        'controls_repeat_forever', 'botao_se_apertado'
      ];
      addedTypes.forEach((type) => {
        const block = workspace.newBlock(type);
        if (type === 'botao_se_apertado') block.setFieldValue('JOYSTICK', 'BOTAO');
      });
      const extraIssues = Code.BlockContractValidator.getReport(workspace).issues.map((issue) => issue.blockType);
      return { report, blockedCode, code, cleanedReport, cleanedCode, filteredToolbox, extraIssues };
    }, fixture);

    assert.equal(result.report.valid, false);
    assert.ok(result.report.issues.some((issue) => issue.blockType === 'joystick_seletor'));
    assert.match(result.blockedCode, /^# Codigo nao gerado:/);
    assert.equal(result.cleanedReport.valid, true);
    assert.doesNotMatch(result.cleanedCode, /^# Codigo nao gerado:/);
    assert.match(result.filteredToolbox, /type="joystick_seletor"/);
    assert.match(result.filteredToolbox, /type="joystick_controlar_led"/);
    for (const type of ['joystick_controlar_led', 'joystick_posicao_x',
      'servo_joystick_controlar', 'robo_joystick', 'controls_repeat_forever',
      'botao_se_apertado']) {
      assert.ok(result.extraIssues.includes(type), `Missing project warning: ${type}`);
    }
    const code = result.cleanedCode;
    assert.match(code, new RegExp(`buzzer = PWM\\(Pin\\(${profile === 'v6' ? 10 : 21}\\)\\)`));
    assert.match(code, new RegExp(`_robo_i2c = I2C\\(1, sda=Pin\\(${profile === 'v6' ? 14 : 2}\\), scl=Pin\\(${profile === 'v6' ? 15 : 3}\\)`));
    const sequence = [
      '_robo_iniciar_setas(5)', '_robo_ir_para(2)', '_robo_ir_para(2)',
      '_robo_ir_para(1)', '_robo_ir_para(3)', '_robo_finalizar_setas()'
    ];
    let position = -1;
    for (const item of sequence) {
      position = code.indexOf(item, position + 1);
      assert.ok(position >= 0, `Missing or out of order: ${item}`);
    }
    assert.match(code, /_robo_ir_para\(2\)[\s\S]*np\.write\(\)[\s\S]*_robo_ir_para\(2\)/);
    assert.doesNotMatch(code.slice(code.indexOf('# Bloco de Setup')), /# Loop Principal\nwhile True:/);

    const readyResult = await page.evaluate((xml) => {
      const workspace = Code.workspace;
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
      return {
        report: Code.BlockContractValidator.getReport(workspace),
        code: Code.generateCode()
      };
    }, readyFixture);
    assert.equal(readyResult.report.valid, true);
    assert.equal(readyResult.code, code);

    const examples = await page.evaluate((xmlList) => xmlList.map((xml) => {
      const workspace = Code.workspace;
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
      const raw = Blockly.Python.workspaceToCode(workspace);
      return Code.wrapWithInfiniteLoop(raw, workspace);
    }), [completeFixture, buttonFixture, repeatFixture]);
    assert.doesNotMatch(examples[0], /# Loop Principal\nwhile True:/);
    assert.match(examples[0], /_robo_frente\([\s\S]*_robo_tras\(/);
    assert.match(examples[1], /# Loop Principal\nwhile True:/);
    assert.equal(examples[1].match(/_robo_iniciar_setas\(5\)/g)?.length, 1);
    assert.ok(examples[1].indexOf('_robo_iniciar_setas(5)') < examples[1].indexOf('# Loop Principal'));
    assert.match(examples[2], /for _rep in range\([\s\S]*_robo_ir_para\(/);
    assert.doesNotMatch(examples[2], /# Loop Principal\nwhile True:/);

    for (const generated of [code, ...examples]) {
      const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], {
        input: generated, encoding: 'utf8'
      });
      assert.equal(parsed.status, 0, parsed.stderr);
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
