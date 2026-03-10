'use strict';

/**
 * I2CScanner - Manages periodic I2C bus scanning and sensor detection
 * Detects sensors on both I2C0 and I2C1 buses independently of WebSerial
 */
class I2CScanner {
  constructor() {
    this._scanInterval = null;        // Periodic scan timer
    this._scanPending = false;        // Waiting for scan result
    this._scanBuffer = '';            // Response accumulator
    this._lastDetectedDevices = [];   // Already detected devices
    this._isRunning = false;          // Scanner state
  }

  /**
   * Starts periodic I2C scanning
   * @param {WebSerialProtocol} serial - WebSerial instance for sending commands
   */
  start(serial) {
    if (this._isRunning) return;
    this._isRunning = true;
    
    var self = this;
    
    // Initial scan
    this._sendScan(serial);
    
    // Periodic scan every 5 seconds
    this._scanInterval = setInterval(function() {
      if (serial.connected && self._canScan()) {
        self._sendScan(serial);
      }
    }, 5000);
  }

  /**
   * Stops the scanner
   */
  stop() {
    this._isRunning = false;
    if (this._scanInterval) {
      clearInterval(this._scanInterval);
      this._scanInterval = null;
    }
    this._lastDetectedDevices = [];
  }

  /**
   * Checks if scanning is allowed (code not running)
   */
  _canScan() {
    // Only scan when user code is not running
    // runButton.status = true when idle, false when running
    return UI['workspace'].runButton.status === true;
  }

  /**
   * Sends I2C scan command via serial
   */
  _sendScan(serial) {
    var self = this;
    
    serial._serialWrite(REPL_CONSTANTS.CTRL_C);
    
    setTimeout(function() {
      self._scanPending = true;
      self._scanBuffer = '';
      serial._serialWrite(self._buildScanCmd());
    }, 200);
  }

  /**
   * Builds the I2C scan command string
   */
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

  /**
   * Processes incoming data for I2C scan results
   * @param {string} chunk - Incoming data chunk from serial
   */
  processData(chunk) {
    if (!this._scanPending) return;
    
    this._scanBuffer = (this._scanBuffer || '') + chunk;
    
    // Search for result pattern
    var match = this._scanBuffer.match(/__I2C0_SCAN__:\[([^\]]*)\]\s*__I2C1_SCAN__:\[([^\]]*)\]/);
    if (!match) return;

    this._scanPending = false;
    this._scanBuffer = '';

    var i2c0List = match[1].trim();
    var i2c1List = match[2].trim();

    // Parse detected devices
    var currentDevices = this._parseDeviceList(i2c0List, i2c1List);
    
    // Check for sensor changes (connections and disconnections)
    this._checkSensorChanges(currentDevices);

    // Update detected devices list
    this._lastDetectedDevices = currentDevices;
  }

  /**
   * Parses device list from scan result
   */
  _parseDeviceList(i2c0List, i2c1List) {
    var devices = [];
    
    if (i2c0List) {
      i2c0List.split(',').forEach(function(s) {
        if (s.trim()) devices.push({ addr: parseInt(s.trim()), bus: 0 });
      });
    }
    if (i2c1List) {
      i2c1List.split(',').forEach(function(s) {
        if (s.trim()) devices.push({ addr: parseInt(s.trim()), bus: 1 });
      });
    }
    
    return devices;
  }

  /**
   * Checks for sensor changes (connections and disconnections)
   */
  _checkSensorChanges(currentDevices) {
    var knownDevices = BitdogLabConfig.SENSOR.I2C_KNOWN_DEVICES;
    var self = this;
    
    // Check for new connections
    currentDevices.forEach(function(dev) {
      if (knownDevices[dev.addr]) {
        // Check if already detected before (prevents spam)
        var alreadyDetected = self._lastDetectedDevices.some(function(d) {
          return d.addr === dev.addr && d.bus === dev.bus;
        });
        
        if (!alreadyDetected) {
          self._notifySensor(knownDevices[dev.addr], dev);
        }
      }
    });
    
    // Check for disconnections
    this._lastDetectedDevices.forEach(function(dev) {
      if (knownDevices[dev.addr]) {
        // Check if still connected
        var stillConnected = currentDevices.some(function(d) {
          return d.addr === dev.addr && d.bus === dev.bus;
        });
        
        if (!stillConnected) {
          self._notifyDisconnection(knownDevices[dev.addr], dev);
        }
      }
    });
  }

  /**
   * Notifies user about detected sensor
   */
  _notifySensor(name, device) {
    if (name === 'AHT20') {
      UI['notify'].send('🌡️💧 Sensor de temperatura e umidade conectado!');
      term.write('\r\n🌡️💧 Sensor de temperatura e umidade conectado!\r\n');
    } else if (name === 'MPU6050') {
      UI['notify'].send('🏃‍♂️📐 Sensor acelerômetro conectado!');
      term.write('\r\n🏃‍♂️📐 Sensor acelerômetro conectado!\r\n');
    }
  }

  /**
   * Notifies user about disconnected sensor
   */
  _notifyDisconnection(name, device) {
    if (name === 'AHT20') {
      UI['notify'].send('⚠️ Sensor de temperatura e umidade desconectado!');
      term.write('\r\n⚠️ >>> Sensor de temperatura e umidade desconectado! <<< ⚠️\x1b[m\r\n');
    } else if (name === 'MPU6050') {
      UI['notify'].send('⚠️ Sensor acelerômetro desconectado!');
      term.write('\r\n⚠️ >>> Sensor acelerômetro desconectado! <<< ⚠️\x1b[m\r\n');
    }
  }

  /**
   * Resets detected devices list (call on disconnect)
   */
  reset() {
    this._lastDetectedDevices = [];
    this._scanPending = false;
    this._scanBuffer = '';
  }
}

// Global instance
const i2cScanner = new I2CScanner();
