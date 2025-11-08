'use strict';

// Serial communication configuration
const SERIAL_CONFIG = {
  BAUD_RATE: 115200,//Bits/sec for pico, for: ESP32/ESP8266 standard (9600, 57600, 921600)
  PACKET_SIZE: 100, // Max bytes per chunk (UART buffer ~128 bytes)
  WATCH_INTERVAL_MS: 50, // Serial polling interval
  RESET_TIMEOUT_MS: 50 //Delay before CTRL_C/CTRL_D
};
// MicroPython REPL control codes
const REPL_CONSTANTS = {
  PROMPT: '>>> ', //REPL ready indicator
  PROMPT_LENGTH: 4,
  CTRL_C: '\x03',// \x03 = KeyboardInterrupt (stops code, no reboot)
  CTRL_D: '\x04'// \x04 = Soft reboot (reloads boot.py/main.py, clears memory)
};
const PATTERNS = {
  LINE_BREAK: /\r\n|\n/gm,// Regex: Windows (\r\n) + Unix (\n) endings
  REPLACEMENT: '\r'//Normalize to \r for MicroPython
};
const ERROR_CODES = {
  PORT_ALREADY_OPEN: 11 //WebSerial: port in use by another process
};
// Manages communication protocols (WebSerial only)
class ProtocolManager {
  constructor() {
    this.isLocalFile = false;//file:// protocol flag
    this.available = ['webserial']; // Supported protocols
    this.currentChannel = 'webserial';
  }
  // Switch protocol (disconnects current before connecting new)
  switch(channelName) {
    if (this.available.includes(channelName)) {
      this.currentChannel = channelName;
      ProtocolManager.disconnect();
      this.connect();
    } else {
      alert(`The channel ${channelName} is not yet available in this version.`);
    }
  }
  connect() {
    Channel['webserial'].connect();
  }
  static disconnect() {
    if (Channel['webserial'].connected) {
      Channel['webserial'].disconnect();
    }
  }
  static connected() {
    return Channel['webserial'].connected;
  }
  //FIFO: Enqueue code chunks + callback (fires on REPL '>>>')
  static bufferPush(code, callback) {
    let textArray;
    if (typeof code === 'object') {
      textArray = code;
    } else if (typeof code === 'string') {
      if (Channel['webserial'].connected) {
        // Regex: split into chunks of max packetSize
        const pattern = new RegExp(`(.|[\\r]){1,${Channel['webserial'].packetSize}}`, 'g');
        textArray = code.replace(PATTERNS.LINE_BREAK, PATTERNS.REPLACEMENT).match(pattern);
      }
    }
    if (Channel['webserial'].connected) {
      Channel['webserial'].buffer = Channel['webserial'].buffer.concat(textArray);
      if (callback !== undefined) {
        Channel['webserial'].completeBufferCallback.push(callback);
      }
    } else {
      UI['notify'].send(MSG['notConnected']);
    }
  }
  // LIFO: Priority send (prepend to queue for urgent commands)
  static bufferUnshift(code) {
    if (Channel['webserial'].connected) {
      Channel['webserial'].buffer.unshift(code);
    } else {
      UI['notify'].send(MSG['notConnected']);
    }
  }
  //Clear transmission queue + callbacks
  static clearBuffer() {
    if (Channel['webserial'].connected) {
      Channel['webserial'].buffer = [];
      Channel['webserial'].completeBufferCallback = [];
    } else {
      UI['notify'].send(MSG['notConnected']);
    }
  }
}
//Legacy alias (multiplexer concept)
const mux = ProtocolManager;
