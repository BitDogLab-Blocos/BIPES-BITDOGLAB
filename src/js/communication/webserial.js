'use strict';

class WebSerialProtocol {
  constructor() {
    this.port = undefined;           // Web Serial API port instance
    this.watcher = undefined;        // Interval ID for buffer polling
    this.buffer = [];               // Queue for outgoing data packets
    this.connected = false;         // Connection state flag
    this.completeBufferCallback = []; // Callbacks for completed transmissions
    this.lastChars = '';            // Buffer for detecting REPL prompts
    this.encoder = new TextEncoder(); // Text encoder for string conversion
    this.appendStream = undefined;  // Writable stream for incoming data
    this.shouldListen = true;       // Controls whether to process incoming data
    this.packetSize = SERIAL_CONFIG.PACKET_SIZE; // Max packet size for transmission
    this.speed = SERIAL_CONFIG.BAUD_RATE; // Serial communication baud rate
    this.terminalBuffer = '';       // Buffer for terminal output processing
  }

  // Write queued data to serial port
  _pollSerialBuffer() {
    if (this.port && this.port.writable && !this.port.writable.locked) {
      if (this.buffer.length > 0) {
        UI['progress'].remain(this.buffer.length); // Update UI progress indicator
        try {
          this._serialWrite(this.buffer[0]); // Write first packet in queue
        } catch (error) {
          this._handleSerialError(error);
        }
      } else {
        UI['progress'].end(); // Hide progress when queue is empty
      }
    }
  }

  // Connect to serial device
  connect() {
    // Check Web Serial API browser support
    if (typeof navigator.serial === 'undefined') {
      const errorMsg = MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API');
      UI['notify'].send(errorMsg);
      term.write(errorMsg);
      return;
    }

    // Request user to select serial port
    navigator.serial.requestPort().then((port) => {
      UI['workspace'].connecting();
      this.port = port;

      // Open serial connection with configured baud rate
      this.port.open({ baudRate: this.speed }).then(() => {
        // Create writable stream for processing incoming data
        const appendStream = new WritableStream({
          write(chunk) {
            if (Channel['webserial'].shouldListen) {
              // Detect REPL prompts to determine command completion
              if (typeof chunk === 'string') {
                Tool.bipesVerify();
                Channel['webserial'].lastChars = Channel['webserial'].lastChars
                  .concat(chunk.substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH))
                  .substr(-REPL_CONSTANTS.PROMPT_LENGTH, REPL_CONSTANTS.PROMPT_LENGTH);

                // Check for REPL prompt indicating command execution completed
                if (Channel['webserial'].lastChars.includes(REPL_CONSTANTS.PROMPT)) {
                  UI['workspace'].runButton.status = true;
                  UI['workspace'].runButton.dom.className = 'icon';
                  UI['workspace'].toolbarButton.className = 'icon medium';

                  // Execute completion callback if available
                  if (Channel['webserial'].completeBufferCallback.length > 0) {
                    try {
                      Channel['webserial'].completeBufferCallback[0]();
                    } catch (error) {
                      Channel['webserial']._handleSerialError(error);
                    }
                    Channel['webserial'].completeBufferCallback.shift();
                  }
                } else if (UI['workspace'].runButton.status === true) {
                  UI['workspace'].receiving(); // Update UI to receiving state
                }

                Files.received_string = Files.received_string.concat(chunk);
              }

              // Process terminal output with line buffering
              Channel['webserial'].terminalBuffer += chunk;
              let lines = Channel['webserial'].terminalBuffer.split(/(\r\n|\r|\n)/);

              // Keep incomplete line in buffer
              if (!Channel['webserial'].terminalBuffer.match(/(\r\n|\r|\n)$/)) {
                Channel['webserial'].terminalBuffer = lines.pop();
              } else {
                Channel['webserial'].terminalBuffer = '';
              }

              // Process complete lines for terminal display
              lines.forEach((line) => {
                if (line === '\r' || line === '\n' || line === '\r\n') {
                  term.write(line); // Write line endings directly
                } else if (line.length > 0) {
                  // Identify system messages for special formatting
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

                  // Apply color coding to system messages
                  if (isSystemMessage) {
                    term.write('\x1b[37m' + line + '\x1b[0m'); // White text for system messages
                  } else if (!line.includes('\x1b[')) {
                    term.write(line); // Regular output
                  } else {
                    term.write(line); // Already formatted output
                  }
                }
              });
            }
          }
        });

        // Pipe serial data through text decoder to writable stream
        this.port.readable.pipeThrough(new TextDecoderStream()).pipeTo(appendStream);
        this._updateUIForConnection();
        this._resetBoard(); // Perform board reset sequence
      }).catch((error) => {
        // Handle case where port is already open
        if (error.code === ERROR_CODES.PORT_ALREADY_OPEN) {
          this._updateUIForConnection();
          this._resetBoard();
          this.shouldListen = true;
        }
        this._handleSerialError(error);
      });
    }).catch((error) => {
      this._handleSerialError(error); // Handle port selection errors
    });
  }

  // Update UI when connected successfully
  _updateUIForConnection() {
    term.on(); // Enable terminal
    term.write('\x1b[32mConnected using Web Serial API!\x1b[m\r\n'); // Green success message
    this.connected = true;

    if (UI['workspace'].runButton.status === true) {
      UI['workspace'].receiving(); // Update UI state
    }

    // Start polling for outgoing data transmission
    this.watcher = setInterval(
      this._pollSerialBuffer.bind(this),
      SERIAL_CONFIG.WATCH_INTERVAL_MS
    );
  }

  // Disconnect from serial device
  disconnect() {
    const writer = this.port.writable.getWriter();

    writer.close().then(() => {
      this.port.close().then(() => {
        this.port = undefined; // Clear port reference
      }).catch((error) => {
        this._handleSerialError(error);
        writer.abort(); // Force close writer on error
        this.port = undefined;
        this.shouldListen = false;
      });

      if (term) {
        term.write('\x1b[32mDisconnected\x1b[m\r\n'); // Green disconnect message
      }

      // Reset all state variables
      this.buffer = [];
      this.lastChars = '';
      this.terminalBuffer = '';
      this.connected = false;
      clearInterval(this.watcher); // Stop buffer polling
      term.off(); // Disable terminal
      UI['workspace'].runAbort(); // Update UI to disconnected state
    });
  }

  // Reset board if enabled in settings
  _resetBoard() {
    setTimeout(() => {
      if (UI['workspace'].resetBoard.checked) {
        term.write('\x1b[32mResetting the board...\x1b[m\r\n');
        this._serialWrite(REPL_CONSTANTS.CTRL_D); // Soft reset
      } else {
        this._serialWrite(REPL_CONSTANTS.CTRL_C); // Keyboard interrupt
      }
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS); // Delay before reset
  }

  // Send data to serial port with proper encoding
  _serialWrite(data) {
    let dataArrayBuffer;
    switch (data.constructor.name) {
      case 'Uint8Array':
        dataArrayBuffer = data; // Already in binary format
        break;
      case 'String':
      case 'Number':
        dataArrayBuffer = this.encoder.encode(data); // Convert to Uint8Array
        break;
    }

    if (this.port && this.port.writable && dataArrayBuffer !== undefined) {
      const writer = this.port.writable.getWriter();
      writer.write(dataArrayBuffer).then(() => {
        writer.releaseLock(); // Release writer lock after write
        this.buffer.shift(); // Remove sent packet from queue
      });
    }
  }

  // Handle serial communication errors
  _handleSerialError(error) {
    console.error('Serial communication error:', error);
    UI['notify'].log(error); // Display error in UI notification system
  }
}

// Backward compatibility
const webserial = WebSerialProtocol;