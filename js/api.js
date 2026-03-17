/**
 * LogiKron - API Helper
 * Usa JSONP per bypassare i limiti CORS di Google Apps Script.
 * fetch() fallisce a causa dei redirect Google; <script> injection no.
 */

function lkApi(url, params) {
  return new Promise((resolve, reject) => {
    const cbName = '_lkCb_' + Date.now();

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout risposta server'));
    }, 15000);

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      const el = document.getElementById(cbName);
      if (el) el.parentNode.removeChild(el);
    }

    window[cbName] = function(data) {
      cleanup();
      resolve(data);
    };

    const allParams = Object.assign({}, params, { callback: cbName });
    const qs = Object.keys(allParams)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(allParams[k]))
      .join('&');

    const script = document.createElement('script');
    script.id = cbName;
    script.src = url + '?' + qs;
    script.onerror = function() {
      cleanup();
      reject(new Error('Impossibile raggiungere il server'));
    };
    document.head.appendChild(script);
  });
}
