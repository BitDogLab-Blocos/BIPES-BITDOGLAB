'use strict';

class MainFileService {
static saveAsMainPy () {
  if (!mux.connected()) {
    Tool.updateFileStatus('Conecte a placa para salvar main.py.');
    return;
  }
  if (typeof mux.ready === 'function' && !mux.ready()) {
    Tool.updateFileStatus(MSG.serialNotReady);
    return;
  }

  if (!Tool.validateWorkspaceBeforeCodeAction('salvar main.py')) return;

  const saveButton = UI['workspace']?.saveMainButton;
  if (saveButton) saveButton.disabled = true;
  const serial = Channel['webserial'];
  const session = serial._session;
  let finished = false;
  let startTimer;
  let connectionWatch;
  const isActive = () => !finished && serial._session === session && mux.connected() && mux.ready();

  // Guarda o _sendScan original e substitui por função vazia
  const originalSendScan = i2cScanner._sendScan.bind(i2cScanner);
  i2cScanner._sendScan = () => {};
  i2cScanner.stop();

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(startTimer);
    clearInterval(connectionWatch);
    i2cScanner._sendScan = originalSendScan;
    if (saveButton) saveButton.disabled = false;
    setTimeout(() => {
      if (serial._session === session && serial.isReady()) i2cScanner.start(serial);
    }, 500);
  };
  connectionWatch = setInterval(() => {
    if (!isActive()) {
      Tool.updateFileStatus(MSG.serialDisconnected);
      finish();
    }
  }, 100);

  mux.clearBuffer();
  mux.bufferPush('\x03\x03');

  startTimer = setTimeout(() => {
    if (isActive()) Tool._doSaveAsMainPy(finish, isActive);
    else finish();
  }, 500);
}

static _doSaveAsMainPy (onDone, isActive = () => true) {
  const enqueue = (command, callback) => {
    if (!isActive()) return;
    mux.bufferPush(command, () => {
      if (isActive()) callback();
    });
  };
  delete Blockly.Python.buzzerDisplayConfig;
  delete Blockly.Python.activeDisplayType;
  let rawCode = Blockly.Python.workspaceToCode(Code.workspace);
  let code = Code.wrapWithInfiniteLoop(rawCode, Code.workspace);
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
  enqueue("import ubinascii; f=open('main.py','wb')\r", () => {
    advanceProgress();
    let i = 0;
    function sendNext() {
      if (i < chunks.length) {
        enqueue(`f.write(ubinascii.a2b_base64('${chunks[i++]}'))\r`, () => {
          advanceProgress();
          sendNext();
        });
      } else {
        enqueue("f.close()\r", () => {
          advanceProgress();
          Files.received_string = '';
          enqueue("import os; print('__BIPES_MAIN_SAVED__', os.stat('main.py')[6])\r", () => {
            setTimeout(() => {
              if (!isActive()) return;
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
}

globalThis.MainFileService = MainFileService;
