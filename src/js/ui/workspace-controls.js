'use strict';

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

