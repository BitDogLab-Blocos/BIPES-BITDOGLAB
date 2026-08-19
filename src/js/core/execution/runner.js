'use strict';

class ExecutionRunner {
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

    const workspaceBlocks = Code.workspace.getAllBlocks ? Code.workspace.getAllBlocks(false) : [];
    const hasContactSetup = workspaceBlocks.some((block) => block.type === 'external_contact_prepare');
    const contactWithoutSetup = !hasContactSetup && workspaceBlocks.find((block) => (
      block.type === 'external_contact_when_closed' ||
      block.type === 'external_contact_is_closed' ||
      block.type === 'external_contact_test_matrix'
    ));
    if (contactWithoutSetup && Code.showExternalContactReminder) {
      Code.showExternalContactReminder(contactWithoutSetup);
    }

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
    // Always validate the current workspace before sending code. A caller may
    // provide a pre-generated string, but it must not bypass block safety
    // rules after the workspace has become invalid.
    if (!Tool.validateWorkspaceBeforeCodeAction('executar codigo')) return;

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
}

globalThis.ExecutionRunner = ExecutionRunner;
