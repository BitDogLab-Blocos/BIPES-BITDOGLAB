'use strict';

// File loading, text preview and CSV spreadsheet rendering.
DeviceFilesManager.extend({
  _parseCsv(text, delimiter, rowLimit) {
    var source = String(text || '').replace(/^\uFEFF/, '');
    var rows = [];
    var row = [];
    var field = '';
    var quoted = false;
    var limit = Number.isFinite(rowLimit) ? rowLimit : Infinity;

    for (var index = 0; index < source.length; index++) {
      var character = source[index];

      if (quoted) {
        if (character === '"') {
          if (source[index + 1] === '"') {
            field += '"';
            index++;
          } else {
            quoted = false;
          }
        } else {
          field += character;
        }
        continue;
      }

      if (character === '"' && field === '') {
        quoted = true;
      } else if (character === delimiter) {
        row.push(field);
        field = '';
      } else if (character === '\n' || character === '\r') {
        if (character === '\r' && source[index + 1] === '\n') index++;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        if (rows.length >= limit) return rows;
      } else {
        field += character;
      }
    }

    if (field !== '' || row.length > 0 || source.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  },

  _detectCsvDelimiter(text) {
    var candidates = [',', ';', '\t', '|'];
    var bestDelimiter = ',';
    var bestScore = -1;

    candidates.forEach((candidate) => {
      var rows = this._parseCsv(text, candidate, 30).filter((row) => row.some((field) => field.trim() !== ''));
      if (!rows.length) return;

      var frequencies = {};
      rows.forEach((row) => {
        frequencies[row.length] = (frequencies[row.length] || 0) + 1;
      });

      var modeColumns = 1;
      var consistentRows = 0;
      Object.keys(frequencies).forEach((columns) => {
        if (frequencies[columns] > consistentRows) {
          consistentRows = frequencies[columns];
          modeColumns = Number(columns);
        }
      });

      var score = modeColumns > 1
        ? consistentRows * 100 - (rows.length - consistentRows) * 25 + Math.min(modeColumns, 12)
        : 0;
      if (score > bestScore) {
        bestScore = score;
        bestDelimiter = candidate;
      }
    });

    return bestDelimiter;
  },

  _csvDelimiterLabel(delimiter) {
    if (delimiter === '\t') return 'tabulação';
    if (delimiter === ';') return 'ponto e vírgula';
    if (delimiter === '|') return 'barra vertical';
    return 'vírgula';
  },

  _renderCsvPreview(text) {
    var delimiter = this._detectCsvDelimiter(text);
    var rows = this._parseCsv(text, delimiter);
    while (rows.length && rows[rows.length - 1].every((field) => field === '')) rows.pop();

    var columnCount = rows.reduce((maximum, row) => Math.max(maximum, row.length), 0);
    var headings = rows.length ? rows[0] : [];
    var dataRows = rows.length > 1 ? rows.slice(1) : [];
    var visibleRows = dataRows.slice(0, 1000);
    var tableHead = document.createElement('thead');
    var headingRow = document.createElement('tr');
    var indexHeading = document.createElement('th');
    indexHeading.className = 'device-files-csv-index';
    indexHeading.scope = 'col';
    indexHeading.textContent = '#';
    indexHeading.title = 'Índice da linha';
    headingRow.appendChild(indexHeading);

    for (var column = 0; column < columnCount; column++) {
      var heading = document.createElement('th');
      heading.scope = 'col';
      heading.textContent = headings[column] === undefined || headings[column] === ''
        ? 'Coluna ' + (column + 1)
        : headings[column];
      heading.title = heading.textContent;
      headingRow.appendChild(heading);
    }
    tableHead.appendChild(headingRow);

    var tableBody = document.createElement('tbody');
    visibleRows.forEach((row, rowIndex) => {
      var tableRow = document.createElement('tr');
      var indexCell = document.createElement('th');
      indexCell.className = 'device-files-csv-index';
      indexCell.scope = 'row';
      indexCell.textContent = String(rowIndex);
      tableRow.appendChild(indexCell);

      for (var cellIndex = 0; cellIndex < columnCount; cellIndex++) {
        var cell = document.createElement('td');
        var cellValue = row[cellIndex] === undefined ? '' : row[cellIndex];
        cell.textContent = cellValue;
        if (cellValue) cell.title = cellValue;
        tableRow.appendChild(cell);
      }
      tableBody.appendChild(tableRow);
    });

    if (!dataRows.length) {
      var emptyRow = document.createElement('tr');
      var emptyCell = document.createElement('td');
      emptyCell.className = 'device-files-csv-empty';
      emptyCell.colSpan = Math.max(columnCount + 1, 1);
      emptyCell.textContent = rows.length ? 'O CSV contém apenas o cabeçalho.' : 'Este arquivo CSV está vazio.';
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
    }

    this.csvTable.replaceChildren(tableHead, tableBody);
    var rowLabel = dataRows.length === 1 ? '1 linha' : dataRows.length + ' linhas';
    var columnLabel = columnCount === 1 ? '1 coluna' : columnCount + ' colunas';
    var limitLabel = dataRows.length > visibleRows.length ? ' · exibindo as primeiras 1000' : '';
    this.csvMeta.textContent = rowLabel + ' · ' + columnLabel + ' · separado por ' + this._csvDelimiterLabel(delimiter) + limitLabel;
    this.editor.setValue('');
    this.editorPanel.setAttribute('aria-hidden', 'true');
    this.csvPanel.setAttribute('aria-hidden', 'false');
    this.preview.classList.add('has-file', 'has-csv');
  },

  _renderRawCsvPreview(text) {
    this.preview.classList.remove('has-csv');
    this.preview.classList.add('has-file');
    this.csvPanel.setAttribute('aria-hidden', 'true');
    this.editor.setOption('mode', null);
    this.editor.setValue(text);
    this.editorPanel.setAttribute('aria-hidden', 'false');
  },

  toggleCsvView() {
    if (!this.selectedFile || !/\.csv$/i.test(this.selectedFile.name) || this.currentFileText === null) return;
    if (this.csvViewToggle.checked) {
      this._renderCsvPreview(this.currentFileText);
      this.setStatus(this.selectedFile.name + ' organizado em tabela.', 'success');
    } else {
      this._renderRawCsvPreview(this.currentFileText);
      this.setStatus(this.selectedFile.name + ' exibido como texto CSV.');
    }
    this.resize();
  },

  selectFile(name) {
    var entry = this.currentFiles.find((item) => item.name === name);
    if (!entry || entry.isDirectory || this.busy) return;

    this.selectedFile = entry;
    this.currentFileBytes = null;
    this.currentFileText = null;
    this.fileName.value = entry.name;
    this._applyFileIcon(this.previewIcon, entry, 'device-files-preview-icon');
    this.fileList.querySelectorAll('.device-file-item').forEach((item) => {
      var itemName = item.querySelector('.device-file-item-name');
      item.setAttribute('aria-selected', String(Boolean(itemName && itemName.textContent === entry.name)));
    });
    this._showPreviewMessage('Lendo ' + entry.name + '…', 'Aguarde a resposta da placa.');
    this._syncActionState();
    this.get_file(entry.path, entry.name);
  },

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
        var isText = true;
        try {
          text = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
        } catch (error) {
          isText = false;
          text = '# Este arquivo é binário e não pode ser exibido como código.\n# Você ainda pode baixá-lo para o computador.';
        }
        this.currentFileText = isText ? text : null;

        if (isText && /\.csv$/i.test(fileName)) {
          this.csvViewToggle.checked = true;
          this.csvViewControl.hidden = false;
          this._renderCsvPreview(text);
        } else {
          this.csvViewControl.hidden = true;
          this.preview.classList.remove('has-csv');
          this.csvPanel.setAttribute('aria-hidden', 'true');
          this.editor.setOption('mode', /\.py$/i.test(fileName) ? 'python' : null);
          this.editor.setValue(text);
          this.preview.classList.add('has-file');
          this.editorPanel.setAttribute('aria-hidden', 'false');
        }
        this.resize();
        this._syncActionState();
        this.setStatus(fileName + ' aberto (' + bytes.length + ' bytes).', 'success');
      } catch (error) {
        this.currentFileBytes = null;
        this.currentFileText = null;
        this._showPreviewMessage('Não foi possível abrir o arquivo', 'A resposta recebida não contém um arquivo válido.');
        this._syncActionState();
        this.setStatus('Não foi possível decodificar o conteúdo do arquivo.', 'error');
      }
    });
  },

  files_view(file) {
    this.selectFile(file);
  }

});
