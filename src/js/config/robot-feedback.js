// Shared visual previews and MicroPython presets for the arrow activity.
'use strict';

var RobotFeedback = {
  colours: ['#ef4444', '#facc15', '#22c55e', '#3b82f6'],
  patterns: {
    happy: [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0],
    sad: [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 0,1,1,1,0, 1,0,0,0,1],
    heart: [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0]
  },
  sounds: {
    beep: [[1500, 100]],
    success: [[392, 100], [440, 100], [494, 100], [523, 100]]
  },
  matrixBrightness: 25,
  ledBrightness: 30,
  volume: 30,
  // Time to observe static pictures, a steady LED, or a short sound before continuing.
  observationMs: 1000,
  pulseBrightness: [10, 20, 30, 20, 10],
  pulseStepMs: 90,
  blinkStepMs: 200,
  blocks: {
    robo_setas_rosto_feliz: { icon: 'happy', emoji: '😊', colour: '#facc15', message: 'arrowFeedbackHappy' },
    robo_setas_rosto_triste: { icon: 'sad', emoji: '☹️', colour: '#3b82f6', message: 'arrowFeedbackSad' },
    robo_setas_coracao: { icon: 'heart', emoji: '❤️', colour: '#ef4444', message: 'arrowFeedbackHeart' },
    robo_setas_led_aceso: { icon: 'led', emoji: '💡', colour: '#22c55e', message: 'arrowFeedbackLed' },
    robo_setas_led_piscando: { icon: 'blink', emoji: '✨', colour: '#facc15', message: 'arrowFeedbackBlink' },
    robo_setas_bipe: { icon: 'beep', emoji: '🔊', message: 'arrowFeedbackBeep' },
    robo_setas_sucesso: { icon: 'success', emoji: '🏆', message: 'arrowFeedbackSuccess' }
  }
};
