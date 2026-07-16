// Smoke test for the BitDogLab block contract validator.
'use strict';

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
      window.Code.BlockContracts &&
      window.Code.BlockContractValidator
    ), null, { timeout: 15000 });

    const result = await page.evaluate(() => {
      const workspace = window.Code.workspace;
      workspace.clear();

      const block = workspace.newBlock('sensor_temperatura');
      block.initSvg();
      block.render();

      const displayValue = workspace.newBlock('display_mostrar_valor');
      displayValue.initSvg();
      displayValue.render();

      const matrixAnimation = workspace.newBlock('matriz_piscar_rapido');
      matrixAnimation.initSvg();
      matrixAnimation.render();

      const soundCommand = workspace.newBlock('tocar_som_agudo');
      soundCommand.initSvg();
      soundCommand.render();
      matrixAnimation.getInput('DO').connection.connect(soundCommand.previousConnection);

      const warnings = window.Code.BlockContractValidator.validateWorkspace(workspace);
      const report = window.Code.BlockContractValidator.getReport(workspace);
      const summary = window.Code.BlockContractValidator.getSummaryText(report, 2);
      const allowedToRun = window.eval('Tool.validateWorkspaceBeforeCodeAction("smoke")');
      const generatedPreview = window.Code.generateCode();

      return {
        hasWarning: Boolean(warnings[block.id]),
        warning: warnings[block.id] && warnings[block.id].join('\\n'),
        missingInputWarning: warnings[displayValue.id] && warnings[displayValue.id].join('\\n'),
        wrongContainerWarning: warnings[soundCommand.id] && warnings[soundCommand.id].join('\\n'),
        reportValid: report.valid,
        summary,
        allowedToRun,
        generatedPreview
      };
    });

    if (!result.hasWarning || result.warning.indexOf('entrega um valor') === -1) {
      throw new Error(`Expected loose value warning, got: ${result.warning || '<none>'}`);
    }

    if (!result.missingInputWarning || result.missingInputWarning.indexOf('Falta encaixar') === -1) {
      throw new Error(`Expected missing input warning, got: ${result.missingInputWarning || '<none>'}`);
    }

    if (!result.wrongContainerWarning || result.wrongContainerWarning.indexOf('lugar errado') === -1) {
      throw new Error(`Expected wrong container warning, got: ${result.wrongContainerWarning || '<none>'}`);
    }

    if (result.reportValid || result.allowedToRun) {
      throw new Error('Expected invalid workspace to block code execution');
    }

    if (!result.summary || result.summary.indexOf('Corrija os avisos') === -1) {
      throw new Error(`Expected validation summary, got: ${result.summary || '<none>'}`);
    }

    if (!result.generatedPreview || result.generatedPreview.indexOf('Codigo nao gerado') === -1) {
      throw new Error(`Expected generation to be blocked, got: ${result.generatedPreview || '<none>'}`);
    }

    console.log('block contract smoke ok');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
