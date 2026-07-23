(function hardenBitDogLabMobileContent(global) {
  'use strict';

  function renderText(container, text, keepPrevious) {
    const previous = keepPrevious ? Array.from(container.childNodes) : [];
    container.replaceChildren(document.createTextNode(String(text)));
    if (previous.length) {
      container.appendChild(document.createElement('hr'));
      previous.forEach((node) => container.appendChild(node));
    }
  }

  function installSafeNotifications() {
    const notifier = global.UI && global.UI.notify;
    if (!notifier || !notifier.container) {
      return;
    }

    notifier.send = function sendSafeNotification(message) {
      if (global.Code && global.Code.translateText) {
        message = global.Code.translateText(message);
      }
      message = String(message);
      console.log(`Notification: ${message}`);

      const time = global.Tool.unix2date(+new Date());
      const renderedMessage = `[${time}] ${message}`;
      const isDuplicate = this.lastMessage === message && this.container.id === 'show';

      if (isDuplicate) {
        this.buffer_count += 1;
        renderText(this.container, `(${this.buffer_count}x) ${renderedMessage}`, false);
      } else {
        renderText(this.container, renderedMessage, this.container.hasChildNodes());
        this.buffer_count = 0;
      }

      this.lastMessage = message;
      this.container.id = 'show';
      global.clearTimeout(this.timeOut);
      global.clearTimeout(this.timeOut2);
      this.timeOut = global.setTimeout(() => {
        this.container.id = '';
        this.buffer_count = 0;
        this.timeOut2 = global.setTimeout(() => {
          this.container.replaceChildren();
          this.lastMessage = '';
        }, 150);
      }, 3000);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installSafeNotifications, { once: true });
  } else {
    installSafeNotifications();
  }
})(window);
