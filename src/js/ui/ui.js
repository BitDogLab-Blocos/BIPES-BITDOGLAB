'use strict';
function get (e) {return document.querySelector (e); }

var $em = 16; // size of 1em

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

// Account state used by project persistence and autosave
function account () {

	this.currentProject = {uid:'', xml:''};
	this.projects = {}; // {uid: timestamp}

  try {
    this.restoreProjects(JSON.parse(localStorage.getItem('bipes_projects') || '{}'));
  } catch (e) {
    console.warn('[Account] Failed to restore project list:', e);
    this.restoreProjects({});
  }
}
// Restore project state from localStorage and discard orphaned entries
account.prototype.restoreProjects = function (projects_) {
  this.projects = (projects_ && typeof projects_ === 'object') ? projects_ : {};

  var hasValidProjects = false;
  for (const prop in this.projects) {
    if (localStorage[prop]) {
      hasValidProjects = true;
    } else {
      delete this.projects[prop]; // Clean orphaned project references
    }
  }

  // If we have projects but currentProject.uid is not set, set it to the first one
  if (hasValidProjects && !this.currentProject.uid) {
    var firstProjectUid = Object.keys(this.projects)[0];
    this.currentProject.uid = firstProjectUid;
    this.currentProject.xml = localStorage[firstProjectUid];
    console.log('[Account] Initialized currentProject.uid to:', firstProjectUid);
  }
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


// Workspace manager: integrates Blockly, devices, and code execution
class workspace {
  constructor () {
    if (window.location.pathname.includes ('index.html') && window.location.protocol == 'file:') {
      alert('You will now be redirected to the offline version.');
      window.location.replace("index_offline.html");
    }

    this.selector = get('#device_selector');
    this.toolbarButton = get('#toolbarButton');
    this.channel_connect = get('#channel_connect');
    this.runButton = {
        dom:get('#runButton'),
        status:true
      };
    this.connectButton = get('#connectButton');
    this.saveButton = get('#saveButton');
    this.loadButton = get('#loadXML');
    this.saveMainButton = get('#saveMainButton');
    this.connectButton.onclick = () => {this.connectClick ()};
    this.runButton.dom.onclick = () => {this.run ()};
    this.saveButton.onclick = () => {this.saveXML ()};
    if (this.saveMainButton) this.saveMainButton.onclick = () => {this.saveMain ()};
	  this.loadButton.addEventListener ('change', () => {this.loadXML ()});

    this.resetBoard = get('#resetBoard');

    this.term = get('#term');
  }
}

// Run or stop Python program (auto-connects if needed)
workspace.prototype.run = function () {
  if (this.runButton.status) {
    if(mux.connected ()) {
        Tool.runPython();
    } else {
      Channel ['mux'].connect ();
      setTimeout(() => { if (mux.connected ()) Tool.runPython();}, 2000); // Wait 2s for connection
    }
  } else {
    Tool.stopPython();
  }
}

// Save generated code as main.py on the board (auto-connects if needed)
workspace.prototype.saveMain = function () {
  if (mux.connected ()) {
    Tool.saveAsMainPy ();
  } else {
    Channel ['mux'].connect ();
    setTimeout(() => { if (mux.connected ()) Tool.saveAsMainPy ();}, 2000);
  }
}

// UI: connecting state
workspace.prototype.connecting = function () {
  this.toolbarButton.className = 'icon medium wait';
  this.channel_connect.className = 'wait';
}

// Toggle connect/disconnect
workspace.prototype.connectClick = function () {
  if (mux.connected ()) {
    mux.disconnect ();
  } else {
    Channel ['mux'].connect ();
  }
}

// UI: receiving data (code running)
workspace.prototype.receiving = function () {
  this.channel_connect.className = '';
  this.runButton.status = false; // false = running, true = stopped
  this.runButton.dom.className = 'icon on';
  this.toolbarButton.className = 'icon medium on';
  this.connectButton.className = 'icon on';
  this.term.className = 'on';
}

// UI: idle state (code stopped)
workspace.prototype.runAbort = function () {
  this.channel_connect.className = '';
  this.runButton.status = true;
  this.runButton.dom.className = 'icon';
  this.toolbarButton.className = 'icon medium';
  this.connectButton.className = 'icon';
  this.term.className = '';
  this.connectButton.value = "Connect";
}

// Generate and download XML file
workspace.prototype.saveXML = function (uid) {
  let xmlText = '';
  if (uid == undefined) {
    xmlText = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));
    xmlText = this.writeWorkspace (xmlText, true);
  } else {
    // Format XML from localStorage
    xmlText = Blockly.Xml.domToPrettyText(Blockly.Xml.textToDom(localStorage [uid]));
  }

  let data = "data:x-application/xml;charset=utf-8," + encodeURIComponent(xmlText);
	let element = document.createElement('a');
	element.setAttribute('href', data),
	element.setAttribute('download', 'workspace.bipes.xml'),
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click ();
	document.body.removeChild(element);
}

// Extract metadata from BIPES XML (device, timestamp)
workspace.prototype.readWorkspace = function (xml, prettyText) {
  let regex_;
  if (prettyText)
    regex_ = /(<workspace>.*<\/workspace>\n)/s; // /s flag for multiline matching
  else
    regex_ = /(<workspace>.*<\/workspace>)/;
  if (regex_.test(xml)) {
    let workspace_chunk = xml.match (regex_) [0];
    xml = xml.replace (regex_,''); // Remove metadata from XML

    try {
      let timestamp = workspace_chunk.match(/<field name="TIMESTAMP">(.+?)<\/field>/) [1];
    } catch (e) {UI ['notify'].log(e)}
    try {
      let device = workspace_chunk.match(/<field name="DEVICE">(.+?)<\/field>/) [1];
      if (this.selector && (device === 'v6' || device === 'v7')) {
        this.selector.value = device;
      }
    } catch(e) {UI ['notify'].log(e)}
  } else {
    if (this.selector && !this.selector.value) this.selector.value = 'v7';
  }
  return xml;
}

// Add metadata to Blockly XML (device, timestamp)
workspace.prototype.writeWorkspace = function (xml, prettyText) {
  let timestamp =  + new Date();
  let device = this.selector.value;

  xml = xml.replace(/(xmlns=")(?:.+?)(")/g, '$1https://bipes.net.br$2')
  if (prettyText)
    xml = xml.replace(/(<xml xmlns=".+?">\n)/, `$1  <workspace>\n    <field name="DEVICE">${device}</field>\n    <field name="TIMESTAMP">${timestamp}</field>\n  </workspace>\n`);
  else
    xml = xml.replace(/(<xml xmlns=".+?">)/, `$1<workspace><field name="DEVICE">${device}</field><field name="TIMESTAMP">${timestamp}</field></workspace>`);
  return xml;
}

// Load XML from file input
workspace.prototype.loadXML = function () {
  if  (this.loadButton.files [0] != undefined) {
      let file = this.loadButton.files [0]
    if(/.xml$/.test(file.name) && file.type == 'text/xml'){
      let reader = new FileReader ();
      reader.readAsText(file,'UTF-8');
      reader.onload = readerEvent => {
        let content = this.readWorkspace (readerEvent.target.result, true);
        try {
          let xml = Blockly.Xml.textToDom(content);
          Blockly.Xml.domToWorkspace(xml, Code.workspace);
        }
        catch (e) {
          UI ['notify'].log(e)
          if (/Error: Variable id, (.*) is already in use\.$/.test(e)) // Blockly duplicate ID error
            UI ['notify'].send (`Unique variable is already in use, could not load ${file.name}.`);
          else
            UI ['notify'].send (`Failed to parse data, could not load ${file.name}.`);
          this.loadButton.value = '' // Reset file input
          return;
        }
        UI ['notify'].send (MSG['blocksLoadedFromFile'].replace('%1', file.name));
        this.loadButton.value = ''
      }
    } else {
      UI ['notify'].send ('No valid file selected to load.');
    }
  }
}
