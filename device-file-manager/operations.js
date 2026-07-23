'use strict';

// Download, folder creation and file move, rename, delete and compatibility actions.
DeviceFilesManager.extend({
  downloadSelected() {
    if (!this.selectedFile || !this.currentFileBytes) return;
    saveAs(new Blob([this.currentFileBytes], {type: 'application/octet-stream'}), this.selectedFile.name);
    this.setStatus(this.selectedFile.name + ' baixado para o computador.', 'success');
  },

  files_download(file) {
    if (this.selectedFile && this.selectedFile.name === file && this.currentFileBytes) {
      this.downloadSelected();
    } else {
      this.selectFile(file);
      this.setStatus('Abra o arquivo e use Baixar quando a leitura terminar.');
    }
  },

  openCreateFolderDialog() {
    if (this.busy || !this.isConnected()) return;
    this.createFolderInput.value = '';
    this.createFolderDialog.hidden = false;
    this.createFolderInput.focus();
  },

  closeCreateFolderDialog() {
    if (this.createFolderDialog) this.createFolderDialog.hidden = true;
  },

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
  },

  openMoveDialog() {
    if (!this.selectedFile || this.selectedFile.isDirectory || this.busy) return;
    this.moveDialog.hidden = false;
    this.moveTarget.replaceChildren();
    var loading = document.createElement('option');
    loading.textContent = this._translate('Lendo pastas…');
    this.moveTarget.appendChild(loading);
    this.moveTarget.disabled = true;
    this.moveConfirm.disabled = true;
    var startupFile = !this.currentPath && /^(main|boot)\.py$/i.test(this.selectedFile.name);
    get('#deviceFilesMoveMessage').textContent = this._translate(startupFile
      ? this.selectedFile.name + ' só participa da inicialização quando está na raiz. Escolha o destino sabendo que ele deixará de iniciar automaticamente.'
      : 'Escolha onde salvar ' + this.selectedFile.name + '.');
    this._loadMoveTargets();
  },

  closeMoveDialog() {
    if (this.moveDialog) this.moveDialog.hidden = true;
  },

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
        empty.textContent = this._translate('Nenhuma outra pasta disponível');
        this.moveTarget.appendChild(empty);
        this.moveTarget.disabled = true;
        this.moveConfirm.disabled = true;
        return;
      }

      targets.forEach((path) => {
        var option = document.createElement('option');
        option.value = path;
        option.textContent = this._translate(path ? '/' + path : '/ (raiz da placa)');
        this.moveTarget.appendChild(option);
      });
      this.moveTarget.disabled = false;
      this.moveConfirm.disabled = false;
      this.moveTarget.focus();
    });
  },

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
  },

  openRenameDialog() {
    if (!this.selectedFile || this.busy) return;
    this.renameInput.value = this.selectedFile.name;
    this.renameDialog.hidden = false;
    this.renameInput.focus();
    var dot = this.renameInput.value.lastIndexOf('.');
    this.renameInput.setSelectionRange(0, dot > 0 ? dot : this.renameInput.value.length);
  },

  closeRenameDialog() {
    if (this.renameDialog) this.renameDialog.hidden = true;
  },

  _validateEntryName(name, ignoredName) {
    if (!name) return 'Digite um nome.';
    if (name === '.' || name === '..') return 'Escolha outro nome.';
    if (/[\\/]/.test(name) || /[\x00-\x1f\x7f]/.test(name)) return 'Use apenas um nome, sem caminhos ou caracteres de controle.';
    if (name.length > 120) return 'O nome é muito longo.';
    if (this.currentFiles.some((entry) => entry.name === name && entry.name !== ignoredName)) return 'Já existe um arquivo ou pasta com esse nome.';
    return '';
  },

  _validateFileName(name) {
    return this._validateEntryName(name, this.selectedFile ? this.selectedFile.name : '');
  },

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
  },

  openDeleteDialog() {
    if (!this.selectedFile || this.busy) return;
    var protectedFile = /^(main|boot)\.py$/i.test(this.selectedFile.name);
    this.deleteMessage.textContent = protectedFile
      ? this.selectedFile.name + ' participa da inicialização da placa. Apagar esse arquivo pode impedir o projeto de iniciar automaticamente.'
      : this.selectedFile.name + ' será removido definitivamente da placa.';
    this.deleteDialog.hidden = false;
    this.deleteConfirm.focus();
  },

  closeDeleteDialog() {
    if (this.deleteDialog) this.deleteDialog.hidden = true;
  },

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
  },

  delete(file) {
    var entry = this.currentFiles.find((item) => item.name === file);
    if (!entry) return;
    this.selectedFile = entry;
    this.openDeleteDialog();
  },

  run(file) {
    if (!this.isConnected()) return;
    var entry = this.currentFiles.find((item) => item.name === file);
    var path = entry ? entry.path : this._joinPath(this.currentPath, file);
    DeviceFilesManager.update_file_status('Executando ' + file + '…');
    mux.bufferPush('exec(open(' + this._pythonText(path) + ').read(),globals())\r');
  },

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
  },

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
  },

  files_save_as() {
    if (!this.fileName) return;
    this.put_file_name = this.fileName.value;
    this.put_file_data = new TextEncoder().encode(this.editor.getValue());
    this.put_file();
  }

  // Legacy hooks remain during migration of the hidden BIPES tab.

});
