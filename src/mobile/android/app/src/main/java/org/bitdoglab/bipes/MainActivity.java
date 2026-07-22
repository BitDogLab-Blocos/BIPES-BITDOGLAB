package org.bitdoglab.bipes;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.Nullable;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public final class MainActivity extends ComponentActivity {
    private static final String APP_ORIGIN = "https://appassets.androidplatform.net";
    private static final String START_URL = APP_ORIGIN + "/assets/src/pages/index.html?mobile=1";

    private WebView webView;
    private NativeSerialBridge serialBridge;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        webView = new WebView(this);
        serialBridge = new NativeSerialBridge(this, webView);
        installNativeSerialBridge(webView);
        installSerialCompatibility(webView);
        installMobileLayout(webView);
        configureWebView(webView);
        configureBackNavigation();
        setContentView(webView);

        if (savedInstanceState == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void installNativeSerialBridge(WebView view) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            throw new IllegalStateException(
                    "Atualize o Android System WebView para usar a conexão USB."
            );
        }
        WebViewCompat.addWebMessageListener(
                view,
                "BitDogLabUsbNative",
                Collections.singleton(APP_ORIGIN),
                (webView, message, sourceOrigin, isMainFrame, replyProxy) -> {
                    if (!isMainFrame || !APP_ORIGIN.equals(sourceOrigin.toString())) {
                        return;
                    }
                    String data = message.getData();
                    if (data != null) {
                        serialBridge.postMessage(data);
                    }
                }
        );
    }

    private void installMobileLayout(WebView view) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            throw new IllegalStateException(
                    "Atualize o Android System WebView para usar a conexão USB."
            );
        }
        String css = readRawResource(R.raw.mobile_layout);
        String script = "(function(){"
                + "function install(){"
                + "document.documentElement.classList.add('bipes-mobile-app');"
                + "var viewport=document.querySelector('meta[name=viewport]');"
                + "if(viewport){viewport.content='width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no';}"
                + "var style=document.createElement('style');"
                + "style.id='bipes-mobile-layout';"
                + "style.textContent=" + JSONObject.quote(css) + ";"
                + "(document.head||document.documentElement).appendChild(style);"
                + "}"
                + "if(document.documentElement){install();}"
                + "else{document.addEventListener('DOMContentLoaded',install,{once:true});}"
                + "})();";
        WebViewCompat.addDocumentStartJavaScript(
                view,
                script,
                Collections.singleton(APP_ORIGIN)
        );
    }

    private void installSerialCompatibility(WebView view) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            throw new IllegalStateException(
                    "Atualize o Android System WebView para usar a conexão USB."
            );
        }
        String script = readRawResource(R.raw.mobile_serial_shim);
        WebViewCompat.addDocumentStartJavaScript(
                view,
                script,
                Collections.singleton(APP_ORIGIN)
        );
    }

    private void configureBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                    return;
                }
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }

    private String readRawResource(int resourceId) {
        StringBuilder result = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                getResources().openRawResource(resourceId),
                StandardCharsets.UTF_8
        ))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append('\n');
            }
        } catch (IOException exception) {
            Log.e("BipesMobile", "Não foi possível carregar o suporte serial.", exception);
            throw new IllegalStateException("Falha ao iniciar o suporte USB.", exception);
        }
        return result.toString();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSafeBrowsingEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setSaveFormData(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(view, false);

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        view.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(
                    WebView webView,
                    WebResourceRequest request
            ) {
                Uri uri = request.getUrl();
                if (isAppOrigin(uri)) {
                    return assetLoader.shouldInterceptRequest(uri);
                }
                if ("http".equalsIgnoreCase(uri.getScheme())
                        || "https".equalsIgnoreCase(uri.getScheme())) {
                    return blockedNetworkResponse();
                }
                return null;
            }

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView webView,
                    WebResourceRequest request
            ) {
                Uri uri = request.getUrl();
                if (isAppOrigin(uri)) {
                    return false;
                }
                String scheme = uri.getScheme();
                if (!"https".equalsIgnoreCase(scheme)
                        && !"http".equalsIgnoreCase(scheme)
                        && !"mailto".equalsIgnoreCase(scheme)) {
                    Log.w("BipesMobile", "Link externo bloqueado: " + scheme);
                    return true;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException exception) {
                    Log.w("BipesMobile", "Nenhum aplicativo disponível para abrir o link.");
                }
                return true;
            }
        });
    }

    private boolean isAppOrigin(Uri uri) {
        return "https".equalsIgnoreCase(uri.getScheme())
                && "appassets.androidplatform.net".equalsIgnoreCase(uri.getHost());
    }

    private WebResourceResponse blockedNetworkResponse() {
        return new WebResourceResponse(
                "text/plain",
                StandardCharsets.UTF_8.name(),
                403,
                "Blocked by offline mobile policy",
                Collections.emptyMap(),
                new ByteArrayInputStream(new byte[0])
        );
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (serialBridge != null) {
            serialBridge.destroy();
            serialBridge = null;
        }
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
