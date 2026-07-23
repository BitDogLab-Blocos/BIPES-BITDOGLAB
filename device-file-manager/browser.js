'use strict';

// Folder navigation, device listing and file type presentation.
DeviceFilesManager.extend({
  _joinPath(base, name) {
    return base ? base + '/' + name : name;
  },

  _parentPath(path) {
    var parts = String(path || '').split('/').filter(Boolean);
    parts.pop();
    return parts.join('/');
  },

  _updatePathUI() {
    if (this.pathButton) {
      this.pathButton.textContent = this.currentPath ? '/' + this.currentPath : '/';
      this.pathButton.title = this._translate(this.currentPath ? 'Voltar à raiz da placa' : 'Raiz da placa');
    }
    if (this.backButton) this.backButton.disabled = this.busy || !this.currentPath;
  },

  enterDirectory(name) {
    if (this.busy) return;
    this.currentPath = this._joinPath(this.currentPath, name);
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  },

  goBack() {
    if (this.busy || !this.currentPath) return;
    this.currentPath = this._parentPath(this.currentPath);
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  },

  goRoot() {
    if (this.busy || !this.currentPath) return;
    this.currentPath = '';
    this._updatePathUI();
    this.clearSelection();
    this.listFiles();
  },

  _renderListMessage(message) {
    if (!this.fileList) return;
    this.fileList.replaceChildren();
    var element = document.createElement('div');
    element.className = 'device-files-list-message';
    element.textContent = message;
    this.fileList.appendChild(element);
    if (this.count) this.count.textContent = '0';
  },

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
  },

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
      item.title = this._translate(entry.isDirectory ? 'Pasta ' + entry.name : 'Abrir ' + entry.name);

      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      this._applyFileIcon(icon, entry, 'device-file-item-icon');

      var name = document.createElement('span');
      name.className = 'device-file-item-name';
      name.textContent = entry.name;

      var size = document.createElement('span');
      size.className = 'device-file-item-size';
      size.textContent = entry.isDirectory ? this._translate('pasta') : this._formatSize(entry.size);

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
  },

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
  },

  _applyFileIcon(element, entry, baseClass) {
    if (entry.isDirectory) {
      element.className = baseClass + ' is-folder';
      element.textContent = '';
      return;
    }
    var icon = this._fileIcon(entry.name);
    element.className = baseClass + ' device-file-icon ' + icon.className;
    element.textContent = icon.label;
  },

  _formatSize(size) {
    if (!Number.isFinite(size) || size < 0) return '';
    if (size < 1024) return size + ' B';
    return (size / 1024).toFixed(size < 10240 ? 1 : 0) + ' KB';
  }

});
