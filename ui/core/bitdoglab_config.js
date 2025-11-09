/**
 * BitdogLab Hardware Configuration
 * Device-specific constants and code templates for BitdogLab board
 */

'use strict';

const BitdogLabConfig = {

  // Hardware pin mappings
  PINS: {
    LED_RED: 13,
    LED_GREEN: 11,
    LED_BLUE: 12,
    BUZZER: 21,
    BUTTON_A: 5,
    BUTTON_B: 6
  },

  // LED variable names (MicroPython identifiers)
  LED_VARS: {
    RED: 'led_vermelho',
    GREEN: 'led_verde',
    BLUE: 'led_azul'
  },

  // Code templates for LED initialization
  LED_INIT: {
    // Turn off all LEDs at startup
    generateInitCode: function(rawCode) {
      const hasRed = rawCode.indexOf(this.RED) !== -1;
      const hasGreen = rawCode.indexOf(this.GREEN) !== -1;
      const hasBlue = rawCode.indexOf(this.BLUE) !== -1;

      if (!hasRed && !hasGreen && !hasBlue) {
        return '';
      }

      let code = '\n# Inicializar LEDs (desligar todos)\n';
      if (hasRed) code += `${this.RED}.duty_u16(0)\n`;
      if (hasGreen) code += `${this.GREEN}.duty_u16(0)\n`;
      if (hasBlue) code += `${this.BLUE}.duty_u16(0)\n`;

      return code;
    },

    RED: 'led_vermelho',
    GREEN: 'led_verde',
    BLUE: 'led_azul'
  },

  // Loop configuration
  LOOP: {
    // Courtesy delay to prevent CPU overload (milliseconds)
    DELAY_MS: 50,
    // Generate courtesy delay code
    getDelayCode: function() {
      return `  time.sleep_ms(${this.DELAY_MS})  # Pausa de cortesia\n`;
    }
  },

  // Code structure markers
  MARKERS: {
    LOOP_START: '# LOOP_BLOCK_START',
    LOOP_END: '# LOOP_BLOCK_END',
    SOUND_START: '# SOUND_BLOCK_START',
    SOUND_END: '# SOUND_BLOCK_END',
    STATIC_CONFIG: 'CONFIGURACAO_FIXA'
  },

  // Setup detection patterns
  SETUP_PATTERNS: {
    isSetupLine: function(line) {
      return line.indexOf(' = Pin(') !== -1 ||
             line.indexOf('=Pin(') !== -1 ||
             line.indexOf(' = PWM(') !== -1 ||
             line.indexOf('=PWM(') !== -1 ||
             line.startsWith('LED_MATRIX = ') ||
             line.startsWith('np = neopixel');
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig;
}
