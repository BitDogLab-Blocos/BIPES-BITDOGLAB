'use strict';

// Progress bar for file transfers
class progress {
  constructor () {
	  this.dom = get ('.progress-bar');
	  this.div = document.createElement ('div');
	  this.dom.appendChild (this.div);

	  // Create text element to show percentage
	  this.text = document.createElement ('span');
	  this.text.className = 'progress-text';
	  this.div.appendChild (this.text);

	  this.len;
	  this.manual = false;
	}

	// Set progress by loaded/total bytes
	load (loaded, total) {
		var percent = (loaded * 100 / total);
		this.div.style.width = percent + '%';
		this.text.textContent = Math.round(percent) + '%';
	}
	// Set progress by remaining bytes
	remain (len_) {
		if (this.manual) return;
		var percent = ((this.len - len_) * 100 / this.len);
		this.div.style.width = percent + '%';
		this.text.textContent = Math.round(percent) + '%';
	}
	// Show progress bar
	start (len_, manual_) {
	  this.len = len_;
	  this.manual = !!manual_;
	  this.dom.id = 'on';
	  this.div.style.width = '0%';
	  this.text.textContent = '0%';
	}
	// Hide progress bar and reset
	end (force_) {
	  if (this.manual && !force_) return;
	  this.dom.id = '';
    this.div.style.width = '0%';
    this.text.textContent = '';
    this.manual = false;
	}
}

