'use strict';

/**
 * Communication channel constants for serial protocols
 */
const SERIAL_CONFIG = {
  BAUD_RATE: 115200,
  PACKET_SIZE: 100,
  WATCH_INTERVAL_MS: 50,
  RESET_TIMEOUT_MS: 50
};

const REPL_CONSTANTS = {
  PROMPT: '>>> ',
  PROMPT_LENGTH: 4,
  CTRL_C: '\x03',
  CTRL_D: '\x04'
};

const PATTERNS = {
  LINE_BREAK: /\r\n|\n/gm,
  REPLACEMENT: '\r'
};

const ERROR_CODES = {
  PORT_ALREADY_OPEN: 11
};

/**
 * Protocol multiplexer - Manages communication between different protocols
 * (WebSerial)
 */
class ProtocolManager {
  /**
   * Initialize the protocol manager
   * Checks if loaded via HTTPS, HTTP, or locally to handle browser policies
   */
  constructor() {
    this.isLocalFile = false;
    this.available = ['webserial'];
    this.currentChannel = 'webserial';
    this.unavailableRedirects = {
      webserial: ['https://bipes.net.br/beta2/ui', 'the HTTPS version']
    };
  }

  /**
   * Switch to a different protocol if available
   * @param {string} channelName - The protocol to switch to
   */
  switch(channelName) {
    if (this.available.includes(channelName)) {
      this.currentChannel = channelName;
      ProtocolManager.disconnect();
      this.connect();
    } else if (this.unavailableRedirects[channelName] !== undefined) {
      const [url, description] = this.unavailableRedirects[channelName];
      const msg = `The channel ${channelName} is not yet available in this version, but at ${description}, would you like to be redirected there?`;
      if (confirm(msg)) {
        window.location.replace(url);
      } else {
        UI['channel-panel'].button.className = `icon ${this.currentChannel}`;
      }
    } else {
      alert(`The channel ${channelName} is not yet available in this version.`);
    }
  }

  /**
   * Connect using the current protocol
   */
  connect() {
    Channel['webserial'].connect();
  }

  /**
   * Disconnect the current protocol
   * @static
   */
  static disconnect() {
    if (Channel['webserial'].connected) {
      Channel['webserial'].disconnect();
    }
  }

  /**
   * Check if any device is connected via any protocol
   * @returns {boolean} True if a device is connected
   * @static
   */
  static connected() {
    return Channel['webserial'].connected;
  }

  /**
   * Send data to the buffer to be transmitted to the device
   * A callback function can be passed and will be called after the MicroPython REPL prompt is detected
   * @param {string|object} code - The code to be sent to the device
   * @param {function} [callback] - Optional callback function to be called when code execution completes
   * @static
   */
  static bufferPush(code, callback) {
    let textArray;

    if (typeof code === 'object') {
      textArray = code;
    } else if (typeof code === 'string') {
      if (Channel['webserial'].connected) {
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

  /**
   * Send data to the first position of the buffer (priority execution)
   * Useful for reset commands that need immediate execution
   * @param {string} code - The code to be sent immediately to the device
   * @static
   */
  static bufferUnshift(code) {
    if (Channel['webserial'].connected) {
      Channel['webserial'].buffer.unshift(code);
    } else {
      UI['notify'].send(MSG['notConnected']);
    }
  }

  /**
   * Clear the transmission buffer (code won't be sent)
   * @static
   */
  static clearBuffer() {
    if (Channel['webserial'].connected) {
      Channel['webserial'].buffer = [];
      Channel['webserial'].completeBufferCallback = [];
    } else {
      UI['notify'].send(MSG['notConnected']);
    }
  }
}

// Legacy class names for backward compatibility
const mux = ProtocolManager;
