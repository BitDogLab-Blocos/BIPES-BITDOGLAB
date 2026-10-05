// Picture-only statement blocks for the arrow activity.
'use strict';

(function() {
  function iconSource(emoji) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">' +
      '<text x="40" y="59" text-anchor="middle" font-size="58" ' +
      'font-family="Segoe UI Emoji,Apple Color Emoji,Noto Color Emoji,sans-serif">' + emoji + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // A large circular colour swatch; its picker contains only coloured circles.
  function FeedbackColour(colour) {
    Blockly.FieldColour.call(this, colour);
    this.setColours(RobotFeedback.colours);
    this.setColumns(2);
  }
  Blockly.utils.object.inherits(FeedbackColour, Blockly.FieldColour);
  FeedbackColour.prototype.initView = function() {
    Blockly.FieldColour.prototype.initView.call(this);
    this.updateSize_();
  };
  FeedbackColour.prototype.updateSize_ = function() {
    this.size_ = new Blockly.utils.Size(32, 32);
    this.positionBorderRect_();
    if (this.borderRect_) {
      this.borderRect_.setAttribute('rx', 16);
      this.borderRect_.setAttribute('ry', 16);
    }
  };
  FeedbackColour.prototype.showEditor_ = function() {
    Blockly.FieldColour.prototype.showEditor_.call(this);
    if (this.picker_) this.picker_.classList.add('robot-feedback-colours');
  };

  var audioContext;
  var activeSounds = [];
  RobotFeedback.previewSound = async function(sound) {
    var Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio || !RobotFeedback.sounds[sound]) return false;
    try {
      if (!audioContext) audioContext = new Audio();
      await audioContext.resume();
      activeSounds.forEach(function(oscillator) { try { oscillator.stop(); } catch (error) {} });
      activeSounds = [];
      var start = audioContext.currentTime;
      RobotFeedback.sounds[sound].forEach(function(note) {
        var oscillator = audioContext.createOscillator();
        var gain = audioContext.createGain();
        var end = start + note[1] / 1000;
        oscillator.type = 'sine';
        oscillator.frequency.value = note[0];
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.08, start + .005);
        gain.gain.setValueAtTime(.08, end - .005);
        gain.gain.linearRampToValueAtTime(0, end);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.onended = function() {
          oscillator.disconnect();
          gain.disconnect();
          activeSounds = activeSounds.filter(function(node) { return node !== oscillator; });
        };
        activeSounds.push(oscillator);
        oscillator.start(start);
        oscillator.stop(end);
        start = end;
      });
      return true;
    } catch (error) {
      console.warn('[BitDogLab] Sound preview unavailable:', error);
      return false;
    }
  };

  Object.keys(RobotFeedback.blocks).forEach(function(type) {
    var preset = RobotFeedback.blocks[type];
    Blockly.Blocks[type] = {
      init: function() {
        var image = new Blockly.FieldImage(iconSource(preset.emoji), 64, 64,
          preset.emoji, preset.colour ? undefined : function() { RobotFeedback.previewSound(preset.icon); });
        var input = this.appendDummyInput().appendField(image, 'PICTURE');
        if (preset.colour) input.appendField(new FeedbackColour(preset.colour), 'COR');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(preset.colour ? '#526e99' : '#9768a6');
        this.setTooltip(function() { return Code.t('app.' + preset.message); });
        this.setHelpUrl('');
      }
    };
  });
})();
