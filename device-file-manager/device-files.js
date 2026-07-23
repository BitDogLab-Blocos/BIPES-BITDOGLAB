'use strict';

// Independent device-file feature. Functional modules extend this public class.
class DeviceFilesManager {
  constructor(fileList) {
    this._mount();
    this.received_string = '';
    this.currentPath = '';
    this.currentFiles = [];
    this.selectedFile = null;
    this.currentFileBytes = null;
    this.currentFileText = null;
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
    this.csvPanel = get('#deviceFilesCsv');
    this.csvMeta = get('#deviceFilesCsvMeta');
    this.csvTable = get('#deviceFilesCsvTable');
    this.csvViewControl = get('#deviceFilesCsvViewControl');
    this.csvViewToggle = get('#deviceFilesCsvViewToggle');
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
    this._showPreviewMessage('Selecione um arquivo', 'O conteúdo salvo na placa aparecerá aqui.');
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
    if (status) {
      status.textContent = typeof Code !== 'undefined' && Code.translateText
        ? Code.translateText(String(message || ''))
        : message;
    }
  }

  _translate(message) {
    if (typeof Code !== 'undefined' && Code.translateText) {
      return Code.translateText(String(message || ''));
    }
    return message;
  }

  _mount() {
    var toolbar = document.querySelector('.top-menu .toolbar');
    if (toolbar && !document.getElementById('filesButton')) {
      var trigger = document.createElement('button');
      trigger.id = 'filesButton';
      trigger.className = 'device-files-trigger';
      trigger.type = 'button';
      trigger.title = this._translate('Abrir arquivos da placa');
      trigger.setAttribute('aria-label', this._translate('Abrir arquivos da placa'));
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
                <label id="deviceFilesCsvViewControl" class="device-files-csv-toggle" title="Marcado: organiza o CSV em colunas. Desmarcado: mostra o texto original." hidden>
                  <input id="deviceFilesCsvViewToggle" type="checkbox" checked>
                  <span>Exibir como tabela</span>
                </label>
              </div>
              <div id="deviceFilesEmpty" class="device-files-empty">
                <span aria-hidden="true">⌁</span>
                <strong>Selecione um arquivo</strong>
                <small>O conteúdo salvo na placa aparecerá aqui.</small>
              </div>
              <div id="deviceFilesEditor" class="device-files-editor" aria-hidden="true">
                <textarea id="content_file_code" wrap="off"></textarea>
              </div>
              <div id="deviceFilesCsv" class="device-files-csv" aria-hidden="true">
                <div class="device-files-csv-summary">
                  <strong>Visualização em tabela</strong>
                  <span id="deviceFilesCsvMeta"></span>
                </div>
                <div class="device-files-csv-scroll" tabindex="0" aria-label="Tabela com os dados do arquivo CSV">
                  <table id="deviceFilesCsvTable" class="device-files-csv-table"></table>
                </div>
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
    var panel = host.firstElementChild;
    document.body.appendChild(panel);
    if (typeof Code !== 'undefined' && Code.translateDom) {
      Code.translateDom(panel);
    }
    var fileNameInput = panel.querySelector('#content_file_name');
    if (fileNameInput) fileNameInput.value = this._translate(fileNameInput.value);
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
    this.csvViewToggle.addEventListener('change', () => this.toggleCsvView());
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

  setStatus(message, state) {
    if (!this.status) return;
    this.status.textContent = this._translate(message);
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
    if (strong) strong.textContent = this._translate(title);
    if (small) small.textContent = this._translate(description);
    this.preview.classList.remove('has-file');
    this.preview.classList.remove('has-csv');
    this.editorPanel.setAttribute('aria-hidden', 'true');
    if (this.csvPanel) this.csvPanel.setAttribute('aria-hidden', 'true');
    if (this.csvViewControl) this.csvViewControl.hidden = true;
  }

  clearSelection() {
    this.selectedFile = null;
    this.currentFileBytes = null;
    this.currentFileText = null;
    if (this.fileName) this.fileName.value = this._translate('Nenhum arquivo selecionado');
    if (this.previewIcon) {
      this.previewIcon.className = 'device-files-preview-icon';
      this.previewIcon.textContent = '◇';
    }
    if (this.editor) this.editor.setValue('');
    if (this.csvTable) this.csvTable.replaceChildren();
    if (this.csvMeta) this.csvMeta.textContent = '';
    if (this.csvViewToggle) this.csvViewToggle.checked = true;
    this._showPreviewMessage('Selecione um arquivo', 'O conteúdo salvo na placa aparecerá aqui.');
    this._syncActionState();
    if (this.fileList) {
      this.fileList.querySelectorAll('.device-file-item').forEach((item) => item.setAttribute('aria-selected', 'false'));
    }
  }

  get_ver() {}

  get_file_webserial_() { return false; }

  static updateTable() {}

  editedXML2Workspace() {}

  internalPython() {}

  internalXML() {}

  handleCurrentProject() {}

  static extend(methods) { Object.assign(this.prototype, methods); }
}
