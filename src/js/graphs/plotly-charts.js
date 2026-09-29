'use strict';

// Plot rendering for the laboratory. The UI owns CSV parsing and the summary cards.
(function(global) {
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char];
    });
  }

  function sample(points, limit) {
    if (points.length <= limit) return points;
    return Array.from({length: limit}, function(_, index) {
      return points[Math.round(index * (points.length - 1) / (limit - 1))];
    });
  }

  function trendLine(xs, ys) {
    if (xs.length < 2) return null;
    var meanX = xs.reduce(function(sum, x) { return sum + x; }, 0) / xs.length;
    var meanY = ys.reduce(function(sum, y) { return sum + y; }, 0) / ys.length;
    var denominator = xs.reduce(function(sum, x) { return sum + Math.pow(x - meanX, 2); }, 0);
    if (denominator < 1e-10) return null;
    var numerator = xs.reduce(function(sum, x, index) { return sum + (x - meanX) * (ys[index] - meanY); }, 0);
    var slope = numerator / denominator;
    var first = Math.min.apply(null, xs), last = Math.max.apply(null, xs);
    return {x: [first, last], y: [meanY + slope * (first - meanX), meanY + slope * (last - meanX)]};
  }

  function render(element, options) {
    if (!global.Plotly) return Promise.reject(new Error('A biblioteca Plotly.js não foi carregada.'));
    var visible = sample(options.points, options.type === 'bar' ? 48 : 250);
    var labels = visible.map(function(point) { return String(point.label); });
    var values = visible.map(function(point) { return point.value; });
    var numericX = labels.map(options.parseNumber);
    var scaledX = options.type !== 'bar' && numericX.length > 1 &&
      numericX.every(Number.isFinite) && Math.max.apply(null, numericX) !== Math.min.apply(null, numericX);
    // Category labels are kept as tick text; integer positions avoid Plotly's category reordering.
    var positions = scaledX ? numericX : labels.map(function(_, index) { return index; });
    var traces = [{
      x: positions, y: values, customdata: labels, name: options.yName,
      type: options.type === 'bar' ? 'bar' : 'scatter',
      mode: options.type === 'scatter' ? 'markers' : options.showPoints ? 'lines+markers' : 'lines',
      line: {color: '#4d73d6', width: 3},
      marker: {color: '#5278d4', size: options.type === 'scatter' ? 8 : 6},
      hovertemplate: '%{customdata}: %{y}<extra></extra>'
    }];
    if (options.type === 'bar') delete traces[0].mode;

    var valuesAll = options.points.map(function(point) { return point.value; });
    var mean = valuesAll.reduce(function(sum, value) { return sum + value; }, 0) / valuesAll.length;
    if (options.showMean && !options.isTimeVariable) {
      traces.push({
        x: [Math.min.apply(null, positions), Math.max.apply(null, positions)],
        y: [mean, mean], type: 'scatter', mode: 'lines', name: 'Média',
        line: {color: '#d17942', width: 2, dash: 'dash'}, hoverinfo: 'skip'
      });
    }
    if (options.showTrend) {
      var trend = trendLine(positions, values);
      if (trend) traces.push({
        x: trend.x, y: trend.y, type: 'scatter', mode: 'lines', name: 'Tendência',
        line: {color: '#138b87', width: 2.5, dash: 'dash'}, hoverinfo: 'skip'
      });
    }
    var ticks = [];
    if (!scaledX) {
      var count = Math.min(5, labels.length);
      for (var i = 0; i < count; i++) ticks.push(Math.round(i * (labels.length - 1) / Math.max(1, count - 1)));
      ticks = Array.from(new Set(ticks));
    }
    var layout = {
      autosize: true, height: 355, margin: {l: 70, r: 24, t: 20, b: 58},
      paper_bgcolor: '#ffffff', plot_bgcolor: '#ffffff',
      font: {family: 'Arial, sans-serif', color: '#52627f', size: 12},
      xaxis: {title: {text: escapeHtml(options.xName)}, zeroline: false, gridcolor: '#f1f4f9',
        tickmode: scaledX ? 'auto' : 'array', tickvals: scaledX ? undefined : ticks,
        ticktext: scaledX ? undefined : ticks.map(function(index) { return labels[index].slice(0, 16); })},
      yaxis: {title: {text: escapeHtml(options.yName)}, zeroline: false, gridcolor: '#e8edf5'},
      showlegend: false, hovermode: 'closest', bargap: 0.33
    };
    return global.Plotly.react(element, traces, layout, {
      responsive: true, displayModeBar: false, scrollZoom: false
    }).then(function() { return {shown: visible.length, hasTrend: traces.length > (options.showMean && !options.isTimeVariable ? 2 : 1)}; });
  }

  function clear(element) {
    if (global.Plotly && element && element.data) global.Plotly.purge(element);
  }

  function downloadSvg(element) {
    if (!global.Plotly || !element || !element.data) return Promise.reject(new Error('Não há gráfico para baixar.'));
    return global.Plotly.downloadImage(element, {
      format: 'svg', filename: 'grafico-bitdoglab', width: 900, height: 355
    });
  }

  global.LaboratoryGraphs = {render: render, clear: clear, downloadSvg: downloadSvg};
})(window);
