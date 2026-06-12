'use strict';

// Temporary screenshot aid:
// disable automatic I2C polling so the generated-code capture stays clean.
// Set back to false after taking the print for IMG 04.
const BITDOGLAB_DISABLE_AUTO_I2C_SCANNER = false;

/**
 * I2CScanner - Manages periodic I2C bus scanning and sensor detection
 * Detects sensors on both I2C0 and I2C1 buses independently of WebSerial
 */
class I2CScanner {
  constructor() {
    this._scanInterval = null;        // Periodic scan timer
    this._scanTimeout = null;         // Pending scan timeout
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
    if (BITDOGLAB_DISABLE_AUTO_I2C_SCANNER) return;
    if (this._isRunning) return;
    this._isRunning = true;
    this._serial = serial;

    var self = this;

    // Initial scan (only if idle)
    if (this._canScan()) {
      this._sendScan(serial);
    }

    // Periodic scan every 5 seconds
    this._scanInterval = setInterval(function() {
      if (serial.connected && self._canScan()) {
        self._sendScan(serial);
      }
    }, 5000);
  }

  /**
   * Stops the scanner (preserves detected devices for reconnection)
   */
  stop() {
    this._isRunning = false;
    if (this._scanInterval) {
      clearInterval(this._scanInterval);
      this._scanInterval = null;
    }
    if (this._scanTimeout) {
      clearTimeout(this._scanTimeout);
      this._scanTimeout = null;
    }
    this._scanPending = false;
    // NÃO limpa _lastDetectedDevices — preserva estado dos sensores
  }

  /**
   * Checks if scanning is allowed (code not running)
   */
  _canScan() {
    // Only scan when user code is not running
    // runButton.status = true when idle, false when running
    return this._isRunning && UI['workspace'].runButton.status === true;
  }

  /**
   * Sends I2C scan command via serial
   */
  _sendScan(serial) {
    var self = this;

    // Não enviar se o scanner foi parado
    if (!this._isRunning) return;

    serial._serialWrite(REPL_CONSTANTS.CTRL_C);

    this._scanTimeout = setTimeout(function() {
      self._scanTimeout = null;
      // Verificar novamente antes de enviar (pode ter sido parado durante os 200ms)
      if (!self._isRunning) return;
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

    // Primary I2C bus from the active board configuration.
    var i2c0Sda = pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA;
    var i2c0Scl = pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL;
    var i2c1Bus = sensor.I2C_BUS_ALT !== undefined ? sensor.I2C_BUS_ALT : 1;

    // Command to scan both buses
    var cmd = 'from machine import I2C, Pin; ' +
      '_i2c0=I2C(' + sensor.I2C_BUS + ',sda=Pin(' + i2c0Sda + '),scl=Pin(' + i2c0Scl + '),freq=' + sensor.I2C_FREQ + '); ' +
      '_r0=_i2c0.scan(); ';

    // Alternate I2C bus, when the board exposes a second configured pair.
    if (pins.I2C_SDA !== undefined && pins.I2C_SCL !== undefined &&
        pins.I2C0_SDA !== undefined && pins.I2C0_SCL !== undefined) {
      cmd += '_i2c1=I2C(' + i2c1Bus + ',sda=Pin(' + pins.I2C_SDA + '),scl=Pin(' + pins.I2C_SCL + '),freq=' + sensor.I2C_FREQ + '); _r1=_i2c1.scan(); ';
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
    if (BITDOGLAB_DISABLE_AUTO_I2C_SCANNER) return;
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
    var sensor = BitdogLabConfig.SENSOR;
    var primaryBus = sensor.I2C_BUS;
    var alternateBus = sensor.I2C_BUS_ALT !== undefined ? sensor.I2C_BUS_ALT : 1;

    if (i2c0List) {
      i2c0List.split(',').forEach(function(s) {
        if (s.trim()) devices.push({ addr: parseInt(s.trim()), bus: primaryBus });
      });
    }
    if (i2c1List) {
      i2c1List.split(',').forEach(function(s) {
        if (s.trim()) devices.push({ addr: parseInt(s.trim()), bus: alternateBus });
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
    var currentKnownDevices = currentDevices.filter(function(dev) {
      return knownDevices[dev.addr];
    });
    var previousKnownDevices = this._lastDetectedDevices.filter(function(dev) {
      return knownDevices[dev.addr];
    });

    // Check for new connections
    currentKnownDevices.forEach(function(dev) {
      // Check if already detected before (prevents spam)
      var alreadyDetected = previousKnownDevices.some(function(d) {
        return d.addr === dev.addr && d.bus === dev.bus;
      });

      if (!alreadyDetected) {
        self._notifySensor(knownDevices[dev.addr], dev);
      }
    });

    // Check for disconnections
    previousKnownDevices.forEach(function(dev) {
      // Check if still connected
      var stillConnected = currentKnownDevices.some(function(d) {
        return d.addr === dev.addr && d.bus === dev.bus;
      });

      if (!stillConnected) {
        self._notifyDisconnection(knownDevices[dev.addr], dev);
      }
    });
  }

  /**
   * Notifies user about detected sensor
   */
  _notifySensor(name, device) {
    var busLabel = this._formatBusLabel(device.bus);
    if (name === 'AHT20') {
      UI['notify'].send('🌡️💧 Sensor de temperatura e umidade conectado!');
      term.write('\r\n🌡️💧 Sensor de temperatura e umidade conectado!\r\n');
    } else if (name === 'MPU6050') {
      var message = '📐 Sensor acelerômetro MPU6050 conectado no ' + busLabel + '!';
      UI['notify'].send(message);
      term.write('\r\n' + message + '\r\n');
    }
  }

  /**
   * Notifies user about disconnected sensor
   */
  _notifyDisconnection(name, device) {
    var busLabel = this._formatBusLabel(device.bus);
    if (name === 'AHT20') {
      UI['notify'].send('⚠️ Sensor de temperatura e umidade desconectado!');
      term.write('\r\n⚠️ >>> Sensor de temperatura e umidade desconectado! <<< ⚠️\x1b[m\r\n');
    } else if (name === 'MPU6050') {
      var message = '⚠️ Sensor acelerômetro MPU6050 desconectado do ' + busLabel + '!';
      UI['notify'].send(message);
      term.write('\r\n>>> ' + message + ' <<<\x1b[m\r\n');
    }
  }

  _formatBusLabel(bus) {
    return 'I2C' + bus;
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
