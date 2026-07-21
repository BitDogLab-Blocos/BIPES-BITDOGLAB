# BitDogLab communication layer

[Leia em português](README.md) · **English**

This folder connects the BIPES interface to the board through the browser. It organizes the command queue, controls the Web Serial session, tracks the MicroPython prompt, and detects I²C sensors without mixing these responsibilities with the interface.

## Architecture

![Communication layer architecture](images/architecture.png)

`ProtocolManager` is the entry point used by the rest of the application. It forwards operations to the Web Serial implementation, while the I²C scanner reuses the same connection whenever the board is idle.

| File | Responsibility |
| --- | --- |
| `channel.js` | Defines protocol constants, controls the transmission queue, and provides the `ProtocolManager` (`mux`) facade. |
| `webserial.js` | Opens the port, reads and writes streams, consumes the queue, and recovers the REPL prompt. |
| `i2c_scanner.js` | Scans the I²C buses, compares detected devices, and reports connections or removals of known sensors. |

## Initialization

The scripts are loaded by `src/pages/index.html`. After `Code.init()`, the page creates the Web Serial channel and the multiplexer kept for compatibility with the rest of the project:

```js
var Channel = {};
Channel['webserial'] = new webserial();
Channel['mux'] = new mux();
```

The names `webserial` and `mux` are compatibility aliases for `WebSerialProtocol` and `ProtocolManager`. The I²C scanner keeps its own global instance:

```js
const i2cScanner = new I2CScanner();
```

## Basic flow

1. The interface requests a connection through `ProtocolManager`.
2. `webserial.js` asks the Web Serial API for a port and opens the streams.
3. `channel.js` splits code into packets and adds it to the queue.
4. `webserial.js` sends the packets and recognizes the MicroPython `>>>` prompt.
5. When user code is not running, `i2c_scanner.js` checks the configured buses.

> The Web Serial API requires a compatible browser and a secure context. The I²C scanner is paused while user code runs so it does not interrupt the REPL.
