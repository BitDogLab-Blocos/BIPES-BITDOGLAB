'use strict';

// Notification system: shows temporary alerts and records diagnostic logs
class notify {
  constructor () {
	  this.container = get ('.notify');
    if (this.container) this.container.innerHTML = '';
    this.lastMessage = '';
    this.logs = [];
    this.buffer_count = 0;
    this.timeOut;
    this.timeOut2;
  }
}
// Show notification (auto-hides after 3s, groups duplicates)
notify.prototype.send = function (message) {
  if (Code.translateText) {
    message = Code.translateText(message);
  }
  console.log (`Notification: ${message}`);
  if (!this.container) return;

  let time_ = Tool.unix2date(+new Date);
  let message_ = `[${time_}] ${message}`;

  if(this.lastMessage == message && this.container.id == 'show') { // Group duplicate messages
    this.buffer_count = this.buffer_count + 1;
    this.container.innerHTML = `(${this.buffer_count}x) ${message_}`; // Show counter
  } else {
    if (this.container.innerHTML == '')
      this.container.innerHTML = message_;
    else
      this.container.innerHTML = `${message_}<hr>${this.container.innerHTML}`;
    this.buffer_count = 0;
  }
  this.lastMessage = message;
  this.container.id = 'show';

  window.clearTimeout(this.timeOut);
  window.clearTimeout(this.timeOut2);
  this.timeOut = setTimeout( () => { // Hide after 3s
    this.container.id = '';
    this.buffer_count = 0;
    this.timeOut2 = setTimeout( () => {
      this.container.innerHTML = '';
      this.lastMessage = '';
    }, 150); // Clear content after fade
  }, 3000);
}
// Log message silently (no UI notification)
notify.prototype.log = function (message) {
  this.logs.push ({timestamp: +new Date, message: message});
}
