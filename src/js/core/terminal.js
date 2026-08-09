'use strict';

class term {
  constructor () {
  }
  static init (dom) {
    terminal.open(get(dom));
    terminal.setOption('fontSize',12);
    // Configure terminal color scheme
    terminal.setOption('theme', {
      foreground: '#00FFFF',
      background: '#000000',
      cursor: '#00FFFF',
      black: '#2e3436',
      red: '#cc0000',
      green: '#00FF00',
      yellow: '#c4a000',
      blue: '#3465a4',
      magenta: '#75507b',
      cyan: '#00FFFF',
      white: '#FFFFFF',
      brightBlack: '#555753',
      brightRed: '#ef2929',
      brightGreen: '#8ae234',
      brightYellow: '#fce94f',
      brightBlue: '#729fcf',
      brightMagenta: '#ad7fa8',
      brightCyan: '#00FFFF',
      brightWhite: '#FFFFFF'
    });
    this.resize();
    // Route terminal input to current channel
    terminal.onData((data) => {
      switch (Channel ['mux'].currentChannel) {
        case 'webserial':
          Channel ['webserial'].serialWrite(data);
        break;
      }
    });
  }

  static on () {
    terminal.setOption('disableStdin', false); // Enable input
    terminal.focus(); // Set focus to terminal
  }

  static off () {
    terminal.setOption('disableStdin', true); // Disable input
    terminal.blur(); // Remove focus from terminal
  }

  static write (data) {
    terminal.write(data); // Write data to terminal
  }

  static resize () {
    if(!Code.current.includes('console'))
      return

    // Calculate terminal dimensions based on window size
    let cols
    if (Code.current[0] == 'console')
      cols = Math.max(50, Math.min(200, (window.innerWidth - 4*$em) / 7)) | 0 // 7px per char
    else
      cols = Math.max(50, Math.min(200, ((window.innerWidth)/2 - 4*$em) / 7)) | 0 // Half width for split view

    let rows = Math.max(15, Math.min(40, (window.innerHeight - 20*$em) / 12)) | 0 // 12px per row

    terminal.resize(cols, rows);
  }
}

globalThis.term = term;

