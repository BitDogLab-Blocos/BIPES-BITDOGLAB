// Global variable to control if the instruction message has been shown
var matrixAnimationTipShown = false;

// Function to show the matrix animation tip (only once)
function showMatrixAnimationTip() {
  if (!matrixAnimationTipShown) {
    matrixAnimationTipShown = true;
    setTimeout(function() {
      alert("💡 Tip: Place a Matrix LED block (like 'Show emoji' or 'Show number') inside this animation block!");
    }, 100);
  }
}

// ==========================================
// Category: Mathematics
// ==========================================

// Mathematical function block for single operations like square root, absolute value, etc.
Blockly.Blocks['math_single'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["Square root (√)", "ROOT"],
            ["Absolute value (always positive)", "ABS"],
            ["Natural logarithm (ln)", "LN"],
            ["Base 10 logarithm (log10)", "LOG10"],
            ["Exponential (e^)", "EXP"],
            ["Power of 10 (10^)", "POW10"]
        ]), "OP", function(option) {
          this.getSourceBlock().updateShape_(option);
        });
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Applies a mathematical function to a number");
    this.setHelpUrl("%{BKY_MATH_SINGLE_HELPURL}");
  }
};

// Trigonometric function block for operations like sine, cosine, etc.
Blockly.Blocks['math_trig'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Trigonometry")
        .appendField(new Blockly.FieldDropdown([
            ["Sine (sin)", "SIN"],
            ["Cosine (cos)", "COS"],
            ["Tangent (tan)", "TAN"],
            ["Arc sine (asin)", "ASIN"],
            ["Arc cosine (acos)", "ACOS"],
            ["Arc tangent (atan)", "ATAN"]
        ]), "OP");
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Applies a trigonometric function to an angle");
    this.setHelpUrl("%{BKY_MATH_TRIG_HELPURL}");
  }
};

// Mathematical constants block for values like Pi, Euler's number, etc.
Blockly.Blocks['math_constant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Constants")
        .appendField(new Blockly.FieldDropdown([
            ["Pi (π)", "PI"],
            ["Euler (e)", "E"],
            ["Phi - Golden ratio (φ)", "GOLDEN_RATIO"],
            ["Square root of 2 (√2)", "SQRT2"],
            ["Square root of half (√½)", "SQRT1_2"],
            ["Infinity (∞)", "INFINITY"]
        ]), "CONSTANT");
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Returns an important mathematical constant");
    this.setHelpUrl("%{BKY_MATH_CONSTANT_HELPURL}");
  }
};

// Number property check block for testing if a number is even, odd, positive, or negative
Blockly.Blocks['math_number_property'] = {
  init: function() {
    this.appendValueInput("NUMBER_TO_CHECK")
        .setCheck("Number")
        .appendField("Check if number");
    this.appendDummyInput()
        .appendField("is")
        .appendField(new Blockly.FieldDropdown([
            ["even", "EVEN"],
            ["odd", "ODD"],
            ["positive", "POSITIVE"],
            ["negative", "NEGATIVE"]
        ]), "PROPERTY");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Checks if a number has the selected property (even, odd, positive or negative). Returns true or false.");
    this.setHelpUrl("");
  }
};

// Divisibility check block to test if one number is divisible by another
Blockly.Blocks['math_is_divisible_by'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number")
        .appendField("Number");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("is divisible by");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Checks if the first number can be divided by the second without leaving a remainder.");
    this.setHelpUrl("");
  }
};

// Decimal rounding block to round numbers to specified decimal places
Blockly.Blocks['math_round_to_decimal'] = {
  init: function() {
    this.appendValueInput("NUMBER_TO_ROUND")
        .setCheck("Number")
        .appendField("Round");
    this.appendDummyInput()
        .appendField("to")
        .appendField(new Blockly.FieldNumber(2, 0), "DECIMAL_PLACES")
        .appendField("decimal places");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Rounds a number to the specified number of decimal places.");
    this.setHelpUrl("");
  }
};

// List operations block for performing calculations on lists of numbers
Blockly.Blocks['math_on_list'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("Calculate")
        .appendField(new Blockly.FieldDropdown([
            ["Sum", "SUM"],
            ["Smallest number", "MIN"], 
            ["Largest number", "MAX"],
            ["Average", "AVERAGE"],
            ["A random item", "RANDOM"]
        ]), "OP", function(option) {
          this.getSourceBlock().updateShape_(option);
        })
        .appendField("of list");
    this.setOutput(true);
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip("Performs simple operations with lists of numbers.");
    this.setHelpUrl("");
  },
  
  updateShape_: function(option) {
    // Add dice icon for random option
    var iconField = this.getField('DICE_ICON');
    if (option === 'RANDOM') {
      if (!iconField) {
        this.getInput('LIST').insertFieldAt(3, new Blockly.FieldImage(svg_dice_icon, 15, 15, "*"), 'DICE_ICON');
      }
    } else {
      if (iconField) {
        this.getInput('LIST').removeField('DICE_ICON');
      }
    }
  }
};

// Random float generator block for generating random decimal numbers
Blockly.Blocks['math_random_float'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Random decimal between");
    this.appendValueInput("FROM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("and");
    this.appendValueInput("TO")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("%{BKY_MATH_HUE}");
    this.setTooltip(Blockly.Msg["MATH_RANDOM_FLOAT_TOOLTIP"]);
    this.setHelpUrl(Blockly.Msg["MATH_RANDOM_FLOAT_HELPURL"]);
  }
};

// ==========================================
// Category: Text
// ==========================================

// Text substring block for extracting a portion of text
Blockly.Blocks['text_getSubstring'] = {
  init: function() {
    // Start position dropdown options
    this.WHERE_OPTIONS_1 = [
        ["First letter", "FIRST"],
        ["Letter #", "FROM_START"]
    ];

    // End position dropdown options
    this.WHERE_OPTIONS_2 = [
        ["Last letter", "LAST"],
        ["Letter #", "FROM_START"]
    ];

    this.setHelpUrl("%{BKY_TEXT_GET_SUBSTRING_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");

    // Main text input
    this.appendValueInput("STRING")
        .setCheck("String")
        .appendField("In text");


    // "FROM" section will be added by updateAt_
    this.appendDummyInput("AT1");

    // "TO" section will be added by updateAt_
    this.appendDummyInput("AT2");

    // Optional tail
    if ("%{BKY_TEXT_GET_SUBSTRING_TAIL}") {
      this.appendDummyInput("TAIL")
          .appendField("%{BKY_TEXT_GET_SUBSTRING_TAIL}");
    }
    
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.updateAt_(1, false); // Initialize first dropdown
    this.updateAt_(2, false); // Initialize second dropdown
    this.setTooltip("Gets a piece of text, from one position to another position.");
  },

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement("mutation");
    var isAt1 = this.getInput("AT1").type == Blockly.INPUT_VALUE;
    container.setAttribute("at1", isAt1);
    var isAt2 = this.getInput("AT2").type == Blockly.INPUT_VALUE;
    container.setAttribute("at2", isAt2);
    return container;
  },

  domToMutation: function(xmlElement) {
    var isAt1 = ("true" == xmlElement.getAttribute("at1"));
    var isAt2 = ("true" == xmlElement.getAttribute("at2"));
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },

  updateAt_: function(n, isAt) {
    // Remove existing input
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);

    // Define descriptive text for each position
    var descriptiveText = (n == 1) ? "get piece from" : "to";


    if (isAt) {
      // Add value input for number
      this.appendValueInput("AT" + n)
          .setCheck("Number")
          .appendField(descriptiveText);
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      // Add dummy input with dropdown
      this.appendDummyInput("AT" + n)
          .appendField(descriptiveText);
    }

    // Add appropriate dropdown
    var options = this["WHERE_OPTIONS_" + n];
    var dropdown = new Blockly.FieldDropdown(options, function(value) {
      var newAt = (value == "FROM_START");
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(n, newAt);
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
    });
    
    this.getInput("AT" + n).appendField(dropdown, "WHERE" + n);
    
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
  }
};

// Text case change block for converting text to uppercase or lowercase
Blockly.Blocks['text_changeCase'] = {
  init: function() {
    // Simplified case change options
    var options = [
        ["UPPERCASE", "UPPERCASE"],
        ["lowercase", "LOWERCASE"]
    ];

    this.setHelpUrl("%{BKY_TEXT_CHANGECASE_HELPURL}");
    this.setStyle("text_blocks");
    this.setColour("%{BKY_TEXTS_HUE}");

    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Transform text");
    
    this.appendDummyInput()
        .appendField("to")
        .appendField(new Blockly.FieldDropdown(options), "CASE");
    
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setTooltip("%{BKY_TEXT_CHANGECASE_TOOLTIP}");
  }
};

// Text print block for sending messages to the console
Blockly.Blocks['text_print'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("Send message");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_TEXTS_HUE}");
    this.setTooltip("Sends any text, number or variable value to the 'Messages' tab. It's the best way to see what your program is doing!");
    this.setHelpUrl("%{BKY_TEXT_PRINT_HELPURL}");
  }
};

// Multiple text print block for joining and sending multiple values
Blockly.Blocks['text_print_multiple'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['text_create_join_item']));
    this.setTooltip("Sends a message joining text and variables. Click the gear to add more items.");
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('text_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('text_create_join_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField("Send message");
    }

    // Add new inputs
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        if (i == 0) {
          this.appendValueInput('ADD' + i)
              .appendField("Send message with");
        } else {
          this.appendValueInput('ADD' + i);
        }
      }
    }

    // Remove excess inputs
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

// Container block for text join mutator
Blockly.Blocks['text_create_join_container'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("join");
    this.appendStatementInput('STACK');
    this.setTooltip("Add, remove, or reorder sections to reconfigure this block.");
    this.contextMenu = false;
  }
};

// Item block for text join mutator
Blockly.Blocks['text_create_join_item'] = {
  init: function() {
    this.setColour("%{BKY_TEXTS_HUE}");
    this.appendDummyInput()
        .appendField("item");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add an item to join.");
    this.contextMenu = false;
  }
};

// ==========================================
// Category: Time
// ==========================================

// Wait seconds block for pausing execution
Blockly.Blocks['esperar_segundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Wait");
    this.appendDummyInput()
        .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pauses execution for a number of seconds");
    this.setHelpUrl("");
  }
};

// Wait milliseconds block for short pauses
Blockly.Blocks['esperar_milisegundos'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck(["Number", "Time"])
        .appendField("⏱️ Wait");
    this.appendDummyInput()
        .appendField("milliseconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("Pauses execution for a number of milliseconds");
    this.setHelpUrl("");
  }
};

// Time value block for seconds
Blockly.Blocks['tempo_segundos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("seconds");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Returns a time value in seconds");
    this.setHelpUrl("");
  }
};

// Time value block for milliseconds
Blockly.Blocks['tempo_milisegundos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(500, 0), "NUM")
        .appendField("milliseconds");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Returns a time value in milliseconds");
    this.setHelpUrl("");
  }
};

// Time value block for minutes
Blockly.Blocks['tempo_minutos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("minutes");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Returns a time value in minutes");
    this.setHelpUrl("");
  }
};

// Time value block for hours
Blockly.Blocks['tempo_horas'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️")
        .appendField(new Blockly.FieldNumber(1, 0), "NUM")
        .appendField("hours");
    this.setOutput(true, "Time");
    this.setColour(190);
    this.setTooltip("Returns a time value in hours");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Colors
// ==========================================

// Red color block
Blockly.Blocks['colour_red'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔴 Red");
    this.setOutput(true, "Colour");
    this.setColour(0);
    this.setTooltip("Red color");
    this.setHelpUrl("");
  }
};

// Green color block
Blockly.Blocks['colour_green'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟢 Green");
    this.setOutput(true, "Colour");
    this.setColour(120);
    this.setTooltip("Green color");
    this.setHelpUrl("");
  }
};

// Blue color block
Blockly.Blocks['colour_blue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔵 Blue");
    this.setOutput(true, "Colour");
    this.setColour(230);
    this.setTooltip("Blue color");
    this.setHelpUrl("");
  }
};

// Yellow color block
Blockly.Blocks['colour_yellow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟡 Yellow");
    this.setOutput(true, "Colour");
    this.setColour(60);
    this.setTooltip("Yellow color (red + green)");
    this.setHelpUrl("");
  }
};

// Cyan color block
Blockly.Blocks['colour_cyan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩵 Cyan");
    this.setOutput(true, "Colour");
    this.setColour(180);
    this.setTooltip("Cyan color (green + blue)");
    this.setHelpUrl("");
  }
};

// Magenta color block
Blockly.Blocks['colour_magenta'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩷 Magenta");
    this.setOutput(true, "Colour");
    this.setColour(300);
    this.setTooltip("Magenta color (red + blue)");
    this.setHelpUrl("");
  }
};

// White color block
Blockly.Blocks['colour_white'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚪ White");
    this.setOutput(true, "Colour");
    this.setColour("#707070"); // Dark gray for better contrast
    this.setTooltip("White color (all colors)");
    this.setHelpUrl("");
  }
};

// Orange color block
Blockly.Blocks['colour_orange'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🟠 Orange");
    this.setOutput(true, "Colour");
    this.setColour(30);
    this.setTooltip("Orange color (strong red + weak green)");
    this.setHelpUrl("");
  }
};

// Pink color block
Blockly.Blocks['colour_pink'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💗 Pink");
    this.setOutput(true, "Colour");
    this.setColour(330);
    this.setTooltip("Pink color (red + weak blue)");
    this.setHelpUrl("");
  }
};

// Lime color block
Blockly.Blocks['colour_lime'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💚 Lime");
    this.setOutput(true, "Colour");
    this.setColour(90);
    this.setTooltip("Lime color (strong green + weak red)");
    this.setHelpUrl("");
  }
};

// Sky blue color block
Blockly.Blocks['colour_skyblue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💙 Sky Blue");
    this.setOutput(true, "Colour");
    this.setColour(200);
    this.setTooltip("Sky blue color (strong blue + weak green)");
    this.setHelpUrl("");
  }
};

// Turquoise color block
Blockly.Blocks['colour_turquoise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🩵 Turquoise");
    this.setOutput(true, "Colour");
    this.setColour(165);
    this.setTooltip("Turquoise color (green + medium blue)");
    this.setHelpUrl("");
  }
};

// Container block for color mix mutator
Blockly.Blocks['mix_colours_container'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("mix");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove colors to mix.");
    this.contextMenu = false;
  }
};

// Item block for color mix mutator
Blockly.Blocks['mix_colours_item'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("color");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a color to the mix.");
    this.contextMenu = false;
  }
};

// Color mix block for combining multiple colors
Blockly.Blocks['mix_colours'] = {
  init: function() {
    this.setColour("#A65C99");
    this.appendDummyInput()
        .appendField("🎨 Mix");
    this.appendValueInput('ADD0')
        .setCheck("Colour");
    this.appendValueInput('ADD1')
        .setCheck("Colour");
    this.setOutput(true, "Colour");
    this.setMutator(new Blockly.Mutator(['mix_colours_item']));
    this.setTooltip("Mixes multiple LED colors");
    this.itemCount_ = 2;
  },

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('mix_colours_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('mix_colours_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    if (this.itemCount_ && this.getInput('ADD0')) {
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i)
              .setCheck("Colour");
        }
      }
    } else if (!this.itemCount_) {
      this.itemCount_ = 2;
    }
    while (this.getInput('ADD' + this.itemCount_)) {
      this.removeInput('ADD' + this.itemCount_);
      this.itemCount_++;
    }
  }
};

// ==========================================
// Category: LEDs
// ==========================================

// Turn on LED block
Blockly.Blocks['bloco_ligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💡 Turn on LED of color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Turns on the LED of the selected color");
    this.setHelpUrl("");
  }
};

// Turn off LED block
Blockly.Blocks['bloco_desligar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔦 Turn off LED of color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Turns off the LED of the selected color");
    this.setHelpUrl("");
  }
};

// Turn off all LEDs block
Blockly.Blocks['bloco_desligar_todos_leds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔦 Turn off all LEDs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Turns off all LEDs");
    this.setHelpUrl("");
  }
};

// Turn on LED with brightness block
Blockly.Blocks['bloco_acender_led_brilho'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🔆 Turn on LED of color");
    this.appendDummyInput()
        .appendField("with brightness of")
        .appendField(new Blockly.FieldNumber(100, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Turns on the LED with the brightness you choose, from 0% to 100%");
    this.setHelpUrl("");
  }
};

// Blink LED quickly block
Blockly.Blocks['bloco_piscar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("⚡ Blink LED of color");
    this.appendDummyInput()
        .appendField("quickly");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Blinks the LED quickly (200ms on, 200ms off)");
    this.setHelpUrl("");
  }
};

// Blink LED slowly block
Blockly.Blocks['piscar_led_lento'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🐌 Blink LED of color");
    this.appendDummyInput()
        .appendField("slowly");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Blinks the LED slowly (1s on, 1s off)");
    this.setHelpUrl("");
  }
};

// Heartbeat LED animation block
Blockly.Blocks['bloco_animar_led_coracao'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("💓 Animate LED of color");
    this.appendDummyInput()
        .appendField("heartbeat");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Simulates a heartbeat with two quick pulses");
    this.setHelpUrl("");
  }
};

// SOS signal LED block
Blockly.Blocks['bloco_sinalizar_led_sos'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("🆘 Signal LED of color");
    this.appendDummyInput()
        .appendField("help (SOS)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Emits the help signal S.O.S. in Morse code (... --- ...)");
    this.setHelpUrl("");
  }
};

// Fade LED animation block
Blockly.Blocks['bloco_animar_led_brilhar'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("✨ Animate LED of color");
    this.appendDummyInput()
        .appendField("shine and disappear");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Fade-in and fade-out effect with the selected color");
    this.setHelpUrl("");
  }
};

// Container block for LED alternate mutator
Blockly.Blocks['bloco_alternar_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("alternate");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove colors to alternate.");
    this.contextMenu = false;
  }
};

// Item block for LED alternate mutator
Blockly.Blocks['bloco_alternar_led_item'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("color");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a color to the alternation.");
    this.contextMenu = false;
  }
};

// Alternate LED colors block
Blockly.Blocks['bloco_alternar_led'] = {
  init: function() {
    this.setColour(45);
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_alternar_led_item']));
    this.setTooltip("Alternates between multiple LED colors. Use the gear to add more colors!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('bloco_alternar_led_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('bloco_alternar_led_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('COLOUR' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'COLOUR' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('COLOUR' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove all existing color inputs
    var i = 0;
    while (this.getInput('COLOUR' + i)) {
      this.removeInput('COLOUR' + i);
      i++;
    }

    // Add color inputs
    for (var i = 0; i < this.itemCount_; i++) {
      if (i == 0) {
        this.appendValueInput('COLOUR' + i)
            .setCheck("Colour")
            .appendField("🔄 Alternate LED of color");
      } else {
        this.appendValueInput('COLOUR' + i)
            .setCheck("Colour")
            .appendField("with color");
      }
    }
  }
};

// LED color transition block
Blockly.Blocks['bloco_transicao_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("🌈 Transition LED from color");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("to color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Makes a smooth transition between two colors using PWM");
    this.setHelpUrl("");
  }
};

// LED color battle block
Blockly.Blocks['bloco_batalhar_led'] = {
  init: function() {
    this.appendValueInput("COLOUR1")
        .setCheck("Colour")
        .appendField("⚔️ Battle LED of color");
    this.appendValueInput("COLOUR2")
        .setCheck("Colour")
        .appendField("with color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Creates a battle effect between two colors");
    this.setHelpUrl("");
  }
};

// Container block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_container'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("animation");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove animation steps.");
    this.contextMenu = false;
  }
};

// Action item block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_action'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("action");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add an action (turn on/off LED).");
    this.contextMenu = false;
  }
};

// Wait item block for LED animation mutator
Blockly.Blocks['bloco_criar_animacao_led_wait'] = {
  init: function() {
    this.setColour(45);
    this.appendDummyInput()
        .appendField("time");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a time (stay like this for...).");
    this.contextMenu = false;
  }
};

// Create LED animation block
Blockly.Blocks['bloco_criar_animacao_led'] = {
  init: function() {
    this.setColour(45);
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['bloco_criar_animacao_led_action', 'bloco_criar_animacao_led_wait']));
    this.setTooltip("Creates a custom LED animation. Use the gear to add more actions and waits!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('steps', JSON.stringify(this.steps_));
    return container;
  },

  domToMutation: function(xmlElement) {
    var stepsStr = xmlElement.getAttribute('steps');
    this.steps_ = stepsStr ? JSON.parse(stepsStr) : [];
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('bloco_criar_animacao_led_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.steps_.length; i++) {
      var blockType = this.steps_[i] === 'action' ? 'bloco_criar_animacao_led_action' : 'bloco_criar_animacao_led_wait';
      var itemBlock = workspace.newBlock(blockType);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var newSteps = [];
    var connections = [];

    // Collect types and connections
    while (itemBlock) {
      if (itemBlock.type === 'bloco_criar_animacao_led_action') {
        newSteps.push('action');
        connections.push(itemBlock.stepConnection_);
      } else if (itemBlock.type === 'bloco_criar_animacao_led_wait') {
        newSteps.push('wait');
        connections.push(itemBlock.stepConnection_);
      }
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }

    // Disconnect old connections
    for (var i = 0; i < this.steps_.length; i++) {
      var input = this.getInput('STEP' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
    }

    this.steps_ = newSteps;
    this.updateShape_();

    // Reconnect blocks
    for (var i = 0; i < this.steps_.length; i++) {
      if (connections[i]) {
        Blockly.Mutator.reconnect(connections[i], this, 'STEP' + i);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('STEP' + i);
      itemBlock.stepConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('STEP' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('STEP' + i)) this.removeInput('STEP' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    // Add step inputs
    if (this.steps_.length === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎬 Create LED Animation");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.steps_.length; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎬 Create LED Animation");
        }

        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
              .setCheck(null)
              .appendField('What to do:');
        } else {
          this.appendValueInput('STEP' + i)
              .setCheck("Time")
              .appendField('Stay like this for:');
        }
      }
    }
  }
};

// ==========================================
// Category: LED Matrix
// ==========================================

// Fill LED matrix block
Blockly.Blocks['preencher_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Turn on LED matrix of color");
    this.appendValueInput("COLOUR")
        .setCheck("Colour");
    this.appendDummyInput()
        .appendField("with brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Turns on the entire 5x5 LED matrix with the specified color and intensity");
    this.setHelpUrl("");
  }
};

// Turn off LED matrix block
Blockly.Blocks['desligar_matriz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Turn off LED matrix");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Turns off the entire 5x5 LED matrix");
    this.setHelpUrl("");
  }
};

// Turn on LED at position block
Blockly.Blocks['acender_led_posicao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Turn on LED at row")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA")
        .appendField("column")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("with color");
    this.appendDummyInput()
        .appendField("and brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Turns on a specific LED in the 5x5 matrix (row: 0-4, column: 0-4)");
    this.setHelpUrl("");
  }
};

// Turn on row block
Blockly.Blocks['acender_linha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Turn on row")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "LINHA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("with color");
    this.appendDummyInput()
        .appendField("and brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Turns on a complete horizontal row in the 5x5 matrix (row: 0-4)");
    this.setHelpUrl("");
  }
};

// Turn on column block
Blockly.Blocks['acender_coluna'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔲 Turn on column")
        .appendField(new Blockly.FieldNumber(0, 0, 4), "COLUNA");
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField("with color");
    this.appendDummyInput()
        .appendField("and brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "INTENSITY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Turns on a complete vertical column in the 5x5 matrix (column: 0-4)");
    this.setHelpUrl("");
  }
};

// Show number on matrix block
Blockly.Blocks['mostrar_numero_matriz'] = {
  init: function() {
    this.appendValueInput("NUMERO")
        .setCheck("MatrixNumber")
        .appendField("🔢 Show number");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("with color");
    this.appendDummyInput()
        .appendField("and brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "BRILHO")
        .appendField("%");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Shows a number on the 5x5 LED matrix with specified color and brightness");
    this.setHelpUrl("");
  }
};

// Show emoji on matrix block
Blockly.Blocks['mostrar_emoji'] = {
  init: function() {
    this.appendValueInput("EMOJI")
        .setCheck("MatrixEmoji")
        .appendField("😊 Show emoji");
    this.appendValueInput("COR")
        .setCheck("Colour")
        .appendField("with color");
    this.appendDummyInput()
        .appendField("and brightness of")
        .appendField(new Blockly.FieldNumber(30, 0, 100), "BRILHO")
        .appendField("%");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4a69bd");
    this.setTooltip("Shows an emoji on the 5x5 LED matrix with specified color and brightness");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Matrix Numbers
// ==========================================

// Number 0 block for matrix display
Blockly.Blocks['numero_matriz_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("0️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 0");
    this.setHelpUrl("");
  }
};

// Number 1 block for matrix display
Blockly.Blocks['numero_matriz_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("1️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 1");
    this.setHelpUrl("");
  }
};

// Number 2 block for matrix display
Blockly.Blocks['numero_matriz_2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("2️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 2");
    this.setHelpUrl("");
  }
};

// Number 3 block for matrix display
Blockly.Blocks['numero_matriz_3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("3️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 3");
    this.setHelpUrl("");
  }
};

// Number 4 block for matrix display
Blockly.Blocks['numero_matriz_4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("4️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 4");
    this.setHelpUrl("");
  }
};

// Number 5 block for matrix display
Blockly.Blocks['numero_matriz_5'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("5️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 5");
    this.setHelpUrl("");
  }
};

// Number 6 block for matrix display
Blockly.Blocks['numero_matriz_6'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("6️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 6");
    this.setHelpUrl("");
  }
};

// Number 7 block for matrix display
Blockly.Blocks['numero_matriz_7'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("7️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 7");
    this.setHelpUrl("");
  }
};

// Number 8 block for matrix display
Blockly.Blocks['numero_matriz_8'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("8️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 8");
    this.setHelpUrl("");
  }
};

// Number 9 block for matrix display
Blockly.Blocks['numero_matriz_9'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("9️⃣");
    this.setOutput(true, "MatrixNumber");
    this.setColour("#55a855");
    this.setTooltip("Number 9");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Matrix Emojis
// ==========================================

// Happy face emoji block for matrix display
Blockly.Blocks['emoji_rosto_feliz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😊 Happy Face");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Happy face emoji");
    this.setHelpUrl("");
  }
};

// Sad face emoji block for matrix display
Blockly.Blocks['emoji_rosto_triste'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😢 Sad Face");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Sad face emoji");
    this.setHelpUrl("");
  }
};

// Surprised face emoji block for matrix display
Blockly.Blocks['emoji_rosto_surpreso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("😮 Surprised Face");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Surprised face emoji");
    this.setHelpUrl("");
  }
};

// Heart emoji block for matrix display
Blockly.Blocks['emoji_coracao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❤️ Heart");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Heart emoji");
    this.setHelpUrl("");
  }
};

// Up arrow emoji block for matrix display
Blockly.Blocks['emoji_seta_cima'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬆️ Up Arrow");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Up arrow emoji");
    this.setHelpUrl("");
  }
};

// Down arrow emoji block for matrix display
Blockly.Blocks['emoji_seta_baixo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬇️ Down Arrow");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Down arrow emoji");
    this.setHelpUrl("");
  }
};

// Sun emoji block for matrix display
Blockly.Blocks['emoji_sol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("☀️ Sun");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Sun emoji");
    this.setHelpUrl("");
  }
};

// Rain emoji block for matrix display
Blockly.Blocks['emoji_chuva'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌧️ Rain");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Rain emoji");
    this.setHelpUrl("");
  }
};

// Flower emoji block for matrix display
Blockly.Blocks['emoji_flor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🌸 Flower");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Flower emoji");
    this.setHelpUrl("");
  }
};

// Ghost emoji block for matrix display
Blockly.Blocks['emoji_fantasma'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👻 Ghost");
    this.setOutput(true, "MatrixEmoji");
    this.setColour("#FF8C00");
    this.setTooltip("Ghost emoji");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Musical Notes
// ==========================================

// Do note block for musical notes
Blockly.Blocks['nota_do'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎵 Do");
    this.setOutput(true, "Note");
    this.setColour("#EA2027");
    this.setTooltip("Do note");
    this.setHelpUrl("");
  }
};

// Re note block for musical notes
Blockly.Blocks['nota_re'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👑 Re");
    this.setOutput(true, "Note");
    this.setColour("#EE5A24");
    this.setTooltip("Re note");
    this.setHelpUrl("");
  }
};

// Mi note block for musical notes
Blockly.Blocks['nota_mi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐱 Mi");
    this.setOutput(true, "Note");
    this.setColour("#FFC312");
    this.setTooltip("Mi note");
    this.setHelpUrl("");
  }
};

// Fa note block for musical notes
Blockly.Blocks['nota_fa'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🧚‍♀️ Fa");
    this.setOutput(true, "Note");
    this.setColour("#C4E538");
    this.setTooltip("Fa note");
    this.setHelpUrl("");
  }
};

// Sol note block for musical notes
Blockly.Blocks['nota_sol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("☀️ Sol");
    this.setOutput(true, "Note");
    this.setColour("#12CBC4");
    this.setTooltip("Sol note");
    this.setHelpUrl("");
  }
};

// La note block for musical notes
Blockly.Blocks['nota_la'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ La");
    this.setOutput(true, "Note");
    this.setColour("#833471");
    this.setTooltip("La note");
    this.setHelpUrl("");
  }
};

// Si note block for musical notes
Blockly.Blocks['nota_si'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("👍 Si");
    this.setOutput(true, "Note");
    this.setColour("#FD7272");
    this.setTooltip("Si note");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Sound
// ==========================================

// Play musical note block
Blockly.Blocks['tocar_nota'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎵 Play note");
    this.appendValueInput("NOTA")
        .setCheck("Note");
    this.appendDummyInput()
        .appendField("in octave")
        .appendField(new Blockly.FieldDropdown([
            ["4", "4"],
            ["5", "5"],
            ["6", "6"]
        ]), "OCTAVE")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a musical note on the buzzer (GPIO21)");
    this.setHelpUrl("");
  }
};

// Play high sound block
Blockly.Blocks['tocar_som_agudo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔔 Play high sound")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a high test sound (1000 Hz for 0.5s)");
    this.setHelpUrl("");
  }
};

// Stop sound block
Blockly.Blocks['parar_som'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔇 Stop sound");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Stops the buzzer sound");
    this.setHelpUrl("");
  }
};

// Play repeatedly block
Blockly.Blocks['tocar_repetidamente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔁 Play repeatedly");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays the sounds inside this block repeatedly in an infinite loop");
    this.setHelpUrl("");
  }
};

// Short beep block
Blockly.Blocks['bipe_curto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Short Beep")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a short beep");
    this.setHelpUrl("");
  }
};

// Double beep block
Blockly.Blocks['bipe_duplo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📌 Double Beep")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays two quick beeps");
    this.setHelpUrl("");
  }
};

// Intermittent alert block
Blockly.Blocks['alerta_intermitente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚨 Intermittent Alert")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays an intermittent alert");
    this.setHelpUrl("");
  }
};

// Call sound block
Blockly.Blocks['chamada'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📞 Call")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a call sound");
    this.setHelpUrl("");
  }
};

// Coin sound block
Blockly.Blocks['som_de_moeda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪙 Coin Sound")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a coin sound");
    this.setHelpUrl("");
  }
};

// Success sound block
Blockly.Blocks['som_de_sucesso'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✅ Success Sound")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a success sound with ascending notes");
    this.setHelpUrl("");
  }
};

// Failure sound block
Blockly.Blocks['som_de_falha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("❌ Failure Sound")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a failure sound with descending notes");
    this.setHelpUrl("");
  }
};

// Laser sound block
Blockly.Blocks['som_de_laser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔫 Laser Sound")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a laser sound");
    this.setHelpUrl("");
  }
};

// Police siren block
Blockly.Blocks['sirene_policial'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🚓 Police Siren")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a police siren");
    this.setHelpUrl("");
  }
};

// Ascending musical scale block
Blockly.Blocks['escala_musical_sobe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📈 Ascending Musical Scale")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays an ascending musical scale");
    this.setHelpUrl("");
  }
};

// Descending musical scale block
Blockly.Blocks['escala_musical_desce'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📉 Descending Musical Scale")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays a descending musical scale");
    this.setHelpUrl("");
  }
};

// Twinkle Twinkle Little Star melody block
Blockly.Blocks['brilha_brilha_estrelinha'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⭐ Twinkle Twinkle Little Star")
        .appendField("with volume of")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "VOLUME")
        .appendField("%");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9a5ba5");
    this.setTooltip("Plays the Twinkle Twinkle Little Star melody");
    this.setHelpUrl("");
  }
};

// Container block for melody mutator
Blockly.Blocks['criar_melodia_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("melody");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove notes from the melody.");
    this.contextMenu = false;
  }
};

// Note step block for melody mutator
Blockly.Blocks['criar_melodia_note_step'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("note");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a note to the melody.");
    this.contextMenu = false;
  }
};

// Create melody block
Blockly.Blocks['criar_melodia'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.noteSteps_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_melodia_note_step']));
    this.setTooltip("Creates a custom melody. Use the gear to add more notes!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('note_steps', this.noteSteps_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.noteSteps_ = parseInt(xmlElement.getAttribute('note_steps'), 10) || 0;
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_melodia_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.noteSteps_; i++) {
      var itemBlock = workspace.newBlock('criar_melodia_note_step');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];

    // Collect existing connections
    while (itemBlock) {
      connections.push(itemBlock.noteConnection_);
      connections.push(itemBlock.timeConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    // Disconnect old connections
    for (var i = 0; i < this.noteSteps_; i++) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      if (noteInput) {
        var noteConn = noteInput.connection.targetConnection;
        if (noteConn && connections.indexOf(noteConn) == -1) {
          noteConn.disconnect();
        }
      }
      if (tempoInput) {
        var tempoConn = tempoInput.connection.targetConnection;
        if (tempoConn && connections.indexOf(tempoConn) == -1) {
          tempoConn.disconnect();
        }
      }
    }

    this.noteSteps_ = connections.length / 2;

    this.updateShape_();
    // Reconnect blocks
    for (var i = 0; i < this.noteSteps_; i++) {
      if (connections[i * 2]) {
        Blockly.Mutator.reconnect(connections[i * 2], this, 'NOTA' + i);
      }
      if (connections[i * 2 + 1]) {
        Blockly.Mutator.reconnect(connections[i * 2 + 1], this, 'TEMPO' + i);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var noteInput = this.getInput('NOTA' + i);
      var tempoInput = this.getInput('TEMPO' + i);
      itemBlock.noteConnection_ = noteInput && noteInput.connection.targetConnection;
      itemBlock.timeConnection_ = tempoInput && tempoInput.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('NOTA' + i) || this.getInput('TEMPO' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('NOTA' + i)) this.removeInput('NOTA' + i);
      if (this.getInput('TEMPO' + i)) this.removeInput('TEMPO' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    // Add inputs for each step
    if (this.noteSteps_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎼 Create Melody");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.noteSteps_; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎼 Create Melody");
        }

        this.appendValueInput('NOTA' + i)
            .setCheck("Note")
            .appendField((i + 1) + '. Play note:');

        this.appendValueInput('TEMPO' + i)
            .setCheck("Time")
            .appendField('   for:');
      }
    }
  }
};

// Container block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_container'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("soundtrack");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove soundtrack steps.");
    this.contextMenu = false;
  }
};

// Action block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_action'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("sound");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a sound action (play note, beep, melody, etc).");
    this.contextMenu = false;
  }
};

// Wait block for soundtrack mutator
Blockly.Blocks['criar_trilha_sonora_wait'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.appendDummyInput()
        .appendField("pause");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a pause (silence for a time).");
    this.contextMenu = false;
  }
};

// Create soundtrack block
Blockly.Blocks['criar_trilha_sonora'] = {
  init: function() {
    this.setColour("#9a5ba5");
    this.steps_ = ['action', 'wait'];
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_trilha_sonora_action', 'criar_trilha_sonora_wait']));
    this.setTooltip("Creates a custom soundtrack. Use the gear to add sounds and pauses!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('steps', JSON.stringify(this.steps_));
    return container;
  },

  domToMutation: function(xmlElement) {
    var stepsStr = xmlElement.getAttribute('steps');
    this.steps_ = stepsStr ? JSON.parse(stepsStr) : [];
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_trilha_sonora_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.steps_.length; i++) {
      var blockType = this.steps_[i] === 'action' ? 'criar_trilha_sonora_action' : 'criar_trilha_sonora_wait';
      var itemBlock = workspace.newBlock(blockType);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var newSteps = [];
    var connections = [];

    // Collect types and connections
    while (itemBlock) {
      if (itemBlock.type === 'criar_trilha_sonora_action') {
        newSteps.push('action');
        connections.push(itemBlock.stepConnection_);
      } else if (itemBlock.type === 'criar_trilha_sonora_wait') {
        newSteps.push('wait');
        connections.push(itemBlock.stepConnection_);
      }
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }

    // Disconnect old connections
    for (var i = 0; i < this.steps_.length; i++) {
      var input = this.getInput('STEP' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
    }

    this.steps_ = newSteps;
    this.updateShape_();

    // Reconnect blocks
    for (var i = 0; i < this.steps_.length; i++) {
      if (connections[i]) {
        Blockly.Mutator.reconnect(connections[i], this, 'STEP' + i);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('STEP' + i);
      itemBlock.stepConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('STEP' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('STEP' + i)) this.removeInput('STEP' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    // Add inputs for each step
    if (this.steps_.length === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎵 Create Soundtrack");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.steps_.length; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎵 Create Soundtrack");
        }

        if (this.steps_[i] === 'action') {
          this.appendStatementInput('STEP' + i)
              .setCheck(null)
              .appendField('🔊 Play:');
        } else {
          this.appendValueInput('STEP' + i)
              .setCheck("Time")
              .appendField('🔇 Pause for:');
        }
      }
    }
  }
};

// ==========================================
// Category: Matrix Animations
// ==========================================

// Fast blink animation block
Blockly.Blocks['matriz_piscar_rapido'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚡ Make Blink Fast");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block blink quickly on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Slow blink animation block
Blockly.Blocks['matriz_piscar_lento'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🐌 Make Blink Slowly");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block blink slowly on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Appear and disappear animation block
Blockly.Blocks['matriz_aparecer_sumir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("✨ Make Appear and Disappear");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block appear and disappear gradually");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Pulse brightness animation block
Blockly.Blocks['matriz_pulsar_brilho'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("💫 Make Pulse Brightness");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block pulse with brightness variation");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Slide up animation block
Blockly.Blocks['matriz_deslizar_cima'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬆️ Make Slide Up");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block slide up on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Slide left animation block
Blockly.Blocks['matriz_deslizar_esquerda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬅️ Make Slide Left");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block slide left on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Slide down animation block
Blockly.Blocks['matriz_deslizar_baixo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⬇️ Make Slide Down");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block slide down on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Slide right animation block
Blockly.Blocks['matriz_deslizar_direita'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("➡️ Make Slide Right");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block slide right on the matrix");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Swing animation block
Blockly.Blocks['matriz_balancar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Make Swing");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block swing from side to side");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Contraction animation block
Blockly.Blocks['matriz_contracao'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔻 Make Contraction");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Makes the content inside this block have a contraction effect");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// Flash animation block
Blockly.Blocks['matriz_dar_flash'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚡ Give a Color Flash");
    this.appendValueInput("COR")
        .setCheck("Colour");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#8e44ad");
    this.setTooltip("Displays the content inside this block and then gives a flash with the specified color");
    this.setHelpUrl("");

    // Shows the tip when the block is created in the workspace
    var self = this;
    setTimeout(function() {
      if (self.workspace) {
        showMatrixAnimationTip();
      }
    }, 200);
  }
};

// ==========================================
// Category: Buttons
// ==========================================

// While button pressed block
Blockly.Blocks['botao_enquanto_apertado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 While pressing button")
        .appendField(new Blockly.FieldDropdown([["🔴 A (Red)", "A"], ["🔵 B (Blue)", "B"], ["🟢 C (Green)", "C"]]), "BOTAO")
        .appendField("😊 do:");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("😕 When released:");
    this.appendStatementInput("ELSE")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5a24");
    this.setTooltip("🎈 While you hold the button, it does one thing. When you release it, it does another!");
    this.setHelpUrl("");
  }
};

// If button pressed block
Blockly.Blocks['botao_se_apertado'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎮 If button is pressed")
        .appendField(new Blockly.FieldDropdown([["🔴 A (Red)", "A"], ["🔵 B (Blue)", "B"], ["🟢 C (Green)", "C"]]), "BOTAO")
        .appendField("Action happens:");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5a24");
    this.setTooltip("😊 When you press the button, it happens once!");
    this.setHelpUrl("");
  }
};

// ==========================================
// Category: Matrix Drawing
// ==========================================

// Container block for matrix drawing mutator
Blockly.Blocks['criar_desenho_matriz_container'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.appendDummyInput()
        .appendField("drawing");
    this.appendStatementInput('STACK');
    this.setTooltip("Add or remove drawing blocks to create your image.");
    this.contextMenu = false;
  }
};

// Item block for matrix drawing mutator
Blockly.Blocks['criar_desenho_matriz_item'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.appendDummyInput()
        .appendField("drawing block");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add a drawing block (turn on LED, line, column, etc).");
    this.contextMenu = false;
  }
};

// Create drawing on matrix block
Blockly.Blocks['criar_desenho_na_matriz'] = {
  init: function() {
    this.setColour("#4a69bd");
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['criar_desenho_matriz_item']));
    this.setTooltip("🎨 Creates a drawing canvas for the LED matrix. Combine drawing blocks inside it!");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('criar_desenho_matriz_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('criar_desenho_matriz_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.drawingConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('DESENHO' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'DESENHO' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('DESENHO' + i);
      itemBlock.drawingConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Remove existing inputs
    var i = 0;
    while (this.getInput('DESENHO' + i) || this.getInput('LABEL' + i)) {
      if (this.getInput('DESENHO' + i)) this.removeInput('DESENHO' + i);
      if (this.getInput('LABEL' + i)) this.removeInput('LABEL' + i);
      i++;
    }
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    // Add drawing inputs
    if (this.itemCount_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField("🎨 Create Drawing on Matrix");
    } else {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }

      for (var i = 0; i < this.itemCount_; i++) {
        if (i == 0) {
          this.appendDummyInput('LABEL0')
              .appendField("🎨 Create Drawing on Matrix");
        }

        this.appendStatementInput('DESENHO' + i)
            .setCheck(null)
            .appendField('Drawing ' + (i + 1) + ':');
      }
    }
  }
};