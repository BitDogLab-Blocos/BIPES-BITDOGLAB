'use strict';

/** Web Serial transport with one isolated session per open port. */
class WebSerialProtocol {
  constructor() {
    this.port = undefined;
    this.watcher = undefined;
    this.buffer = [];
    this.completeBufferCallback = [];
    this.connected = false;
    this.ready = false;
    this.shouldListen = true;
    this.lastChars = '';
    this.terminalBuffer = '';
    this.encoder = new TextEncoder();
    this.packetSize = SERIAL_CONFIG.PACKET_SIZE;
    this.speed = SERIAL_CONFIG.BAUD_RATE;
    this._session = null;
    this._generation = 0;
    this._connectPromise = null;
    this._closingPromise = Promise.resolve();
    this._sendingPacket = false;
    this._replRecoveryTimer = null;
    this._replRecoveryAttempts = 0;
    this._recoveringRepl = false;
    this._resetTimer = null;
    this._recoveryNonce = 0;
    if (navigator.serial && navigator.serial.addEventListener) {
      navigator.serial.addEventListener('disconnect', (event) => {
        const port = event.port || event.target;
        if (this._session && this._session.port === port) {
          this._loseSession(this._session);
        }
      });
    }
  }

  isReady() {
    return this.connected && this.ready;
  }

  waitUntilReady() {
    return this._session ? this._session.readyPromise : Promise.resolve(false);
  }

  _makeReadyPromise(session) {
    session.readySettled = false;
    session.readyPromise = new Promise((resolve) => {
      session.resolveReady = (value) => {
        if (!session.readySettled) {
          session.readySettled = true;
          resolve(value);
        }
      };
    });
  }

  connect() {
    if (this._connectPromise) return this._connectPromise;
    if (this.connected) return this.waitUntilReady();
    if (typeof navigator.serial === 'undefined') {
      const message = MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API');
      UI['notify'].send(message);
      term.write(message);
      return Promise.resolve(false);
    }
    const generation = ++this._generation;
    UI['workspace'].connecting();
    // Call the picker in the click handler, before awaiting cleanup.
    let selection;
    try {
      selection = navigator.serial.requestPort();
    } catch (error) {
      selection = Promise.reject(error);
    }
    const operation = Promise.resolve(selection).then(async (port) => {
      await this._closingPromise;
      if (generation !== this._generation) return false;
      const session = { port, closed: false, opened: false, writeTail: Promise.resolve() };
      this._makeReadyPromise(session);
      this._session = session;
      this.port = port;
      this.shouldListen = true;
      this.lastChars = '';
      this.terminalBuffer = '';
      this.buffer = [];
      this.completeBufferCallback = [];
      Files.received_string = '';
      try {
        session.openTask = port.open({ baudRate: this.speed });
        await session.openTask;
        session.opened = true;
        if (session.closed || this._session !== session) return false;
        const decoder = new TextDecoderStream();
        session.readableClosed = port.readable.pipeTo(decoder.writable).catch(() => {});
        session.reader = decoder.readable.getReader();
        session.readTask = this._readSession(session);
        this._updateUIForConnection();
        this._resetBoard(session);
        const ready = await session.readyPromise;
        return ready && this._session === session && !session.closed;
      } catch (error) {
        if (!session.closed) {
          this._handleSerialError(error);
          UI['notify'].send(MSG.serialConnectionFailed || 'Não foi possível abrir a conexão USB.');
          await this.disconnect();
        }
        return false;
      }
    }).catch((error) => {
      if (generation === this._generation) {
        if (error.name !== 'NotFoundError') this._handleSerialError(error);
        UI['workspace'].runAbort();
      }
      return false;
    });
    this._connectPromise = operation;
    operation.finally(() => {
      if (this._connectPromise === operation) this._connectPromise = null;
    });
    return operation;
  }

  async _readSession(session) {
    let failure;
    try {
      while (!session.closed) {
        const { value, done } = await session.reader.read();
        if (done) break;
        if (this._session === session && this.shouldListen) this._processReceived(value);
      }
    } catch (error) {
      failure = error;
    } finally {
      session.reader.releaseLock();
      // Do not await cleanup here: cleanup waits for this read task to finish.
      if (!session.closed) this._loseSession(session, failure);
    }
  }

  _processReceived(chunk) {
    const wasRecovering = this._recoveringRepl;
    if (wasRecovering) this._recoveryBuffer += chunk;
    Files.received_string += chunk;
    i2cScanner.processData(chunk);
    this.lastChars = (this.lastChars + chunk).slice(-REPL_CONSTANTS.PROMPT_LENGTH);
    if (this.lastChars === REPL_CONSTANTS.PROMPT) {
      UI['workspace'].runButton.status = true;
      UI['workspace'].runButton.dom.className = 'icon';
      UI['workspace'].toolbarButton.className = 'icon medium';
      this._finishReplRecovery();
      if (this.ready && !wasRecovering && this.completeBufferCallback.length) {
        const callback = this.completeBufferCallback.shift();
        try { callback(); } catch (error) { this._handleSerialError(error); }
      }
      if (this.ready && !i2cScanner._isRunning) i2cScanner.start(this);
    } else if (this.ready && UI['workspace'].runButton.status === true) {
      UI['workspace'].receiving();
    }
    // Line processing for terminal
    this.terminalBuffer += chunk;
    let lines = this.terminalBuffer.split(/(\r\n|\r|\n)/);

    if (!this.terminalBuffer.match(/(\r\n|\r|\n)$/)) {
      this.terminalBuffer = lines.pop();
    } else {
      this.terminalBuffer = '';
    }

    // Display lines in terminal with formatting
    lines.forEach((line) => {
      if (line === '\r' || line === '\n' || line === '\r\n') {
        term.write(line);
      } else if (line.length > 0) {
        const isSystemMessage =
          (line.includes('MicroPython') ||
            line.includes('Type "help()"') ||
            line.includes('Raspberry Pi Pico') ||
            line.includes('OSError') ||
            line.includes('Traceback') ||
            line.includes('File "') ||
            line.includes('soft reboot') ||
            line.includes('MPY:') ||
            line.includes('setting up') ||
            line.includes('Error') ||
            line.includes('KeyboardInterrupt') ||
            line.includes('>>>') ||
            line.includes('...') ||
            line.match(/\[\d+\]/) ||
            line.includes('  File') ||
            line.includes('last):') ||
            line.includes('paste mode')) &&
          !line.startsWith('===');

        if (isSystemMessage) {
          term.write('\x1b[37m' + line + '\x1b[0m');
        } else if (!line.includes('\x1b[')) {
          term.write(line);
        } else {
          term.write(line);
        }
      }
    });
  }

  _updateUIForConnection() {
    term.on();
    term.write('\x1b[32m' + (MSG.serialPreparing || 'USB conectado. Preparando a placa...') + '\x1b[m\r\n');
    this.connected = true;
    this.ready = false;
    clearInterval(this.watcher);
    this.watcher = setInterval(() => this._pollSerialBuffer(), SERIAL_CONFIG.WATCH_INTERVAL_MS);
  }

  _pollSerialBuffer() {
    if (!this.isReady() || this._sendingPacket) return;
    if (!this.buffer.length) {
      UI['progress'].end();
      return;
    }
    const session = this._session;
    const queue = this.buffer;
    const packet = queue[0];
    this._sendingPacket = true;
    UI['progress'].remain(queue.length);
    this._serialWrite(packet).then((written) => {
      // Only queue transmissions consume packets. Ctrl+C and scans never do.
      if (written && this._session === session && this.buffer === queue && queue[0] === packet) {
        queue.shift();
      }
    }).catch(() => {}).finally(() => {
      if (this._session === session) this._sendingPacket = false;
    });
  }

  disconnect() {
    ++this._generation;
    this._connectPromise = null;
    const session = this._session;
    this._session = null;
    this.port = undefined;
    this.connected = false;
    this.ready = false;
    this.shouldListen = false;
    this._sendingPacket = false;
    this._stopReplRecovery();
    clearTimeout(this._resetTimer);
    this._resetTimer = null;
    clearInterval(this.watcher);
    this.watcher = undefined;
    i2cScanner.stop();
    this.buffer = [];
    this.completeBufferCallback = [];
    this.lastChars = '';
    this.terminalBuffer = '';
    Files.received_string = '';
    UI['progress'].end();
    term.off();
    UI['workspace'].runAbort();
    if (!session || session.closed) return this._closingPromise;
    session.closed = true;
    session.resolveReady(false);
    const cleanup = async () => {
      // An unplug can happen while open() is still pending.
      if (session.openTask) {
        try { await session.openTask; session.opened = true; } catch (error) {}
      }
      if (session.reader) {
        try { await session.reader.cancel(); } catch (error) {}
      }
      if (session.readTask) await session.readTask;
      if (session.readableClosed) await session.readableClosed;
      const writer = session.writer;
      if (writer) {
        try { await writer.abort(); } catch (error) {}
      }
      await session.writeTail;
      if (session.opened) {
        try { await session.port.close(); } catch (error) { this._handleSerialError(error); }
      }
    };
    this._closingPromise = cleanup().catch((error) => this._handleSerialError(error));
    return this._closingPromise;
  }

  _loseSession(session, error) {
    if (this._session !== session || session.closed) return;
    if (error) this._handleSerialError(error);
    UI['notify'].send(MSG.serialDisconnected || 'A conexão USB foi perdida. Conecte a placa novamente.');
    return this.disconnect();
  }

  _resetBoard(session = this._session) {
    this._resetTimer = setTimeout(() => {
      this._resetTimer = null;
      if (session && this._session === session && !session.closed) {
        this._startReplRecovery(!!UI['workspace'].resetBoard.checked);
      }
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS);
  }

  _startReplRecovery(reset = false) {
    const session = this._session;
    if (!session || session.closed || !this.connected) return Promise.resolve(false);
    this._stopReplRecovery();
    clearTimeout(this._resetTimer);
    this._resetTimer = null;
    if (session.readySettled) this._makeReadyPromise(session);
    this.ready = false;
    this.lastChars = '';
    this._recoveringRepl = true;
    this._recoveryPhase = 'interrupt';
    this._recoveryBuffer = '';
    this._readyMarker = '__BIPES_REPL_READY_' + (++this._recoveryNonce) + '__';
    this._resetRequested = reset;
    i2cScanner.stop();
    const interval = SERIAL_CONFIG.REPL_RECOVERY_INTERVAL_MS || 350;
    const attempts = SERIAL_CONFIG.REPL_RECOVERY_ATTEMPTS || 20;
    const interrupt = () => {
      if (this._session !== session || session.closed || !this._recoveringRepl) return;
      if (this._replRecoveryAttempts >= attempts) {
        UI['notify'].send(MSG.serialNotReady || 'A placa não respondeu. Reconecte a placa e tente novamente.');
        this.disconnect();
        return;
      }
      this._replRecoveryAttempts += 1;
      if (this._recoveryPhase === 'interrupt') {
        const command = REPL_CONSTANTS.CTRL_C + REPL_CONSTANTS.CTRL_C;
        this._serialWrite(command, () => this._recoveringRepl && this._recoveryPhase === 'interrupt').catch(() => {});
      }
      this._replRecoveryTimer = setTimeout(interrupt, interval);
    };
    interrupt();
    return session.readyPromise;
  }

  _finishReplRecovery() {
    if (!this._recoveringRepl || !this._session) return;
    if (this._recoveryPhase === 'interrupt' && this._resetRequested) {
      // Reset from raw REPL skips main.py and cannot relaunch the robot.
      this._recoveryPhase = 'reset';
      this._recoveryBuffer = '';
      this._serialWrite(REPL_CONSTANTS.CTRL_A + REPL_CONSTANTS.CTRL_D + REPL_CONSTANTS.CTRL_B,
        () => this._recoveringRepl && this._recoveryPhase === 'reset').catch(() => {});
      return;
    }
    if (this._recoveryPhase === 'reset' && !this._recoveryBuffer.includes('soft reboot')) return;
    if (this._recoveryPhase === 'interrupt' || this._recoveryPhase === 'reset') {
      // A fresh round trip prevents leftover Ctrl+C prompts from completing
      // callbacks for a program that has not been sent yet.
      this._recoveryPhase = 'probe';
      this._recoveryBuffer = '';
      this._serialWrite("print('" + this._readyMarker + "')\r", () => this._recoveringRepl && this._recoveryPhase === 'probe').catch(() => {});
      return;
    }
    if (!this._recoveryBuffer.split(/\r\n|\r|\n/).includes(this._readyMarker)) return;
    this._stopReplRecovery();
    this.ready = true;
    this._session.resolveReady(true);
    term.write('\r\n\x1b[32m' + (MSG.serialReady || 'Placa pronta.') + '\x1b[m\r\n');
  }

  _stopReplRecovery() {
    clearTimeout(this._replRecoveryTimer);
    this._replRecoveryTimer = null;
    this._recoveringRepl = false;
    this._replRecoveryAttempts = 0;
  }

  interrupt() {
    this.buffer = [];
    this.completeBufferCallback = [];
    return this._startReplRecovery();
  }

  // Public terminal API; internal traffic uses the session-aware writer below.
  serialWrite(data) {
    if (data === REPL_CONSTANTS.CTRL_C) return this.interrupt();
    if (!this.isReady()) return Promise.resolve(false);
    return this._serialWrite(data);
  }

  _serialWrite(data, canWrite) {
    const session = this._session;
    if (!session || session.closed) return Promise.resolve(false);
    const bytes = data instanceof Uint8Array ? data : this.encoder.encode(String(data));
    const operation = session.writeTail.then(async () => {
      if (session.closed || this._session !== session || (canWrite && !canWrite())) return false;
      const writer = session.port.writable.getWriter();
      session.writer = writer;
      try {
        this.lastChars = '';
        await writer.write(bytes);
        return true;
      } finally {
        writer.releaseLock();
        if (session.writer === writer) session.writer = null;
      }
    });
    session.writeTail = operation.catch((error) => { this._loseSession(session, error); });
    return operation;
  }

  _handleSerialError(error) {
    console.error('Serial communication error:', error);
    UI['notify'].log(error);
  }
}

const webserial = WebSerialProtocol;
