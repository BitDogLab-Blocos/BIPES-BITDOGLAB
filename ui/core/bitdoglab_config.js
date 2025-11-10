// BitdogLab Hardware Configuration
// Device-specific pin mappings and code generation templates

'use strict';

const BitdogLabConfig = {

  // GPIO pin assignments for BitdogLab board
  PINS: {
    LED_RED: 13,
    LED_GREEN: 11,
    LED_BLUE: 12,
    BUZZER: 21,
    BUTTON_A: 5,
    BUTTON_B: 6
  },

  // MicroPython variable identifiers for LEDs
  LED_VARS: {
    RED: 'led_vermelho',
    GREEN: 'led_verde',
    BLUE: 'led_azul'
  },

  // LED initialization code generator
  LED_INIT: {
    // Generate init code to turn off all used LEDs
    generateInitCode: function(rawCode) {
      const hasRed = rawCode.indexOf(this.RED) !== -1;
      const hasGreen = rawCode.indexOf(this.GREEN) !== -1;
      const hasBlue = rawCode.indexOf(this.BLUE) !== -1;

      if (!hasRed && !hasGreen && !hasBlue) { // No LEDs used
        return '';
      }

      let code = '\n# Inicializar LEDs (desligar todos)\n';
      if (hasRed) code += `${this.RED}.duty_u16(0)\n`; // PWM duty cycle = 0 (off)
      if (hasGreen) code += `${this.GREEN}.duty_u16(0)\n`;
      if (hasBlue) code += `${this.BLUE}.duty_u16(0)\n`;

      return code;
    },

    RED: 'led_vermelho',
    GREEN: 'led_verde',
    BLUE: 'led_azul'
  },

  // Main loop configuration
  LOOP: {
    DELAY_MS: 50, // Courtesy delay to prevent CPU overload (50ms)

    // Generate sleep statement for loop
    getDelayCode: function() {
      return `  time.sleep_ms(${this.DELAY_MS})  # Pausa de cortesia\n`;
    }
  },

  // Code block markers (used by code.js parser)
  MARKERS: {
    LOOP_START: '# LOOP_BLOCK_START', // Custom loop block start marker
    LOOP_END: '# LOOP_BLOCK_END', // Custom loop block end marker
    SOUND_START: '# SOUND_BLOCK_START', // Sound block start marker
    SOUND_END: '# SOUND_BLOCK_END', // Sound block end marker
    STATIC_CONFIG: 'CONFIGURACAO_FIXA' // Static LED configuration marker
  },

  // Pattern matching for setup/initialization detection
  SETUP_PATTERNS: {
    // Check if line is hardware setup (Pin/PWM/LED_MATRIX/neopixel init)
    isSetupLine: function(line) {
      return line.indexOf(' = Pin(') !== -1 || // Pin initialization with spaces
             line.indexOf('=Pin(') !== -1 || // Pin initialization without spaces
             line.indexOf(' = PWM(') !== -1 || // PWM initialization with spaces
             line.indexOf('=PWM(') !== -1 || // PWM initialization without spaces
             line.startsWith('LED_MATRIX = ') || // LED matrix setup
             line.startsWith('np = neopixel'); // Neopixel setup
    }
  }
};

// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig;
}
