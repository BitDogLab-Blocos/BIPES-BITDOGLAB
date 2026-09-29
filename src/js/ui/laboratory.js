'use strict';

// Front-end explorer. A board integration can call setBoardFiles() and setBoardLoader().
(function(global) {
  var root = document.getElementById('content_laboratorio');
  if (!root) return;

  var $ = function(selector) { return root.querySelector(selector); };
  var ui = {
    file: $('#labFileSelect'), refresh: $('#labRefreshFiles'),
    status: $('#labSourceStatus'), x: $('#labXAxis'), y: $('#labYAxis'), hint: $('#labAxisHint'),
    mean: $('#labMeanToggle'), trend: $('#labTrendToggle'), points: $('#labPointsToggle'),
    chart: $('#labChart'), legend: $('#labChartLegend'), title: $('#labChartTitle'),
    subtitle: $('#labChartSubtitle'), download: $('#labDownloadChart'),
    meanValue: $('#labMeanValue'), meanLabel: $('#labMeanLabel'),
    medianValue: $('#labMedianValue'), medianLabel: $('#labMedianLabel'),
    minValue: $('#labMinValue'), minLabel: $('#labMinLabel'),
    maxValue: $('#labMaxValue'), maxLabel: $('#labMaxLabel'),
    averages: $('#labAverages'), table: $('#labTable'), tableCount: $('#labTableCount')
  };
  var sources = new Map();
  var boardLoader = null;
  var selectedId = null;
  var data = null;
  var chartType = 'line';
  var renderVersion = 0;
  var svgNs = 'http://www.w3.org/2000/svg';

  function setStatus(message, isError) {
    ui.status.textContent = message;
    ui.status.style.borderLeftColor = isError ? '#c94d55' : '#8db0eb';
  }

  function parseRows(text, delimiter) {
    var source = String(text || '').replace(/^\uFEFF/, '');
    var rows = [], row = [], cell = '', quoted = false;
    for (var i = 0; i < source.length; i++) {
      var char = source[i];
      if (quoted) {
        if (char === '"' && source[i + 1] === '"') { cell += '"'; i++; }
        else if (char === '"') quoted = false;
        else cell += char;
      } else if (char === '"' && cell === '') quoted = true;
      else if (char === delimiter) { row.push(cell); cell = ''; }
      else if (char === '\n' || char === '\r') {
        if (char === '\r' && source[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += char;
    }
    if (quoted) throw new Error('O CSV contém aspas sem fechamento.');
    if (cell !== '' || row.length || source.length) { row.push(cell); rows.push(row); }
    return rows.filter(function(item) { return item.some(function(value) { return value.trim() !== ''; }); });
  }

  function parseCsv(text) {
    var candidates = [',', ';', '\t', '|'];
    var best = null;
    candidates.forEach(function(delimiter) {
      var rows = parseRows(text, delimiter);
      var width = rows.length ? rows[0].length : 0;
      var consistent = rows.slice(1, 21).filter(function(row) { return row.length === width; }).length;
      var score = width > 1 ? consistent * 10 + width : 0;
      if (!best || score > best.score) best = {rows: rows, score: score};
    });
    var rows = best.rows;
    if (!rows.length || rows[0].length < 2 || rows.length < 2) {
      throw new Error('Use um CSV com cabeçalho, duas ou mais colunas e pelo menos uma medição.');
    }
    var headers = rows[0].map(function(value, index) { return value.trim() || 'Coluna ' + (index + 1); });
    return {
      headers: headers,
      rows: rows.slice(1).map(function(row) {
        return headers.map(function(_, index) { return (row[index] || '').trim(); });
      })
    };
  }

  function number(value) {
    var cleaned = String(value == null ? '' : value).trim().replace(/\s/g, '');
    if (!cleaned) return NaN;
    if (/^-?\d+(?:,\d+)?$/.test(cleaned)) cleaned = cleaned.replace(',', '.');
    return /^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(cleaned) ? Number(cleaned) : NaN;
  }

  function isTime(header) { return /tempo|time|data|date|hora|hor[aá]rio|timestamp|dura[cç][aã]o/i.test(header); }
  function numericColumns() {
    if (!data) return [];
    return data.headers.map(function(_, index) { return index; }).filter(function(index) {
      var values = data.rows.map(function(row) { return row[index]; }).filter(Boolean);
      return values.length && values.some(function(value) { return Number.isFinite(number(value)); }) &&
        values.filter(function(value) { return Number.isFinite(number(value)); }).length / values.length >= .7;
    });
  }
  function fmt(value, digits) {
    return Number.isFinite(value) ? new Intl.NumberFormat('pt-BR', {maximumFractionDigits: digits == null ? 2 : digits}).format(value) : '—';
  }
  function average(values) { return values.reduce(function(sum, value) { return sum + value; }, 0) / values.length; }
  function median(values) {
    var sorted = values.slice().sort(function(a, b) { return a - b; });
    var middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }
  function option(value, label) { var el = document.createElement('option'); el.value = String(value); el.textContent = label; return el; }

  function renderFileList() {
    ui.file.replaceChildren();
    var entries = Array.from(sources.values());
    if (!entries.length) { ui.file.appendChild(option('', 'Nenhum CSV encontrado na placa')); ui.file.disabled = true; return; }
    ui.file.appendChild(option('', 'Selecione um arquivo da placa'));
    entries.forEach(function(entry) { ui.file.appendChild(option(entry.id, entry.name)); });
    ui.file.disabled = false;
    ui.file.value = sources.has(selectedId) ? selectedId : '';
  }

  function renderAxes(reset) {
    var previousX = reset ? null : ui.x.value;
    var previousY = reset ? null : ui.y.value;
    var numeric = numericColumns();
    ui.x.replaceChildren(); ui.y.replaceChildren();
    data.headers.forEach(function(header, index) { ui.x.appendChild(option(index, header)); });
    numeric.forEach(function(index) { ui.y.appendChild(option(index, data.headers[index])); });
    var defaultX = data.headers.findIndex(isTime);
    if (defaultX < 0 && numeric.length === 1) defaultX = data.headers.findIndex(function(_, index) { return index !== numeric[0]; });
    if (defaultX < 0) defaultX = numeric.length > 1 ? numeric[0] : 0;
    var defaultY = numeric.find(function(index) { return index !== defaultX && !isTime(data.headers[index]); });
    if (defaultY == null) defaultY = numeric.find(function(index) { return index !== defaultX; });
    if (defaultY == null) defaultY = numeric[0];
    ui.x.value = previousX !== null && Number(previousX) < data.headers.length ? previousX : String(defaultX);
    ui.y.value = previousY !== null && numeric.indexOf(Number(previousY)) !== -1 ? previousY : String(defaultY);
    ui.x.disabled = false;
    ui.y.disabled = !numeric.length;
    ui.trend.disabled = !numeric.length;
    ui.points.disabled = !numeric.length;
    root.querySelectorAll('.lab-chart-type').forEach(function(button) { button.disabled = !numeric.length; });
    ui.hint.textContent = numeric.length ? 'As médias ignoram colunas de tempo e data.' : 'Este CSV não possui uma coluna numérica para o eixo Y.';
  }

  function renderTable() {
    ui.table.replaceChildren();
    var table = document.createElement('table');
    var head = document.createElement('thead'); var headingRow = document.createElement('tr');
    data.headers.forEach(function(header) { var th = document.createElement('th'); th.scope = 'col'; th.textContent = header; headingRow.appendChild(th); });
    head.appendChild(headingRow); table.appendChild(head);
    var body = document.createElement('tbody');
    data.rows.slice(0, 6).forEach(function(row) {
      var tr = document.createElement('tr');
      row.forEach(function(value) { var td = document.createElement('td'); td.textContent = value; tr.appendChild(td); });
      body.appendChild(tr);
    });
    table.appendChild(body); ui.table.appendChild(table);
    ui.tableCount.textContent = 'Mostrando ' + Math.min(6, data.rows.length) + ' de ' + data.rows.length + ' linhas';
  }

  function renderAverages() {
    ui.averages.replaceChildren();
    var columns = numericColumns().filter(function(index) { return !isTime(data.headers[index]); });
    if (!columns.length) { ui.averages.textContent = 'Não há variáveis numéricas para calcular médias.'; ui.averages.className = 'lab-averages lab-empty-inline'; return; }
    ui.averages.className = 'lab-averages';
    columns.forEach(function(index) {
      var values = data.rows.map(function(row) { return number(row[index]); }).filter(Number.isFinite);
      var item = document.createElement('div'); item.className = 'lab-average-item';
      var name = document.createElement('span'); name.textContent = data.headers[index];
      var result = document.createElement('strong'); result.textContent = fmt(average(values));
      item.append(name, result); ui.averages.appendChild(item);
    });
  }

  function emptyChart(title, detail) {
    renderVersion++;
    LaboratoryGraphs.clear(ui.chart);
    ui.chart.replaceChildren(); ui.legend.replaceChildren(); ui.download.disabled = true;
    ui.title.textContent = title; ui.subtitle.textContent = detail;
    ui.meanValue.textContent = '—'; ui.meanLabel.textContent = 'Selecione uma variável';
    ui.medianValue.textContent = '—'; ui.medianLabel.textContent = 'da variável escolhida';
    ui.minValue.textContent = '—'; ui.minLabel.textContent = 'da variável escolhida';
    ui.maxValue.textContent = '—'; ui.maxLabel.textContent = 'da variável escolhida';
    var box = document.createElement('div'); box.className = 'lab-chart-empty';
    var copy = document.createElement('div');
    var strong = document.createElement('strong'); strong.textContent = title;
    var span = document.createElement('span'); span.textContent = detail;
    copy.append(strong, span); box.appendChild(copy); ui.chart.appendChild(box);
  }
  function clearData() {
    data = null;
    root.querySelector('.lab-app').classList.remove('has-data');
    ui.x.replaceChildren(option('', 'Escolha um CSV primeiro'));
    ui.y.replaceChildren(option('', 'Escolha um CSV primeiro'));
    ui.x.disabled = true; ui.y.disabled = true;
    ui.mean.disabled = true; ui.trend.disabled = true; ui.points.disabled = true;
    root.querySelectorAll('.lab-chart-type').forEach(function(button) { button.disabled = true; });
    ui.hint.textContent = 'As colunas aparecem depois que o CSV for lido.';
    ui.averages.className = 'lab-averages lab-empty-inline';
    ui.averages.textContent = 'As médias aparecerão após a seleção de um CSV da placa.';
    ui.table.replaceChildren();
    var empty = document.createElement('p'); empty.className = 'lab-table-empty';
    empty.textContent = 'As primeiras linhas do arquivo aparecerão aqui.'; ui.table.appendChild(empty);
    ui.tableCount.textContent = '';
    emptyChart('Aguardando dados da placa', 'Escolha um CSV salvo na BitDogLab.');
  }
  function legend(label, kind) {
    var item = document.createElement('span'); item.className = 'lab-legend-item';
    var swatch = document.createElement('span'); swatch.className = 'lab-legend-swatch' + (kind ? ' is-' + kind : '');
    item.append(swatch, document.createTextNode(label)); ui.legend.appendChild(item);
  }

  function renderChart() {
    if (!data || ui.y.disabled) { emptyChart('Ainda não há um gráfico', 'Escolha um CSV com uma coluna numérica.'); return; }
    var xIndex = Number(ui.x.value), yIndex = Number(ui.y.value);
    var xName = data.headers[xIndex], yName = data.headers[yIndex];
    var points = data.rows.map(function(row) { return {label: row[xIndex], value: number(row[yIndex])}; })
      .filter(function(point) { return point.label !== '' && Number.isFinite(point.value); });
    var timeVariable = isTime(yName);
    ui.mean.disabled = timeVariable;
    if (!points.length) { emptyChart('Sem medidas para mostrar', 'Confira as colunas escolhidas para os eixos.'); return; }
    var values = points.map(function(point) { return point.value; });
    var mean = average(values);
    ui.meanValue.textContent = timeVariable ? 'Não se aplica' : fmt(mean);
    ui.meanLabel.textContent = timeVariable ? 'Tempo e data não têm média' : yName;
    ui.medianValue.textContent = timeVariable ? 'Não se aplica' : fmt(median(values));
    ui.medianLabel.textContent = timeVariable ? 'Tempo e data não têm mediana' : yName;
    ui.minValue.textContent = fmt(values.reduce(function(a, b) { return Math.min(a, b); })); ui.minLabel.textContent = yName;
    ui.maxValue.textContent = fmt(values.reduce(function(a, b) { return Math.max(a, b); })); ui.maxLabel.textContent = yName;
    ui.title.textContent = yName + ' por ' + xName;
    var limit = chartType === 'bar' ? 48 : 250;
    ui.subtitle.textContent = points.length + ' medições válidas' + (points.length > limit ? ' · ' + limit + ' exibidas no gráfico' : '') + ' · ' + sources.get(selectedId).name;
    ui.download.disabled = true;
    ui.legend.replaceChildren(); legend(yName);
    if (ui.mean.checked && !timeVariable) legend('Média', 'mean');
    if (ui.trend.checked) legend('Tendência', 'trend');
    var version = ++renderVersion;
    LaboratoryGraphs.render(ui.chart, {
      points: points, xName: xName, yName: yName, type: chartType,
      parseNumber: number, showMean: ui.mean.checked, showTrend: ui.trend.checked,
      showPoints: ui.points.checked, isTimeVariable: timeVariable
    }).then(function() {
      if (version === renderVersion) ui.download.disabled = false;
    }).catch(function(error) {
      if (version === renderVersion) {
        emptyChart('Não foi possível mostrar o gráfico', error.message);
        setStatus(error.message, true);
      }
    });
  }

  async function selectSource(id) {
    var source = sources.get(id);
    if (!source) { selectedId = null; clearData(); return; }
    selectedId = id; ui.file.value = id;
    if (source.kind === 'board' && source.text == null) {
      if (!boardLoader) { clearData(); emptyChart('Leitura da placa indisponível', 'A conexão com os arquivos será ligada ao backend.'); setStatus('A leitura de arquivos da placa será ligada ao backend.', true); return; }
      setStatus('Lendo ' + source.name + ' da placa…');
      try { source.text = await boardLoader(source.path); }
      catch (error) { clearData(); emptyChart('Não foi possível ler o CSV', 'Tente selecionar outro arquivo.'); setStatus('Não foi possível ler o arquivo da placa.', true); return; }
      if (selectedId !== id) return;
    }
    try {
      data = parseCsv(source.text);
      root.querySelector('.lab-app').classList.add('has-data');
      renderAxes(true); renderTable(); renderAverages(); renderChart();
      setStatus(source.name + ' carregado · ' + data.rows.length + ' medições.');
    } catch (error) { clearData(); emptyChart('Não foi possível abrir este CSV', error.message); setStatus(error.message, true); }
  }

  ui.file.addEventListener('change', function() { if (ui.file.value) selectSource(ui.file.value); });
  ui.x.addEventListener('change', renderChart); ui.y.addEventListener('change', renderChart);
  [ui.mean, ui.trend, ui.points].forEach(function(input) { input.addEventListener('change', renderChart); });
  root.querySelectorAll('.lab-chart-type').forEach(function(button) {
    button.addEventListener('click', function() {
      chartType = button.dataset.chart;
      root.querySelectorAll('.lab-chart-type').forEach(function(item) { var active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      renderChart();
    });
  });
  ui.refresh.addEventListener('click', function() {
    setStatus('Buscando arquivos CSV da placa…');
    global.dispatchEvent(new CustomEvent('laboratory:request-files'));
    if (!boardLoader) setStatus('A busca de arquivos da placa será ligada ao backend.');
  });
  ui.download.addEventListener('click', function() {
    LaboratoryGraphs.downloadSvg(ui.chart).catch(function(error) { setStatus(error.message, true); });
  });

  global.LaboratoryData = {
    // files: [{name: 'medidas.csv', path: '/medidas.csv'}]
    setBoardFiles: function(files) {
      Array.from(sources.keys()).filter(function(id) { return id.indexOf('board:') === 0; }).forEach(function(id) { sources.delete(id); });
      var csvFiles = (files || []).filter(function(file) { return file && /\.csv$/i.test(file.name); });
      csvFiles.forEach(function(file) {
        var path = file.path || file.name, id = 'board:' + path;
        sources.set(id, {id: id, kind: 'board', name: file.name, path: path, text: file.text == null ? null : file.text});
      });
      selectedId = null; clearData();
      renderFileList(); setStatus(csvFiles.length ? csvFiles.length + ' CSV(s) encontrado(s) na placa. Selecione um arquivo.' : 'Nenhum CSV encontrado na placa.');
    },
    // loader(path) returns a Promise<string> with the CSV content.
    setBoardLoader: function(loader) { boardLoader = loader; }
  };

  renderFileList(); clearData();
})(window);
