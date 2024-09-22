package com.jkruja.uet;

// Import necessary Android and Java packages
import android.app.DownloadManager;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.ConnectivityManager.NetworkCallback;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.URLUtil;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.ComponentActivity;

import androidx.annotation.NonNull;
import android.annotation.SuppressLint;

public class MainActivity extends ComponentActivity {
    private WebView mWebView;
    private NetworkCallback networkCallback;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize the WebView and set its settings
        mWebView = findViewById(R.id.activity_main_webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true); // Enable JavaScript
        webSettings.setDomStorageEnabled(true); // Enable DOM storage

        // Set a custom WebViewClient to handle URL loading and page events
        mWebView.setWebViewClient(new HelloWebViewClient());

        // Set a download listener to handle file downloads from the WebView
        mWebView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setMimeType(mimetype); // Set the MIME type
            request.addRequestHeader("cookie", CookieManager.getInstance().getCookie(url));
            request.addRequestHeader("User-Agent", userAgent); // Add headers
            request.setDescription("Downloading file...");
            request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype)); // Set the download file name
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED); // Show notification on download completion
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype)); // Set the download destination
            DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            dm.enqueue(request); // Enqueue the download request
            Toast.makeText(getApplicationContext(), "Downloading File", Toast.LENGTH_LONG).show(); // Show a toast message
        });

        // Check network availability and load the appropriate URL
        if (isNetworkAvailable()) {
            mWebView.loadUrl("https://uet.jkruja.com/"); // Load the online URL
        } else {
            mWebView.loadUrl("file:///android_asset/offline.html"); // Load the offline page
        }

        // Define a network callback to handle network changes
        networkCallback = new NetworkCallback() {
            @Override
            public void onAvailable(@NonNull Network network) {
                runOnUiThread(() -> {
                    if (mWebView.getUrl() != null && !mWebView.getUrl().startsWith("file:///android_asset")) {
                        mWebView.loadUrl("https://uet.jkruja.com/"); // Reload the online URL when network becomes available
                    }
                });
            }

            @Override
            public void onLost(@NonNull Network network) {
                runOnUiThread(() -> {
                    if (mWebView.getUrl() != null) {
                        mWebView.loadUrl("file:///android_asset/offline.html"); // Load the offline page when network is lost
                    }
                });
            }
        };

        // Register the network callback to listen for network changes
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        connectivityManager.registerDefaultNetworkCallback(networkCallback);

        // Handle back button press
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (mWebView.canGoBack()) {
                    mWebView.goBack(); // Go back in WebView history
                } else {
                    finish(); // Close the activity
                }
            }
        });

        // Enable JavaScript debugging
        WebView.setWebContentsDebuggingEnabled(true);

        // Set a JavaScript interface to get more information about errors
        mWebView.addJavascriptInterface(new Object() {
            @android.webkit.JavascriptInterface
            public void logMessage(String message) {
                // Log essential JavaScript errors
            }
        }, "Android");
    }

    // Method to check network availability
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        Network nw = connectivityManager.getActiveNetwork();
        if (nw == null) return false;
        NetworkCapabilities actNw = connectivityManager.getNetworkCapabilities(nw);
        return actNw != null && (actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_VPN));
    }

    // Custom WebViewClient to handle URL loading and page events
    private static class HelloWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            view.loadUrl(request.getUrl().toString()); // Load the requested URL
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            // Inject JavaScript to log console errors
            view.evaluateJavascript("window.onerror = function(message, source, lineno, colno, error) { Android.logMessage(message + ' at ' + source + ':' + lineno + ':' + colno); return false; };", null);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Unregister the network callback to avoid memory leaks
        if (networkCallback != null) {
            ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            connectivityManager.unregisterNetworkCallback(networkCallback);
        }
    }
}