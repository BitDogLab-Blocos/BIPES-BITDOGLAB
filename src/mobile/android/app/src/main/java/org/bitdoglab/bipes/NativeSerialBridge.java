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
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import com.hoho.android.usbserial.util.SerialInputOutputManager;

import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Expõe a porta CDC do Android somente à WebView local do aplicativo. */
public final class NativeSerialBridge implements SerialInputOutputManager.Listener {
    private static final String ACTION_USB_PERMISSION =
            "org.bitdoglab.bipes.USB_PERMISSION";
    private static final int WRITE_TIMEOUT_MS = 4000;

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

    @JavascriptInterface
    public void postMessage(String rawMessage) {
        final JSONObject message;
        try {
            message = new JSONObject(rawMessage);
        } catch (JSONException exception) {
            emitError("Mensagem inválida recebida pela ponte USB.");
            return;
        }

        String id = message.optString("id", "");
        String action = message.optString("action", "");
        switch (action) {
            case "requestPort":
                requestPort(id);
                break;
            case "open":
                int baudRate = message.optJSONObject("payload") == null
                        ? 115200
                        : message.optJSONObject("payload").optInt("baudRate", 115200);
                serialExecutor.execute(() -> open(id, baudRate));
                break;
            case "write":
                JSONObject payload = message.optJSONObject("payload");
                String encoded = payload == null ? "" : payload.optString("data", "");
                serialExecutor.execute(() -> write(id, encoded));
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
            if (driver.getDevice().getVendorId() == 0x2E8A) {
                return driver;
            }
        }
        return drivers.get(0);
    }

    private UsbSerialDriver findDriver(UsbDevice device) {
        for (UsbSerialDriver driver : UsbSerialProber.getDefaultProber().findAllDrivers(usbManager)) {
            if (driver.getDevice().getDeviceId() == device.getDeviceId()) {
                return driver;
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
        try {
            byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
            port.write(bytes, WRITE_TIMEOUT_MS);
            resolve(requestId, new JSONObject());
        } catch (Exception exception) {
            reject(requestId, friendlyError("Falha ao enviar dados para a placa", exception));
        }
    }

    @Override
    public void onNewData(byte[] data) {
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
