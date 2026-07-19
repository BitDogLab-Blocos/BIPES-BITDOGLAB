'use strict';

// Window lifecycle, dragging, resizing and maximize behavior.
DeviceFilesManager.extend({
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
  },

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
  },

  resize() {
    if (!this.isOpen()) return;
    window.setTimeout(() => {
      this.editor.setSize('100%', '100%');
      this.editor.refresh();
    }, 0);
  },

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
  },

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
  },

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
  },

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
  },

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

});
