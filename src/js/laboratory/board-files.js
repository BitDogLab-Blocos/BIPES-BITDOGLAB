'use strict';

// Read-only CSV access through the same MicroPython filesystem transport used by Device Files.
(function(global) {
  var api = global.LaboratoryData;
  var files = global.Files;
  if (!api || !files) return;

  var CHUNK_BYTES = 4096;
  var MAX_CSV_BYTES = 5 * 1024 * 1024;
  var MAX_ENTRIES = 2000;
  var MAX_DEPTH = 12;
  var knownFiles = new Map();
  var refreshPromise = null;
  var wasConnected = files.isConnected();
  var listedThisConnection = false;

  function nativeTransaction() {
    return Boolean(global.BitDogLabMobileSerial &&
      typeof global.BitDogLabMobileSerial.executeTransaction === 'function');
  }

  function responseLines(value) {
    if (!nativeTransaction()) return [" print(start+'OK:'+" + value + "+end)"];
    return [
      ' data=' + value,
      " print(start+'OK:',end='')",
      ' for offset in range(0,len(data),64):',
      "  print(data[offset:offset+64],end='')",
      '  time.sleep_ms(3)',
      ' print(end)'
    ];
  }

  function waitForTransport() {
    return new Promise(function(resolve, reject) {
      var started = Date.now();
      function check() {
        if (!files.isConnected()) { reject(new Error('A placa está desconectada.')); return; }
        if (!files.busy) { resolve(); return; }
        if (Date.now() - started > 30000) {
          reject(new Error('A placa está ocupada. Aguarde e tente novamente.'));
          return;
        }
        global.setTimeout(check, 100);
      }
      check();
    });
  }

  async function runFs(label, body, timeout) {
    await waitForTransport();
    return new Promise(function(resolve, reject) {
      var settled = false;
      var watcher = global.setInterval(function() {
        if (!files.isConnected()) finish(new Error('A placa foi desconectada durante a leitura.'));
      }, 200);
      function finish(error, result) {
        if (settled) return;
        settled = true;
        global.clearInterval(watcher);
        if (error) reject(error);
        else resolve(result);
      }
      try {
        files._executeFsScript(label, body, timeout,
          function(payload) { finish(null, payload); },
          function(error) { finish(new Error(String(error || 'A placa não respondeu.'))); });
      } catch (error) {
        finish(error);
      }
    });
  }

  async function listDirectory(path) {
    var target = path ? files._pythonText(path) : "'.'";
    var body = [
      'try:',
      ' import ujson',
      ' entries=[]',
      " if hasattr(os,'ilistdir'):",
      '  for item in os.ilistdir(' + target + '):',
      '   entries.append([item[0],item[1],item[3] if len(item)>3 else -1])',
      ' else:',
      '  for name in os.listdir(' + target + '):',
      '   full=' + (path ? target + "+'/' +name" : 'name'),
      '   entries.append([name,os.stat(full)[0],os.stat(full)[6]])'
    ].concat(responseLines('ujson.dumps(entries)'), [
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ]).join('\n');
    var payload = await runFs('Buscando CSVs em ' + (path ? '/' + path : '/') + '…', body, 12000);
    var entries;
    try { entries = JSON.parse(payload); }
    catch (_error) { throw new Error('A lista de arquivos recebida da placa é inválida.'); }
    if (!Array.isArray(entries)) throw new Error('A lista de arquivos recebida da placa é inválida.');
    return entries;
  }

  async function listCsvFiles() {
    var pending = [{path: '', depth: 0}];
    var result = [];
    var total = 0;
    while (pending.length) {
      var directory = pending.shift();
      var entries = await listDirectory(directory.path);
      total += entries.length;
      if (total > MAX_ENTRIES) throw new Error('A placa contém arquivos demais para a busca do laboratório.');
      entries.forEach(function(entry) {
        if (!Array.isArray(entry) || typeof entry[0] !== 'string' || !entry[0] || /[/\\]/.test(entry[0])) return;
        var path = directory.path ? directory.path + '/' + entry[0] : entry[0];
        var isDirectory = (Number(entry[1]) & 0x4000) === 0x4000;
        if (isDirectory && directory.depth < MAX_DEPTH) pending.push({path: path, depth: directory.depth + 1});
        else if (!isDirectory && /\.csv$/i.test(entry[0])) {
          result.push({name: entry[0], path: path, size: Number(entry[2])});
        }
      });
    }
    result.sort(function(a, b) { return a.path.localeCompare(b.path, 'pt-BR', {sensitivity: 'base'}); });
    knownFiles = new Map(result.map(function(entry) { return [entry.path, entry]; }));
    return result;
  }

  async function readChunk(path, offset) {
    var body = [
      'try:',
      " f=open(" + files._pythonText(path) + ",'rb')",
      ' f.seek(' + offset + ')',
      " print(start+'OK:',end='')",
      ' remaining=' + CHUNK_BYTES,
      ' while remaining:',
      '  chunk=f.read(48 if remaining>=48 else remaining)',
      '  if not chunk: break',
      '  print(ubinascii.b2a_base64(chunk).decode().strip(),end=\'\')',
      '  remaining-=len(chunk)'
    ];
    if (nativeTransaction()) body.push('  time.sleep_ms(3)');
    body = body.concat([
      ' f.close()',
      ' print(end)',
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ]).join('\n');
    var encoded = (await runFs('Lendo ' + path + '…', body, 20000)).replace(/\s+/g, '');
    var binary;
    try { binary = atob(encoded); }
    catch (_error) { throw new Error('A placa enviou dados inválidos para este CSV.'); }
    return Uint8Array.from(binary, function(character) { return character.charCodeAt(0); });
  }

  async function readCsvFile(path) {
    var entry = knownFiles.get(path);
    if (!entry) throw new Error('Atualize a lista e selecione um CSV da placa.');
    if (Number.isFinite(entry.size) && entry.size > MAX_CSV_BYTES) {
      throw new Error('Este CSV excede o limite de 5 MB do laboratório.');
    }
    var chunks = [];
    var length = 0;
    while (true) {
      var chunk = await readChunk(path, length);
      chunks.push(chunk);
      length += chunk.length;
      if (length > MAX_CSV_BYTES) throw new Error('Este CSV excede o limite de 5 MB do laboratório.');
      if (chunk.length < CHUNK_BYTES) break;
    }
    var bytes = new Uint8Array(length);
    var offset = 0;
    chunks.forEach(function(chunk) { bytes.set(chunk, offset); offset += chunk.length; });
    try { return new TextDecoder('utf-8', {fatal: true}).decode(bytes); }
    catch (_error) { throw new Error('O arquivo CSV não está codificado em UTF-8.'); }
  }

  async function refresh() {
    if (refreshPromise) return refreshPromise;
    if (!files.isConnected()) {
      knownFiles.clear();
      api.setBoardFiles([]);
      api.setSourceStatus('Escolha a porta USB da BitDogLab para buscar os CSVs.');
      files.connect();
      global.setTimeout(function() {
        if (!files.isConnected()) api.setSourceStatus('A placa não está conectada. Toque em Buscar na placa para tentar novamente.', true);
      }, 2500);
      return;
    }
    var button = document.getElementById('labRefreshFiles');
    button.disabled = true;
    api.setSourceStatus('Buscando arquivos CSV na placa…');
    refreshPromise = listCsvFiles().then(function(found) {
      api.setBoardFiles(found);
      listedThisConnection = true;
    }).catch(function(error) {
      api.setSourceStatus(error.message, true);
    }).finally(function() {
      button.disabled = false;
      refreshPromise = null;
    });
    return refreshPromise;
  }

  api.setBoardLoader(readCsvFile);
  global.addEventListener('laboratory:request-files', refresh);
  document.getElementById('tab_laboratorio').addEventListener('click', function() {
    if (files.isConnected() && !listedThisConnection) global.setTimeout(refresh, 0);
  });
  global.setInterval(function() {
    var connected = files.isConnected();
    if (connected === wasConnected) return;
    wasConnected = connected;
    if (!connected) {
      listedThisConnection = false;
      knownFiles.clear();
      api.setBoardFiles([]);
      api.setSourceStatus('A placa foi desconectada. Conecte novamente para buscar os CSVs.', true);
    } else if (global.Code && Code.current.indexOf('laboratorio') !== -1) {
      refresh();
    }
  }, 500);

  global.LaboratoryBoardFiles = {listCsvFiles: listCsvFiles, readCsvFile: readCsvFile, refresh: refresh};
})(window);
