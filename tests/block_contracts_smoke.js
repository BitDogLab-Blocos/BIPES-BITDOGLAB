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

      let matrixAnimationConnected = false;
      let matrixAnimationConnectError = '';
      try {
        matrixAnimation.getInput('DO').connection.connect(soundCommand.previousConnection);
        matrixAnimationConnected = matrixAnimation.getInputTargetBlock('DO') === soundCommand;
      } catch (error) {
        matrixAnimationConnectError = error.message;
      }

      const drawing = workspace.newBlock('criar_desenho_na_matriz');
      drawing.initSvg();
      drawing.render();

      const shortBeep = workspace.newBlock('bipe_curto');
      shortBeep.initSvg();
      shortBeep.render();

      let drawingConnected = false;
      let drawingConnectError = '';
      try {
        drawing.getInput('DESENHO0').connection.connect(shortBeep.previousConnection);
        drawingConnected = drawing.getInputTargetBlock('DESENHO0') === shortBeep;
      } catch (error) {
        drawingConnectError = error.message;
      }

      const matrixFill = workspace.newBlock('preencher_matriz');
      matrixFill.initSvg();
      matrixFill.render();
      drawing.getInput('DESENHO0').connection.connect(matrixFill.previousConnection);
      const validDrawingChild = drawing.getInputTargetBlock('DESENHO0') === matrixFill;

      const robotStop = workspace.newBlock('robo_parar');
      robotStop.initSvg();
      robotStop.render();

      let genericProgramConnected = false;
      let genericProgramConnectError = '';
      try {
        drawing.getInput('DESENHO1').connection.connect(robotStop.previousConnection);
        genericProgramConnected = drawing.getInputTargetBlock('DESENHO1') === robotStop;
      } catch (error) {
        genericProgramConnectError = error.message;
      }

      const warnings = window.Code.BlockContractValidator.validateWorkspace(workspace);
      const report = window.Code.BlockContractValidator.getReport(workspace);
      const summary = window.Code.BlockContractValidator.getSummaryText(report, 2);
      const allowedToRun = window.eval('Tool.validateWorkspaceBeforeCodeAction("smoke")');
      const generatedPreview = window.Code.generateCode();
      block.warning.setVisible(true);
      const warningVisibleBeforeRefresh = block.warning.isVisible();
      window.Code.BlockContractValidator.validateWorkspace(workspace);
      window.Code.BlockContractValidator.getReport(workspace);
      window.Code.generateCode();
      const warningVisibleAfterRefresh = block.warning.isVisible();
      const untypedPreviousConnections = [];
      const semanticCompatibilityFailures = [];

      Object.keys(window.Blockly.Blocks).forEach((blockType) => {
        let candidate = null;
        try {
          candidate = workspace.newBlock(blockType);
          if (candidate.previousConnection &&
              candidate.previousConnection.getCheck &&
              !candidate.previousConnection.getCheck()) {
            untypedPreviousConnections.push(blockType);
          }
        } catch (error) {
          // Some legacy blocks may require richer setup; they are covered by direct cases above.
        } finally {
          if (candidate) candidate.dispose(false);
        }
      });

      const representativeBlocks = [
        'preencher_matriz',
        'bipe_curto',
        'bloco_ligar_led',
        'display_texto',
        'mostrar_emoji',
        'robo_parar'
      ];

      function intersects(a, b) {
        if (!a || !b) return true;
        return a.some((item) => b.indexOf(item) !== -1);
      }

      function findStatementInputsForRule(target, rule) {
        return target.inputList.filter((input) => {
          if (input.type !== window.Blockly.STATEMENT_INPUT) return false;
          if (rule.exact && rule.exact[input.name]) return true;
          if (rule.prefix) {
            return Object.keys(rule.prefix).some((prefix) => input.name.indexOf(prefix) === 0);
          }
          return false;
        });
      }

      window.Code.BlockTypeDomains.inputRules.forEach((rule) => {
        rule.blockTypes.forEach((targetType) => {
          if (!window.Blockly.Blocks[targetType]) return;

          const target = workspace.newBlock(targetType);
          target.initSvg();
          target.render();

          findStatementInputsForRule(target, rule).forEach((input) => {
            representativeBlocks.forEach((sourceType) => {
              if (!window.Blockly.Blocks[sourceType]) return;

              const source = workspace.newBlock(sourceType);
              source.initSvg();
              source.render();

              const inputChecks = input.connection.getCheck && input.connection.getCheck();
              const sourceChecks = source.previousConnection && source.previousConnection.getCheck &&
                source.previousConnection.getCheck();
              const expected = Boolean(source.previousConnection) && intersects(inputChecks, sourceChecks);
              let actual = false;

              try {
                input.connection.connect(source.previousConnection);
                actual = input.connection.targetBlock() === source;
              } catch (error) {
                actual = false;
              }

              if (actual !== expected) {
                semanticCompatibilityFailures.push({
                  target: targetType,
                  input: input.name,
                  inputChecks,
                  source: sourceType,
                  sourceChecks,
                  expected,
                  actual
                });
              }

              source.dispose(false);
            });
          });

          target.dispose(false);
        });
      });

      return {
        hasWarning: Boolean(warnings[block.id]),
        warning: warnings[block.id] && warnings[block.id].join('\\n'),
        missingInputWarning: warnings[displayValue.id] && warnings[displayValue.id].join('\\n'),
        matrixAnimationConnected,
        matrixAnimationConnectError,
        drawingConnected,
        drawingConnectError,
        validDrawingChild,
        genericProgramConnected,
        genericProgramConnectError,
        reportValid: report.valid,
        summary,
        allowedToRun,
        generatedPreview,
        warningVisibleBeforeRefresh,
        warningVisibleAfterRefresh,
        untypedPreviousConnections,
        semanticCompatibilityFailures
      };
    });

    if (!result.hasWarning || result.warning.indexOf('entrega um valor') === -1) {
      throw new Error(`Expected loose value warning, got: ${result.warning || '<none>'}`);
    }

    if (!result.missingInputWarning || result.missingInputWarning.indexOf('Falta encaixar') === -1) {
      throw new Error(`Expected missing input warning, got: ${result.missingInputWarning || '<none>'}`);
    }

    if (result.matrixAnimationConnected) {
      throw new Error('Expected sound block to be rejected by matrix animation input');
    }

    if (result.drawingConnected) {
      throw new Error('Expected sound block to be rejected by matrix drawing input');
    }

    if (!result.validDrawingChild) {
      throw new Error(`Expected matrix command to connect inside drawing, sound error: ${result.drawingConnectError || '<none>'}`);
    }

    if (result.genericProgramConnected) {
      throw new Error('Expected generic program command to be rejected by matrix drawing input');
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

    if (!result.warningVisibleBeforeRefresh || !result.warningVisibleAfterRefresh) {
      throw new Error('Expected warning bubble to stay open after validation refresh');
    }

    if (result.untypedPreviousConnections.length) {
      throw new Error(`Expected typed statement blocks, untyped: ${result.untypedPreviousConnections.join(', ')}`);
    }

    if (result.semanticCompatibilityFailures.length) {
      throw new Error(`Semantic compatibility failures: ${JSON.stringify(result.semanticCompatibilityFailures.slice(0, 5))}`);
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
