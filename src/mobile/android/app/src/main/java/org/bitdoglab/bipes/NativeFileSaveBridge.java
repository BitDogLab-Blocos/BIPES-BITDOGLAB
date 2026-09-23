package org.bitdoglab.bipes;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebView;

import androidx.activity.result.ActivityResultLauncher;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Saves WebView-generated files through Android's system document picker. */
public final class NativeFileSaveBridge {
    private static final int MAX_MESSAGE_CHARS = 400_000;
    private static final int MAX_CHUNK_BYTES = 256 * 1024;
    private static final long MAX_FILE_BYTES = 64L * 1024L * 1024L;
    private static final String PNG_MIME_TYPE = "image/png";

    private final Activity activity;
    private final WebView webView;
    private final ContentResolver contentResolver;
    private final ActivityResultLauncher<Intent> createDocumentLauncher;
    private final ExecutorService fileExecutor = Executors.newSingleThreadExecutor();

    private String pendingCreateRequestId;
    private String documentToken;
    private Uri documentUri;
    private OutputStream outputStream;
    private long expectedBytes;
    private long writtenBytes;

    public NativeFileSaveBridge(
            Activity activity,
            WebView webView,
            ActivityResultLauncher<Intent> createDocumentLauncher
    ) {
        this.activity = activity;
        this.webView = webView;
        this.contentResolver = activity.getContentResolver();
        this.createDocumentLauncher = createDocumentLauncher;
    }

    public void postMessage(String rawMessage) {
        if (rawMessage == null || rawMessage.length() > MAX_MESSAGE_CHARS) {
            emitProtocolError("Mensagem de arquivo ausente ou maior que o limite permitido.");
            return;
        }

        final JSONObject message;
        try {
            message = new JSONObject(rawMessage);
        } catch (JSONException exception) {
            emitProtocolError("Mensagem inválida recebida pela ponte de arquivos.");
            return;
        }

        String id = message.optString("id", "");
        String action = message.optString("action", "");
        JSONObject payload = message.optJSONObject("payload");
        if (!id.matches("[0-9]{1,20}")) {
            emitProtocolError("Identificador de arquivo inválido.");
            return;
        }

        switch (action) {
            case "createDocument":
                createDocument(id, payload);
                break;
            case "beginWrite":
                fileExecutor.execute(() -> beginWrite(id, payload));
                break;
            case "writeChunk":
                fileExecutor.execute(() -> writeChunk(id, payload));
                break;
            case "finishWrite":
                fileExecutor.execute(() -> finishWrite(id, payload));
                break;
            case "abortWrite":
                fileExecutor.execute(() -> abortWrite(id, payload));
                break;
            default:
                reject(id, "UNSUPPORTED", "Operação de arquivo desconhecida: " + action);
        }
    }

    private void createDocument(String requestId, JSONObject payload) {
        activity.runOnUiThread(() -> {
            synchronized (this) {
                if (pendingCreateRequestId != null || documentUri != null || outputStream != null) {
                    reject(requestId, "BUSY", "Já existe um salvamento em andamento.");
                    return;
                }
                pendingCreateRequestId = requestId;
            }

            String filename = sanitizeFilename(
                    payload == null ? "programa-bitdoglab.png" : payload.optString("filename", "")
            );
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE)
                    .setType(PNG_MIME_TYPE)
                    .putExtra(Intent.EXTRA_TITLE, filename);
            try {
                createDocumentLauncher.launch(intent);
            } catch (RuntimeException exception) {
                synchronized (this) {
                    pendingCreateRequestId = null;
                }
                reject(requestId, "PICKER_FAILED", friendlyError(
                        "Não foi possível abrir o seletor de arquivos", exception
                ));
            }
        });
    }

    public void onDocumentResult(int resultCode, Intent data) {
        final String requestId;
        synchronized (this) {
            requestId = pendingCreateRequestId;
            pendingCreateRequestId = null;
        }
        if (requestId == null) {
            return;
        }
        if (resultCode != Activity.RESULT_OK || data == null || data.getData() == null) {
            reject(requestId, "CANCELLED", "Salvamento cancelado.");
            return;
        }

        Uri selectedUri = data.getData();
        String selectedToken = UUID.randomUUID().toString();
        synchronized (this) {
            documentUri = selectedUri;
            documentToken = selectedToken;
        }

        JSONObject value = new JSONObject();
        try {
            value.put("token", selectedToken);
            value.put("name", queryDisplayName(selectedUri));
        } catch (JSONException ignored) {
            // The token is sufficient; JSON only fails on an unavailable platform value.
        }
        resolve(requestId, value);
    }

    private void beginWrite(String requestId, JSONObject payload) {
        String token = payload == null ? "" : payload.optString("token", "");
        long size = payload == null ? -1L : payload.optLong("size", -1L);
        Uri uri;
        synchronized (this) {
            if (!token.equals(documentToken) || documentUri == null) {
                reject(requestId, "INVALID_HANDLE", "O destino escolhido não está mais disponível.");
                return;
            }
            if (outputStream != null) {
                reject(requestId, "BUSY", "A gravação do arquivo já foi iniciada.");
                return;
            }
            if (size < 0 || size > MAX_FILE_BYTES) {
                reject(requestId, "TOO_LARGE", "A imagem excede o limite de 64 MB.");
                return;
            }
            uri = documentUri;
        }

        try {
            OutputStream stream = contentResolver.openOutputStream(uri, "wt");
            if (stream == null) {
                throw new IOException("O Android não forneceu um destino gravável.");
            }
            synchronized (this) {
                outputStream = stream;
                expectedBytes = size;
                writtenBytes = 0L;
            }
            resolve(requestId, new JSONObject());
        } catch (Exception exception) {
            failAndDiscard(requestId, "OPEN_FAILED", "Não foi possível iniciar o arquivo", exception);
        }
    }

    private void writeChunk(String requestId, JSONObject payload) {
        String token = payload == null ? "" : payload.optString("token", "");
        String encoded = payload == null ? "" : payload.optString("data", "");
        final byte[] bytes;
        try {
            bytes = Base64.decode(encoded, Base64.DEFAULT);
        } catch (IllegalArgumentException exception) {
            failAndDiscard(requestId, "INVALID_DATA", "Trecho de imagem inválido", exception);
            return;
        }
        if (bytes.length == 0 || bytes.length > MAX_CHUNK_BYTES) {
            failAndDiscard(requestId, "INVALID_DATA", "Trecho de imagem fora do limite", null);
            return;
        }

        try {
            synchronized (this) {
                if (!token.equals(documentToken) || outputStream == null) {
                    reject(requestId, "INVALID_HANDLE", "A gravação não está ativa.");
                    return;
                }
                if (writtenBytes + bytes.length > expectedBytes
                        || writtenBytes + bytes.length > MAX_FILE_BYTES) {
                    throw new IOException("Os dados recebidos excedem o tamanho declarado.");
                }
                outputStream.write(bytes);
                writtenBytes += bytes.length;
            }
            resolve(requestId, new JSONObject());
        } catch (Exception exception) {
            failAndDiscard(requestId, "WRITE_FAILED", "Não foi possível gravar a imagem", exception);
        }
    }

    private void finishWrite(String requestId, JSONObject payload) {
        String token = payload == null ? "" : payload.optString("token", "");
        try {
            synchronized (this) {
                if (!token.equals(documentToken) || outputStream == null) {
                    reject(requestId, "INVALID_HANDLE", "A gravação não está ativa.");
                    return;
                }
                if (writtenBytes != expectedBytes) {
                    throw new IOException("A imagem recebida está incompleta.");
                }
                outputStream.flush();
                outputStream.close();
                outputStream = null;
                clearDocumentState();
            }
            resolve(requestId, new JSONObject());
        } catch (Exception exception) {
            failAndDiscard(requestId, "WRITE_FAILED", "Não foi possível concluir a imagem", exception);
        }
    }

    private void abortWrite(String requestId, JSONObject payload) {
        String token = payload == null ? "" : payload.optString("token", "");
        synchronized (this) {
            if (!token.equals(documentToken)) {
                reject(requestId, "INVALID_HANDLE", "O destino escolhido não está mais disponível.");
                return;
            }
        }
        discardCurrentDocument();
        resolve(requestId, new JSONObject());
    }

    public void destroy() {
        synchronized (this) {
            pendingCreateRequestId = null;
            closeOutputQuietly();
            clearDocumentState();
        }
        fileExecutor.shutdownNow();
    }

    private synchronized void failAndDiscard(
            String requestId,
            String code,
            String prefix,
            Exception exception
    ) {
        String message = exception == null ? prefix + "." : friendlyError(prefix, exception);
        Uri failedUri = documentUri;
        closeOutputQuietly();
        clearDocumentState();
        if (failedUri != null) {
            try {
                contentResolver.delete(failedUri, null, null);
            } catch (RuntimeException ignored) {
                Log.w("BipesMobile", "Não foi possível remover o arquivo incompleto.");
            }
        }
        reject(requestId, code, message);
    }

    private synchronized void discardCurrentDocument() {
        Uri discardedUri = documentUri;
        closeOutputQuietly();
        clearDocumentState();
        if (discardedUri != null) {
            try {
                contentResolver.delete(discardedUri, null, null);
            } catch (RuntimeException ignored) {
                Log.w("BipesMobile", "Não foi possível remover o arquivo cancelado.");
            }
        }
    }

    private void closeOutputQuietly() {
        if (outputStream != null) {
            try {
                outputStream.close();
            } catch (IOException ignored) {
                // The document is discarded after an incomplete write.
            }
            outputStream = null;
        }
    }

    private void clearDocumentState() {
        documentToken = null;
        documentUri = null;
        expectedBytes = 0L;
        writtenBytes = 0L;
    }

    private String queryDisplayName(Uri uri) {
        try (android.database.Cursor cursor = contentResolver.query(
                uri,
                new String[]{OpenableColumns.DISPLAY_NAME},
                null,
                null,
                null
        )) {
            if (cursor != null && cursor.moveToFirst()) {
                String name = cursor.getString(0);
                if (name != null && !name.isBlank()) {
                    return name;
                }
            }
        } catch (RuntimeException ignored) {
            // Fall back to the stable default below.
        }
        return "programa-bitdoglab.png";
    }

    private String sanitizeFilename(String filename) {
        String sanitized = filename == null ? "" : filename.trim();
        sanitized = sanitized.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_");
        if (sanitized.isBlank()) {
            sanitized = "programa-bitdoglab.png";
        }
        if (!sanitized.toLowerCase(java.util.Locale.ROOT).endsWith(".png")) {
            sanitized += ".png";
        }
        return sanitized.length() > 120 ? sanitized.substring(sanitized.length() - 120) : sanitized;
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
            emitProtocolError("Falha ao confirmar uma operação de arquivo.");
        }
    }

    private void reject(String requestId, String code, String message) {
        JSONObject response = new JSONObject();
        try {
            response.put("type", "response");
            response.put("id", requestId);
            response.put("ok", false);
            response.put("code", code);
            response.put("error", message);
            emit(response);
        } catch (JSONException ignored) {
            emitProtocolError(message);
        }
    }

    private void emitProtocolError(String message) {
        JSONObject event = new JSONObject();
        try {
            event.put("type", "error");
            event.put("error", message);
            emit(event);
        } catch (JSONException ignored) {
            // There is no safer channel available for a malformed bridge message.
        }
    }

    private void emit(JSONObject message) {
        String script = "window.__bitdoglabNativeFileReceive(" + message + ");";
        activity.runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    private String friendlyError(String prefix, Exception exception) {
        String detail = exception.getMessage();
        return detail == null || detail.isBlank() ? prefix + "." : prefix + ": " + detail;
    }
}
