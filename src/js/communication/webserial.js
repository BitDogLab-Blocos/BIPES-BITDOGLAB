'use strict';

/**
 * WebSerialProtocol - Manages Web Serial communication
 * I2C sensor detection is handled by i2c_scanner.js
 */
class WebSerialProtocol {
  constructor() {
    this.port = undefined;           // Web Serial API port
    this.watcher = undefined;        // Buffer polling timer
    this.buffer = [];               // Transmission queue
    this.connected = false;         // Connection state
    this.completeBufferCallback = []; // Post-transmission callbacks
    this.lastChars = '';            // Buffer to detect REPL prompt
    this.encoder = new TextEncoder(); // Text encoder
    this.appendStream = undefined;  // Write stream
    this.shouldListen = true;       // Controls data processing
    this.packetSize = SERIAL_CONFIG.PACKET_SIZE; // Max packet size
    this.speed = SERIAL_CONFIG.BAUD_RATE; // Connection baud rate
    this.terminalBuffer = '';       // Terminal buffer
  }

  // Transmit buffer polling
  _pollSerialBuffer() {
    if (this.port && this.port.writable && !this.port.writable.locked) {
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

  // Connects to serial device
  connect() {
    // Check Web Serial API support
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
        // Create stream to process received data
        const appendStream = new WritableStream({
          write(chunk) {
            if (Channel['webserial'].shouldListen) {
              if (typeof chunk === 'string') {
                Tool.bipesVerify();
                // Delegate I2C scan processing to i2cScanner
                i2cScanner.processData(chunk);
                
                Channel['webserial'].lastChars = Channel['webserial'].lastChars
                  .concat(chunk.substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH))
                  .substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH);

                // Detect REPL prompt (command completed)
                if (Channel['webserial'].lastChars.includes(REPL_CONSTANTS.PROMPT)) {
                  UI['workspace'].runButton.status = true;
                  UI['workspace'].runButton.dom.className = 'icon';
                  UI['workspace'].toolbarButton.className = 'icon medium';

                  // Execute callback if available
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

              // Line processing for terminal
              Channel['webserial'].terminalBuffer += chunk;
              let lines = Channel['webserial'].terminalBuffer.split(/(\r\n|\r|\n)/);

              if (!Channel['webserial'].terminalBuffer.match(/(\r\n|\r|\n)$/)) {
                Channel['webserial'].terminalBuffer = lines.pop();
              } else {
                Channel['webserial'].terminalBuffer = '';
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
          }
        });

        this.port.readable.pipeThrough(new TextDecoderStream()).pipeTo(appendStream);
        this._updateUIForConnection();
        this._resetBoard();
      }).catch((error) => {
        // Port already open
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

  // Updates UI when connected
  _updateUIForConnection() {
    term.on();
    term.write('\x1b[32mConnected using Web Serial API!\x1b[m\r\n');
    this.connected = true;

    if (UI['workspace'].runButton.status === true) {
      UI['workspace'].receiving();
    }

    // Start buffer polling
    this.watcher = setInterval(
      this._pollSerialBuffer.bind(this),
      SERIAL_CONFIG.WATCH_INTERVAL_MS
    );
  }

  // Disconnects from device
  disconnect() {
    // Stop I2C scanner
    i2cScanner.stop();

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

      // Reset state variables
      this.buffer = [];
      this.lastChars = '';
      this.terminalBuffer = '';
      this.connected = false;
      clearInterval(this.watcher);
      term.off();
      UI['workspace'].runAbort();
    });
  }

  // Resets board and starts I2C scanner
  _resetBoard() {
    var self = this;
    setTimeout(() => {
      if (UI['workspace'].resetBoard.checked) {
        term.write('\x1b[32mResetting the board...\x1b[m\r\n');
        self._serialWrite(REPL_CONSTANTS.CTRL_D); // Soft reset
      } else {
        self._serialWrite(REPL_CONSTANTS.CTRL_C); // Keyboard interrupt
      }
      // Start I2C scanner after board reset
      setTimeout(function() {
        i2cScanner.start(self);
      }, 3000);
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS);
  }

  // Sends data via serial (public method for i2cScanner)
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
        if (this.buffer.length > 0) {
          this.buffer.shift();
        }
      }).catch((err) => {
        writer.releaseLock();
      });
    }
  }

  // Handles communication errors
  _handleSerialError(error) {
    console.error('Serial communication error:', error);
    UI['notify'].log(error);
  }
}

// Backward compatibility
const webserial = WebSerialProtocol;
