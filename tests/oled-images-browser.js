// Real Blockly + Canvas + generated Python; no physical OLED is simulated here.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.xml': 'application/xml', '.png': 'image/png', '.svg': 'image/svg+xml' };

async function main() {
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => {
      res.writeHead(err ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      res.end(err ? '' : data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const executablePath = [process.env.PLAYWRIGHT_BROWSER_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => p && fs.existsSync(p));
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const url = `http://127.0.0.1:${server.address().port}/src/pages/index.html?lang=pt-br`;
  try {
    await page.goto(url);
    await page.waitForFunction(() => window.Code && Code.workspace && window.OledImageEditor);
    await page.waitForTimeout(1200); // Let startup restoration finish before clearing the workspace.
    const fixture = await page.evaluate(() => {
      clearInterval(Code._generationInterval);
      Code.workspace.clear();
      localStorage.setItem('bitdoglab_project', 'basico');
      document.querySelectorAll('#project-modal, #welcome-modal').forEach(n => n.style.display = 'none');
      const block = Code.workspace.newBlock('display_mostrar_imagem');
      block.initSvg(); block.render();
      OledImageEditor.open(block);
      const canvas = document.createElement('canvas');
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = 'black'; ctx.fillRect(12, 20, 36, 48); ctx.fillRect(70, 78, 22, 14);
      return canvas.toDataURL('image/png').split(',')[1];
    });
    assert.equal(await page.locator('.oled-image-editor__apply').isDisabled(), true);
    await page.locator('.oled-image-editor input[type=file]').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: Buffer.from(fixture, 'base64') });
    await page.waitForFunction(() => !document.querySelector('.oled-image-editor__apply').disabled);
    await page.locator('.oled-image-editor__apply').click();
    const cases = await page.evaluate(() => {
      const block = Code.workspace.getAllBlocks(false).find(b => b.type === 'display_mostrar_imagem');
      const output = [];
      const v7 = BitdogLabConfig;
      for (const profile of ['v6', 'v7']) {
        BitdogLabConfig = profile === 'v6' ? BitdogLabConfig_V6 : v7;
        for (const type of ['SMALL', 'LARGE']) {
          block.setFieldValue(type, 'DISPLAY_TYPE');
          block.refreshOledImage();
          Code.auto_mode = true;
          const report = Code.BlockContractValidator.getReport(Code.workspace);
          if (!report.valid) throw new Error(JSON.stringify(report.issues));
          const bitmap = OledImages.bitmap(block.oledImageToken_, type);
          output.push({ profile, type, code: Code.generateCode(), bytes: Array.from(bitmap.bytes), width: bitmap.width, height: bitmap.height });
        }
      }
      return output;
    });
    assert.equal(cases.length, 4);
    const python = spawnSync('python', ['-c', `
import ast, json, sys, binascii
class Display:
 def __init__(self): self.lit=set(); self.shown=0
 def fill(self, value): self.lit.clear()
 def pixel(self, x, y, value):
  if value: self.lit.add((x,y))
 def show(self): self.shown+=1
for case in json.load(sys.stdin):
 tree=ast.parse(case['code'])
 oled=Display(); env={'oled':oled,'binascii':binascii}
 nodes=[n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name=='_oled_mostrar_imagem']
 nodes += [n for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t,ast.Name) and t.id.startswith('_oled_bitmap_') for t in n.targets)]
 exec(compile(ast.Module(body=nodes,type_ignores=[]),'<generated>','exec'),env)
 calls=[n for n in ast.walk(tree) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='_oled_mostrar_imagem']
 assert len(calls)==1
 eval(compile(ast.Expression(body=calls[0]),'<render>','eval'),env)
 expected={(x,y) for y in range(case['height']) for x in range(case['width']) if case['bytes'][y*(case['width']//8)+x//8] & (0x80 >> (x%8))}
 assert oled.lit==expected and oled.shown==1
 assert len(case['bytes'])==case['width']*case['height']//8
 assert case['code'].index(' = binascii.unhexlify(')<case['code'].index('while True:')
 print(case['profile'],case['type'],len(case['bytes']),'bytes:',len(expected),'pixels match tutorial rendering')
`], { input: JSON.stringify(cases), encoding: 'utf8' });
    assert.equal(python.status, 0, python.stderr);
    process.stdout.write(python.stdout);
    assert.deepEqual(errors, []);
    console.log('PASS: real upload, preview, Blockly and Python rendering on both profiles and displays');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
