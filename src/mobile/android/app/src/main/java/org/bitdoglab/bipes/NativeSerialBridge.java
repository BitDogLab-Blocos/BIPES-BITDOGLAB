package org.bitdoglab.bipes;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.os.Build;
import android.util.Base64;
import android.webkit.WebView;

import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import com.hoho.android.usbserial.util.SerialInputOutputManager;

import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Expõe a porta CDC do Android somente à WebView local do aplicativo. */
public final class NativeSerialBridge implements SerialInputOutputManager.Listener {
    private static final String ACTION_USB_PERMISSION =
            "org.bitdoglab.bipes.USB_PERMISSION";
    private static final int BITDOGLAB_VENDOR_ID = 0x2E8A;
    private static final int BITDOGLAB_BAUD_RATE = 115200;
    private static final int MAX_MESSAGE_CHARS = 1_500_000;
    private static final int MAX_ENCODED_WRITE_CHARS = 1_400_000;
    private static final int WRITE_TIMEOUT_MS = 4000;
    private static final int MOBILE_WRITE_CHUNK_BYTES = 100;
    private static final int MOBILE_WRITE_CHUNK_DELAY_MS = 10;
    private static final int INTERRUPT_SETTLE_MS = 150;
    private static final int TRANSACTION_READER_SETTLE_MS = 150;
    private static final int TRANSACTION_READ_SLICE_MS = 200;
    private static final int MAX_TRANSACTION_OUTPUT_BYTES = 2_000_000;
    // Keep the mobile stop path in lockstep with WebSerialProtocol's proven
    // recovery loop: reopen the CDC port and retry Ctrl+C while the normal
    // asynchronous reader forwards the resulting >>> prompt to the WebView.
    private static final int STOP_RECOVERY_INTERVAL_MS = 350;
    private static final int STOP_RECOVERY_ATTEMPTS = 10;

    private final Activity activity;
    private final WebView webView;
    private final UsbManager usbManager;
    private final ExecutorService serialExecutor = Executors.newSingleThreadExecutor();

    private UsbSerialDriver selectedDriver;
    private UsbDeviceConnection connection;
    private UsbSerialPort port;
    private SerialInputOutputManager inputOutputManager;
    private String pendingPermissionRequestId;
    private boolean receiverRegistered;
    private volatile boolean stopRequested;
    private volatile boolean stopRecoveryActive;
    private volatile boolean stopPromptSeen;
    private volatile String stopPromptTail = "";

    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            UsbDevice device = getUsbDevice(intent);

            if (ACTION_USB_PERMISSION.equals(action)) {
                String requestId = pendingPermissionRequestId;
                pendingPermissionRequestId = null;
                if (requestId == null) {
                    return;
                }
                if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
                        && device != null) {
                    selectedDriver = findDriver(device);
                    if (selectedDriver == null) {
                        reject(requestId, "A placa USB não oferece uma porta serial compatível.");
                    } else {
                        resolvePort(requestId, device);
                    }
                } else {
                    reject(requestId, "Permissão USB negada.");
                }
                return;
            }

            if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(action)
                    && selectedDriver != null
                    && device != null
                    && selectedDriver.getDevice().getDeviceId() == device.getDeviceId()) {
                serialExecutor.execute(() -> closeInternal(true));
            }
        }
    };

    public NativeSerialBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        this.usbManager = (UsbManager) activity.getSystemService(Context.USB_SERVICE);
        registerReceiver();
    }

    public void postMessage(String rawMessage) {
        if (rawMessage == null || rawMessage.length() > MAX_MESSAGE_CHARS) {
            emitError("Mensagem USB ausente ou maior que o limite permitido.");
            return;
        }
        final JSONObject message;
        try {
            message = new JSONObject(rawMessage);
        } catch (JSONException exception) {
            emitError("Mensagem inválida recebida pela ponte USB.");
            return;
        }

        String id = message.optString("id", "");
        String action = message.optString("action", "");
        if (!id.matches("[0-9]{1,20}")) {
            emitError("Identificador de operação USB inválido.");
            return;
        }
        switch (action) {
            case "requestPort":
                requestPort(id);
                break;
            case "open":
                int baudRate = message.optJSONObject("payload") == null
                        ? BITDOGLAB_BAUD_RATE
                        : message.optJSONObject("payload")
                                .optInt("baudRate", BITDOGLAB_BAUD_RATE);
                if (baudRate != BITDOGLAB_BAUD_RATE) {
                    reject(id, "A BitDogLab utiliza exclusivamente 115200 baud.");
                    return;
                }
                serialExecutor.execute(() -> open(id, baudRate));
                break;
            case "write":
                JSONObject payload = message.optJSONObject("payload");
                String encoded = payload == null ? "" : payload.optString("data", "");
                serialExecutor.execute(() -> write(id, encoded));
                break;
            case "interrupt":
                serialExecutor.execute(() -> interrupt(id));
                break;
            case "stopProgram":
                // A large program can still be split into USB writes. Mark the
                // pending write immediately so it yields before the recovery
                // operation reaches the serial executor.
                stopRequested = true;
                serialExecutor.execute(() -> stopProgram(id));
                break;
            case "executeTransaction":
                JSONObject transactionPayload = message.optJSONObject("payload");
                String command = transactionPayload == null
                        ? ""
                        : transactionPayload.optString("data", "");
                String endMarker = transactionPayload == null
                        ? ""
                        : transactionPayload.optString("endMarker", "");
                int timeoutMs = transactionPayload == null
                        ? 0
                        : transactionPayload.optInt("timeoutMs", 0);
                serialExecutor.execute(
                        () -> executeTransaction(id, command, endMarker, timeoutMs)
                );
                break;
            case "close":
                serialExecutor.execute(() -> {
                    closeInternal(false);
                    resolve(id, new JSONObject());
                });
                break;
            default:
                reject(id, "Operação USB desconhecida: " + action);
        }
    }

    private void requestPort(String requestId) {
        activity.runOnUiThread(() -> {
            if (pendingPermissionRequestId != null) {
                reject(requestId, "Já existe uma solicitação USB em andamento.");
                return;
            }

            List<UsbSerialDriver> drivers = UsbSerialProber.getDefaultProber()
                    .findAllDrivers(usbManager);
            if (drivers.isEmpty()) {
                reject(requestId,
                        "BitDogLab não encontrada. Conecte a placa ao celular com um adaptador OTG e tente novamente.");
                return;
            }

            selectedDriver = selectPreferredDriver(drivers);
            if (selectedDriver == null) {
                reject(requestId,
                        "O dispositivo conectado não é uma BitDogLab/RP2040 compatível.");
                return;
            }
            UsbDevice device = selectedDriver.getDevice();
            if (usbManager.hasPermission(device)) {
                resolvePort(requestId, device);
                return;
            }

            pendingPermissionRequestId = requestId;
            Intent permissionIntent = new Intent(ACTION_USB_PERMISSION)
                    .setPackage(activity.getPackageName());
            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    activity,
                    0,
                    permissionIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            usbManager.requestPermission(device, pendingIntent);
        });
    }

    private UsbSerialDriver selectPreferredDriver(List<UsbSerialDriver> drivers) {
        for (UsbSerialDriver driver : drivers) {
            if (driver.getDevice().getVendorId() == BITDOGLAB_VENDOR_ID) {
                return driver;
            }
        }
        return null;
    }

    private UsbSerialDriver findDriver(UsbDevice device) {
        for (UsbSerialDriver driver : UsbSerialProber.getDefaultProber().findAllDrivers(usbManager)) {
            if (driver.getDevice().getDeviceId() == device.getDeviceId()) {
                return driver.getDevice().getVendorId() == BITDOGLAB_VENDOR_ID
                        ? driver
                        : null;
            }
        }
        return null;
    }

    private void open(String requestId, int baudRate) {
        if (port != null && port.isOpen()) {
            resolve(requestId, new JSONObject());
            return;
        }
        if (selectedDriver == null) {
            reject(requestId, "Selecione a BitDogLab antes de abrir a conexão.");
            return;
        }
        if (!usbManager.hasPermission(selectedDriver.getDevice())) {
            reject(requestId, "O Android não concedeu acesso à BitDogLab.");
            return;
        }

        try {
            connection = usbManager.openDevice(selectedDriver.getDevice());
            if (connection == null) {
                throw new IllegalStateException("Não foi possível abrir o dispositivo USB.");
            }
            port = selectedDriver.getPorts().get(0);
            port.open(connection);
            port.setParameters(
                    baudRate,
                    8,
                    UsbSerialPort.STOPBITS_1,
                    UsbSerialPort.PARITY_NONE
            );
            inputOutputManager = new SerialInputOutputManager(port, this);
            inputOutputManager.start();
            resolve(requestId, new JSONObject());
        } catch (Exception exception) {
            closeInternal(false);
            reject(requestId, friendlyError("Não foi possível abrir a porta serial", exception));
        }
    }

    private void write(String requestId, String encoded) {
        if (port == null || !port.isOpen()) {
            reject(requestId, "A BitDogLab não está conectada.");
            return;
        }
        if (encoded == null || encoded.length() > MAX_ENCODED_WRITE_CHARS) {
            reject(requestId, "O bloco de dados excede o limite de envio USB.");
            return;
        }
        try {
            byte[] bytes = Base64.decode(encoded, Base64.NO_WRAP);
            for (int offset = 0; offset < bytes.length; offset += MOBILE_WRITE_CHUNK_BYTES) {
                if (stopRequested) {
                    break;
                }
                int end = Math.min(offset + MOBILE_WRITE_CHUNK_BYTES, bytes.length);
                port.write(Arrays.copyOfRange(bytes, offset, end), WRITE_TIMEOUT_MS);
                if (end < bytes.length) {
                    Thread.sleep(MOBILE_WRITE_CHUNK_DELAY_MS);
                }
            }
            resolve(requestId, new JSONObject());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            reject(requestId, "O envio para a placa foi cancelado.");
        } catch (Exception exception) {
            reject(requestId, friendlyError("Falha ao enviar dados para a placa", exception));
        }
    }

    private void interrupt(String requestId) {
        if (port == null || !port.isOpen()) {
            reject(requestId, "A BitDogLab não está conectada.");
            return;
        }
        try {
            // Dois Ctrl+C interrompem tanto um programa comum quanto o modo raw REPL.
            port.write(new byte[] {0x03, 0x03, 0x0D}, WRITE_TIMEOUT_MS);
            Thread.sleep(INTERRUPT_SETTLE_MS);
            resolve(requestId, new JSONObject());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            reject(requestId, "A interrupção do programa foi cancelada.");
        } catch (Exception exception) {
            reject(requestId, friendlyError("Falha ao interromper o programa", exception));
        }
    }

    private void stopProgram(String requestId) {
        if (port == null || !port.isOpen()) {
            stopRequested = false;
            reject(requestId, "A BitDogLab não está conectada.");
            return;
        }

        try {
            stopRecoveryActive = true;
            stopPromptSeen = false;
            stopPromptTail = "";
            pauseAsyncReader();
            // Equivale ao desconectar/conectar manualmente, mas sem remover a
            // autorização USB nem destruir a porta WebSerial da interface.
            reopenPort();
            resumeAsyncReader();
            Thread.sleep(TRANSACTION_READER_SETTLE_MS);
            for (int attempt = 0; attempt < STOP_RECOVERY_ATTEMPTS; attempt += 1) {
                writeReplInterrupt();
                if (stopPromptSeen) {
                    break;
                }
                if (attempt + 1 < STOP_RECOVERY_ATTEMPTS) {
                    Thread.sleep(STOP_RECOVERY_INTERVAL_MS);
                }
            }
            resolve(requestId, new JSONObject());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            reject(requestId, "A parada do programa foi cancelada.");
        } catch (Exception exception) {
            reject(requestId, friendlyError("Falha ao parar o programa", exception));
        } finally {
            stopRecoveryActive = false;
            stopRequested = false;
            resumeAsyncReader();
        }
    }

    private void writeReplInterrupt() throws Exception {
        // A sequência exata usada pelo navegador para interromper o programa.
        port.write(new byte[] {0x03, 0x03}, WRITE_TIMEOUT_MS);
    }

    private void reopenPort() throws Exception {
        if (port != null) {
            try {
                port.close();
            } catch (Exception ignored) {
                // A recuperação deve continuar mesmo se o descritor antigo já fechou.
            }
            port = null;
        }
        if (connection != null) {
            connection.close();
            connection = null;
        }
        if (selectedDriver == null
                || !usbManager.hasPermission(selectedDriver.getDevice())) {
            throw new IllegalStateException("A autorização USB da BitDogLab foi perdida.");
        }

        connection = usbManager.openDevice(selectedDriver.getDevice());
        if (connection == null) {
            throw new IllegalStateException("O Android não conseguiu reabrir a porta USB.");
        }
        port = selectedDriver.getPorts().get(0);
        port.open(connection);
        port.setParameters(
                BITDOGLAB_BAUD_RATE,
                8,
                UsbSerialPort.STOPBITS_1,
                UsbSerialPort.PARITY_NONE
        );
    }

    private void executeTransaction(
            String requestId,
            String encodedCommand,
            String endMarker,
            int timeoutMs
    ) {
        if (port == null || !port.isOpen()) {
            reject(requestId, "A BitDogLab não está conectada.");
            return;
        }
        if (encodedCommand == null
                || encodedCommand.isEmpty()
                || encodedCommand.length() > MAX_ENCODED_WRITE_CHARS) {
            reject(requestId, "O comando enviado à placa é inválido ou excede o limite.");
            return;
        }
        if (endMarker == null
                || !endMarker.matches("__BIPES_FS_END_[A-Za-z0-9]{1,32}__")) {
            reject(requestId, "O marcador final da operação é inválido.");
            return;
        }
        int boundedTimeoutMs = Math.max(1000, Math.min(timeoutMs, 20000));
        byte[] commandBytes;
        try {
            commandBytes = Base64.decode(encodedCommand, Base64.NO_WRAP);
        } catch (IllegalArgumentException exception) {
            reject(requestId, "O comando enviado à placa não está em Base64 válido.");
            return;
        }

        try {
            pauseAsyncReader();
            // Ctrl+B garante a saída de um possível Raw REPL deixado por uma
            // operação anterior. Dois Ctrl+C interrompem o programa em curso.
            port.write(new byte[] {0x02, 0x03, 0x03, 0x0D}, WRITE_TIMEOUT_MS);
            byte[] promptResponse = readDirectlyUntil(">>>", 4000);
            if (promptResponse == null) {
                reject(
                        requestId,
                        "A placa não apresentou o prompt normal para ler os arquivos."
                );
                return;
            }

            port.write(commandBytes, WRITE_TIMEOUT_MS);
            byte[] responseBytes = readDirectlyUntil(endMarker, boundedTimeoutMs);
            if (responseBytes == null) {
                reject(requestId, "A placa demorou para concluir a operação de arquivos.");
                return;
            }

            JSONObject value = new JSONObject();
            value.put("data", Base64.encodeToString(responseBytes, Base64.NO_WRAP));
            resolve(requestId, value);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            reject(requestId, "A operação de arquivos foi cancelada.");
        } catch (Exception exception) {
            reject(
                    requestId,
                    friendlyError("Falha na operação de arquivos da placa", exception)
            );
        } finally {
            resumeAsyncReader();
        }
    }

    private void pauseAsyncReader() throws InterruptedException {
        if (inputOutputManager != null) {
            inputOutputManager.setListener(null);
            inputOutputManager.stop();
            inputOutputManager = null;
            Thread.sleep(TRANSACTION_READER_SETTLE_MS);
        }
    }

    private void resumeAsyncReader() {
        if (port == null || !port.isOpen() || inputOutputManager != null) {
            return;
        }
        inputOutputManager = new SerialInputOutputManager(port, this);
        inputOutputManager.start();
    }

    private byte[] readDirectlyUntil(String marker, int timeoutMs) throws Exception {
        long deadline = System.nanoTime() + (long) timeoutMs * 1_000_000L;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] chunk = new byte[4096];

        while (System.nanoTime() < deadline) {
            int remainingMs = (int) Math.max(
                    1,
                    Math.min(
                            TRANSACTION_READ_SLICE_MS,
                            (deadline - System.nanoTime()) / 1_000_000L
                    )
            );
            int count = port.read(chunk, remainingMs);
            if (count <= 0) {
                continue;
            }
            if (output.size() + count > MAX_TRANSACTION_OUTPUT_BYTES) {
                throw new IllegalStateException(
                        "A resposta da placa excedeu o limite permitido."
                );
            }
            output.write(chunk, 0, count);
            String received = new String(
                    output.toByteArray(),
                    java.nio.charset.StandardCharsets.ISO_8859_1
            );
            if (received.contains(marker)) {
                return output.toByteArray();
            }
        }
        return null;
    }

    @Override
    public void onNewData(byte[] data) {
        if (stopRecoveryActive) {
            String received = new String(
                    data,
                    java.nio.charset.StandardCharsets.ISO_8859_1
            );
            String promptProbe = stopPromptTail + received;
            if (promptProbe.contains(">>>")) {
                stopPromptSeen = true;
            }
            stopPromptTail = promptProbe.length() > 3
                    ? promptProbe.substring(promptProbe.length() - 3)
                    : promptProbe;
        }
        JSONObject event = new JSONObject();
        try {
            event.put("type", "data");
            event.put("data", Base64.encodeToString(data, Base64.NO_WRAP));
            emit(event);
        } catch (JSONException ignored) {
            emitError("Falha ao encaminhar dados recebidos da placa.");
        }
    }

    @Override
    public void onRunError(Exception exception) {
        serialExecutor.execute(() -> {
            String message = friendlyError("A conexão USB foi interrompida", exception);
            closeInternal(false);
            emitDisconnected(message);
        });
    }

    private void closeInternal(boolean detached) {
        if (inputOutputManager != null) {
            inputOutputManager.setListener(null);
            inputOutputManager.stop();
            inputOutputManager = null;
        }
        if (port != null) {
            try {
                port.close();
            } catch (Exception ignored) {
                // A desconexão física pode fechar o descritor antes desta chamada.
            }
            port = null;
        }
        if (connection != null) {
            connection.close();
            connection = null;
        }
        if (detached) {
            selectedDriver = null;
            emitDisconnected("A BitDogLab foi desconectada do celular.");
        }
    }

    private void resolvePort(String requestId, UsbDevice device) {
        JSONObject value = new JSONObject();
        try {
            value.put("vendorId", device.getVendorId());
            value.put("productId", device.getProductId());
            value.put("productName", device.getProductName());
        } catch (JSONException ignored) {
            // Os identificadores numéricos bastam quando o nome não está disponível.
        }
        resolve(requestId, value);
    }

    private void resolve(String requestId, JSONObject value) {
        JSONObject response = new JSONObject();
        try {
            response.put("type", "response");
            response.put("id", requestId);
            response.put("ok", true);
            response.put("value", value);
            emit(response);
        } catch (JSONException ignored) {
            emitError("Falha ao confirmar uma operação USB.");
        }
    }

    private void reject(String requestId, String message) {
        JSONObject response = new JSONObject();
        try {
            response.put("type", "response");
            response.put("id", requestId);
            response.put("ok", false);
            response.put("error", message);
            emit(response);
        } catch (JSONException ignored) {
            emitError(message);
        }
    }

    private void emitDisconnected(String message) {
        JSONObject event = new JSONObject();
        try {
            event.put("type", "disconnect");
            event.put("error", message);
            emit(event);
        } catch (JSONException ignored) {
            emitError(message);
        }
    }

    private void emitError(String message) {
        JSONObject event = new JSONObject();
        try {
            event.put("type", "error");
            event.put("error", message);
            emit(event);
        } catch (JSONException ignored) {
            // Não há outro canal seguro para relatar uma falha de serialização JSON.
        }
    }

    private void emit(JSONObject message) {
        String script = "window.__bitdoglabNativeSerialReceive(" + message + ");";
        activity.runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    private String friendlyError(String prefix, Exception exception) {
        String detail = exception.getMessage();
        return detail == null || detail.isBlank() ? prefix + "." : prefix + ": " + detail;
    }

    @SuppressWarnings("deprecation")
    private UsbDevice getUsbDevice(Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return intent.getParcelableExtra(UsbManager.EXTRA_DEVICE, UsbDevice.class);
        }
        return intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
    }

    private void registerReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_USB_PERMISSION);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        ContextCompat.registerReceiver(
                activity,
                usbReceiver,
                filter,
                ContextCompat.RECEIVER_NOT_EXPORTED
        );
        receiverRegistered = true;
    }

    public void destroy() {
        pendingPermissionRequestId = null;
        serialExecutor.execute(() -> closeInternal(false));
        serialExecutor.shutdown();
        if (receiverRegistered) {
            activity.unregisterReceiver(usbReceiver);
            receiverRegistered = false;
        }
    }
}
