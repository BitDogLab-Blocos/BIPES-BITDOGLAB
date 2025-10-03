'use strict';

/*Handles the webserial protocol*/
class mux {
  /**
   * Init the mux class as Channel.mux, will check if it has been loaded as HTTPS, HTTP or locally ("file:") to handle browser policies for the protocols.
   */
  constructor () {
    this.isLocalFile = false;
    this.available = ['webserial'];
    this.currentChannel = 'webserial';

    this.ifunavailable = {
      webserial: ['https://bipes.net.br/beta2/ui', 'the HTTPS version']
    }
  }
	/**
   * Switch the target protocol if available, see mux.constructor
   * @param {string} channel_ - the protocol to be switched to
   */
  switch (channel_) {
    if (this.available.includes(channel_)) {
      this.currentChannel = channel_;
      mux.disconnect ();
      this.connect ();

      } else if (this.ifunavailable [channel_] != undefined) {
        let msg = `The channel ${channel_} is not yet available in this version, but at ${this.ifunavailable [channel_] [1]}, would you like to be redirected there?`;
        if (confirm(msg)) {
          window.location.replace(this.ifunavailable [channel_] [0]);
        } else {
          UI ['channel-panel'].button.className = `icon ${this.currentChannel}`
        }
    } else {
      alert(`The channel ${channel_} is not yet available in this version.`);
    }
  }

	/**
   * Connect using the target protocol, call as Channel.mux.connect()
   */
  connect () {
    Channel ['webserial'].connect();
  }
	/**
   *  Disconnect using the target protocol, call as mux.disconnect()
   */
  static disconnect () {
    if (Channel ['websocket'].connected) {
      Channel ['websocket'].ws.close();
    } else if (Channel ['webserial'].connected) {
      Channel ['webserial'].disconnect();
    } else if (Channel ['webbluetooth'].connected) {
      Channel ['webbluetooth'].disconnect();
    }
  }
  /**
   * Return if a device is connected via any protocol, call as mux.connected()
   * @returns {boolean} True if a device is connected via any protocol
   */
  static connected () {
    if (Channel ['websocket'].connected || Channel ['webserial'].connected || Channel ['webbluetooth'].connected)
      return true;
    else
      return false;
  }
	/**
   * Send data to the buffer of the target protocol, to be sent to the device with the target protocol.
   * A callback function can be passed and will be called after the MicroPython REPL ">>> " charset is detected.
   * This means understanding how your code executes is crucial. Call as mux.bufferPush()
   * @param {string} code - the code to be sent to the device with the target protocol
   * @param {function} callback - the callback function to be called when the  code has been executed.
   */
  static bufferPush (code, callback) {
    let textArray;
    if (typeof code == 'object')
      textArray = code;
    else if (typeof code == 'string') {
      if (Channel ['websocket'].connected) {
        textArray = code.replace(/\r\n|\n/gm, '\r').match(/(.|[\r]){1,10}/g);
      } else if (Channel ['webserial'].connected) {
        var pattern_ = new RegExp(`(.|[\r]){1,${Channel ['webserial'].packetSize}}`, 'g')
        textArray = code.replace(/\r\n|\n/gm, '\r').match(pattern_);
      } else if (Channel ['webbluetooth'].connected) {
        var pattern_ = new RegExp(`(.|[\r]){1,`, 'g')
        textArray = code.replace(/\r\n|\n/gm, '\r').match(/(.|[\r]){1,5}/g);
      }
    }

    if (Channel ['websocket'].connected) {
      Channel ['websocket'].buffer_ = Channel ['websocket'].buffer_.concat(textArray);
      if (callback != undefined)
        Channel ['websocket'].completeBufferCallback.push(callback);
    }  else if (Channel ['webserial'].connected) {
      Channel ['webserial'].buffer_ = Channel ['webserial'].buffer_.concat(textArray);
      if (callback != undefined)
        Channel ['webserial'].completeBufferCallback.push(callback);
    } else if (Channel ['webbluetooth'].connected) {
      Channel ['webbluetooth'].buffer_ = Channel ['webbluetooth'].buffer_.concat(textArray);
      if (callback != undefined)
        Channel ['webbluetooth'].completeBufferCallback.push(callback);
    } else
      UI ['notify'].send(MSG['notConnected']);
  }

	/**
   * Send data to the first position of the buffer of the target protocol, to be sent to the device with the target protocol. This means will it'll be executed as soon as possible, is useful for reset commands.
   * @param {string} code - the code to be sent immediatally to the device with the target protocol
   */
  static bufferUnshift (code) {
    if (Channel ['websocket'].connected) {
      Channel ['websocket'].buffer_.unshift(code);
    }  else if (Channel ['webserial'].connected) {
      Channel ['webserial'].buffer_.unshift(code);
    } else if (Channel ['webbluetooth'].connected) {
      Channel ['webbluetooth'].buffer_.unshift(code);
    } else
      UI ['notify'].send(MSG['notConnected']);
  }

	/**
   * Clears the buffer of the connected protocol, code won't be sent.
   */
  static clearBuffer () {
    if (Channel ['websocket'].connected) {
      Channel ['websocket'].buffer_ = [];
    }  else if (Channel ['webserial'].connected) {
      Channel ['webserial'].buffer_ = [];
      Channel ['webserial'].completeBufferCallback = [];
    } else if (Channel ['webbluetooth'].connected) {
      Channel ['webbluetooth'].buffer_ = [];
    } else
      UI ['notify'].send(MSG['notConnected']);
  }
}

/*Stub class for websocket (disabled)*/
class websocket {
  constructor () {
    this.connected = false;
    this.buffer_ = [];
    this.completeBufferCallback = [];
    this.ws = {close: () => {}};
  }
  connect(url, pass) {
    console.log('WebSocket não disponível nesta versão.');
  }
}

/*Stub class for webbluetooth (disabled)*/
class webbluetooth {
  constructor () {
    this.connected = false;
    this.buffer_ = [];
    this.completeBufferCallback = [];
  }
  connect() {
    console.log('Bluetooth não disponível nesta versão.');
  }
  disconnect() {}
  watch() {}
}

class webserial {
	/**
   * Init the webserial, stored as Channel.websocket
   */
  constructor () {
    this.port;
    this.watcher;
    this.watcherConnected_;
    /**Store the code to be sent to the device*/
    this.buffer_ = [];
    this.connected = false;
    this.completeBufferCallback = [];
    this.last4chars = '';
    this.encoder = new TextEncoder();
    this.appendStream = undefined;
    this.shouldListen = true;
    this.packetSize = 100;
    this.speed = 115200;
  }

	/**
   * Runs every 50ms to check if there is code to be sent in the :js:attr:`webserial#buffer_` (appended with :js:func:`mux.bufferPush()`)
   */
  watch () {
    if (this.port && this.port.writable && this.port.writable.locked == false) {
      if (this.buffer_.length > 0) {
        UI ['progress'].remain(this.buffer_.length);
        try {
		      this.serialWrite(this.buffer_ [0]);
        } catch (e) {
          UI ['notify'].log(e);
        }
      } else {
        UI ['progress'].end();
      }
    }
  }

	/**
   * Connect using webserial protocol, will ask user permission for the serial port.
   */
  connect () {
    if (typeof navigator.serial == "undefined") {
      UI ['notify'].send(MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API'));
      term.write(MSG['notAvailableFlag'].replaceAll('$1', 'WebSerial API'));
      return;
    }
    navigator.serial.requestPort ().then((port) => {
      UI ['workspace'].connecting ();
      this.port = port;
      this.port.open({baudRate: [this.speed] }).then(() => {
        const appendStream = new WritableStream({
          write(chunk) {
            if(Channel ['webserial'].shouldListen) {
              if (typeof chunk == 'string') {
                Tool.bipesVerify ();
                //data comes in chunks, keep last 4 chars to check MicroPython REPL string
                Channel ['webserial'].last4chars = Channel ['webserial'].last4chars.concat(chunk.substr(-4,4)).substr(-4,4)
                if (Channel ['webserial'].last4chars.includes(">>> ")) {
                  UI ['workspace'].runButton.status = true;
                  UI ['workspace'].runButton.dom.className = 'icon';
                  UI ['workspace'].toolbarButton.className = 'icon medium';
                  if (Channel ['webserial'].completeBufferCallback.length > 0) {
                    try {
                      Channel ['webserial'].completeBufferCallback [0] ();
                    } catch (e) {
                      UI ['notify'].log(e);
                    }
                    Channel ['webserial'].completeBufferCallback.shift ();
                  }
                } else if (UI ['workspace'].runButton.status == true) {
                  UI ['workspace'].receiving ();
                }
                Files.received_string = Files.received_string.concat(chunk);
              }
              term.write(chunk);
            }
          }
        });
        this.port.readable
        .pipeThrough(new TextDecoderStream())
        .pipeTo(appendStream);


        this.connect_ ();

        this.resetBoard ();

      }).catch((e) => {
        if (e.code == 11) {
          this.connect_ ();
          this.resetBoard ();
          this.shouldListen = true;
        }
        UI ['notify'].log(e);
      });

    }).catch((e) => {
        UI ['notify'].log(e);
    });
  }
  /**
   * User interface styling for when connected via webserial protocol.
   */
  connect_ () {
    term.on();
    term.write('\x1b[31mConnected using Web Serial API !\x1b[m\r\n');
    this.connected=true;
    if (UI ['workspace'].runButton.status == true)
        UI ['workspace'].receiving ();

    this.watcher = setInterval(this.watch.bind(this), 50);
  }
  /**
   * Disconnect device connected with webserial protocol.
   */
  disconnect () {
    const writer = this.port.writable.getWriter();
    writer.close().then(() => {
      this.port.close().then(() => {
          this.port = undefined;
        }).catch((e) => {
          UI ['notify'].log(e);
          writer.abort();
          this.port = undefined;
          this.shouldListen = false;
        })
         if (term)
          term.write('\x1b[31mDisconnected\x1b[m\r\n');
        this.buffer_ = [];
        this.last4chars = '';
        this.connected = false;
        clearInterval(this.watcher);
        term.off();
        UI ['workspace'].runAbort();
    })

  }
  /**
   * Reset board on connect with webserial protocol,
   * action enabled by a checkbox on the user interface.
   */
  resetBoard () {
    setTimeout(() => {
      if (UI ['workspace'].resetBoard.checked) {
        term.write('\x1b[31mResetting the board...\x1b[m\r\n');
        this.serialWrite ('\x04');
      } else
        this.serialWrite ('\x03');
    },50);
  }

	/**
   * Directly send code via webserial, normally called by this.watch()
   * @param {(Uint8Array|string|number)} data - code to be sent via webserial
   */
  serialWrite (data) {
    let dataArrayBuffer = undefined;
    switch (data.constructor.name) {
      case 'Uint8Array':
        dataArrayBuffer = data;
      break;
      case 'String':
      case 'Number':
        dataArrayBuffer = this.encoder.encode(data);
      break;
    }
    if (this.port && this.port.writable && dataArrayBuffer != undefined) {
      const writer = this.port.writable.getWriter();
      writer.write(dataArrayBuffer).then (() => {writer.releaseLock(); this.buffer_.shift ()});
	  }
	}
}





