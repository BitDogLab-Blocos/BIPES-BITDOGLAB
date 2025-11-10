
'use strict';

class WebSerialProtocol {
  constructor() {
    this.port = undefined; // Serial port instance
    this.watcher = undefined; // Polling interval
    this.buffer = []; // Command queue
    this.connected = false; // Connection status
    this.completeBufferCallback = []; // Execution callbacks
    this.lastChars = ''; // REPL prompt detection
    this.encoder = new TextEncoder(); // Text to bytes converter
    this.appendStream = undefined; // Write stream handler
    this.shouldListen = true; // Data processing flag
    this.packetSize = SERIAL_CONFIG.PACKET_SIZE; // Data chunk size
    this.speed = SERIAL_CONFIG.BAUD_RATE; // Serial baud rate
    this.terminalBuffer = ''; // Line processing buffer
  }

  _pollSerialBuffer() {
    if (this.port?.writable && !this.port.writable.locked) { // Check port availability
      if (this.buffer.length > 0) { // Commands pending
        UI['progress'].remain(this.buffer.length);
        try {
          this._serialWrite(this.buffer[0]); // Send next command
        } catch (error) {
          this._handleSerialError(error);
        }
      } else {
        UI['progress'].end(); // All commands sent
      }
    }
  }

  connect() {
    if (typeof navigator.serial === 'undefined') { // WebSerial not supported
      const errorMsg = MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API');
      UI['notify'].send(errorMsg);
      term.write(errorMsg);
      return;
    }

    navigator.serial.requestPort().then((port) => { // Request device selection
      UI['workspace'].connecting();
      this.port = port;

      this.port.open({ baudRate: this.speed }).then(() => { // Open serial connection
        const appendStream = new WritableStream({
          write(chunk) {
            if (Channel['webserial'].shouldListen) {
              if (typeof chunk === 'string') {
                Tool.bipesVerify();

                // Check for MicroPython REPL prompt
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

              // Accumulate chunks in buffer
              Channel['webserial'].terminalBuffer += chunk;

              // Process complete lines on line break
              let lines = Channel['webserial'].terminalBuffer.split(/(\r\n|\r|\n)/);

              // Keep last incomplete line in buffer
              if (!Channel['webserial'].terminalBuffer.match(/(\r\n|\r|\n)$/)) {
                Channel['webserial'].terminalBuffer = lines.pop();
              } else {
                Channel['webserial'].terminalBuffer = '';
              }

              // Process each complete line
              lines.forEach((line) => {
                if (line === '\r' || line === '\n' || line === '\r\n') {
                  term.write(line); // Keep line breaks
                } else if (line.length > 0) {
                  // Check if system message (white) or code output (cyan)
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
                    !line.startsWith('==='); // Lines with === are code, not system

                  if (isSystemMessage) {
                    term.write('\x1b[37m' + line + '\x1b[0m'); // White
                  } else if (!line.includes('\x1b[')) { // If no color code already
                    term.write(line); // Use default color (cyan)
                  } else {
                    term.write(line); // Keep existing colors (green from connection messages)
                  }
                }
              });
            }
          }
        });

        this.port.readable
          .pipeThrough(new TextDecoderStream()) // Convert bytes to text
          .pipeTo(appendStream); // Route to stream handler

        this._updateUIForConnection();
        this._resetBoard();

      }).catch((error) => {
        if (error.code === ERROR_CODES.PORT_ALREADY_OPEN) { // Handle existing connection
          this._updateUIForConnection();
          this._resetBoard();
          this.shouldListen = true;
        }
        this._handleSerialError(error);
      });

    }).catch((error) => {
      this._handleSerialError(error); // Handle connection failure
    });
  }

  _updateUIForConnection() {
    term.on(); // Enable terminal input
    term.write('\x1b[32mConnected using Web Serial API!\x1b[m\r\n');
    this.connected = true;

    if (UI['workspace'].runButton.status === true) {
      UI['workspace'].receiving(); // Update UI state
    }

    this.watcher = setInterval(
      this._pollSerialBuffer.bind(this),
      SERIAL_CONFIG.WATCH_INTERVAL_MS // Start polling
    );
  }

  disconnect() {
    const writer = this.port.writable.getWriter(); // Get write lock

    writer.close().then(() => {
      this.port.close().then(() => {
        this.port = undefined; // Clear port reference
      }).catch((error) => {
        this._handleSerialError(error);
        writer.abort(); // Force close on error
        this.port = undefined;
        this.shouldListen = false;
      });

      if (term) {
        term.write('\x1b[32mDisconnected\x1b[m\r\n');
      }

      this.buffer = []; // Clear command queue
      this.lastChars = '';
      this.terminalBuffer = ''; // Clear terminal buffer
      this.connected = false;
      clearInterval(this.watcher); // Stop polling
      term.off(); // Disable terminal
      UI['workspace'].runAbort();
    });
  }

  _resetBoard() {
    setTimeout(() => {
      if (UI['workspace'].resetBoard.checked) { // User wants reset
        term.write('\x1b[32mResetting the board...\x1b[m\r\n');
        this._serialWrite(REPL_CONSTANTS.CTRL_D); // Soft reset
      } else {
        this._serialWrite(REPL_CONSTANTS.CTRL_C); // Just interrupt
      }
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS);
  }

  serialWrite(data) {
    this._serialWrite(data); // Public interface
  }

  _serialWrite(data) {
    let dataArrayBuffer;

    switch (data.constructor.name) {
      case 'Uint8Array':
        dataArrayBuffer = data; // Already bytes
        break;
      case 'String':
      case 'Number':
        dataArrayBuffer = this.encoder.encode(data); // Convert to bytes
        break;
    }

    if (this.port?.writable && !this.port.writable.locked && dataArrayBuffer !== undefined) {
      const writer = this.port.writable.getWriter(); // Get exclusive access
      writer.write(dataArrayBuffer).then(() => {
        writer.releaseLock(); // Release for next write
        this.buffer.shift(); // Remove from queue
      });
    }
  }

  _handleSerialError(error) {
    console.error('Serial communication error:', error);
    UI['notify'].log(error); // Show user notification
  }
}
