'use strict';

// Tool class - Static utilities for code execution and file operations
class Tool {
  constructor () {}

  static runPython (code_) {
    let code;
    if (code_ == undefined) { // No code provided, generate from workspace
      let rawCode = Blockly.Python.workspaceToCode(Code.workspace);
      code = Code.wrapWithInfiniteLoop(rawCode); // Wrap in while True loop
    } else {
      code = code_; // Use provided code directly
    }

    if (code) {
      code+='\r\r'; // Snek workaround - extra line breaks for compatibility
      mux.bufferPush (`\x05${code}\x04`); // \x05=raw REPL mode, \x04=soft reboot to execute
    }
  }

  static stopPython () {
    mux.bufferPush ('\x03\x03'); // Ctrl+C twice - interrupt running code
  }

  static softReset () {
    mux.bufferPush ('\x04'); // Ctrl+D soft reboot - reset device
  }

  static updateSourceCode (code, file_name) {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => { // Fired when blob is fully loaded
      let text = e.srcElement.result;
      Files.editor.getDoc().setValue(text); // Update CodeMirror editor content
      UI ['workspace'].content_file_name.value = file_name; // Update filename display
    });
    reader.readAsText(code); // Start async read of blob
  }

  static unix2date (timestamp) {
    let date;
    if (timestamp == undefined)
      date = new Date (+new Date); // Current time if no timestamp provided
    else
      date = new Date(timestamp); // Convert Unix timestamp to Date object
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes(); // Prepend 0 for padding
    let seconds = "0" + date.getSeconds(); // Prepend 0 for padding
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2); // Zero-pad to 2 digits (e.g., 08:02:01)
  }

  static bipesVerify () {
    // Parse BIPES data format: $SENSOR_NAME:value1,value2
    let re = /\r\n\$(.*):(.*)\r\n/; // Match $NAME:data1,data2 pattern (e.g., $SENSOR:25.5,100)
    let match_;
    if (re.test(Files.received_string)) { // Check if pattern exists in received data
      match_ = Files.received_string.match(re);
      if (match_.length == 3) { // match[0]=full, match[1]=name, match[2]=data
        let coordinates = match_ [2].split(',').map((item)=>item = parseFloat(item)) // Convert "25.5,100" to [25.5, 100]
        window.frames[3].modules.DataStorage.push(match_[1],coordinates) // Push to plot iframe
      }
    }
    Files.received_string = Files.received_string.replace(re, '\r\n') // Remove matched pattern from buffer
  }

  static makeAName (code, ext) {
    let desc = code.match(/#Description: '(.*)'/) // Extract description from Python comment
    let imp = [...code.matchAll(/import (.*)/g)] // Find all import statements

    if (ext == '') { // No extension, just return project name
      return desc ? `${desc [1].slice()}${ext}` : 'My BIPES Project';
    } else {
      if (desc == null) { // No description found, use default
        desc = [];
        desc [1] = 'code';
      }
      desc [1] = desc [1].toLowerCase() // Normalize to lowercase
      return desc ? `${desc [1].replaceAll(' ', '_').replaceAll('.', '').slice().substring(0,30)}.bipes.${ext}` : imp.length ? `my_${imp.slice(-1)[0][1]}_project.bipes.${ext}` : `my_project.bipes.${ext}`; // Sanitize: spaces→_, remove dots, limit 30 chars
    }
  }

  static uid () {
    // Generate unique ID: timestamp in base36 + random string in base36
    return (+new Date).toString(36) + Math.random().toString(36).substr(2);
  }

  static emptyXML () {
    let account_user = localStorage ['account_user']; // Get username from localStorage
    return `<xml xmlns="https://bipes.net.br"><workspace><databoard><![CDATA[{"currentWorkspace":"kvflqzky5js84d7x5pe","workspace:kvflqzky5js84d7x5pe":[]}]]></databoard></workspace><block type="project_metadata" id="" x="-212" y="-612"><value name="project_author"><shadow type="text" id=""><field name="TEXT">${account_user}</field></shadow></value><value name="project_iot_id"><shadow type="math_number" id=""><field name="NUM">0</field></shadow></value><value name="project_description"><shadow type="text" id=""><field name="TEXT">My project</field></shadow></value></block></xml>` // XML template with project_metadata block
  }
}

// Files class - Manages file operations, editor, and device communication
class files {
  constructor (fileList) {
    this.watcher; // Interval timer for file operations
    this.watcher_calledCount = 0; // Timeout counter
    this.put_file_name = null; // Upload filename
    this.put_file_data = null; // Upload file data
    this.get_file_name = null; // Download filename
    this.get_file_data = null; // Download file data
    this.binary_state = 0; // Protocol state machine
    this.received_string = ""; // Buffer for incoming data
    this.viewOnly = false; // Flag for view-only mode
    // Initialize CodeMirror editor with Python mode and line numbers
    this.editor = CodeMirror.fromTextArea(content_file_code, {
      mode: "python",
      lineNumbers: true
    });
    this.fileList = get('#fileList'); // File list container
    this.file_save_as = get('#file_save_as'); // Save as input
    this.blocks2Code = {Python: get('#blocks2codePython'), XML: get('#blocks2codeXML')}
    this.blocks2Code.Python.onclick = () => {this.internalPython ()};
    this.blocks2Code.XML.onclick = () => {this.internalXML ()};
  }

  static update_file_status (s) {
    UI ['workspace'].file_status.innerHTML = s; // Update status display
  }

  resize () {
    if (!Code.current.includes('files'))
      return
    if (Code.current[0] == 'files') // Full width mode
      this.editor.setSize(window.innerWidth - (18*$em),window.innerHeight - (6*$em)) // 18em for sidebar, 6em for header
    else // Split view mode
      this.editor.setSize((window.innerWidth/2) - (18*$em),window.innerHeight - (6*$em)) // Half width for split
  }

  put_file () {
    switch (Channel ['mux'].currentChannel) {
      case 'webserial':
        var dest_fsize = this.put_file_data.length;
        files.update_file_status(`Sending raw (USB) ${this.put_file_name}...`);

        let decoderUint8 =  new TextDecoder().decode(this.put_file_data).replaceAll(/(\r\n|\r|\n)/g, '\\r').replaceAll(/'/g, "\\'").replaceAll(/"/g, '\\"').replaceAll(/\t/g, '    '); // Escape for Python string: newlines→\r, quotes→\', "→\", tabs→4 spaces
        UI ['progress'].start(parseInt(decoderUint8.length/Channel ['webserial'].packetSize) + 1); // Calculate chunks based on packet size

        mux.clearBuffer ();
        mux.bufferUnshift ('\r\x03\x03'); // Ctrl+C twice to interrupt
        mux.bufferPush ("import struct\r");
        mux.bufferPush (`f=open('${this.put_file_name}', 'w')\r`); // Open file for writing on device
        mux.bufferPush (`f.write('${decoderUint8}')\r`, () => {files.update_file_status(`Sent ${Files.put_file_data.length} bytes`)});
        mux.bufferPush ("f.close()\r"); // Close file handle
        mux.bufferPush ('\r\r\r'); // Triple newline to ensure execution
        files.update_file_status(`File ${this.put_file_name} sent.`);
      break;
    }
  }

  get_ver () {
    var rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64); // WEBREPL_REQ_S = "<2sBBQLH64s" struct format
    rec[0] = 'W'.charCodeAt(0); // Magic byte 1: 'W'
    rec[1] = 'A'.charCodeAt(0); // Magic byte 2: 'A'
    rec[2] = 3; // GET_VER opcode
    this.binary_state = 31; // Set state for binary response handler
    mux.bufferPush(rec);
  }

  handle_put_file_select() {
    let file_ = UI ['workspace'].put_file_select.files;
    let f = file_[0]; // Get first selected file
    this.put_file_name = f.name;
    var reader = new FileReader();
    reader.onload = (e) => {
        this.put_file_data = new Uint8Array(e.target.result); // Convert to byte array
        this.put_file (); // Upload to device
    };
    reader.readAsArrayBuffer(f); // Start async read as binary
  }

  files_save_as () {
    var codeStr = Files.editor.getDoc().getValue("\n"); // Get CodeMirror content

    var bufCode = new Uint8Array(codeStr.length); // Allocate byte array
    for (var i=0, strLen=codeStr.length; i < strLen; i++) {
    bufCode[i] = codeStr.charCodeAt(i); // Convert each char to byte
    }

    this.put_file_name = UI ['workspace'].file.value; // Get filename from input
    this.put_file_data = bufCode; // Set byte data

    this.put_file (); // Upload to device
  }

  listFiles () {
    mux.bufferPush ('import os; os.listdir(\'.\')\r', files.updateTable.bind(this)); // ; triggers single >>>
  }

  run (file) {
    files.update_file_status('Executing  ' + file);
    mux.bufferPush (`exec(open(\'./${file}\').read(),globals())\r`);
  }

  delete (file) {
    let msg = "Are you sure you want to delete " + file + "?";

    if (confirm(msg)) {
      let txt = "Will delete file " + file;
      mux.bufferPush(`os.remove(\'${file}\')\r`, this.listFiles.bind(this));
      files.update_file_status('Deleted  ' + file);
    } else {
      let txt = "Delete aborted";
      files.update_file_status('Delete aborted for ' + file);
    }
  }

  files_view (file) {
    this.viewOnly=true;
    this.get_file(file);
    files.update_file_status('Downloading ' + file);
  }

  files_download (file) {
    this.viewOnly=false;
    this.get_file(file);
  }

  get_file (src_fname) {
    this.file_save_as.className = 'py';
    switch (Channel ['mux'].currentChannel) {
      case 'webserial':
        this.binary_state = 91;
        files.update_file_status(`Getting ${src_fname}...`);

        mux.clearBuffer ();
        mux.bufferUnshift ('\r\x03\x03'); // Ctrl+C twice
        this.get_file_name = src_fname;
        this.received_string = "";
        this.watcher_calledCount = 0;
        mux.bufferPush (`import os, sys; os.stat('${src_fname}')\r`);
        mux.bufferPush (`with open('${src_fname}', 'rb') as infile:\rwhile True:\rresult = infile.read(32)\rif result == b'':\rbreak\r\blen = sys.stdout.write(result)\r`, () => {}); // Dummy callback for >>>
        mux.bufferPush ("\r\r\r", () => {
          this.watcher = setInterval ( () => {
            if (Files.get_file_webserial_ ()) {
              Files.watcher_calledCount = 0;
              clearInterval (Files.watcher);
            } else {
              Files.watcher_calledCount += 1;
              if (Files.watcher_calledCount >= 10) { // 2.5s timeout
                UI ['notify'].send(MSG['ErrorGET']);
                clearInterval (Files.watcher);
                Files.watcher = undefined;
              }
            }
          }, 250); // Poll every 250ms
        });
      break;
    }
  }

  get_file_webserial_ () {
      let re = /sys\.stdout\.write\(result\)\r\n...         \r\n...         \r\n... \r\n(.*)>>> /s;
      let get_file_data_;
      if (re.test(Files.received_string)) {
        get_file_data_ = Files.received_string.match(re);
        if (get_file_data_.length == 2)
          Files.get_file_data = get_file_data_ [1]


        files.update_file_status('Got ' + Files.get_file_name + ', ' + Files.get_file_data.length + ' bytes');
        if (!Files.viewOnly)
          saveAs(new Blob([Files.get_file_data], {type: "application/octet-stream"}), Files.get_file_name);
        else
          Tool.updateSourceCode(new Blob([Files.get_file_data], {type: "text/plain"}), Files.get_file_name);
        Files.received_string = Files.received_string.replace(re, '\r\n') //purge received string out
        return true
      } else {
        return false;
      }
  }

  static updateTable () {
    let re = /\[(.+)?\]/g;
    if (re.test(this.received_string)) {
      let match_ = this.received_string.match((/\[(.+)?\]/g));
      let treat_ = match_ [match_.length - 1].replace(/[\[\]]/g, '');
      let split_ = treat_.split('"'[0]);
      let files_ = eval("[" + split_ + "]");

      UI ['notify'].send("File list updated at " + Tool.unix2date() + ".");
      this.fileList.innerHTML = '';

      files_.forEach (file => {
        let wrapper2_ = new DOM ('div');
        let openButton_ = new DOM ('div', {innerText:file, className: 'runText'});
        if (!(/\./.test(file))) { // Directory
          openButton_.flag('is directory');
          wrapper2_.append(openButton_)
          wrapper2_._dom.style.cursor = 'default';
        } else {
          openButton_._dom.title = `Open file ${file}`;
          openButton_.onclick (this, Files.files_view, [file]);
          if(file == 'boot.py' || file == 'main.py')
            openButton_.flag('run at boot');
          let deleteButton_ = new DOM ('span', {className:'icon', id:'trashIcon', title:`Delete file ${file}`})
            .onclick (this, Files.delete, [file]);
          let runButton_ = new DOM ('span', {className:'icon', id:'runIcon', title:`Run file ${file}`})
            .onclick (this, Files.run, [file]);
          let downloadButton_ = new DOM ('span', {className:'icon', id:'downloadIcon', title:`Download file ${file}`})
            .onclick (this, Files.files_download, [file]);

          let wrapper_ = new DOM ('div')
            .append([runButton_, downloadButton_, deleteButton_]);
          wrapper2_.append([openButton_, wrapper_]);
        }

        this.fileList.appendChild(wrapper2_._dom)
      })

      Files.received_string = Files.received_string.replace(re, '\r\n')
    }
  }

  editedXML2Workspace () {
    var result = window.confirm('Changes will be applied directly to the workspace and might break everything, continue?');
    if (result === true) {
      let content = UI ['workspace'].readWorkspace (this.editor.getDoc().getValue("\n"), true);
      let xmlDom = '';
      try {
        xmlDom = Blockly.Xml.textToDom(content);
      } catch (e) {
        var q =
            window.confirm(MSG['badXml'].replace('%1', e));
        if (!q) {
          //Leave the user on the XML tab.
          return;
        }
      }
      if (xmlDom) {
        Code.workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
  	    Code.renderContent();
      }
    }
  }

  internalPython () {
    this.file_save_as.className = 'bipes-py';
    let code = Code.generateCode();
    Tool.updateSourceCode(new Blob([code], {type: "text/plain"}), Tool.makeAName(code, 'py'));
  }

  internalXML () {
    this.file_save_as.className = 'bipes-xml';
    Tool.updateSourceCode(new Blob([Code.generateXML()], {type: "text/plain"}), 'workspace.bipes.xml');
  }

  handleCurrentProject () {
    this.blocks2Code.Python.innerHTML = Tool.makeAName(Code.generateCode(), 'py') + '<span>automatic</span>'
    if (this.file_save_as.className == 'bipes-py')
      this.internalPython ();
    else if(Files.file_save_as.className == 'bipes-xml')
      this.internalXML ();
  }
}

// DOM helper class for dynamic element creation
class DOM {
  constructor (dom, tags){
    this._dom ;
    switch (dom) {
	  case 'button':
	  case 'h2':
	  case 'h3':
      case 'span':
      case 'div':
        this._dom = document.createElement (dom);
        if (typeof tags == 'object') for (const tag in tags) {
          // Apply standard HTML attributes
          if (['innerText', 'className', 'id', 'title', 'innerText'].includes(tag))
            this._dom [tag] = tags [tag]
        }
        break;
	  case 'video':
        this._dom = document.createElement (dom);
        if (typeof tags == 'object') for (const tag in tags) {
          // Apply video-specific attributes
          if (['preload', 'controls', 'autoplay'].includes(tag))
            this._dom [tag] = tags [tag]
        }
        break;
    }
	  return this;
  }

  onclick (self, ev, args){
    // Bind click handler with context preservation
    this._dom.onclick = () => {
			if (typeof args == 'undefined')
				ev.bind(self)()
			else if (args.constructor == Array)
				ev.apply(self, args) // Apply with arguments array
		};
	  return this
  }

  append (DOMS){
	  if (DOMS.constructor != Array)
	    DOMS = [DOMS]

	    DOMS.forEach ((item) => {
	      // Handle both raw DOM elements and DOM wrapper objects
	      if (/HTML(.*)Element/.test(item.constructor.name))
		      this._dom.appendChild(item)
	      else if (item.constructor.name == 'DOM' && (/HTML(.*)Element/.test(item._dom)))
		      this._dom.appendChild(item._dom)
	    })
	    return this
  }

  flag (str) {
    // Add visual flag/label to element
    this._dom.innerHTML = `${this._dom.innerHTML} <span>${str}</span>`;
  }
}

// Animation utilities for UI transitions
class Animate {
  constructor (){}
  static off (dom, callback){
    dom.classList.remove('on')
    setTimeout(()=>{
      dom.classList.remove('ani', 'on')
      if (callback != undefined)
        callback () // Execute after 250ms fade out
      }, 250) // 250ms fade duration
  }
  static on (dom){
    dom.classList.add('ani')
    setTimeout(()=>{dom.classList.add('ani', 'on')}, 250) // 250ms fade in
  }
}

// Terminal management class for serial communication
class term {
  constructor () {
  }
  static init (dom) {
    terminal.open(get(dom));
    terminal.setOption('fontSize',12);
    // Configure terminal color scheme
    terminal.setOption('theme', {
      foreground: '#00FFFF',
      background: '#000000',
      cursor: '#00FFFF',
      black: '#2e3436',
      red: '#cc0000',
      green: '#00FF00',
      yellow: '#c4a000',
      blue: '#3465a4',
      magenta: '#75507b',
      cyan: '#00FFFF',
      white: '#FFFFFF',
      brightBlack: '#555753',
      brightRed: '#ef2929',
      brightGreen: '#8ae234',
      brightYellow: '#fce94f',
      brightBlue: '#729fcf',
      brightMagenta: '#ad7fa8',
      brightCyan: '#00FFFF',
      brightWhite: '#FFFFFF'
    });
    this.resize();
    // Route terminal input to current channel
    terminal.onData((data) => {
      switch (Channel ['mux'].currentChannel) {
        case 'webserial':
          Channel ['webserial'].serialWrite(data);
        break;
      }
    });
  }

  static on () {
    terminal.setOption('disableStdin', false); // Enable input
    terminal.focus(); // Set focus to terminal
  }

  static off () {
    terminal.setOption('disableStdin', true); // Disable input
    terminal.blur(); // Remove focus from terminal
  }

  static write (data) {
    terminal.write(data); // Write data to terminal
  }

  static resize () {
    if(!Code.current.includes('console'))
      return

    // Calculate terminal dimensions based on window size
    let cols
    if (Code.current[0] == 'console')
      cols = Math.max(50, Math.min(200, (window.innerWidth - 4*$em) / 7)) | 0 // 7px per char
    else
      cols = Math.max(50, Math.min(200, ((window.innerWidth)/2 - 4*$em) / 7)) | 0 // Half width for split view

    let rows = Math.max(15, Math.min(40, (window.innerHeight - 20*$em) / 12)) | 0 // 12px per row

    terminal.resize(cols, rows);
  }
}
