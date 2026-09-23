(function installBitDogLabMobileFileSave(global) {
  'use strict';

  if (!global.BitDogLabFileNative) return;

  var nextRequestId = 1;
  var pendingRequests = new Map();
  var CHUNK_BYTES = 192 * 1024;

  function bytesToBase64(bytes) {
    var binary = '';
    var sliceSize = 0x8000;
    for (var offset = 0; offset < bytes.length; offset += sliceSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + sliceSize));
    }
    return global.btoa(binary);
  }

  function nativeRequest(action, payload) {
    var id = String(nextRequestId++);
    return new Promise(function(resolve, reject) {
      pendingRequests.set(id, { resolve: resolve, reject: reject });
      try {
        global.BitDogLabFileNative.postMessage(JSON.stringify({
          id: id,
          action: action,
          payload: payload || {}
        }));
      } catch (error) {
        pendingRequests.delete(id);
        reject(error);
      }
    });
  }

  global.__bitdoglabNativeFileReceive = function receiveNativeFile(message) {
    if (!message || message.type !== 'response') return;
    var request = pendingRequests.get(String(message.id));
    if (!request) return;
    pendingRequests.delete(String(message.id));
    if (message.ok) {
      request.resolve(message.value || {});
      return;
    }
    var errorName = message.code === 'CANCELLED' ? 'AbortError' : 'NotAllowedError';
    var error = new DOMException(message.error || 'Não foi possível salvar o arquivo.', errorName);
    error.nativeCode = message.code || 'UNKNOWN';
    request.reject(error);
  };

  function asBlob(data) {
    if (data instanceof Blob) return data;
    if (data && data.type === 'write') return asBlob(data.data);
    return new Blob([data], { type: 'image/png' });
  }

  function createWritableHandle(token) {
    var started = false;
    var finished = false;

    return {
      async write(data) {
        if (finished) throw new DOMException('O arquivo já foi encerrado.', 'InvalidStateError');
        var blob = asBlob(data);
        if (!started) {
          await nativeRequest('beginWrite', { token: token, size: blob.size });
          started = true;
        }
        for (var offset = 0; offset < blob.size; offset += CHUNK_BYTES) {
          var bytes = new Uint8Array(await blob.slice(offset, offset + CHUNK_BYTES).arrayBuffer());
          await nativeRequest('writeChunk', { token: token, data: bytesToBase64(bytes) });
        }
      },
      async close() {
        if (finished) return;
        if (!started) await nativeRequest('beginWrite', { token: token, size: 0 });
        await nativeRequest('finishWrite', { token: token });
        finished = true;
      },
      async abort() {
        if (finished) return;
        await nativeRequest('abortWrite', { token: token });
        finished = true;
      }
    };
  }

  async function showSaveFilePicker(options) {
    options = options || {};
    var result = await nativeRequest('createDocument', {
      filename: options.suggestedName || 'programa-bitdoglab.png',
      mimeType: 'image/png'
    });
    var token = String(result.token || '');
    if (!token) throw new DOMException('O Android não retornou um destino válido.', 'NotAllowedError');
    return Object.freeze({
      kind: 'file',
      name: result.name || options.suggestedName || 'programa-bitdoglab.png',
      createWritable: function() {
        return Promise.resolve(createWritableHandle(token));
      }
    });
  }

  Object.defineProperty(global, 'showSaveFilePicker', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: showSaveFilePicker
  });

  Object.defineProperty(global, 'BitDogLabMobileFiles', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze({ showSaveFilePicker: showSaveFilePicker })
  });
})(window);
