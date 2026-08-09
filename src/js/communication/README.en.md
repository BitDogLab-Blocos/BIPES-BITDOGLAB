# BIPES–BitDogLab communication

[Leia em português](README.md) · **English**

`src/js/communication/` maintains a reliable session between the interface and the MicroPython REPL. Queuing, serial transport, and I²C discovery belong here; buttons, notifications, and code generation belong to other layers.

![Communication layer architecture](images/architecture.png)

## Components

| File | Role |
| --- | --- |
| `channel.js` | Constants, transmission queue, callbacks, and `ProtocolManager` facade. |
| `webserial.js` | Port, streams, reads, writes, and `>>>` prompt recognition. |
| `i2c_scanner.js` | Bus scanning and events for known sensors. |

Modern classes retain legacy global aliases because other modules and published projects still use `mux` and `webserial`.

## Runtime objects

```js
var Channel = {};
Channel.webserial = new webserial();
Channel.mux = new mux();
```

`Channel.mux` is the entry point used by the rest of the application. It does not access the port directly: it organizes commands and delegates transmission to `Channel.webserial`.

## Connection flow

```text
UI → ProtocolManager → WebSerialProtocol → navigator.serial → BitDogLab
                              ↑                         ↓
                       queue/callbacks ← bytes and prompt
```

1. The interface requests a connection.
2. Web Serial asks for authorization and opens the port.
3. A continuous reader converts incoming bytes into text.
4. The protocol recognizes prompts and completes pending callbacks.
5. Commands are split into packets and sent in queue order.
6. On disconnect, state, queue, and interface return to a known condition.

On Android, a native shim implements `navigator.serial`. The web protocol remains unchanged; avoid Android conditionals in the queue when the bridge can reproduce the browser contract.

## Queue rules

- `bufferPush` appends normal commands and preserves callback order.
- `bufferUnshift` prepends an urgent operation.
- `clearBuffer` cancels packets and callbacks not yet sent.
- Line endings and packet size are normalized before transmission.
- Disconnected operations must notify the user without silently mutating the queue.

UI components must not write bytes directly. New operations should go through the facade or through an execution service that uses it.

## I²C scanner

The scanner reads buses and addresses from `BitdogLabConfig`. It pauses while user code runs or while another transaction owns the REPL, preventing probes from interrupting file writes, listings, or program execution.

Known devices live in `BitdogLabConfig.SENSOR.I2C_KNOWN_DEVICES`. Add an address to the board profile, not to the scanner.

## Browser constraints

Web Serial requires a compatible browser, secure context, and explicit user permission. Automated tests simulate the port; hardware validation should cover connection, reconnection, physical removal, and prompt recovery.

## Validation

```powershell
node --test tests/communication/*.test.js
node --test tests/device-files/*.test.js
node --test src/mobile/tests/mobile-serial-shim.test.js
```

A change is ready when queue order remains stable, no callback is orphaned, and browser and Android-shim behavior remain equivalent.
