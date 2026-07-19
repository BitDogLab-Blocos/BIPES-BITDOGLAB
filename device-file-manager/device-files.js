'use strict';

// Independent device-file feature. It does not depend on the BIPES files tab.
class DeviceFilesManager {
  constructor(fileList) {
    this._mount();
    this.received_string = '';
    this.currentPath = '';
    this.currentFiles = [];
    this.selectedFile = null;
    this.currentFileBytes = null;
    this.busy = false;
    this._lastFocus = null;
    this._operationPoll = null;
    this._operationTimeout = null;
    this._operationStart = null;
    this._scannerSend = null;
    this._selectAfterRefresh = null;
    this._restoreGeometry = null;

    this.editor = CodeMirror.fromTextArea(document.getElementById('content_file_code'), {
      mode: 'python',
      lineNumbers: true,
      readOnly: true,
      lineWrapping: false
    });

    this.fileList = get(fileList);
    this.panel = get('#content_files');
    this.dialog = get('#deviceFilesDialog');
    this.preview = this.panel ? this.panel.querySelector('.device-files-preview') : null;
    this.previewIcon = get('#deviceFilesPreviewIcon');
    this.editorPanel = get('#deviceFilesEditor');
    this.emptyPanel = get('#deviceFilesEmpty');
    this.status = get('#file-status');
    this.fileName = get('#content_file_name');
    this.count = get('#deviceFilesCount');
    this.connection = get('#deviceFilesConnection');
    this.connectButton = get('#deviceFilesConnectButton');
    this.openButton = get('#filesButton');
    this.titlebar = this.panel ? this.panel.querySelector('.device-files-titlebar') : null;
    this.maximizeButton = get('#deviceFilesMaximizeButton');
    this.closeButton = get('#deviceFilesCloseButton');
    this.resizeHandle = get('#deviceFilesResizeHandle');
    this.refreshButton = get('#refreshFilesList');
    this.backButton = get('#deviceFilesBackButton');
    this.pathButton = get('#deviceFilesPath');
    this.createFolderButton = get('#deviceFilesCreateFolderButton');
    this.downloadButton = get('#deviceFilesDownloadButton');
    this.moveButton = get('#deviceFilesMoveButton');
    this.renameButton = get('#deviceFilesRenameButton');
    this.deleteButton = get('#deviceFilesDeleteButton');
    this.renameDialog = get('#deviceFilesRenameDialog');
    this.renameForm = get('#deviceFilesRenameForm');
    this.renameInput = get('#deviceFilesRenameInput');
    this.renameCancel = get('#deviceFilesRenameCancel');
    this.deleteDialog = get('#deviceFilesDeleteDialog');
    this.deleteMessage = get('#deviceFilesDeleteMessage');
    this.deleteCancel = get('#deviceFilesDeleteCancel');
    this.deleteConfirm = get('#deviceFilesDeleteConfirm');
    this.createFolderDialog = get('#deviceFilesCreateFolderDialog');
    this.createFolderForm = get('#deviceFilesCreateFolderForm');
    this.createFolderInput = get('#deviceFilesCreateFolderInput');
    this.createFolderCancel = get('#deviceFilesCreateFolderCancel');
    this.moveDialog = get('#deviceFilesMoveDialog');
    this.moveTarget = get('#deviceFilesMoveTarget');
    this.moveCancel = get('#deviceFilesMoveCancel');
    this.moveConfirm = get('#deviceFilesMoveConfirm');

    this._bindPanel();
    this._updatePathUI();
    this._showPreviewMessage('Selecione um arquivo', 'O código salvo na placa aparecerá aqui.');
    this._syncActionState();
    this._connectedSnapshot = this.isConnected();
    this._connectionWatcher = window.setInterval(() => {
      var connected = this.isConnected();
      if (connected === this._connectedSnapshot) return;
      this._connectedSnapshot = connected;
      this.updateConnectionState(connected);
    }, 400);
  }

  static update_file_status(message) {
    if (typeof Files !== 'undefined' && Files && typeof Files.setStatus === 'function') {
      Files.setStatus(message);
      return;
    }
    var status = document.getElementById('file-status');
    if (status) status.textContent = message;
  }

  _mount() {
    var toolbar = document.querySelector('.top-menu .toolbar');
    if (toolbar && !document.getElementById('filesButton')) {
      var trigger = document.createElement('button');
      trigger.id = 'filesButton';
      trigger.className = 'device-files-trigger';
      trigger.type = 'button';
      trigger.title = 'Abrir arquivos da placa';
      trigger.setAttribute('aria-label', 'Abrir arquivos da placa');
      trigger.setAttribute('aria-controls', 'content_files');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = '<span aria-hidden="true">📁</span>';
      toolbar.insertBefore(trigger, document.getElementById('saveMainButton'));
    }

    if (document.getElementById('content_files')) return;

    var host = document.createElement('div');
    host.innerHTML = `
      <div id="content_files" class="device-files-overlay" aria-hidden="true">
        <section id="deviceFilesDialog" class="device-files-window" role="dialog" aria-modal="true" aria-labelledby="deviceFilesTitle" tabindex="-1">
          <header class="device-files-titlebar">
            <div class="device-files-title">
              <span class="device-files-title-icon" aria-hidden="true">📁</span>
              <span id="deviceFilesTitle">Arquivos da placa</span>
            </div>
            <div class="device-files-title-actions">
              <span id="deviceFilesConnection" class="device-files-connection is-offline">Desconectada</span>
              <button id="deviceFilesMaximizeButton" class="device-files-window-button is-maximize" type="button" title="Maximizar" aria-label="Maximizar janela">□</button>
              <button id="deviceFilesCloseButton" class="device-files-window-button" type="button" title="Fechar" aria-label="Fechar arquivos da placa">×</button>
            </div>
          </header>

          <div class="device-files-toolbar">
            <button id="deviceFilesBackButton" class="device-files-tool is-compact" type="button" title="Voltar uma pasta" aria-label="Voltar uma pasta" disabled>
              <span aria-hidden="true">←</span>
            </button>
            <button id="deviceFilesPath" class="device-files-path" type="button" title="Voltar à raiz da placa">/</button>
            <button id="refreshFilesList" class="device-files-tool" type="button" title="Atualizar arquivos da placa">
              <span aria-hidden="true">↻</span>
              <span>Atualizar</span>
            </button>
            <button id="deviceFilesCreateFolderButton" class="device-files-tool" type="button" title="Criar uma pasta" disabled>
              <span aria-hidden="true">＋</span>
              <span>Nova pasta</span>
            </button>
            <span id="file-status" class="device-files-status" role="status" aria-live="polite">Conecte a placa para ver seus arquivos.</span>
            <button id="deviceFilesConnectButton" class="device-files-connect" type="button">Conectar</button>
          </div>

          <div class="device-files-body">
            <aside class="device-files-sidebar" aria-label="Arquivos gravados na placa">
              <div class="device-files-sidebar-heading">
                <span>NA PLACA</span>
                <span id="deviceFilesCount" class="device-files-count">0</span>
              </div>
              <div id="fileList" class="device-files-list" role="listbox" aria-label="Lista de arquivos">
                <div class="device-files-list-message">Aguardando conexão…</div>
              </div>
            </aside>

            <main class="device-files-preview">
              <div class="device-files-preview-heading">
                <span id="deviceFilesPreviewIcon" class="device-files-preview-icon" aria-hidden="true">◇</span>
                <input id="content_file_name" type="text" value="Nenhum arquivo selecionado" readonly aria-label="Arquivo selecionado">
              </div>
              <div id="deviceFilesEmpty" class="device-files-empty">
                <span aria-hidden="true">⌁</span>
                <strong>Selecione um arquivo</strong>
                <small>O código salvo na placa aparecerá aqui.</small>
              </div>
              <div id="deviceFilesEditor" class="device-files-editor" aria-hidden="true">
                <textarea id="content_file_code" wrap="off"></textarea>
              </div>
              <footer class="device-files-footer">
                <button id="deviceFilesDownloadButton" class="device-files-action" type="button" disabled>Baixar</button>
                <button id="deviceFilesMoveButton" class="device-files-action" type="button" disabled>Mover</button>
                <button id="deviceFilesRenameButton" class="device-files-action" type="button" disabled>Renomear</button>
                <button id="deviceFilesDeleteButton" class="device-files-action is-danger" type="button" disabled>Apagar</button>
              </footer>
            </main>
          </div>

          <div id="deviceFilesRenameDialog" class="device-files-prompt" hidden>
            <form id="deviceFilesRenameForm" class="device-files-prompt-card">
              <span class="device-files-prompt-icon" aria-hidden="true">✎</span>
              <h2>Renomear arquivo</h2>
              <p>Digite o novo nome que ficará salvo na placa.</p>
              <label for="deviceFilesRenameInput">Novo nome</label>
              <input id="deviceFilesRenameInput" type="text" maxlength="120" autocomplete="off">
              <div class="device-files-prompt-actions">
                <button id="deviceFilesRenameCancel" type="button">Cancelar</button>
                <button class="is-primary" type="submit">Renomear</button>
              </div>
            </form>
          </div>

          <div id="deviceFilesDeleteDialog" class="device-files-prompt" hidden>
            <div class="device-files-prompt-card">
              <span class="device-files-prompt-icon is-danger" aria-hidden="true">!</span>
              <h2>Apagar arquivo?</h2>
              <p id="deviceFilesDeleteMessage"></p>
              <div class="device-files-prompt-actions">
                <button id="deviceFilesDeleteCancel" type="button">Cancelar</button>
                <button id="deviceFilesDeleteConfirm" class="is-danger" type="button">Apagar</button>
              </div>
            </div>
          </div>

          <div id="deviceFilesCreateFolderDialog" class="device-files-prompt" hidden>
            <form id="deviceFilesCreateFolderForm" class="device-files-prompt-card">
              <span class="device-files-prompt-icon is-folder" aria-hidden="true">＋</span>
              <h2>Criar nova pasta</h2>
              <p>A pasta será criada dentro do caminho que está aberto.</p>
              <label for="deviceFilesCreateFolderInput">Nome da pasta</label>
              <input id="deviceFilesCreateFolderInput" type="text" maxlength="120" autocomplete="off">
              <div class="device-files-prompt-actions">
                <button id="deviceFilesCreateFolderCancel" type="button">Cancelar</button>
                <button class="is-primary" type="submit">Criar pasta</button>
              </div>
            </form>
          </div>

          <div id="deviceFilesMoveDialog" class="device-files-prompt" hidden>
            <div class="device-files-prompt-card">
              <span class="device-files-prompt-icon is-folder" aria-hidden="true">→</span>
              <h2>Mover arquivo</h2>
              <p id="deviceFilesMoveMessage">Escolha a pasta de destino.</p>
              <label for="deviceFilesMoveTarget">Destino</label>
              <select id="deviceFilesMoveTarget" disabled>
                <option>Lendo pastas…</option>
              </select>
              <div class="device-files-prompt-actions">
                <button id="deviceFilesMoveCancel" type="button">Cancelar</button>
                <button id="deviceFilesMoveConfirm" class="is-primary" type="button" disabled>Mover para cá</button>
              </div>
            </div>
          </div>
          <div id="deviceFilesResizeHandle" class="device-files-resize-handle" role="separator" aria-label="Redimensionar janela" title="Arraste para redimensionar"></div>
        </section>
      </div>`;
    document.body.appendChild(host.firstElementChild);
  }

  _bindPanel() {
    if (!this.panel) return;

    this.openButton.addEventListener('click', () => this.openPanel());
    this.maximizeButton.addEventListener('click', () => this.toggleMaximize());
    this.closeButton.addEventListener('click', () => this.closePanel());
    this.backButton.addEventListener('click', () => this.goBack());
    this.pathButton.addEventListener('click', () => this.goRoot());
    this.refreshButton.addEventListener('click', () => this.listFiles());
    this.createFolderButton.addEventListener('click', () => this.openCreateFolderDialog());
    this.connectButton.addEventListener('click', () => this.connect());
    this.downloadButton.addEventListener('click', () => this.downloadSelected());
    this.moveButton.addEventListener('click', () => this.openMoveDialog());
    this.renameButton.addEventListener('click', () => this.openRenameDialog());
    this.deleteButton.addEventListener('click', () => this.openDeleteDialog());
    this.renameCancel.addEventListener('click', () => this.closeRenameDialog());
    this.deleteCancel.addEventListener('click', () => this.closeDeleteDialog());
    this.deleteConfirm.addEventListener('click', () => this.confirmDelete());
    this.createFolderCancel.addEventListener('click', () => this.closeCreateFolderDialog());
    this.moveCancel.addEventListener('click', () => this.closeMoveDialog());
    this.moveConfirm.addEventListener('click', () => this.confirmMove());
    this.renameForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.confirmRename();
    });
    this.createFolderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.confirmCreateFolder();
    });

    this.titlebar.addEventListener('pointerdown', (event) => this._startWindowDrag(event));
    this.titlebar.addEventListener('dblclick', (event) => {
      if (!event.target.closest('button')) this.toggleMaximize();
    });
    this.resizeHandle.addEventListener('pointerdown', (event) => this._startWindowResize(event));
    window.addEventListener('resize', () => this._clampWindowToOverlay());

    this.panel.addEventListener('mousedown', (event) => {
      if (event.target === this.panel) this.closePanel();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.isOpen()) return;
      if (!this.renameDialog.hidden) {
        this.closeRenameDialog();
      } else if (!this.deleteDialog.hidden) {
        this.closeDeleteDialog();
      } else if (!this.createFolderDialog.hidden) {
        this.closeCreateFolderDialog();
      } else if (!this.moveDialog.hidden) {
        this.closeMoveDialog();
      } else {
        this.closePanel();
      }
    });
  }

  isOpen() {
    return Boolean(this.panel && this.panel.classList.contains('is-open'));
  }

  isConnected() {
    return typeof mux !== 'undefined' && typeof mux.connected === 'function' && mux.connected();
  }

  _joinPath(base, name) {
    return base ? base + '/' + name : name;
  }

  _parentPath(path) {
    var parts = String(path || '').split('/').filter(Boolean);
    parts.pop();
    return parts.join('/');
  }

  _updatePathUI() {
    if (this.pathButton) {
      this.pathButton.textContent = this.currentPath ? '/' + this.currentPath : '/';
      this.pathButton.title = this.currentPath ? 'Voltar à raiz da placa' : 'Raiz da placa';
    }
    if (this.backButton) this.backButton.disabled = this.busy || !this.currentPath;
  }

  enterDirectory(name) {
    if (this.busy) return;
    this.currentPath = this._joinPath(this.currentPath, name);
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  }

  goBack() {
    if (this.busy || !this.currentPath) return;
    this.currentPath = this._parentPath(this.currentPath);
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  }

  goRoot() {
    if (this.busy || !this.currentPath) return;
    this.currentPath = '';
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  }

  openPanel() {
    if (!this.panel) return;
    this._lastFocus = document.activeElement;
    this.panel.classList.add('is-open');
    this.panel.setAttribute('aria-hidden', 'false');
    this.openButton.setAttribute('aria-expanded', 'true');
    this.dialog.focus();
    this.updateConnectionState(this.isConnected(), false);
    this.resize();

    if (this.isConnected()) {
      this.listFiles();
    } else {
      this._renderListMessage('Conecte a BitDogLab para acessar os arquivos gravados na placa.');
      this.setStatus('Conecte a placa para ver seus arquivos.');
    }
  }

  closePanel() {
    if (!this.panel) return;
    this.closeRenameDialog();
    this.closeDeleteDialog();
    this.closeCreateFolderDialog();
    this.closeMoveDialog();
    this.panel.classList.remove('is-open');
    this.panel.setAttribute('aria-hidden', 'true');
    this.openButton.setAttribute('aria-expanded', 'false');
    if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    } else {
      this.openButton.focus();
    }
  }

  resize() {
    if (!this.isOpen()) return;
    window.setTimeout(() => {
      this.editor.setSize('100%', '100%');
      this.editor.refresh();
    }, 0);
  }

  _captureWindowGeometry() {
    if (!this.dialog || !this.panel) return null;
    var dialogRect = this.dialog.getBoundingClientRect();
    var panelRect = this.panel.getBoundingClientRect();
    var geometry = {
      left: dialogRect.left - panelRect.left,
      top: dialogRect.top - panelRect.top,
      width: dialogRect.width,
      height: dialogRect.height
    };
    this.dialog.style.position = 'absolute';
    this.dialog.style.left = geometry.left + 'px';
    this.dialog.style.top = geometry.top + 'px';
    this.dialog.style.width = geometry.width + 'px';
    this.dialog.style.height = geometry.height + 'px';
    return geometry;
  }

  _startWindowDrag(event) {
    if (event.button !== 0 || event.target.closest('button') || this.dialog.classList.contains('is-maximized')) return;
    event.preventDefault();
    var geometry = this._captureWindowGeometry();
    if (!geometry) return;
    var startX = event.clientX;
    var startY = event.clientY;
    this.dialog.classList.add('is-moving');

    var move = (pointerEvent) => {
      var maxLeft = Math.max(0, this.panel.clientWidth - this.dialog.offsetWidth);
      var maxTop = Math.max(0, this.panel.clientHeight - this.dialog.offsetHeight);
      var left = Math.min(maxLeft, Math.max(0, geometry.left + pointerEvent.clientX - startX));
      var top = Math.min(maxTop, Math.max(0, geometry.top + pointerEvent.clientY - startY));
      this.dialog.style.left = left + 'px';
      this.dialog.style.top = top + 'px';
    };

    var stop = () => {
      this.dialog.classList.remove('is-moving');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      document.removeEventListener('pointercancel', stop);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointercancel', stop);
  }

  _startWindowResize(event) {
    if (event.button !== 0 || this.dialog.classList.contains('is-maximized')) return;
    event.preventDefault();
    event.stopPropagation();
    var geometry = this._captureWindowGeometry();
    if (!geometry) return;
    var startX = event.clientX;
    var startY = event.clientY;
    this.dialog.classList.add('is-resizing');

    var move = (pointerEvent) => {
      var minimumWidth = Math.min(520, this.panel.clientWidth);
      var minimumHeight = Math.min(400, this.panel.clientHeight);
      var maximumWidth = Math.max(minimumWidth, this.panel.clientWidth - geometry.left);
      var maximumHeight = Math.max(minimumHeight, this.panel.clientHeight - geometry.top);
      var width = Math.min(maximumWidth, Math.max(minimumWidth, geometry.width + pointerEvent.clientX - startX));
      var height = Math.min(maximumHeight, Math.max(minimumHeight, geometry.height + pointerEvent.clientY - startY));
      this.dialog.style.width = width + 'px';
      this.dialog.style.height = height + 'px';
    };

    var stop = () => {
      this.dialog.classList.remove('is-resizing');
      this.resize();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      document.removeEventListener('pointercancel', stop);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointercancel', stop);
  }

  toggleMaximize() {
    if (!this.dialog || !this.panel) return;
    var maximized = this.dialog.classList.contains('is-maximized');
    if (!maximized) {
      this._restoreGeometry = this._captureWindowGeometry();
      this.dialog.classList.add('is-maximized');
      this.dialog.style.left = '0';
      this.dialog.style.top = '0';
      this.dialog.style.width = '100%';
      this.dialog.style.height = '100%';
      this.maximizeButton.textContent = '❐';
      this.maximizeButton.title = 'Restaurar';
      this.maximizeButton.setAttribute('aria-label', 'Restaurar tamanho da janela');
    } else {
      var geometry = this._restoreGeometry;
      this.dialog.classList.remove('is-maximized');
      if (geometry) {
        this.dialog.style.left = geometry.left + 'px';
        this.dialog.style.top = geometry.top + 'px';
        this.dialog.style.width = geometry.width + 'px';
        this.dialog.style.height = geometry.height + 'px';
      }
      this.maximizeButton.textContent = '□';
      this.maximizeButton.title = 'Maximizar';
      this.maximizeButton.setAttribute('aria-label', 'Maximizar janela');
      this._clampWindowToOverlay();
    }
    this.resize();
  }

  _clampWindowToOverlay() {
    if (!this.isOpen() || !this.dialog || this.dialog.style.position !== 'absolute') return;
    if (this.dialog.classList.contains('is-maximized')) return;
    var width = Math.min(this.dialog.offsetWidth, this.panel.clientWidth);
    var height = Math.min(this.dialog.offsetHeight, this.panel.clientHeight);
    var left = Math.min(Math.max(0, parseFloat(this.dialog.style.left) || 0), Math.max(0, this.panel.clientWidth - width));
    var top = Math.min(Math.max(0, parseFloat(this.dialog.style.top) || 0), Math.max(0, this.panel.clientHeight - height));
    this.dialog.style.width = width + 'px';
    this.dialog.style.height = height + 'px';
    this.dialog.style.left = left + 'px';
    this.dialog.style.top = top + 'px';
    this.resize();
  }

  connect() {
    if (this.isConnected()) {
      this.listFiles();
      return;
    }
    this.setStatus('Escolha a porta USB da sua BitDogLab…');
    this.connectButton.disabled = true;
    if (typeof Channel !== 'undefined' && Channel['mux']) Channel['mux'].connect();
    window.setTimeout(() => {
      if (!this.isConnected()) this.connectButton.disabled = false;
    }, 1500);
  }

  updateConnectionState(connected, refresh) {
    if (!this.connection || !this.connectButton) return;
    this.connection.textContent = connected ? 'Conectada' : 'Desconectada';
    this.connection.classList.toggle('is-online', connected);
    this.connection.classList.toggle('is-offline', !connected);
    this.connectButton.hidden = connected;
    this.connectButton.disabled = false;

    if (!connected) {
      this._cancelOperation();
      this.currentPath = '';
      this._updatePathUI();
      this.currentFiles = [];
      this.clearSelection();
      this._renderListMessage('A placa foi desconectada. Conecte novamente para atualizar os arquivos.');
      this.setStatus('Placa desconectada.');
    } else if (refresh !== false && this.isOpen()) {
      this.listFiles();
    }
  }

  setStatus(message, state) {
    if (!this.status) return;
    this.status.textContent = String(message || '');
    this.status.classList.toggle('is-error', state === 'error');
    this.status.classList.toggle('is-success', state === 'success');
  }

  _setBusy(busy) {
    this.busy = busy;
    if (this.dialog) this.dialog.classList.toggle('is-busy', busy);
    if (this.refreshButton) this.refreshButton.disabled = busy || !this.isConnected();
    if (this.createFolderButton) this.createFolderButton.disabled = busy || !this.isConnected();
    this._updatePathUI();
    this._syncActionState();
  }

  _syncActionState() {
    var hasFile = Boolean(this.selectedFile && !this.selectedFile.isDirectory);
    if (this.downloadButton) this.downloadButton.disabled = this.busy || !hasFile || !this.currentFileBytes;
    if (this.moveButton) this.moveButton.disabled = this.busy || !hasFile;
    if (this.renameButton) this.renameButton.disabled = this.busy || !hasFile;
    if (this.deleteButton) this.deleteButton.disabled = this.busy || !hasFile;
  }

  _showPreviewMessage(title, description) {
    if (!this.emptyPanel || !this.preview) return;
    var strong = this.emptyPanel.querySelector('strong');
    var small = this.emptyPanel.querySelector('small');
    if (strong) strong.textContent = title;
    if (small) small.textContent = description;
    this.preview.classList.remove('has-file');
    this.editorPanel.setAttribute('aria-hidden', 'true');
  }

  clearSelection() {
    this.selectedFile = null;
    this.currentFileBytes = null;
    if (this.fileName) this.fileName.value = 'Nenhum arquivo selecionado';
    if (this.previewIcon) {
      this.previewIcon.className = 'device-files-preview-icon';
      this.previewIcon.textContent = '◇';
    }
    if (this.editor) this.editor.setValue('');
    this._showPreviewMessage('Selecione um arquivo', 'O código salvo na placa aparecerá aqui.');
    this._syncActionState();
    if (this.fileList) {
      this.fileList.querySelectorAll('.device-file-item').forEach((item) => item.setAttribute('aria-selected', 'false'));
    }
  }

  _renderListMessage(message) {
    if (!this.fileList) return;
    this.fileList.replaceChildren();
    var element = document.createElement('div');
    element.className = 'device-files-list-message';
    element.textContent = message;
    this.fileList.appendChild(element);
    if (this.count) this.count.textContent = '0';
  }

  _pauseScanner() {
    if (typeof i2cScanner === 'undefined' || !i2cScanner) return;
    i2cScanner.stop();
    if (this._scannerSend === null && typeof i2cScanner._sendScan === 'function') {
      this._scannerSend = i2cScanner._sendScan;
      i2cScanner._sendScan = function() {};
    }
  }

  _resumeScanner() {
    if (typeof i2cScanner === 'undefined' || !i2cScanner) return;
    if (this._scannerSend !== null) {
      i2cScanner._sendScan = this._scannerSend;
      this._scannerSend = null;
    }
    window.setTimeout(() => {
      if (this.isConnected() && !i2cScanner._isRunning) i2cScanner.start(Channel['webserial']);
    }, 300);
  }

  _cancelOperation() {
    window.clearInterval(this._operationPoll);
    window.clearTimeout(this._operationTimeout);
    window.clearTimeout(this._operationStart);
    this._operationPoll = null;
    this._operationTimeout = null;
    this._operationStart = null;
    this._resumeScanner();
    this._setBusy(false);
  }

  _friendlyError(rawError) {
    var error = String(rawError || '');
    if (/Errno 2|ENOENT/i.test(error)) return 'O arquivo não foi encontrado na placa.';
    if (/Errno 17|EEXIST/i.test(error)) return 'Já existe um arquivo com esse nome.';
    if (/Errno 13|EACCES/i.test(error)) return 'A placa não permitiu essa operação.';
    if (/Errno 28|ENOSPC/i.test(error)) return 'Não há espaço livre suficiente na placa.';
    return 'A placa não conseguiu concluir a operação.';
  }

  _executeFsScript(label, body, timeoutMs, onSuccess) {
    if (!this.isConnected()) {
      this.updateConnectionState(false);
      return;
    }
    if (this.busy) {
      this.setStatus('Aguarde a operação atual terminar.');
      return;
    }

    var token = Tool.uid().replace(/[^a-z0-9]/gi, '').slice(-12);
    var begin = '__BIPES_FS_BEGIN_' + token + '__';
    var end = '__BIPES_FS_END_' + token + '__';
    var prelude = [
      "import os,ubinascii",
      "start='__BIPES_'+'FS_BEGIN_" + token + "__'",
      "end='__BIPES_'+'FS_END_" + token + "__'"
    ].join('\n');
    var command = 'exec(' + JSON.stringify(prelude + '\n' + body) + ')\r';

    this._pauseScanner();
    this._setBusy(true);
    this.setStatus(label);
    this.received_string = '';
    mux.clearBuffer();
    mux.bufferPush('\x03\x03');

    this._operationStart = window.setTimeout(() => {
      if (!this.isConnected()) {
        this.updateConnectionState(false);
        return;
      }

      this.received_string = '';
      mux.bufferPush(command);

      this._operationPoll = window.setInterval(() => {
        var beginIndex = this.received_string.lastIndexOf(begin);
        if (beginIndex === -1) return;
        var payloadStart = beginIndex + begin.length;
        var endIndex = this.received_string.indexOf(end, payloadStart);
        if (endIndex === -1) return;

        var payload = this.received_string.slice(payloadStart, endIndex).trim();
        this._cancelOperation();

        if (payload.indexOf('ERR:') === 0) {
          this.setStatus(this._friendlyError(payload.slice(4)), 'error');
          return;
        }

        if (payload.indexOf('OK') !== 0) {
          this.setStatus('A resposta da placa não pôde ser interpretada.', 'error');
          return;
        }

        payload = payload.slice(2).replace(/^\s*:\s*/, '').trim();
        onSuccess(payload);
      }, 80);

      this._operationTimeout = window.setTimeout(() => {
        this._cancelOperation();
        this.setStatus('A placa demorou para responder. Tente atualizar novamente.', 'error');
      }, timeoutMs || 7000);
    }, 320);
  }

  _pythonText(value) {
    var bytes = new TextEncoder().encode(value);
    var binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return "ubinascii.a2b_base64('" + btoa(binary) + "').decode()";
  }

  listFiles() {
    if (!this.isConnected()) {
      this.updateConnectionState(false);
      return;
    }

    var target = this.currentPath ? this._pythonText(this.currentPath) : "'.'";
    var body = [
      'try:',
      ' entries=[]',
      " if hasattr(os,'ilistdir'):",
      '  for item in os.ilistdir(' + target + '):',
      '   entries.append([item[0],item[1],item[3] if len(item)>3 else -1])',
      ' else:',
      '  for name in os.listdir(' + target + '):',
      '   entries.append([name,0,-1])',
      ' import ujson',
      " print(start+'OK:'+ujson.dumps(entries)+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this._updatePathUI();
    this._renderListMessage('Lendo esta pasta…');
    this._executeFsScript('Lendo ' + (this.currentPath ? '/' + this.currentPath : 'a raiz da placa') + '…', body, 8000, (payload) => {
      var entries;
      try {
        entries = JSON.parse(payload);
      } catch (error) {
        this._renderListMessage('Não foi possível interpretar a lista recebida.');
        this.setStatus('A lista recebida da placa é inválida.', 'error');
        return;
      }

      this.currentFiles = entries.filter((entry) => Array.isArray(entry) && typeof entry[0] === 'string').map((entry) => ({
        name: entry[0],
        type: Number(entry[1]) || 0,
        size: Number(entry[2]),
        isDirectory: (Number(entry[1]) & 0x4000) === 0x4000,
        path: this._joinPath(this.currentPath, entry[0])
      })).sort((left, right) => {
        if (left.isDirectory !== right.isDirectory) return left.isDirectory ? -1 : 1;
        return left.name.localeCompare(right.name, 'pt-BR', {sensitivity: 'base'});
      });

      this.renderFileList();
      this.setStatus(this.currentFiles.length === 1 ? '1 item nesta pasta.' : this.currentFiles.length + ' itens nesta pasta.', 'success');

      var selection = this._selectAfterRefresh;
      this._selectAfterRefresh = null;
      if (selection && this.currentFiles.some((entry) => entry.name === selection && !entry.isDirectory)) {
        this.selectFile(selection);
      } else {
        this.clearSelection();
      }
    });
  }

  renderFileList() {
    this.fileList.replaceChildren();
    if (this.count) this.count.textContent = String(this.currentFiles.length);

    if (this.currentFiles.length === 0) {
      this._renderListMessage('Nenhum arquivo encontrado na placa.');
      return;
    }

    this.currentFiles.forEach((entry) => {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'device-file-item' + (entry.isDirectory ? ' is-directory' : '');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.title = entry.isDirectory ? 'Pasta ' + entry.name : 'Abrir ' + entry.name;

      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      this._applyFileIcon(icon, entry, 'device-file-item-icon');

      var name = document.createElement('span');
      name.className = 'device-file-item-name';
      name.textContent = entry.name;

      var size = document.createElement('span');
      size.className = 'device-file-item-size';
      size.textContent = entry.isDirectory ? 'pasta' : this._formatSize(entry.size);

      item.append(icon, name, size);
      item.addEventListener('click', () => {
        if (entry.isDirectory) {
          this.enterDirectory(entry.name);
          return;
        }
        this.selectFile(entry.name);
      });
      this.fileList.appendChild(item);
    });
  }

  _fileIcon(name) {
    var extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    var types = {
      py: {label: 'PY', className: 'is-python'},
      csv: {label: 'CSV', className: 'is-csv'},
      txt: {label: 'TXT', className: 'is-text'},
      json: {label: '{}', className: 'is-json'},
      md: {label: 'MD', className: 'is-markdown'},
      xml: {label: '<>', className: 'is-xml'},
      js: {label: 'JS', className: 'is-javascript'},
      bipes: {label: 'B', className: 'is-bipes'}
    };
    if (types[extension]) return types[extension];
    return {
      label: extension ? extension.slice(0, 3).toUpperCase() : '•',
      className: 'is-generic'
    };
  }

  _applyFileIcon(element, entry, baseClass) {
    if (entry.isDirectory) {
      element.className = baseClass + ' is-folder';
      element.textContent = '';
      return;
    }
    var icon = this._fileIcon(entry.name);
    element.className = baseClass + ' device-file-icon ' + icon.className;
    element.textContent = icon.label;
  }

  _formatSize(size) {
    if (!Number.isFinite(size) || size < 0) return '';
    if (size < 1024) return size + ' B';
    return (size / 1024).toFixed(size < 10240 ? 1 : 0) + ' KB';
  }

  selectFile(name) {
    var entry = this.currentFiles.find((item) => item.name === name);
    if (!entry || entry.isDirectory || this.busy) return;

    this.selectedFile = entry;
    this.currentFileBytes = null;
    this.fileName.value = entry.name;
    this._applyFileIcon(this.previewIcon, entry, 'device-files-preview-icon');
    this.fileList.querySelectorAll('.device-file-item').forEach((item) => {
      var itemName = item.querySelector('.device-file-item-name');
      item.setAttribute('aria-selected', String(Boolean(itemName && itemName.textContent === entry.name)));
    });
    this._showPreviewMessage('Lendo ' + entry.name + '…', 'Aguarde a resposta da placa.');
    this._syncActionState();
    this.get_file(entry.path, entry.name);
  }

  get_file(filePath, displayName) {
    var path = this._pythonText(filePath);
    var fileName = displayName || filePath;
    var body = [
      'try:',
      ' f=open(' + path + ",'rb')",
      " print(start+'OK')",
      ' while True:',
      '  chunk=f.read(48)',
      '  if not chunk: break',
      '  print(ubinascii.b2a_base64(chunk).decode().strip())',
      ' f.close()',
      ' print(end)',
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this._executeFsScript('Abrindo ' + fileName + '…', body, 12000, (payload) => {
      if (!this.selectedFile || this.selectedFile.path !== filePath) return;
      try {
        var compact = payload.replace(/\s+/g, '');
        var binary = atob(compact);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        this.currentFileBytes = bytes;

        var text;
        try {
          text = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
        } catch (error) {
          text = '# Este arquivo é binário e não pode ser exibido como código.\n# Você ainda pode baixá-lo para o computador.';
        }

        this.editor.setOption('mode', /\.py$/i.test(fileName) ? 'python' : null);
        this.editor.setValue(text);
        this.preview.classList.add('has-file');
        this.editorPanel.setAttribute('aria-hidden', 'false');
        this.resize();
        this._syncActionState();
        this.setStatus(fileName + ' aberto (' + bytes.length + ' bytes).', 'success');
      } catch (error) {
        this.currentFileBytes = null;
        this._showPreviewMessage('Não foi possível abrir o arquivo', 'A resposta recebida não contém um arquivo válido.');
        this._syncActionState();
        this.setStatus('Não foi possível decodificar o conteúdo do arquivo.', 'error');
      }
    });
  }

  files_view(file) {
    this.selectFile(file);
  }

  downloadSelected() {
    if (!this.selectedFile || !this.currentFileBytes) return;
    saveAs(new Blob([this.currentFileBytes], {type: 'application/octet-stream'}), this.selectedFile.name);
    this.setStatus(this.selectedFile.name + ' baixado para o computador.', 'success');
  }

  files_download(file) {
    if (this.selectedFile && this.selectedFile.name === file && this.currentFileBytes) {
      this.downloadSelected();
    } else {
      this.selectFile(file);
      this.setStatus('Abra o arquivo e use Baixar quando a leitura terminar.');
    }
  }

  openCreateFolderDialog() {
    if (this.busy || !this.isConnected()) return;
    this.createFolderInput.value = '';
    this.createFolderDialog.hidden = false;
    this.createFolderInput.focus();
  }

  closeCreateFolderDialog() {
    if (this.createFolderDialog) this.createFolderDialog.hidden = true;
  }

  confirmCreateFolder() {
    if (this.busy || !this.isConnected()) return;
    var folderName = this.createFolderInput.value.trim();
    var error = this._validateEntryName(folderName, '');
    if (error) {
      this.setStatus(error, 'error');
      this.createFolderInput.focus();
      return;
    }

    var folderPath = this._joinPath(this.currentPath, folderName);
    var body = [
      'try:',
      ' os.mkdir(' + this._pythonText(folderPath) + ')',
      " print(start+'OK'+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this.closeCreateFolderDialog();
    this._executeFsScript('Criando a pasta ' + folderName + '…', body, 7000, () => {
      this.setStatus('Pasta ' + folderName + ' criada.', 'success');
      this.listFiles();
    });
  }

  openMoveDialog() {
    if (!this.selectedFile || this.selectedFile.isDirectory || this.busy) return;
    this.moveDialog.hidden = false;
    this.moveTarget.replaceChildren();
    var loading = document.createElement('option');
    loading.textContent = 'Lendo pastas…';
    this.moveTarget.appendChild(loading);
    this.moveTarget.disabled = true;
    this.moveConfirm.disabled = true;
    var startupFile = !this.currentPath && /^(main|boot)\.py$/i.test(this.selectedFile.name);
    get('#deviceFilesMoveMessage').textContent = startupFile
      ? this.selectedFile.name + ' só participa da inicialização quando está na raiz. Escolha o destino sabendo que ele deixará de iniciar automaticamente.'
      : 'Escolha onde salvar ' + this.selectedFile.name + '.';
    this._loadMoveTargets();
  }

  closeMoveDialog() {
    if (this.moveDialog) this.moveDialog.hidden = true;
  }

  _loadMoveTargets() {
    var body = [
      'try:',
      ' directories=[]',
      ' def scan(path,depth):',
      '  if depth>8: return',
      "  source=path if path else '.'",
      '  for item in os.ilistdir(source):',
      '   if item[1]&16384:',
      "    child=(path+'/' if path else '')+item[0]",
      '    directories.append(child)',
      '    scan(child,depth+1)',
      " scan('',0)",
      ' import ujson',
      " print(start+'OK:'+ujson.dumps(directories)+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this._executeFsScript('Lendo pastas da placa…', body, 10000, (payload) => {
      var directories;
      try {
        directories = JSON.parse(payload).filter((path) => typeof path === 'string');
      } catch (error) {
        this.closeMoveDialog();
        this.setStatus('Não foi possível carregar as pastas de destino.', 'error');
        return;
      }

      var targets = [''].concat(directories).filter((path, index, list) => path !== this.currentPath && list.indexOf(path) === index);
      targets.sort((left, right) => {
        if (!left) return -1;
        if (!right) return 1;
        return left.localeCompare(right, 'pt-BR', {sensitivity: 'base'});
      });
      this.moveTarget.replaceChildren();

      if (targets.length === 0) {
        var empty = document.createElement('option');
        empty.textContent = 'Nenhuma outra pasta disponível';
        this.moveTarget.appendChild(empty);
        this.moveTarget.disabled = true;
        this.moveConfirm.disabled = true;
        return;
      }

      targets.forEach((path) => {
        var option = document.createElement('option');
        option.value = path;
        option.textContent = path ? '/' + path : '/ (raiz da placa)';
        this.moveTarget.appendChild(option);
      });
      this.moveTarget.disabled = false;
      this.moveConfirm.disabled = false;
      this.moveTarget.focus();
    });
  }

  confirmMove() {
    if (!this.selectedFile || this.busy || this.moveTarget.disabled) return;
    var fileName = this.selectedFile.name;
    var sourcePath = this.selectedFile.path;
    var destinationPath = this._joinPath(this.moveTarget.value, fileName);
    var body = [
      'try:',
      ' destination=' + this._pythonText(destinationPath),
      ' exists=True',
      ' try:',
      '  os.stat(destination)',
      ' except OSError:',
      '  exists=False',
      ' if exists:',
      '  raise OSError(17)',
      ' os.rename(' + this._pythonText(sourcePath) + ',destination)',
      " print(start+'OK'+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    var destinationLabel = this.moveTarget.value ? '/' + this.moveTarget.value : '/';
    this.closeMoveDialog();
    this._executeFsScript('Movendo ' + fileName + '…', body, 8000, () => {
      this.clearSelection();
      this.setStatus(fileName + ' movido para ' + destinationLabel + '.', 'success');
      this.listFiles();
    });
  }

  openRenameDialog() {
    if (!this.selectedFile || this.busy) return;
    this.renameInput.value = this.selectedFile.name;
    this.renameDialog.hidden = false;
    this.renameInput.focus();
    var dot = this.renameInput.value.lastIndexOf('.');
    this.renameInput.setSelectionRange(0, dot > 0 ? dot : this.renameInput.value.length);
  }

  closeRenameDialog() {
    if (this.renameDialog) this.renameDialog.hidden = true;
  }

  _validateEntryName(name, ignoredName) {
    if (!name) return 'Digite um nome.';
    if (name === '.' || name === '..') return 'Escolha outro nome.';
    if (/[\\/]/.test(name) || /[\x00-\x1f\x7f]/.test(name)) return 'Use apenas um nome, sem caminhos ou caracteres de controle.';
    if (name.length > 120) return 'O nome é muito longo.';
    if (this.currentFiles.some((entry) => entry.name === name && entry.name !== ignoredName)) return 'Já existe um arquivo ou pasta com esse nome.';
    return '';
  }

  _validateFileName(name) {
    return this._validateEntryName(name, this.selectedFile ? this.selectedFile.name : '');
  }

  confirmRename() {
    if (!this.selectedFile || this.busy) return;
    var oldName = this.selectedFile.name;
    var oldPath = this.selectedFile.path;
    var newName = this.renameInput.value.trim();
    var error = this._validateFileName(newName);
    if (error) {
      this.setStatus(error, 'error');
      this.renameInput.focus();
      return;
    }
    if (newName === oldName) {
      this.closeRenameDialog();
      return;
    }

    var body = [
      'try:',
      ' os.rename(' + this._pythonText(oldPath) + ',' + this._pythonText(this._joinPath(this.currentPath, newName)) + ')',
      " print(start+'OK'+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this.closeRenameDialog();
    this._executeFsScript('Renomeando ' + oldName + '…', body, 7000, () => {
      this._selectAfterRefresh = newName;
      this.setStatus('Arquivo renomeado para ' + newName + '.', 'success');
      this.listFiles();
    });
  }

  openDeleteDialog() {
    if (!this.selectedFile || this.busy) return;
    var protectedFile = /^(main|boot)\.py$/i.test(this.selectedFile.name);
    this.deleteMessage.textContent = protectedFile
      ? this.selectedFile.name + ' participa da inicialização da placa. Apagar esse arquivo pode impedir o projeto de iniciar automaticamente.'
      : this.selectedFile.name + ' será removido definitivamente da placa.';
    this.deleteDialog.hidden = false;
    this.deleteConfirm.focus();
  }

  closeDeleteDialog() {
    if (this.deleteDialog) this.deleteDialog.hidden = true;
  }

  confirmDelete() {
    if (!this.selectedFile || this.busy) return;
    var fileName = this.selectedFile.name;
    var body = [
      'try:',
      ' os.remove(' + this._pythonText(this.selectedFile.path) + ')',
      " print(start+'OK'+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');

    this.closeDeleteDialog();
    this._executeFsScript('Apagando ' + fileName + '…', body, 7000, () => {
      this.clearSelection();
      this.setStatus(fileName + ' foi apagado da placa.', 'success');
      this.listFiles();
    });
  }

  delete(file) {
    var entry = this.currentFiles.find((item) => item.name === file);
    if (!entry) return;
    this.selectedFile = entry;
    this.openDeleteDialog();
  }

  run(file) {
    if (!this.isConnected()) return;
    var entry = this.currentFiles.find((item) => item.name === file);
    var path = entry ? entry.path : this._joinPath(this.currentPath, file);
    DeviceFilesManager.update_file_status('Executando ' + file + '…');
    mux.bufferPush('exec(open(' + this._pythonText(path) + ').read(),globals())\r');
  }

  // Compatibility with the existing save/upload hooks.
  handle_put_file_select() {
    var input = typeof UI !== 'undefined' && UI['workspace'] ? UI['workspace'].put_file_select : null;
    if (!input || !input.files || !input.files[0]) return;
    var selected = input.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.put_file_name = selected.name;
      this.put_file_data = new Uint8Array(event.target.result);
      this.put_file();
    };
    reader.readAsArrayBuffer(selected);
  }

  put_file() {
    if (!this.put_file_name || !this.put_file_data || !this.isConnected()) return;
    var text = new TextDecoder().decode(this.put_file_data);
    var path = this._pythonText(this.put_file_name);
    var data = this._pythonText(text);
    var body = [
      'try:',
      " f=open(" + path + ",'w')",
      ' f.write(' + data + ')',
      ' f.close()',
      " print(start+'OK'+end)",
      'except Exception as e:',
      " print(start+'ERR:'+repr(e)+end)"
    ].join('\n');
    this._executeFsScript('Salvando ' + this.put_file_name + '…', body, 12000, () => {
      this.setStatus(this.put_file_name + ' salvo na placa.', 'success');
      this.listFiles();
    });
  }

  files_save_as() {
    if (!this.fileName) return;
    this.put_file_name = this.fileName.value;
    this.put_file_data = new TextEncoder().encode(this.editor.getValue());
    this.put_file();
  }

  // Legacy hooks remain during migration of the hidden BIPES tab.
  get_ver() {}
  get_file_webserial_() { return false; }
  static updateTable() {}
  editedXML2Workspace() {}
  internalPython() {}
  internalXML() {}
  handleCurrentProject() {}
}
