'use strict';
function get (e) {return document.querySelector (e); }
function getIn (a, b) {return a.querySelector (b); }

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
    if(panel_.from == 'notify-panel')
      UI ['notify'].container.id = ''; // Hide temp notification when opening panel
 } else {
    this.panel.id = '';
  }
  panel_.show = !panel_.show; // Toggle state
  if (this.onOpenPanel_ != undefined)
    this.onOpenPanel_ ();
}

account.prototype = Object.create (panel.prototype);
// Account panel: manages user projects and settings
function account (button_, panel_) {
	panel.call (this, button_, panel_);
  this.projectList = get("#ProjectList");
  this.newProjectButton = get('#newProjectButton');
  this.dom_username = get('#account_user');
  if (this.dom_username) {
    this.dom_username.addEventListener("input", () => {localStorage.setItem('account_user', this.dom_username.innerText)});
  }
  if (this.newProjectButton) {
    this.newProjectButton.onclick = () => {this.newProject ()};
  }

  this.currentProject = {uid:'', xml:''};
	this.projects = {}; // {uid: timestamp}

	if (this.dom_username) {
	  if (localStorage ['account_user']) {
	    this.dom_username.innerText = localStorage ['account_user'];
	  } else {
	    localStorage.setItem('account_user', 'User');
	  }
	}
}
// Restore projects from localStorage and list valid ones
account.prototype.restoreProjects = function (projects_) {
  this.projects = projects_;

  // Update UI with translated strings
  if (MSG['hello'] && document.getElementById('hello_text')) document.getElementById('hello_text').textContent = MSG['hello'];
  if (MSG['user'] && document.getElementById('user_text')) document.getElementById('user_text').textContent = MSG['user'];
  if (MSG['projects'] && document.getElementById('projects_header')) document.getElementById('projects_header').textContent = MSG['projects'];
  if (MSG['settings'] && document.getElementById('settings_header')) document.getElementById('settings_header').textContent = MSG['settings'];

  var hasValidProjects = false;
  for (const prop in this.projects) {
    if (localStorage[prop]) {
      this.listProject (prop, this.projects[prop]);
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

// Open most recently edited project
account.prototype.openLastEdited = function () {
  var projectKeys = Object.keys(this.projects);

  if (projectKeys.length === 0) {
    console.warn('[Account] No projects to open');
    return;
  }

  this.currentProject.uid = projectKeys.reduce((a, b) => (this.projects[a] > this.projects[b]) ? a : b); // Find project with highest timestamp
  this.currentProject.xml = localStorage[this.currentProject.uid];

  console.log('[Account] Opening project with UID:', this.currentProject.uid);

  if (this.projectList) getIn(this.projectList, `#${this.currentProject.uid}`).className = 'current';

  var xml = UI ['workspace'].readWorkspace (this.currentProject.xml, false);
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), Blockly.getMainWorkspace());
}

// Add project to UI list
account.prototype.listProject = function (uid, timestamp) {
    let project_name = this.getProjectName_ (uid);
    timestamp = Tool.unix2date(timestamp);
    let short_project_name = project_name.length > 30 ? `${project_name.substring(0,27)}...` : project_name; // Truncate long names
    let wrapper2_ = new DOM ('div', {'id':uid});
    let openButton_ = new DOM ('div', {innerText:short_project_name, className: 'runText', title:`Open project ${project_name}, created at ${timestamp}`})
        .onclick (this, this.openProject, [uid])
    let deleteButton_ = new DOM ('span', {className:'icon', id:'trashIcon', title:`Delete project ${project_name}`})
        .onclick (this, this.deleteProject, [uid])
    let downloadButton_ = new DOM ('span', {className:'icon', id:'downloadIcon', title:`Download project ${project_name}`})
        .onclick (this, UI ['workspace'].saveXML, [uid])

    let wrapper_ = new DOM ('div')
        .append([downloadButton_, deleteButton_])
    wrapper2_.append([openButton_, wrapper_])
    if (this.projectList) this.projectList.append(wrapper2_._dom)
}
// Open project by UID
account.prototype.openProject = function (uid) {
  if (this.currentProject.uid != '') {
    BlocklyStorage.backupBlocks_ ();
    if (this.projectList) try{getIn(this.projectList, `#${this.currentProject.uid}`).className = ''} catch (e) {};
  }
  let xml = localStorage[uid];

  this.currentProject.uid = uid;
  this.currentProject.xml = xml;

  if (this.projectList) getIn(this.projectList, `#${uid}`).className = 'current';

  this.projects[uid] = +new Date(); // Update timestamp to mark as recently opened

  BlocklyStorage.loadXml_ (xml, Blockly.getMainWorkspace());
  Files.handleCurrentProject ();
}
// Delete project by UID
account.prototype.deleteProject = function (uid) {
  localStorage.removeItem (uid);
  delete this.projects[uid];
  localStorage.setItem('bipes_projects', JSON.stringify(this.projects))

  if (this.projectList) getIn(this.projectList, `#${uid}`).remove();

  if (this.currentProject.uid == uid) {
    this.currentProject.uid = '';
    this.currentProject.xml = '';
    if (Object.keys(this.projects).length == 0) {
      this.newProject ();
    } else {
      this.openProject (Object.keys(this.projects).reduce((a, b) => (this.projects[a] > this.projects[b]) ? a : b)); // Open most recent
    }
  }
}
// Extract project name from XML
account.prototype.getProjectName_ = function (uid) {
  let xml = localStorage[uid];
  let project_name = '';
  let regex_ = /<value name="project_description">.*?<\/value>/; // Match project_description block
  if (regex_.test(xml)) {
    let project_description_chunk = xml.match (regex_) [0];
    project_name = project_description_chunk.match (/<field name="TEXT">(.*?)<\/field>/)[1].slice(); // Extract text field
  } else {
    project_name = "My BIPES Project";
  }
  return project_name;
}
// Create and open new empty project
account.prototype.newProject = function () {
  if (this.currentProject.uid != '') {
    BlocklyStorage.backupBlocks_ ();
    if (this.projectList) try{getIn(this.projectList, `#${this.currentProject.uid}`).className = ''} catch (e) {};
  }

  let emptyXML = Tool.emptyXML ();
  let uid = Tool.uid ();
  this.projects [uid] = +new Date (); // Store creation timestamp
  localStorage.setItem('bipes_projects', JSON.stringify(this.projects))
  localStorage.setItem (uid, emptyXML)

  this.currentProject.uid = uid;
  this.currentProject.xml = emptyXML;

  this.listProject (uid, this.projects [uid]);

  BlocklyStorage.loadXml_ (emptyXML, Blockly.getMainWorkspace());

  if (this.projectList) getIn(this.projectList, `#${uid}`).className = 'current';
}
// Import project from external XML
account.prototype.importProject = function (xml) {
  if (this.currentProject.uid != '') {
    BlocklyStorage.backupBlocks_ ();
    if (this.projectList) try{getIn(this.projectList, `#${this.currentProject.uid}`).className = ''} catch (e) {};
  }
  let uid = Tool.uid ();
  this.projects [uid] = +new Date ();
  localStorage.setItem('bipes_projects', JSON.stringify(this.projects))
  localStorage.setItem (uid, xml);

  this.currentProject.uid = uid;
  this.currentProject.xml = xml;

  this.listProject (uid, this.projects [uid]);

  BlocklyStorage.loadXml_ (xml, Blockly.getMainWorkspace());

  if (this.projectList) getIn(this.projectList, `#${uid}`).className = 'current';
}
// Update current project name in UI
account.prototype.setCurrentProjectName_ = function (str_) {
  let short_project_name = str_.length > 30 ? `${str_.substring(0,27)}...` : str_;

  if (!this.projectList) return;
  let a_ = getIn(this.projectList, `#${this.currentProject.uid}`);
  let b_ = getIn(a_, '.runText')
  b_.innerText = short_project_name;
  b_.title = `Open project ${str_}.`;
}

account.prototype.onOpenPanel_ = function () {
   this.setCurrentProjectName_(Tool.makeAName(Code.generateCode(), ''));
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


// Notification system: shows temporary alerts and keeps history
class notify {
  constructor () {
    this.panel_ = '.notify-panel'
	  this.container = get ('.notify');
	  this.container.innerHTML = '';
	  this.panel = get (this.panel_);
    this.messages = [];
    this.logs = [];
    this.buffer_count = 0;
    this.timeOut;
    this.timeOut2;
  }
}
// Show notification (auto-hides after 3s, groups duplicates)
notify.prototype.send = function (message) {
  console.log (`Notification: ${message}`);
  this.messages.push ({timestamp: +new Date, message: message});
  let last_message;
  let this_message = this.messages [this.messages.length - 1];
  if(!!this.messages [this.messages.length - 2]) last_message = this.messages [this.messages.length - 2].message;
  let closeButton_ = document.createElement ('span');
  closeButton_.classList.add("icon");
  closeButton_.id="trashIcon";
  this_message.div = document.createElement ('span');
  let time_ =  Tool.unix2date(this_message.timestamp);
  let message_ = `[${time_}] ${message}`;
  this_message.div.title = message_;
  this_message.div.appendChild(document.createTextNode(message_));
  this_message.div.appendChild(closeButton_);
  this_message.div.onclick = (ev) => {try {this.panel.removeChild(ev.target.parentNode)}catch(e){};};
  this.panel.appendChild(this_message.div);

  let panel_ = UI ['responsive'].panels [this.panel_];
  if (!panel_.show) { // Only show temp notification if panel is closed
    if(last_message == message && this.container.id == 'show') { // Group duplicate messages
        this.buffer_count = this.buffer_count + 1;
        this.container.innerHTML = `(${this.buffer_count}x) ${message_}`; // Show counter
    } else {
        if (this.container.innerHTML == '')
          this.container.innerHTML = message_;
        else
          this.container.innerHTML = `${message_}<hr>${this.container.innerHTML}`;
        this.buffer_count = 0;
    }

    this.container.id = 'show';

    window.clearTimeout(this.timeOut);
    this.timeOut = setTimeout( () => { // Hide after 3s
      this.container.id = '';
      this.buffer_count = 0;
      this.timeOut2 = setTimeout( () => {
      this.container.innerHTML = '';}, 150); // Clear content after fade
    }, 3000);
  }
}
// Log message silently (no UI notification)
notify.prototype.log = function (message) {
  this.logs.push ({timestamp: +new Date, message: message});
}

// XMLHttpRequest wrapper: supports online and offline modes
async function xhrGET (filename, responsetype, onsuccess, onfail) {
  let xmlHTTP = new XMLHttpRequest ();

  if (!Channel ['mux'].isLocalFile) {
    xmlHTTP.open ('GET', `${filename}`);
    xmlHTTP.responseType = responsetype;
    xmlHTTP.onload = function () {
      if (this.status == 200) {
        if (responsetype == 'text' || responsetype == '')
          onsuccess (this.responseText);
        else if (responsetype == 'document')
          onsuccess (this.responseXML);
        else
          onsuccess (this.response);
      } else if (onfail != undefined)
        onfail ();
      else
        UI ['notify'].send(MSG['ErrorGET']);
      }
  xmlHTTP.send();
	} else { // Offline mode: load embedded data
      filename = filename.replace(/[\/\.]/g, '_') // Normalize filename for variable name
	    let regex_xml = /_(.*)_xml/;
	    let regex_json = /_(.*)_json/;
      if (regex_json.test (filename)) {
	        window.addEventListener('load', () => {
            onsuccess(JSON.parse (eval(`OFFLINE_${filename}`))); // Execute embedded data
        }, false);
      } else if (regex_xml.test (filename)) {
        var xml_ = get(`#OFFLINE_${filename}`);
        if (xml_ == undefined) {
          xml_ = get(`#OFFLINE_toolbox_default_xml`);
          UI ['notify'].send(MSG['noToolbox']);
        }
        onsuccess(xml_);
	    } else
	      alert(`Could not find ${filename} locally, please run at a server or use the live version at bipes.net.br/beta2/ui.`);


  }
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
	                 '.notify-panel':{from:'notify-panel',x:$em*22, x2:0, y:0, show:false},
	                 '.account-panel':{from:'account',x:$em*22, x2:0, y:$em*0, show:false},
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
	}

	// Set progress by loaded/total bytes
	load (loaded, total) {
		var percent = (loaded * 100 / total);
		this.div.style.width = percent + '%';
		this.text.textContent = Math.round(percent) + '%';
	}
	// Set progress by remaining bytes
	remain (len_) {
		var percent = ((this.len - len_) * 100 / this.len);
		this.div.style.width = percent + '%';
		this.text.textContent = Math.round(percent) + '%';
	}
	// Show progress bar
	start (len_) {
	  this.len = len_;
	  this.dom.id = 'on';
	  this.text.textContent = '0%';
	}
	// Hide progress bar and reset
	end () {
	  this.dom.id = '';
    this.div.style.width = '0%';
    this.text.textContent = '';
	}
}


// Workspace manager: integrates Blockly, devices, and code execution
class workspace {
  constructor () {
    if (window.location.pathname.includes ('index.html') && window.location.protocol == 'file:') {
      alert('You will now be redirected to the offline version.');
      window.location.replace("index_offline.html");
    }

    this.defaultToolbox = 'default.xml';
    this.selector = get('#device_selector');
    this.content = get('#content_device');
    this.toolbarButton = get('#toolbarButton');
    this.channel_connect = get('#channel_connect');
    this.device_title = getIn(this.content, '#device_title'),
    this.device_img = getIn(this.content, '#device_img'),
    this.device_desc = getIn(this.content, '#device_desc');
    this.devices = [];
    xhrGET("devinfo/devinfo.json", 'json', (response) => {
      this.devices = response.devices;
      if (!/#(.)/.test(window.location.href))
        this.change ();
    });
    this.selector.onchange = () => {this.change ()};
    this.runButton = {
        dom:get('#runButton'),
        status:true
      };
    this.connectButton = get('#connectButton');
    this.saveButton = get('#saveButton');
    this.loadButton = get('#loadXML');
    this.connectButton.onclick = () => {this.connectClick ()};
    this.runButton.dom.onclick = () => {this.run ()};
    this.saveButton.onclick = () => {this.saveXML ()};
	  this.loadButton.addEventListener ('change', () => {this.loadXML ()});

    this.resetBoard = get('#resetBoard');

    this.term = get('#term');
    this.file_status = get('#file-status');
    this.put_file_select = get('#put-file-select');
    this.file = get('#content_file_name');
    this.content_file_name = get('#content_file_name');
    if (this.put_file_select) this.put_file_select.onchange = () => {Files.handle_put_file_select ()};
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

// Switch device: updates toolbox, pinout blocks, and serial config
workspace.prototype.change = function () {

  if (this.selector.value in this.devices) {
    let selected = this.devices [this.selector.value];
    this.device_title.innerHTML = selected.title,
    this.device_img.src = selected.img,
    this.device_desc.innerHTML = selected.description;

    if (!!selected.toolbox) {
       xhrGET(`toolbox/${selected.toolbox}`, 'document', (XML_) => {
        Code.reloadToolbox(XML_);
      });
    } else {
        xhrGET(`toolbox/${this.defaultToolbox}`, 'document', (XML_) => {
          Code.reloadToolbox(XML_);
        });
        UI ['notify'].send(MSG['noToolbox']);
    }
    if (this.devices.constructor.name == 'Object') {
      // Refresh pinout blocks for new device
      let blocks = Code.workspace.getBlocksByType('pinout');
       Code.workspace.getBlocksByType('pinout').forEach ((block, id) => {
         block.refresh ();
       });
       if (blocks.length != 0) UI ['notify'].send (MSG['wrongDevicePin']);
    }

    Channel ['webserial'].packetSize = parseInt(selected.serial_packet_size);
    Channel ['webserial'].speed = parseInt(selected.speed);

  } else
    UI ['notify'].send(MSG['invalidDevice']);
}

// Change device by name
workspace.prototype.changeTo = function (device) {
    if (device in this.devices)
      this.selector.value = device,
      this.change ();
    else if (device != '')
      UI ['notify'].send (MSG['deviceUnavailable'].replace ('%1', device));
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
      if (this.devices.constructor.name == 'Object') {
        this.changeTo (device);
      } else {
        // Wait for devices to load (poll every 500ms)
        var interval_ = setInterval(() => {
          if (this.devices.constructor.name == 'Object') {
            this.changeTo (device);
            clearInterval(interval_);
          }
        }, 500);
      }
    } catch(e) {UI ['notify'].log(e)}
  } else {
    this.changeTo (Object.keys(this.devices) [0]); // Fallback to first device
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
      let self = this;
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







