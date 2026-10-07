// Real Blockly + Canvas + generated Python with hardware-independent pixel checks.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const tutorial = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/oled-tutorial-bitmap.json'), 'utf8'));
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
    const blockXml = fs.readFileSync(path.join(__dirname, 'fixtures/oled-image.xml'), 'utf8');
    const fixture = await page.evaluate(xml => {
      clearInterval(Code._generationInterval);
      Code.workspace.clear();
      localStorage.setItem('bitdoglab_project', 'basico');
      document.querySelectorAll('#project-modal, #welcome-message, #partnership-notice').forEach(n => n.style.display = 'none');
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), Code.workspace);
      if (Code.BlockContractValidator.getReport(Code.workspace).valid) throw new Error('Empty image must block execution');
      const canvas = document.createElement('canvas');
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = 'black'; ctx.fillRect(12, 20, 36, 48); ctx.fillRect(70, 78, 22, 14);
      return canvas.toDataURL('image/png').split(',')[1];
    }, blockXml);
    await page.getByText('Escolher imagem', { exact: true }).click();
    assert.equal(await page.locator('.oled-image-editor__apply').isDisabled(), true);
    await page.locator('.oled-image-editor input[type=file]').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: Buffer.from(fixture, 'base64') });
    await page.waitForFunction(() => !document.querySelector('.oled-image-editor__apply').disabled);
    await page.locator('.oled-image-editor').screenshot({ path: path.join(__dirname, 'oled-image-preview.png') });
    await page.setViewportSize({ width: 360, height: 740 });
    assert.equal(await page.locator('.oled-image-editor').evaluate(n => n.scrollWidth <= n.clientWidth), true);
    await page.locator('.oled-image-editor').screenshot({ path: path.join(__dirname, 'oled-image-preview-mobile.png') });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.locator('.oled-image-editor__apply').click();
    const cases = await page.evaluate(() => {
      const block = Code.workspace.getAllBlocks(false).find(b => b.type === 'display_mostrar_imagem');
      const output = [];
      const v7 = BitdogLabConfig;
      for (const language of ['pt-br', 'en']) for (const profile of ['v6', 'v7']) {
        Code.LANG = language;
        BitdogLabConfig = profile === 'v6' ? BitdogLabConfig_V6 : v7;
        for (const type of ['SMALL', 'LARGE']) {
          block.setFieldValue(type, 'DISPLAY_TYPE');
          block.refreshOledImage();
          Code.auto_mode = true;
          const report = Code.BlockContractValidator.getReport(Code.workspace);
          if (!report.valid) throw new Error(JSON.stringify(report.issues));
          const bitmap = OledImages.bitmap(block.oledImageToken_, type);
          output.push({ language, profile, type, code: Code.generateCode(), bytes: Array.from(bitmap.bytes), width: bitmap.width, height: bitmap.height });
        }
      }
      return output;
    });
    const reference = await page.evaluate(reference => {
      Code.LANG = 'pt-br';
      const block = Code.workspace.getAllBlocks(false).find(b => b.type === 'display_mostrar_imagem');
      block.setFieldValue('LARGE', 'DISPLAY_TYPE');
      const source = document.createElement('canvas'); source.width = source.height = 128;
      const ctx = source.getContext('2d'), rgba = ctx.createImageData(128, 128);
      const bytes = reference.bitmapHex.match(/../g).map(hex => parseInt(hex, 16));
      for (let i = 0; i < 128 * 128; i++) {
        const colour = bytes[i >> 3] & (0x80 >> (i & 7)) ? 0 : 255;
        rgba.data[i * 4] = rgba.data[i * 4 + 1] = rgba.data[i * 4 + 2] = colour;
        rgba.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(rgba, 0, 0);
      block.setOledImageToken(OledImages.store(source, { margin: 0 }, 'tutorial.png'));
      const bitmap = OledImages.bitmap(block.oledImageToken_, 'LARGE');
      if (bytes.some((byte, i) => byte !== bitmap.bytes[i])) throw new Error('Tutorial bitmap changed in Canvas conversion');
      Code.auto_mode = true;
      return { language: 'pt-br', profile: 'v7', type: 'LARGE', code: Code.generateCode(), bytes, width: 128, height: 128 };
    }, tutorial);
    cases.push(reference);
    assert.equal(cases.length, 9);
    fs.writeFileSync(path.join(__dirname, 'oled-generated-large.py'), reference.code);
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
 nodes=[n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith('_oled_') and len(n.args.args)==3]
 assert len(nodes)==1
 helper=nodes[0].name
 nodes += [n for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t,ast.Name) and t.id.startswith('_oled_bitmap_') for t in n.targets)]
 exec(compile(ast.Module(body=nodes,type_ignores=[]),'<generated>','exec'),env)
 calls=[n for n in ast.walk(tree) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id==helper]
 assert len(calls)==1
 eval(compile(ast.Expression(body=calls[0]),'<render>','eval'),env)
 expected={(x,y) for y in range(case['height']) for x in range(case['width']) if case['bytes'][y*(case['width']//8)+x//8] & (0x80 >> (x%8))}
 assert oled.lit==expected and oled.shown==1
 assert len(case['bytes'])==case['width']*case['height']//8
 assert case['code'].index(' = binascii.unhexlify(')<case['code'].index('while True:')
 print(case['language'],case['profile'],case['type'],len(case['bytes']),'bytes:',len(expected),'pixels match tutorial rendering')
`], { input: JSON.stringify(cases), encoding: 'utf8' });
    assert.equal(python.status, 0, python.stderr);
    process.stdout.write(python.stdout);
    const lifecycle = await page.evaluate(async () => {
      Code.LANG = 'pt-br';
      const workspace = Code.workspace;
      const first = workspace.getAllBlocks(false).find(b => b.type === 'display_mostrar_imagem');
      first.setFieldValue('LARGE', 'DISPLAY_TYPE');
      const original = first.oledImageToken_;
      const second = workspace.newBlock('display_mostrar_imagem');
      second.initSvg(); second.render(); second.setFieldValue('LARGE', 'DISPLAY_TYPE');
      const source = document.createElement('canvas'); source.width = source.height = 8;
      second.setOledImageToken(OledImages.store(source, { invert: true }, 'second.png'));
      const secondToken = second.oledImageToken_;
      if (first.oledImageToken_ !== original || original === secondToken) throw new Error('Image independence failed');
      await new Promise(r => setTimeout(r, 100));
      workspace.clearUndo();
      first.setOledImageToken(secondToken);
      await new Promise(r => setTimeout(r, 100));
      workspace.undo(false);
      if (first.oledImageToken_ !== original) throw new Error('Undo did not restore image');
      workspace.undo(true);
      if (first.oledImageToken_ !== secondToken) throw new Error('Redo did not restore image');
      first.setOledImageToken(original);
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      if (xml.includes('data:image') || xml.includes('tutorial.png') || xml.includes('test.png') || xml.includes('second.png') || xml.includes('unhexlify')) throw new Error('Image data leaked into XML');
      const cloneId = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace).find(id => workspace.getBlockById(id).type === 'display_mostrar_imagem');
      const clone = workspace.getBlockById(cloneId);
      clone.setOledImageToken(secondToken);
      if (first.oledImageToken_ !== original) throw new Error('Editing copy changed original');
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
      const block = workspace.getAllBlocks(false).find(b => b.oledImageToken_ === original);
      block.getField('IMAGE_PREVIEW').showEditor();
      return { xml, original, secondToken, blockId: block.id,
        secondId: workspace.getAllBlocks(false).find(b => b.oledImageToken_ === secondToken).id };
    });
    // Cancelling edits and rejecting corrupt files must preserve the previous asset.
    await page.locator('.oled-image-editor input[type=checkbox]').first().check();
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    assert.equal(await page.evaluate(id => Code.workspace.getBlockById(id).oledImageToken_, lifecycle.blockId), lifecycle.original);
    await page.evaluate(id => OledImageEditor.open(Code.workspace.getBlockById(id)), lifecycle.secondId);
    await page.locator('.oled-image-editor input[type=file]').setInputFiles({ name: 'other.png', mimeType: 'image/png', buffer: Buffer.from(fixture, 'base64') });
    await page.waitForFunction(() => !document.querySelector('.oled-image-editor__apply').disabled);
    await page.locator('.oled-image-editor select').selectOption('dither');
    await page.locator('.oled-image-editor input[type=checkbox]').first().check();
    await page.getByRole('button', { name: 'Usar imagem', exact: true }).click();
    const changed = await page.evaluate(info => {
      const first = Code.workspace.getBlockById(info.blockId), second = Code.workspace.getBlockById(info.secondId);
      const asset = OledImages.get(second.oledImageToken_);
      const report = Code.BlockContractValidator.getReport(Code.workspace);
      second.setFieldValue('SMALL', 'DISPLAY_TYPE');
      const conflict = !Code.BlockContractValidator.getReport(Code.workspace).valid;
      second.setFieldValue('LARGE', 'DISPLAY_TYPE');
      return { first: first.oledImageToken_, second: second.oledImageToken_, method: asset.settings.method,
        invert: asset.settings.invert, valid: report.valid, conflict };
    }, lifecycle);
    assert.equal(changed.first, lifecycle.original);
    assert.notEqual(changed.second, lifecycle.secondToken);
    assert.equal(changed.method, 'dither');
    assert.equal(changed.invert, true);
    assert.equal(changed.valid, true);
    assert.equal(changed.conflict, true);
    lifecycle.secondToken = changed.second;
    await page.evaluate(id => OledImageEditor.open(Code.workspace.getBlockById(id)), lifecycle.blockId);
    await page.locator('.oled-image-editor input[type=file]').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
    await page.getByRole('status').filter({ hasText: 'válida' }).waitFor();
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    assert.equal(await page.evaluate(id => Code.workspace.getBlockById(id).oledImageToken_, lifecycle.blockId), lifecycle.original);
    await page.evaluate(() => {
      SimpleStorage.saveWorkspaceBackup();
    });
    await page.reload();
    await page.waitForFunction(() => Code.workspace && Code.workspace.getAllBlocks(false).some(b => b.type === 'display_mostrar_imagem'));
    await page.waitForTimeout(1200);
    const restored = await page.evaluate(tokens => {
      clearInterval(Code._generationInterval);
      const blocks = Code.workspace.getAllBlocks(false).filter(b => b.type === 'display_mostrar_imagem');
      return { count: blocks.length, absent: tokens.every(token => !OledImages.get(token)),
        valid: Code.BlockContractValidator.getReport(Code.workspace).valid,
        labels: blocks.map(b => b.getFieldValue('IMAGE_NAME')) };
    }, [lifecycle.original, lifecycle.secondToken]);
    assert.equal(restored.count, 2);
    assert.equal(restored.absent, true);
    assert.equal(restored.valid, false);
    assert.ok(restored.labels.every(label => label.includes('Selecione')));
    console.log('PASS: independent images, undo/redo, copy, cancellation, corrupt files, XML without image data and expiry after reload');
    assert.deepEqual(errors, []);
    console.log('PASS: real upload, responsive preview, Blockly, Python rendering and exact tutorial bitmap (2048 bytes / 3254 lit pixels)');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
