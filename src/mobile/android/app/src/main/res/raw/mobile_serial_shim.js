(function installBitDogLabMobileSerial(global) {
  'use strict';

  if (!global.BitDogLabUsbNative || !global.navigator) {
    return;
  }

  let nextRequestId = 1;
  let activePort = null;
  const pendingRequests = new Map();

  function toBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + chunkSize));
    }
    return global.btoa(binary);
  }

  function fromBase64(encoded) {
    const binary = global.atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function nativeRequest(action, payload) {
    const id = String(nextRequestId++);
    return new Promise((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
      try {
        global.BitDogLabUsbNative.postMessage(JSON.stringify({ id, action, payload }));
      } catch (error) {
        pendingRequests.delete(id);
        reject(error);
      }
    });
  }

  class MobileSerialPort {
    constructor(info) {
      this.info = info || {};
      this.readable = null;
      this.writable = null;
      this._readController = null;
      this._opened = false;
    }

    getInfo() {
      return {
        usbVendorId: this.info.vendorId,
        usbProductId: this.info.productId
      };
    }

    async open(options) {
      if (this._opened) {
        throw new DOMException('A porta já está aberta.', 'InvalidStateError');
      }
      const baudRate = Number(options && options.baudRate) || 115200;
      await nativeRequest('open', { baudRate });
      this._opened = true;

      this.readable = new ReadableStream({
        start: (controller) => {
          this._readController = controller;
        },
        cancel: () => {
          this._readController = null;
        }
      });

      this.writable = new WritableStream({
        write: (chunk) => {
          const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
          return nativeRequest('write', { data: toBase64(bytes) });
        }
      });
    }

    async close() {
      if (!this._opened) {
        return;
      }
      await nativeRequest('close', {});
      this._finishStreams();
    }

    _receive(bytes) {
      if (this._readController) {
        this._readController.enqueue(bytes);
      }
    }

    _disconnect(message) {
      if (this._readController) {
        this._readController.error(new DOMException(message, 'NetworkError'));
      }
      this._readController = null;
      this.readable = null;
      this.writable = null;
      this._opened = false;
    }

    _finishStreams() {
      if (this._readController) {
        try {
          this._readController.close();
        } catch (ignored) {
          // O reader pode já ter sido cancelado pelo fluxo de desconexão existente.
        }
      }
      this._readController = null;
      this.readable = null;
      this.writable = null;
      this._opened = false;
      if (activePort === this) {
        activePort = null;
      }
    }
  }

  global.__bitdoglabNativeSerialReceive = function receiveNativeSerial(message) {
    if (message.type === 'response') {
      const request = pendingRequests.get(String(message.id));
      if (!request) {
        return;
      }
      pendingRequests.delete(String(message.id));
      if (message.ok) {
        request.resolve(message.value);
      } else {
        request.reject(new DOMException(message.error || 'Falha na conexão USB.', 'NetworkError'));
      }
      return;
    }

    if (message.type === 'data' && activePort) {
      activePort._receive(fromBase64(message.data));
      return;
    }

    if ((message.type === 'disconnect' || message.type === 'error') && activePort) {
      const currentPort = activePort;
      const protocol = global.Channel && global.Channel.webserial;
      if (protocol && protocol.connected && protocol.port === currentPort) {
        try {
          protocol.disconnect();
          return;
        } catch (ignored) {
          // Continua com o encerramento local se a interface ainda estiver iniciando.
        }
      }
      currentPort._disconnect(message.error || 'A conexão USB foi encerrada.');
      activePort = null;
    }
  };

  const mobileSerial = {
    async requestPort() {
      const info = await nativeRequest('requestPort', {});
      activePort = new MobileSerialPort(info);
      return activePort;
    },
    async getPorts() {
      return activePort ? [activePort] : [];
    },
    addEventListener() {},
    removeEventListener() {}
  };

  Object.defineProperty(global.navigator, 'serial', {
    configurable: true,
    enumerable: true,
    value: mobileSerial
  });
})(window);
