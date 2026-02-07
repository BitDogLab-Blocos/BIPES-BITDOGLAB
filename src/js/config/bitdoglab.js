// BitdogLab Hardware Configuration
// Device-specific pin mappings and code generation templates

'use strict';

const BitdogLabConfig = {
  // GPIO pin assignments for BitdogLab board
  PINS: {
    // RGB LED pins
    LED_RED: 13,
    LED_GREEN: 11,
    LED_BLUE: 12,

    // Sound
    BUZZER: 21,

    // Buttons (physical)
    BUTTON_A: 5,         // Left button
    BUTTON_B: 6,         // Right button
    BUTTON_C: 10,        // Center button

    // Joystick analog axes (ADC) + press button
    JOYSTICK_X: 27,      // VRx - ADC1
    JOYSTICK_Y: 26,      // VRy - ADC0
    JOYSTICK_SW: 22,     // SW button (press joystick)

    // LED Matrix (NeoPixel)
    NEOPIXEL: 7,

    // OLED Display (I2C)
    I2C_SCL: 3,  // I2C Clock
    I2C_SDA: 2   // I2C Data
  },

  // LED Matrix configuration
  NEOPIXEL: {
    PIN: 7,
    COUNT: 25,  // 5x5 matrix
    // LED Matrix mapping (row, column) to neopixel index
    // This maps physical position [row][col] to the LED number in the strip
    MATRIX: [
      [24, 23, 22, 21, 20],  // Row 0
      [15, 16, 17, 18, 19],  // Row 1
      [14, 13, 12, 11, 10],  // Row 2
      [5,  6,  7,  8,  9],   // Row 3
      [4,  3,  2,  1,  0]    // Row 4
    ]
  },

  // Joystick configuration (KY-023)
  JOYSTICK: {
    X_PIN: 27,            // VRx analog axis
    Y_PIN: 26,            // VRy analog axis
    SW_PIN: 22,           // SW button
    CENTER_VALUE: 32768,  // Resting center value
    DEADZONE: 5000        // Dead zone to avoid drift
  },

  // OLED Display configuration
  DISPLAY: {
    I2C_BUS: 1,        // I2C bus number
    SCL_PIN: 3,        // Clock pin
    SDA_PIN: 2,        // Data pin
    I2C_FREQ: 400000,  // I2C frequency (400kHz)
    WIDTH: 128,        // Display width in pixels
    HEIGHT: 64         // Display height in pixels
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
    SETUP_START: '# SETUP_BLOCK_START', // Setup block start marker
    SETUP_END: '# SETUP_BLOCK_END', // Setup block end marker
    STATIC_CONFIG: 'CONFIGURACAO_FIXA' // Static LED configuration marker
  },
  // Pattern matching for setup/initialization detection
  SETUP_PATTERNS: {
    // Check if line is hardware setup (Pin/PWM/LED_MATRIX/neopixel init)
    isSetupLine: function(line) {
      // Ignore lines that start with whitespace (they are inside blocks)
      if (line.startsWith(' ') || line.startsWith('\t')) {
        return false;
      }
      return line.indexOf(' = Pin(') !== -1 || // Pin initialization with spaces
             line.indexOf('=Pin(') !== -1 || // Pin initialization without spaces
             line.indexOf(' = PWM(') !== -1 || // PWM initialization with spaces
             line.indexOf('=PWM(') !== -1 || // PWM initialization without spaces
             line.indexOf(' = I2C(') !== -1 || // I2C initialization with spaces
             line.indexOf('=I2C(') !== -1 || // I2C initialization without spaces
             line.indexOf(' = SSD1306_I2C(') !== -1 || // OLED display initialization with spaces
             line.indexOf('=SSD1306_I2C(') !== -1 || // OLED display initialization without spaces
             line.startsWith('LED_MATRIX = ') || // LED matrix setup
             line.startsWith('np = neopixel') || // Neopixel setup
             line.startsWith('EMOJIS_5X5 = ') || // Emoji patterns dictionary
             line.startsWith('NUMEROS_5X5 = ') || // Number patterns dictionary
             line.startsWith('_contador_repeticao = ') || // Repetition counter
             (line.startsWith('_crono_') && (line.endsWith(' = 0') || line.endsWith(' = False'))) || // Cronometro initialization only (exact match)
             (line.startsWith('estado_anterior_botao_') && line.endsWith(' = 1')) || // Button state initialization only (exact match)
             line.startsWith('flag_botao_') || // IRQ button flags
             line.startsWith('last_time_') || // IRQ button debounce timestamps
             line.startsWith('def callback_') || // IRQ callback functions
             line.startsWith('def _btn_') || // Button handler functions
             line.startsWith('_btn_a_count') || // Button A counter variable
             line.startsWith('_btn_b_count') || // Button B counter variable
             line.startsWith('_btn_c_count') || // Button C counter variable
             line.startsWith('_btn_a_last_time') || // Button A last time variable
             line.startsWith('_btn_b_last_time') || // Button B last time variable
             line.startsWith('_btn_c_last_time') || // Button C last time variable
             line.startsWith('_debounce_ms') || // Debounce milliseconds variable
             line.indexOf('.irq(trigger=') !== -1 || // IRQ configuration
             line.indexOf(' = ADC(') !== -1 || // ADC initialization
             line.startsWith('joystick_') || // Joystick variables
             line.startsWith('botao_joy') || // Joystick button
             line.startsWith('_joy_') // Joystick helper variables
    }
  },

  // Code generation helpers - Generate MicroPython code using the config
  CODE_GEN: {
    // Generate NeoPixel setup code
    getNeopixelSetup: function() {
      const cfg = BitdogLabConfig.NEOPIXEL;
      return `np = neopixel.NeoPixel(Pin(${cfg.PIN}), ${cfg.COUNT})  # Pin ${cfg.PIN}, ${cfg.COUNT} LEDs`;
    },

    // Generate LED Matrix definition
    getLedMatrixDefinition: function() {
      const matrix = BitdogLabConfig.NEOPIXEL.MATRIX;
      return `LED_MATRIX = ${JSON.stringify(matrix)}`;
    },

    // Generate RGB LED setup code
    getRGBLedSetup: function() {
      const pins = BitdogLabConfig.PINS;
      return {
        red: `led_vermelho = PWM(Pin(${pins.LED_RED}), freq=1000)`,
        green: `led_verde = PWM(Pin(${pins.LED_GREEN}), freq=1000)`,
        blue: `led_azul = PWM(Pin(${pins.LED_BLUE}), freq=1000)`
      };
    },

    // Generate Joystick ADC setup code
    getJoystickSetup: function() {
      const joy = BitdogLabConfig.JOYSTICK;
      return `joystick_x = ADC(Pin(${joy.X_PIN}))\njoystick_y = ADC(Pin(${joy.Y_PIN}))\nbotao_joy = Pin(${joy.SW_PIN}, Pin.IN, Pin.PULL_UP)`;
    },

    // Generate OLED Display I2C setup code
    getDisplaySetup: function() {
      const disp = BitdogLabConfig.DISPLAY;
      return `i2c = I2C(${disp.I2C_BUS}, scl=Pin(${disp.SCL_PIN}), sda=Pin(${disp.SDA_PIN}), freq=${disp.I2C_FREQ})\noled = SSD1306_I2C(${disp.WIDTH}, ${disp.HEIGHT}, i2c)`;
    }
  }
};
// CommonJS export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitdogLabConfig;
}