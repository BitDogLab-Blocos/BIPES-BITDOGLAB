'use strict';

(function(global) {
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
  var DEFAULT_PADDING = 40;
  var DEFAULT_SCALE = 2;
  var MAX_OUTPUT_DIMENSION = 16384;
  var MAX_OUTPUT_AREA = 67108864;
  var STYLE_PROPERTIES = [
    'color',
    'fill',
    'fill-opacity',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'letter-spacing',
    'opacity',
    'paint-order',
    'shape-rendering',
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-rendering',
    'vector-effect',
    'word-spacing'
  ];

  function WorkspaceImageExportError(code, message) {
    this.name = 'WorkspaceImageExportError';
    this.code = code;
    this.message = message;
    if (Error.captureStackTrace) Error.captureStackTrace(this, WorkspaceImageExportError);
  }

  WorkspaceImageExportError.prototype = Object.create(Error.prototype);
  WorkspaceImageExportError.prototype.constructor = WorkspaceImageExportError;

  function getBlockCanvas(workspace) {
    if (!workspace || typeof workspace.getAllBlocks !== 'function') {
      throw new WorkspaceImageExportError('WORKSPACE_UNAVAILABLE', 'Blockly workspace is unavailable.');
    }
    if (workspace.getAllBlocks(false).length === 0) {
      throw new WorkspaceImageExportError('EMPTY_WORKSPACE', 'The workspace has no blocks.');
    }

    var canvas = typeof workspace.getCanvas === 'function' ? workspace.getCanvas() : null;
    if (!canvas) {
      throw new WorkspaceImageExportError('CANVAS_UNAVAILABLE', 'Blockly block canvas is unavailable.');
    }
    return canvas;
  }

  function getBlockBounds(blockCanvas) {
    var bounds;
    try {
      bounds = blockCanvas.getBBox();
    } catch (error) {
      throw new WorkspaceImageExportError('BOUNDS_FAILED', 'Could not measure the workspace blocks.');
    }

    if (!bounds || !isFinite(bounds.x) || !isFinite(bounds.y) ||
        !isFinite(bounds.width) || !isFinite(bounds.height) ||
        bounds.width <= 0 || bounds.height <= 0) {
      throw new WorkspaceImageExportError('BOUNDS_FAILED', 'The workspace block bounds are invalid.');
    }

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    };
  }

  function copyComputedStyles(sourceRoot, cloneRoot) {
    var sourceElements = [sourceRoot].concat(Array.prototype.slice.call(sourceRoot.querySelectorAll('*')));
    var cloneElements = [cloneRoot].concat(Array.prototype.slice.call(cloneRoot.querySelectorAll('*')));

    sourceElements.forEach(function(sourceElement, index) {
      var cloneElement = cloneElements[index];
      if (!cloneElement || sourceElement.nodeType !== 1) return;

      var computed = global.getComputedStyle(sourceElement);
      STYLE_PROPERTIES.forEach(function(property) {
        var value = computed.getPropertyValue(property);
        if (value) cloneElement.style.setProperty(property, value);
      });
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = function() { reject(reader.error || new Error('Could not read image resource.')); };
      reader.readAsDataURL(blob);
    });
  }

  async function inlineImageResources(cloneRoot) {
    var cache = new Map();
    var images = Array.prototype.slice.call(cloneRoot.querySelectorAll('image'));

    await Promise.all(images.map(async function(image) {
      var href = image.getAttribute('href') || image.getAttributeNS(XLINK_NAMESPACE, 'href') ||
        image.getAttribute('xlink:href');
      if (!href || href.charAt(0) === '#' || /^data:/i.test(href)) return;

      var absoluteUrl;
      try {
        absoluteUrl = new URL(href, document.baseURI).href;
      } catch (error) {
        return;
      }

      var dataUrlPromise = cache.get(absoluteUrl);
      if (!dataUrlPromise) {
        dataUrlPromise = global.fetch(absoluteUrl)
          .then(function(response) {
            if (!response.ok) throw new Error('Image request failed with status ' + response.status + '.');
            return response.blob();
          })
          .then(blobToDataUrl)
          .catch(function() { return absoluteUrl; });
        cache.set(absoluteUrl, dataUrlPromise);
      }

      var embeddedHref = await dataUrlPromise;
      image.setAttribute('href', embeddedHref);
      image.setAttributeNS(XLINK_NAMESPACE, 'xlink:href', embeddedHref);
    }));
  }

  async function createSvgBlob(workspace, options) {
    options = options || {};
    var padding = Math.max(0, Number(options.padding == null ? DEFAULT_PADDING : options.padding));
    var blockCanvas = getBlockCanvas(workspace);
    var bounds = getBlockBounds(blockCanvas);
    var width = Math.ceil(bounds.width + padding * 2);
    var height = Math.ceil(bounds.height + padding * 2);

    var svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    svg.setAttribute('xmlns', SVG_NAMESPACE);
    svg.setAttribute('xmlns:xlink', XLINK_NAMESPACE);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', [bounds.x - padding, bounds.y - padding, width, height].join(' '));

    var parentSvg = typeof workspace.getParentSvg === 'function' ? workspace.getParentSvg() : null;
    var definitions = parentSvg ? parentSvg.querySelector('defs') : null;
    if (definitions) svg.appendChild(definitions.cloneNode(true));

    var clonedCanvas = blockCanvas.cloneNode(true);
    clonedCanvas.removeAttribute('transform');
    clonedCanvas.classList.remove('blocklyDragging');
    copyComputedStyles(blockCanvas, clonedCanvas);
    await inlineImageResources(clonedCanvas);
    svg.appendChild(clonedCanvas);

    var source = new XMLSerializer().serializeToString(svg);
    return {
      blob: new Blob([source], { type: 'image/svg+xml;charset=utf-8' }),
      width: width,
      height: height,
      bounds: bounds
    };
  }

  function fitOutputScale(width, height, requestedScale) {
    var scale = Math.max(0.1, Number(requestedScale || DEFAULT_SCALE));
    scale = Math.min(scale, MAX_OUTPUT_DIMENSION / width, MAX_OUTPUT_DIMENSION / height);
    scale = Math.min(scale, Math.sqrt(MAX_OUTPUT_AREA / (width * height)));
    return Math.max(0.1, scale);
  }

  function loadSvgImage(svgBlob) {
    return new Promise(function(resolve, reject) {
      var objectUrl = URL.createObjectURL(svgBlob);
      var image = new Image();
      image.onload = function() {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = function() {
        URL.revokeObjectURL(objectUrl);
        reject(new WorkspaceImageExportError('SVG_LOAD_FAILED', 'Could not render the exported SVG.'));
      };
      image.src = objectUrl;
    });
  }

  function canvasToPngBlob(canvas) {
    return new Promise(function(resolve, reject) {
      try {
        canvas.toBlob(function(blob) {
          if (blob) resolve(blob);
          else reject(new WorkspaceImageExportError('PNG_FAILED', 'The browser did not create a PNG image.'));
        }, 'image/png');
      } catch (error) {
        reject(new WorkspaceImageExportError('PNG_FAILED', error.message || 'Could not create the PNG image.'));
      }
    });
  }

  async function createPngBlob(workspace, options) {
    options = options || {};
    if (global.Blockly && typeof global.Blockly.hideChaff === 'function') global.Blockly.hideChaff();

    var svgResult = await createSvgBlob(workspace, options);
    var scale = fitOutputScale(svgResult.width, svgResult.height, options.scale);
    var outputWidth = Math.max(1, Math.round(svgResult.width * scale));
    var outputHeight = Math.max(1, Math.round(svgResult.height * scale));
    var image = await loadSvgImage(svgResult.blob);
    var canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    var context = canvas.getContext('2d');
    if (!context) {
      throw new WorkspaceImageExportError('CANVAS_UNAVAILABLE', 'The browser does not support 2D canvas rendering.');
    }

    if (options.background) {
      context.fillStyle = options.background;
      context.fillRect(0, 0, outputWidth, outputHeight);
    }
    context.drawImage(image, 0, 0, outputWidth, outputHeight);

    return {
      blob: await canvasToPngBlob(canvas),
      width: outputWidth,
      height: outputHeight,
      scale: scale,
      bounds: svgResult.bounds
    };
  }

  function downloadBlob(blob, filename) {
    var objectUrl = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename || 'programa-bitdoglab.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    global.setTimeout(function() { URL.revokeObjectURL(objectUrl); }, 1000);
  }

  async function download(workspace, options) {
    options = options || {};
    var result = await createPngBlob(workspace, options);
    downloadBlob(result.blob, options.filename || 'programa-bitdoglab.png');
    return result;
  }

  global.WorkspaceImageExport = {
    createSvgBlob: createSvgBlob,
    createPngBlob: createPngBlob,
    download: download,
    Error: WorkspaceImageExportError
  };
})(window);
