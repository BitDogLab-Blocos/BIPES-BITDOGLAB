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

      function dhtAht20Scenario(dhtConnection, ahtType) {
        workspace.clear();
        const dht = make('dht11_temperatura', { DIG: dhtConnection });
        const dhtDisplay = make('display_mostrar_valor');
        connectValue(dhtDisplay, 'VALOR', dht);
        const aht = make(ahtType || 'sensor_temperatura');
        if (aht.outputConnection) {
          const ahtDisplay = make('display_mostrar_valor');
          connectValue(ahtDisplay, 'VALOR', aht);
        }
        const report = window.Code.BlockContractValidator.getReport(workspace);
        const dhtIssue = report.issues.find((issue) => issue.blockId === dht.id);
        const ahtIssue = report.issues.find((issue) => issue.blockId === aht.id);
        return {
          valid: report.valid,
          dhtWarning: dhtIssue && dhtIssue.messages.join('\n'),
          ahtWarning: ahtIssue && ahtIssue.messages.join('\n')
        };
      }

      function contactI2cScenario(profile, type, connection, useMatrix) {
        window.AppBootstrap.applyDeviceProfile(profile);
        workspace.clear();
        make('external_contact_prepare', { COMMON: 'GND' });

        if (useMatrix) {
          make('external_contact_test_matrix');
        } else {
          const contactCondition = make('controls_if');
          const contact = make('external_contact_is_closed', { DIG: connection });
          const action = make('bipe_curto', { VOLUME: 30 });
          connectValue(contactCondition, 'IF0', contact);
          contactCondition.getInput('DO0').connection.connect(action.previousConnection);
        }

        if (type === 'robo_inicializar') {
          make(type, { ESPERA: 0 });
        } else {
          const comparison = make('logic_compare', { OP: 'GT' });
          const value = make(type);
          const number = make('math_number', { NUM: 3 });
          const condition = make('controls_if');
          connectValue(comparison, 'A', value);
          connectValue(comparison, 'B', number);
          connectValue(condition, 'IF0', comparison);
        }

        const report = window.Code.BlockContractValidator.getReport(workspace);
        return {
          valid: report.valid,
          issues: report.issues.map((issue) => issue.messages.join('\n')),
          generated: window.Code.generateCode()
        };
      }

      function sharedI2cScenario() {
        window.AppBootstrap.applyDeviceProfile('v7');
        workspace.clear();
        const ahtCondition = make('controls_if');
        const ahtComparison = make('logic_compare', { OP: 'GT' });
        const aht = make('sensor_temperatura');
        const ahtNumber = make('math_number', { NUM: 3 });
        connectValue(ahtComparison, 'A', aht);
        connectValue(ahtComparison, 'B', ahtNumber);
        connectValue(ahtCondition, 'IF0', ahtComparison);
        make('robo_inicializar', { ESPERA: 0 });
        const inaCondition = make('controls_if');
        const inaComparison = make('logic_compare', { OP: 'GT' });
        const ina = make('robo_tensao_bateria');
        const inaNumber = make('math_number', { NUM: 3 });
        connectValue(inaComparison, 'A', ina);
        connectValue(inaComparison, 'B', inaNumber);
        connectValue(inaCondition, 'IF0', inaComparison);
        return window.Code.BlockContractValidator.getReport(workspace).valid;
      }

      const v7SameConnection = conflictScenario(0, 0);
      const v7DifferentConnections = conflictScenario(0, 1);
      const v7Contact0Aht20 = contactI2cScenario('v7', 'sensor_temperatura', 0, false);
      const v7Contact3Aht20 = contactI2cScenario('v7', 'sensor_temperatura', 3, false);
      const v7Contact0Mpu = contactI2cScenario('v7', 'robo_inicializar', 0, false);
      const v7Contact3Mpu = contactI2cScenario('v7', 'robo_inicializar', 3, false);
      const v7Contact2Ina = contactI2cScenario('v7', 'robo_tensao_bateria', 2, false);
      const v7Contact0Ina = contactI2cScenario('v7', 'robo_tensao_bateria', 0, false);
      const v7ContactMatrixAht20 = contactI2cScenario('v7', 'sensor_temperatura', 0, true);
      const v6Contact0Mpu = contactI2cScenario('v6', 'robo_inicializar', 0, false);
      const v6Contact2Mpu = contactI2cScenario('v6', 'robo_inicializar', 2, false);
      const v6Contact0Aht20 = contactI2cScenario('v6', 'sensor_temperatura', 0, false);
      const v6Contact2Ina = contactI2cScenario('v6', 'robo_tensao_bateria', 2, false);
      const sharedI2c = sharedI2cScenario();
      const v7DhtAht20I2c0 = dhtAht20Scenario(0);
      const v7DhtAht20I2c0OnConnection1 = dhtAht20Scenario(1);
      const v7DhtEstufaI2c0 = dhtAht20Scenario(0, 'sensor_estufa_comparar');

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
      const v6DhtAht20 = dhtAht20Scenario(0);
      window.AppBootstrap.applyDeviceProfile('v7');

      return {
        registryVersion: window.Code.ExternalResources.VERSION,
        v7SameConnection,
        v7DifferentConnections,
        v7Contact0Aht20,
        v7Contact3Aht20,
        v7Contact0Mpu,
        v7Contact3Mpu,
        v7Contact2Ina,
        v7Contact0Ina,
        v7ContactMatrixAht20,
        v6Contact0Mpu,
        v6Contact2Mpu,
        v6Contact0Aht20,
        v6Contact2Ina,
        sharedI2c,
        v7DhtAht20I2c0,
        v7DhtAht20I2c0OnConnection1,
        v7DhtEstufaI2c0,
        sameDhtValid: sameDhtReport.valid,
        v6SameConnection,
        v6DhtAht20
      };
    });

    assert.strictEqual(result.registryVersion, '2026-08-19-external-contacts-i2c');
    assert.strictEqual(result.v7SameConnection.valid, false);
    assert.ok(result.v7SameConnection.dhtWarning.includes('Conexão 0'));
    assert.ok(result.v7SameConnection.servoWarning.includes('Conexão 0'));
    assert.ok(result.v7SameConnection.dhtWarning.includes('servo'));
    assert.ok(result.v7SameConnection.servoWarning.includes('DHT11'));
    assert.ok(result.v7SameConnection.generated.includes('Codigo nao gerado'));
    assert.strictEqual(result.v7DifferentConnections.valid, true);
    [result.v7Contact0Aht20, result.v7Contact3Aht20, result.v7Contact0Mpu,
      result.v7Contact3Mpu, result.v7Contact2Ina, result.v7ContactMatrixAht20,
      result.v6Contact0Mpu].forEach((scenario) => {
      assert.strictEqual(scenario.valid, false);
      assert.match(scenario.generated, /Codigo nao gerado/);
    });
    assert.ok(result.v7Contact0Aht20.issues.some((message) => /AHT20|mesmo pino/.test(message)));
    assert.ok(result.v7Contact0Mpu.issues.some((message) => /MPU6050|mesmo pino/.test(message)));
    assert.ok(result.v7Contact2Ina.issues.some((message) => /tens|corrente|bateria|mesmo pino/.test(message)));
    [result.v7Contact0Ina, result.v6Contact2Mpu, result.v6Contact0Aht20,
      result.v6Contact2Ina].forEach((scenario) => {
      assert.strictEqual(scenario.valid, true);
    });
    assert.strictEqual(result.sharedI2c, true);
    assert.strictEqual(result.v7DhtAht20I2c0.valid, false);
    assert.ok(result.v7DhtAht20I2c0.dhtWarning.includes('dois sensores'));
    assert.ok(result.v7DhtAht20I2c0.dhtWarning.includes('sensor da Estufa'));
    assert.ok(!result.v7DhtAht20I2c0.dhtWarning.includes('I2C'));
    assert.ok(result.v7DhtAht20I2c0.dhtWarning.includes('outra entrada'));
    assert.ok(!result.v7DhtAht20I2c0.ahtWarning.includes('I2C'));
    assert.strictEqual(result.v7DhtAht20I2c0OnConnection1.valid, false);
    assert.ok(result.v7DhtAht20I2c0OnConnection1.dhtWarning.includes('Conexão 1'));
    assert.strictEqual(result.v7DhtEstufaI2c0.valid, false);
    assert.ok(result.v7DhtEstufaI2c0.ahtWarning.includes('outra entrada'));
    assert.strictEqual(result.sameDhtValid, true);
    assert.strictEqual(result.v6SameConnection.valid, false);
    assert.strictEqual(result.v6DhtAht20.valid, true);
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
