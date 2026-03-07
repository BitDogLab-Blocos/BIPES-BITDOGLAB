'use strict';

/**
 * WebSerialProtocol - Manages Web Serial communication and I2C sensor detection
 * Detects connected sensors in real-time on I2C0 and I2C1 buses
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
    // I2C scan state variables
    this._i2cScanPending = false;   // Waiting for scan result
    this._i2cScanBuffer = '';       // Scan accumulator buffer
    this._i2cScanInterval = null;   // Periodic scan timer
    this._lastDetectedDevices = []; // Already detected devices
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
                // Check I2C scan result
                Channel['webserial']._checkI2CScanResult(chunk);
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
    // Stop periodic I2C scan
    if (this._i2cScanInterval) {
      clearInterval(this._i2cScanInterval);
      this._i2cScanInterval = null;
    }

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
      this._i2cScanPending = false;
      this._i2cScanBuffer = '';
      this._lastDetectedDevices = [];
      this.connected = false;
      clearInterval(this.watcher);
      term.off();
      UI['workspace'].runAbort();
    });
  }

  // Resets board and starts I2C scan
  _resetBoard() {
    var self = this;
    setTimeout(() => {
      if (UI['workspace'].resetBoard.checked) {
        term.write('\x1b[32mResetting the board...\x1b[m\r\n');
        self._serialWrite(REPL_CONSTANTS.CTRL_D); // Soft reset
      } else {
        self._serialWrite(REPL_CONSTANTS.CTRL_C); // Keyboard interrupt
      }
      // Start periodic scan after 3s
      setTimeout(function() {
        self._startPeriodicI2CScan();
      }, 3000);
    }, SERIAL_CONFIG.RESET_TIMEOUT_MS);
  }

  // Builds I2C scan command
  _buildScanCmd() {
    var pins = BitdogLabConfig.PINS;
    var sensor = BitdogLabConfig.SENSOR;
    
    // I2C0: uses GP0/GP1 (v7) or GP14/GP15 (v6)
    var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
    var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;
    
    // Command to scan both buses
    var cmd = 'from machine import I2C, Pin; ' +
      '_i2c0=I2C(0,sda=Pin(' + i2c0Sda + '),scl=Pin(' + i2c0Scl + '),freq=' + sensor.I2C_FREQ + '); ' +
      '_r0=_i2c0.scan(); ';
    
    // I2C1: only available on v7 (GP2/GP3)
    if (pins.I2C_SDA !== undefined && pins.I2C_SCL !== undefined && 
        pins.I2C0_SDA !== undefined && pins.I2C0_SCL !== undefined) {
      cmd += '_i2c1=I2C(1,sda=Pin(' + pins.I2C_SDA + '),scl=Pin(' + pins.I2C_SCL + '),freq=400000); _r1=_i2c1.scan(); ';
    } else {
      cmd += '_r1=[]; ';
    }
    
    cmd += 'print("__I2C0_SCAN__:" + str(_r0) + " __I2C1_SCAN__:" + str(_r1))\r\n';
    return cmd;
  }

  // Starts periodic I2C scan (every 5 seconds)
  _startPeriodicI2CScan() {
    var self = this;
    self._sendI2CScan();
    
    this._i2cScanInterval = setInterval(function() {
      if (self.connected) {
        self._sendI2CScan();
      }
    }, 5000);
  }

  // Sends I2C scan command
  _sendI2CScan() {
    var self = this;
    if (!self.connected) return;
    
    self._serialWrite(REPL_CONSTANTS.CTRL_C);
    
    setTimeout(function() {
      self._i2cScanPending = true;
      self._i2cScanBuffer = '';
      self._serialWrite(self._buildScanCmd());
    }, 200);
  }

  // Processes I2C scan result
  _checkI2CScanResult(chunk) {
    if (!this._i2cScanPending) return;
    
    this._i2cScanBuffer = (this._i2cScanBuffer || '') + chunk;
    
    // Search for result string in buffer
    var match = this._i2cScanBuffer.match(/__I2C0_SCAN__:\[([^\]]*)\]\s*__I2C1_SCAN__:\[([^\]]*)\]/);
    if (!match) return;

    this._i2cScanPending = false;
    this._i2cScanBuffer = '';

    var i2c0List = match[1].trim();
    var i2c1List = match[2].trim();

    // Convert address list to object array
    var currentDevices = [];
    if (i2c0List) {
      i2c0List.split(',').forEach(function(s) {
        if (s.trim()) currentDevices.push({ addr: parseInt(s.trim()), bus: 0 });
      });
    }
    if (i2c1List) {
      i2c1List.split(',').forEach(function(s) {
        if (s.trim()) currentDevices.push({ addr: parseInt(s.trim()), bus: 1 });
      });
    }

    // Check known sensors
    var knownDevices = BitdogLabConfig.SENSOR.I2C_KNOWN_DEVICES;
    var newDevices = [];
    
    currentDevices.forEach(function(dev) {
      if (knownDevices[dev.addr]) {
        // Check if already detected before (prevents spam)
        var alreadyDetected = this._lastDetectedDevices.some(function(d) {
          return d.addr === dev.addr && d.bus === dev.bus;
        });
        
        if (!alreadyDetected) {
          newDevices.push(dev);
        }
      }
    }.bind(this));

    // Notify new devices
    newDevices.forEach(function(dev) {
      var name = knownDevices[dev.addr];
      UI['notify'].send('Sensor ' + name + ' conectado! (I2C' + dev.bus + ' endereco 0x' + dev.addr.toString(16) + ')');
      term.write('\r\n\x1b[36m>>> Sensor ' + name + ' detectado no I2C' + dev.bus + ' (0x' + dev.addr.toString(16) + ') <<<\x1b[m\r\n');
    });

    // Update detected devices list
    this._lastDetectedDevices = currentDevices;
  }

  // Sends data via serial
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
