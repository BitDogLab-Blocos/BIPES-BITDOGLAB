// Browser-level checks for shared physical resources used by external peripherals.
'use strict';

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const LOCAL_BROWSER_PATHS = [
  process.env.PLAYWRIGHT_BROWSER_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);

const MIME = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml'
};

function serveFile(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, safePath === path.sep ? 'index.html' : safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream'
    });
    res.end(data);
  });
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

async function main() {
  const server = http.createServer(serveFile);
  const port = await listen(server);
  const executablePath = LOCAL_BROWSER_PATHS.find((candidate) => fs.existsSync(candidate));
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage();

  try {
    await page.goto(`http://127.0.0.1:${port}/src/pages/index.html?lang=pt-br`);
    await page.waitForFunction(() => (
      window.Code &&
      window.Code.workspace &&
      window.Code.BlockContractValidator &&
      window.Code.ExternalResources
    ), null, { timeout: 15000 });

    const result = await page.evaluate(() => {
      const workspace = window.Code.workspace;

      function make(type, fields) {
        const block = workspace.newBlock(type);
        block.initSvg();
        block.render();
        Object.keys(fields || {}).forEach((fieldName) => {
          block.setFieldValue(String(fields[fieldName]), fieldName);
        });
        return block;
      }

      function connectValue(parent, inputName, child) {
        parent.getInput(inputName).connection.connect(child.outputConnection);
      }

      function conflictScenario(dhtConnection, servoConnection) {
        workspace.clear();
        const dht = make('dht11_temperatura', { DIG: dhtConnection });
        const display = make('display_mostrar_valor');
        connectValue(display, 'VALOR', dht);
        const servo = make('servo_mover', { DIG: servoConnection, ANGLE: 90 });
        const report = window.Code.BlockContractValidator.getReport(workspace);
        const dhtIssue = report.issues.find((issue) => issue.blockId === dht.id);
        const servoIssue = report.issues.find((issue) => issue.blockId === servo.id);
        return {
          valid: report.valid,
          dhtWarning: dhtIssue && dhtIssue.messages.join('\n'),
          servoWarning: servoIssue && servoIssue.messages.join('\n'),
          generated: window.Code.generateCode()
        };
      }

      const v7SameConnection = conflictScenario(0, 0);
      const v7DifferentConnections = conflictScenario(0, 1);

      workspace.clear();
      const temperature = make('dht11_temperatura', { DIG: 0 });
      const humidity = make('dht11_umidade', { DIG: 0 });
      const temperatureDisplay = make('display_mostrar_valor');
      const humidityDisplay = make('display_mostrar_valor');
      connectValue(temperatureDisplay, 'VALOR', temperature);
      connectValue(humidityDisplay, 'VALOR', humidity);
      const sameDhtReport = window.Code.BlockContractValidator.getReport(workspace);

      window.AppBootstrap.applyDeviceProfile('v6');
      const v6SameConnection = conflictScenario(3, 3);
      window.AppBootstrap.applyDeviceProfile('v7');

      return {
        registryVersion: window.Code.ExternalResources.VERSION,
        v7SameConnection,
        v7DifferentConnections,
        sameDhtValid: sameDhtReport.valid,
        v6SameConnection
      };
    });

    assert.strictEqual(result.registryVersion, '2026-08-14-external-resources');
    assert.strictEqual(result.v7SameConnection.valid, false);
    assert.ok(result.v7SameConnection.dhtWarning.includes('Conexão 0'));
    assert.ok(result.v7SameConnection.servoWarning.includes('Conexão 0'));
    assert.ok(result.v7SameConnection.dhtWarning.includes('servo'));
    assert.ok(result.v7SameConnection.servoWarning.includes('DHT11'));
    assert.ok(result.v7SameConnection.generated.includes('Codigo nao gerado'));
    assert.strictEqual(result.v7DifferentConnections.valid, true);
    assert.strictEqual(result.sameDhtValid, true);
    assert.strictEqual(result.v6SameConnection.valid, false);
    assert.ok(result.v6SameConnection.dhtWarning.includes('Conexão 3'));
    assert.ok(result.v6SameConnection.servoWarning.includes('Conexão 3'));

    console.log('OK: external resource conflicts block shared DHT11/servo GPIOs on V6 and V7.');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
