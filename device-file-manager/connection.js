'use strict';

// Board connection and isolated filesystem command transport.
DeviceFilesManager.extend({
  connect() {
    if (this.isConnected()) {
      this.listFiles();
      return;
    }
    this.setStatus('Escolha a porta USB da sua BitDogLab…');
    this.connectButton.disabled = true;
    if (typeof Channel !== 'undefined' && Channel['mux']) Channel['mux'].connect();
    window.setTimeout(() => {
      if (!this.isConnected()) this.connectButton.disabled = false;
    }, 1500);
  },

  updateConnectionState(connected, refresh) {
    if (!this.connection || !this.connectButton) return;
    this.connection.textContent = connected ? 'Conectada' : 'Desconectada';
    this.connection.classList.toggle('is-online', connected);
    this.connection.classList.toggle('is-offline', !connected);
    this.connectButton.hidden = connected;
    this.connectButton.disabled = false;

    if (!connected) {
      this._cancelOperation();
      this.currentPath = '';
      this._updatePathUI();
      this.currentFiles = [];
      this.clearSelection();
      this._renderListMessage('A placa foi desconectada. Conecte novamente para atualizar os arquivos.');
      this.setStatus('Placa desconectada.');
    } else if (refresh !== false && this.isOpen()) {
      this.listFiles();
    }
  },

  _pauseScanner() {
    if (typeof i2cScanner === 'undefined' || !i2cScanner) return;
    i2cScanner.stop();
    if (this._scannerSend === null && typeof i2cScanner._sendScan === 'function') {
      this._scannerSend = i2cScanner._sendScan;
      i2cScanner._sendScan = function() {};
    }
  },

  _resumeScanner() {
    if (typeof i2cScanner === 'undefined' || !i2cScanner) return;
    if (this._scannerSend !== null) {
      i2cScanner._sendScan = this._scannerSend;
      this._scannerSend = null;
    }
    window.setTimeout(() => {
      if (this.isConnected() && !i2cScanner._isRunning) i2cScanner.start(Channel['webserial']);
    }, 300);
  },

  _cancelOperation() {
    window.clearInterval(this._operationPoll);
    window.clearTimeout(this._operationTimeout);
    window.clearTimeout(this._operationStart);
    this._operationPoll = null;
    this._operationTimeout = null;
    this._operationStart = null;
    this._resumeScanner();
    this._setBusy(false);
  },

  _friendlyError(rawError) {
    var error = String(rawError || '');
    if (/Errno 2|ENOENT/i.test(error)) return 'O arquivo não foi encontrado na placa.';
    if (/Errno 17|EEXIST/i.test(error)) return 'Já existe um arquivo com esse nome.';
    if (/Errno 13|EACCES/i.test(error)) return 'A placa não permitiu essa operação.';
    if (/Errno 28|ENOSPC/i.test(error)) return 'Não há espaço livre suficiente na placa.';
    return 'A placa não conseguiu concluir a operação.';
  },

  _executeFsScript(label, body, timeoutMs, onSuccess) {
    if (!this.isConnected()) {
      this.updateConnectionState(false);
      return;
    }
    if (this.busy) {
      this.setStatus('Aguarde a operação atual terminar.');
      return;
    }

    var token = Tool.uid().replace(/[^a-z0-9]/gi, '').slice(-12);
    var begin = '__BIPES_FS_BEGIN_' + token + '__';
    var end = '__BIPES_FS_END_' + token + '__';
    var prelude = [
      "import os,ubinascii",
      "start='__BIPES_'+'FS_BEGIN_" + token + "__'",
      "end='__BIPES_'+'FS_END_" + token + "__'"
    ].join('\n');
    var command = 'exec(' + JSON.stringify(prelude + '\n' + body) + ')\r';

    this._pauseScanner();
    this._setBusy(true);
    this.setStatus(label);
    this.received_string = '';
    mux.clearBuffer();
    mux.bufferPush('\x03\x03');

    this._operationStart = window.setTimeout(() => {
      if (!this.isConnected()) {
        this.updateConnectionState(false);
        return;
      }

      this.received_string = '';
      mux.bufferPush(command);

      this._operationPoll = window.setInterval(() => {
        var beginIndex = this.received_string.lastIndexOf(begin);
        if (beginIndex === -1) return;
        var payloadStart = beginIndex + begin.length;
        var endIndex = this.received_string.indexOf(end, payloadStart);
        if (endIndex === -1) return;

        var payload = this.received_string.slice(payloadStart, endIndex).trim();
        this._cancelOperation();

        if (payload.indexOf('ERR:') === 0) {
          this.setStatus(this._friendlyError(payload.slice(4)), 'error');
          return;
        }

        if (payload.indexOf('OK') !== 0) {
          this.setStatus('A resposta da placa não pôde ser interpretada.', 'error');
          return;
        }

        payload = payload.slice(2).replace(/^\s*:\s*/, '').trim();
        onSuccess(payload);
      }, 80);

      this._operationTimeout = window.setTimeout(() => {
        this._cancelOperation();
        this.setStatus('A placa demorou para responder. Tente atualizar novamente.', 'error');
      }, timeoutMs || 7000);
    }, 320);
  },

  _pythonText(value) {
    var bytes = new TextEncoder().encode(value);
    var binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return "ubinascii.a2b_base64('" + btoa(binary) + "').decode()";
  }

});
