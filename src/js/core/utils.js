'use strict';

// Tool class - Static utilities for code execution and file operations
class Tool {
  constructor () {}

  static updateFileStatus (message) {
    if (typeof Files !== 'undefined' && Files && typeof Files.setStatus === 'function') {
      Files.setStatus(message);
      return;
    }
    const status = typeof document !== 'undefined' ? document.getElementById('file-status') : null;
    if (status) status.textContent = message;
  }

  static validateWorkspaceBeforeCodeAction (actionLabel) {
    if (!Code || !Code.workspace || !Code.BlockContractValidator) return true;

    const report = Code.BlockContractValidator.getReport(Code.workspace);
    if (report.valid) return true;

    const summary = Code.BlockContractValidator.getSummaryText(report, 3);
    const message = summary || 'Corrija os avisos dos blocos antes de continuar.';

    if (typeof UI !== 'undefined' && UI['notify'] && UI['notify'].send) {
      UI['notify'].send(message);
    }

    Tool.updateFileStatus(message.split('\n')[0]);

    console.warn('[BitDogLab] Block contract validation blocked ' + (actionLabel || 'code action'), report);
    return false;
  }

  static runPython (code_) {
    if (code_ == undefined && !Tool.validateWorkspaceBeforeCodeAction('executar codigo')) return;

    // Parar scanner I2C ANTES de enviar código (evita CTRL_C durante paste mode)
    i2cScanner.stop();

    let code;
    if (code_ == undefined) { // No code provided, generate from workspace
      // Reset buzzer display config before generating code
      // This ensures it's undefined unless display_mostrar_status_buzzer block sets it
      delete Blockly.Python.buzzerDisplayConfig;
      delete Blockly.Python.activeDisplayType;
      let rawCode = Blockly.Python.workspaceToCode(Code.workspace);
      code = Code.wrapWithInfiniteLoop(rawCode); // Wrap in while True loop
    } else {
      code = code_; // Use provided code directly
    }

    if (code) {
      code+='\r\r'; // Snek workaround - extra line breaks for compatibility

      const mobileSerial = window.BitDogLabMobileSerial;
      if (mobileSerial && typeof mobileSerial.stopProgram === 'function') {
        UI['workspace'].receiving();
      }

      // Calculate expected buffer size for progress bar
      const packetSize = Channel['webserial']?.packetSize || 100;
      const fullCode = `\x05${code}\x04`;
      const estimatedPackets = Math.ceil(fullCode.length / packetSize);

      // Start progress bar with estimated packet count
      UI['progress'].start(estimatedPackets);

      mux.bufferPush (`\x05${code}\x04`); // \x05=raw REPL mode, \x04=soft reboot to execute
    }
  }

  static stopPython () {
    const mobileSerial = window.BitDogLabMobileSerial;
    if (mobileSerial && typeof mobileSerial.stopProgram === 'function') {
      i2cScanner.stop();
      mux.clearBuffer();
      mobileSerial.stopProgram().catch((error) => {
        const message = error && error.message
          ? error.message
          : 'A placa não confirmou a parada do programa.';
        if (UI['notify'] && typeof UI['notify'].send === 'function') {
          UI['notify'].send(message);
        }
      });
      return;
    }

    mux.bufferPush ('\x03\x03'); // Ctrl+C twice - interrupt running code
    // Reiniciar scanner I2C após parar o código do usuário
    setTimeout(function() {
      if (typeof Channel !== 'undefined' && Channel['webserial'] && Channel['webserial'].connected) {
        i2cScanner.start(Channel['webserial']);
      }
    }, 500);
  }

static saveAsMainPy () {
  if (!mux.connected()) {
    Tool.updateFileStatus('Conecte a placa para salvar main.py.');
    return;
  }

  if (!Tool.validateWorkspaceBeforeCodeAction('salvar main.py')) return;

  const saveButton = UI['workspace']?.saveMainButton;
  if (saveButton) saveButton.disabled = true;

  // Guarda o _sendScan original e substitui por função vazia
  const originalSendScan = i2cScanner._sendScan.bind(i2cScanner);
  i2cScanner._sendScan = () => {};
  i2cScanner.stop();

  const finish = () => {
    i2cScanner._sendScan = originalSendScan;
    if (saveButton) saveButton.disabled = false;
    setTimeout(() => {
      if (Channel['webserial']?.connected) i2cScanner.start(Channel['webserial']);
    }, 500);
  };

  mux.clearBuffer();
  mux.bufferPush('\x03\x03');

  setTimeout(() => {
    Tool._doSaveAsMainPy(finish);
  }, 500);
}

static _doSaveAsMainPy (onDone) {
  delete Blockly.Python.buzzerDisplayConfig;
  delete Blockly.Python.activeDisplayType;
  let rawCode = Blockly.Python.workspaceToCode(Code.workspace);
  let code = Code.wrapWithInfiniteLoop(rawCode);
  if (!code) {
    Tool.updateFileStatus('Nenhum código para salvar.');
    if (onDone) onDone(false);
    return;
  }

  const bytes = new TextEncoder().encode(code);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  const b64 = btoa(binary);

  const chunkSize = 48;
  const chunks = [];
  for (let i = 0; i < b64.length; i += chunkSize)
    chunks.push(b64.slice(i, i + chunkSize));

  const totalSteps = chunks.length + 3;
  let completedSteps = 0;
  const advanceProgress = () => {
    completedSteps += 1;
    UI['progress'].load(completedSteps, totalSteps);
  };

  UI['progress'].start(totalSteps, true);
  Tool.updateFileStatus('Salvando main.py na placa...');

  mux.clearBuffer();
  mux.bufferPush("import ubinascii; f=open('main.py','wb')\r", () => {
    advanceProgress();
    let i = 0;
    function sendNext() {
      if (i < chunks.length) {
        mux.bufferPush(`f.write(ubinascii.a2b_base64('${chunks[i++]}'))\r`, () => {
          advanceProgress();
          sendNext();
        });
      } else {
        mux.bufferPush("f.close()\r", () => {
          advanceProgress();
          Files.received_string = '';
          mux.bufferPush("import os; print('__BIPES_MAIN_SAVED__', os.stat('main.py')[6])\r", () => {
            setTimeout(() => {
              const match = Files.received_string.match(/__BIPES_MAIN_SAVED__\s+(\d+)/);
              const savedBytes = match ? Number(match[1]) : -1;
              const verified = savedBytes === bytes.length;

              Tool.updateFileStatus(verified
                ? `main.py salvo e verificado (${savedBytes} bytes)! Pode desconectar e reiniciar a placa.`
                : 'Falha ao verificar main.py na placa.');
              advanceProgress();
              setTimeout(() => UI['progress'].end(true), 400);
              if (onDone) onDone(verified);
            }, 50);
          });
        });
      }
    }
    sendNext();
  });
}


  static clearQueue () {
    // Silently clear any pending serial queue leftovers during page boot.
    if (typeof Channel !== 'undefined' && Channel['webserial']) {
      Channel['webserial'].buffer = [];
      Channel['webserial'].completeBufferCallback = [];
    }
  }

  static softReset () {
    mux.bufferPush ('\x04'); // Ctrl+D soft reboot - reset device
  }

  static unix2date (timestamp) {
    let date;
    if (timestamp == undefined)
      date = new Date (+new Date); // Current time if no timestamp provided
    else
      date = new Date(timestamp); // Convert Unix timestamp to Date object
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes(); // Prepend 0 for padding
    let seconds = "0" + date.getSeconds(); // Prepend 0 for padding
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2); // Zero-pad to 2 digits (e.g., 08:02:01)
  }

  static uid () {
    // Generate unique ID: timestamp in base36 + random string in base36
    return (+new Date).toString(36) + Math.random().toString(36).substr(2);
  }

}

class DOM {
  constructor (dom, tags){
    this._dom = document.createElement (dom);
    if (typeof tags == 'object') for (const tag in tags) {
      if (['innerText', 'className', 'id', 'title'].includes(tag))
        this._dom [tag] = tags [tag]
    }
	  return this;
  }

  onclick (self, ev, args){
    // Bind click handler with context preservation
    this._dom.onclick = () => {
			if (typeof args == 'undefined')
				ev.bind(self)()
			else if (args.constructor == Array)
				ev.apply(self, args) // Apply with arguments array
		};
	  return this
  }

}

// Animation utilities for UI transitions
class Animate {
  constructor (){}
  static off (dom, callback){
    dom.classList.remove('on')
    setTimeout(()=>{
      dom.classList.remove('ani', 'on')
      if (callback != undefined)
        callback () // Execute after 250ms fade out
      }, 250) // 250ms fade duration
  }
  static on (dom){
    dom.classList.add('ani')
    setTimeout(()=>{dom.classList.add('ani', 'on')}, 250) // 250ms fade in
  }
}

// Terminal management class for serial communication
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
