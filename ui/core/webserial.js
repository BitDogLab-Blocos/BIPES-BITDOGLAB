
'use strict';

/**
 * WebSerial protocol implementation
 * Handles communication with MicroPython devices via Web Serial API
 */
class WebSerialProtocol {
  /**
   * Initialize the WebSerial protocol handler
   */
  constructor() {
    this.port = undefined;
    this.watcher = undefined;
    this.buffer = [];
    this.connected = false;
    this.completeBufferCallback = [];
    this.lastChars = '';
    this.encoder = new TextEncoder();
    this.appendStream = undefined;
    this.shouldListen = true;
    this.packetSize = SERIAL_CONFIG.PACKET_SIZE;
    this.speed = SERIAL_CONFIG.BAUD_RATE;
    this.terminalBuffer = ''; // Buffer para acumular chunks antes de processar cores
  }

  /**
   * Poll serial buffer every WATCH_INTERVAL_MS to send queued code
   * @private
   */
  _pollSerialBuffer() {
    if (this.port && this.port.writable && this.port.writable.locked === false) {
      if (this.buffer.length > 0) {
        UI['progress'].remain(this.buffer.length);
        try {
          this._serialWrite(this.buffer[0]);
        } catch (error) {
          this._handleSerialError(error);
        }
      } else {
        UI['progress'].end();
      }
    }
  }

  /**
   * Connect to device using WebSerial protocol
   * Requests user permission for serial port access
   */
  connect() {
    if (typeof navigator.serial === 'undefined') {
      const errorMsg = MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API');
      UI['notify'].send(errorMsg);
      term.write(errorMsg);
      return;
    }

    navigator.serial.requestPort().then((port) => {
      UI['workspace'].connecting();
      this.port = port;

      this.port.open({ baudRate: this.speed }).then(() => {
        const appendStream = new WritableStream({
          write(chunk) {
            if (Channel['webserial'].shouldListen) {
              if (typeof chunk === 'string') {
                Tool.bipesVerify();

                // Keep last characters to check for MicroPython REPL prompt
                Channel['webserial'].lastChars = Channel['webserial'].lastChars
                  .concat(chunk.substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH))
                  .substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH);

                if (Channel['webserial'].lastChars.includes(REPL_CONSTANTS.PROMPT)) {
                  UI['workspace'].runButton.status = true;
                  UI['workspace'].runButton.dom.className = 'icon';
                  UI['workspace'].toolbarButton.className = 'icon medium';

                  if (Channel['webserial'].completeBufferCallback.length > 0) {
                    try {
                      Channel['webserial'].completeBufferCallback[0]();
                    } catch (error) {
                      Channel['webserial']._handleSerialError(error);
                    }
                    Channel['webserial'].completeBufferCallback.shift();
                  }
                } else if (UI['workspace'].runButton.status === true) {
                  UI['workspace'].receiving();
                }

                Files.received_string = Files.received_string.concat(chunk);
              }

              // Acumula chunks no buffer
              Channel['webserial'].terminalBuffer += chunk;

              // Processa linhas completas quando encontrar quebra de linha
              let lines = Channel['webserial'].terminalBuffer.split(/(\r\n|\r|\n)/);

              // Se não terminou em quebra de linha, guarda o último pedaço no buffer
              if (!Channel['webserial'].terminalBuffer.match(/(\r\n|\r|\n)$/)) {
                Channel['webserial'].terminalBuffer = lines.pop();
              } else {
                Channel['webserial'].terminalBuffer = '';
              }

              // Processa cada linha completa
              lines.forEach((line) => {
                if (line === '\r' || line === '\n' || line === '\r\n') {
                  term.write(line); // Mantém quebras de linha
                } else if (line.length > 0) {
                  // Verifica se é mensagem do sistema (branco) ou output de código (ciano)
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
                    !line.startsWith('==='); // Linhas com === são código, não sistema

                  if (isSystemMessage) {
                    term.write('\x1b[37m' + line + '\x1b[0m'); // Branco
                  } else if (!line.includes('\x1b[')) { // Se não tem código de cor já
                    term.write(line); // Usa cor padrão (ciano)
                  } else {
                    term.write(line); // Mantém cores existentes (verde das mensagens de conexão)
                  }
                }
              });
            }
          }
        });

        this.port.readable
          .pipeThrough(new TextDecoderStream())
          .pipeTo(appendStream);

        this._updateUIForConnection();
        this._resetBoard();

      }).catch((error) => {
        if (error.code === ERROR_CODES.PORT_ALREADY_OPEN) {
          this._updateUIForConnection();
          this._resetBoard();
          this.shouldListen = true;
        }
        this._handleSerialError(error);
      });

    }).catch((error) => {
      this._handleSerialError(error);
    });
  }

  /**
   * Update UI elements when connection is established
   * @private
   */
  _updateUIForConnection() {
    term.on();
    term.write('\x1b[32mConnected using Web Serial API!\x1b[m\r\n');
    this.connected = true;

    if (UI['workspace'].runButton.status === true) {
      UI['workspace'].receiving();
    }

    this.watcher = setInterval(
      this._pollSerialBuffer.bind(this),
      SERIAL_CONFIG.WATCH_INTERVAL_MS
    );
  }

  /**
   * Disconnect device
   */
  disconnect() {
    const writer = this.port.writable.getWriter();

    writer.close().then(() => {
      this.port.close().then(() => {
        this.port = undefined;
      }).catch((error) => {
        this._handleSerialError(error);
        writer.abort();
        this.port = undefined;
        this.shouldListen = false;
      });

      if (term) {
        term.write('\x1b[32mDisconnected\x1b[m\r\n');
      }

      this.buffer = [];
      this.lastChars = '';
      this.terminalBuffer = ''; // Limpa o buffer do terminal
      this.connected = false;
      clearInterval(this.watcher);
      term.off();
      UI['workspace'].runAbort();
    });
  }

  /**
   * Reset board on connection if enabled in UI
   * @private
   */
  _resetBoard() {
    setTimeout(() => {
      if (UI['workspace'].resetBoard.checked) {
        term.write('\x1b[32mResetting the board...\x1b[m\r\n');
        this._serialWrite(REPL_CONSTANTS.CTRL_D);
      } else {
        this._serialWrite(REPL_CONSTANTS.CTRL_C);
      }
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS);
  }

  /**
   * Send data directly via serial port
   * @param {Uint8Array|string|number} data - Data to be sent
   * @private
   */
  _serialWrite(data) {
    let dataArrayBuffer;

    switch (data.constructor.name) {
      case 'Uint8Array':
        dataArrayBuffer = data;
        break;
      case 'String':
      case 'Number':
        dataArrayBuffer = this.encoder.encode(data);
        break;
    }

    if (this.port && this.port.writable && dataArrayBuffer !== undefined) {
      const writer = this.port.writable.getWriter();
      writer.write(dataArrayBuffer).then(() => {
        writer.releaseLock();
        this.buffer.shift();
      });
    }
  }

  /**
   * Handle serial communication errors
   * @param {Error} error - The error object
   * @private
   */
  _handleSerialError(error) {
    console.error('Serial communication error:', error);
    UI['notify'].log(error);
  }
}

// Legacy class names for backward compatibility
const webserial = WebSerialProtocol;
