'use strict';

// Base class for toggleable UI panels
function panel (button_, panel_) {
  this.panel_ = panel_;
  this.button = get (button_);
  this.panel = get (panel_);
  if (this.button) this.button.onclick = () => {this.showPanel ()};
}
// Toggle panel visibility
panel.prototype.showPanel = function () {
  if (!this.panel) return;
  let panel_ = UI ['responsive'].panels [this.panel_];

  UI ['responsive'].closeZone._dom.classList.add('on') // Activate close overlay

  if(!panel_.show) {
    this.panel.id = "show";
 } else {
    this.panel.id = '';
  }
  panel_.show = !panel_.show; // Toggle state
  if (this.onOpenPanel_ != undefined)
    this.onOpenPanel_ ();
}

channelPanel.prototype = Object.create (panel.prototype);
// Channel panel: switches communication protocols
function channelPanel (button_, panel_) {
	panel.call (this, button_, panel_);
  this.serial = get ('#serialButton');
  this.hidePanel = (target_) => {
    this.panel.id = '';
    this.button.className = `icon ${target_}`;
    UI ['responsive'].panels [this.panel_].show = false;
  };

  this.button.className = `icon ${Channel ['mux'].currentChannel}`;
  this.serial.onclick = () => {this.hidePanel ('webserial'); Channel ['mux'].switch('webserial');};
}

// Responsive layout manager: handles panel positioning and dead zones
class responsive {
  constructor () {
    this.mobile = window.innerWidth < 60*$em ? true : false; // 960px breakpoint
    this.body = get ('body');
    this.closeZone = new DOM('div', {id:"closeZone"})
      .onclick (this, this.hidePanels)

    // Dead zones for each panel (tap outside to close)
	  this.panels = {'.toolbar':{from:'toolbar',x:$em*22, x2:0, y:$em*7.5, show:false},
	                 '.language-panel':{from:'language-panel',x:$em*22, x2:0, y:$em*6.5, show:false},
	                 '.channel-panel':{from:'channel-panel',x:$em*42.5, x2:$em*22, y:$em*24.5, show:false}};

    this.body.append(this.closeZone._dom)

    this.binded = false;

    window.onresize = () => {
      Files.resize ();
      term.resize ();

      this.mobile = window.innerWidth < 60*$em ? true : false;
    };
  }
}
// Close all open panels
responsive.prototype.hidePanels = function (ev) {
  for (const prop in this.panels) {
      let ui_ = UI [this.panels[prop].from];
      if (ui_ && ui_.panel) ui_.panel.id='';
      this.panels[prop].show = false
  }
  this.closeZone._dom.classList.remove('on')
}

