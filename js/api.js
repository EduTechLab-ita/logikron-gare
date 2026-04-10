/**
 * LogiKron - API Helper
 * Usa JSONP per bypassare i limiti CORS di Google Apps Script.
 * fetch() fallisce a causa dei redirect Google; <script> injection no.
 */

// ── Notifica aggiornamento SW ─────────────────────────────────────
// Quando il Service Worker si aggiorna, mostra un banner che invita
// a ricaricare la pagina. Nessuna azione manuale richiesta all'utente.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'SW_UPDATED') return;
    // Non mostrare durante la gara attiva (gara.html gestisce da solo il reload)
    if (window.location.pathname.includes('gara.html')) return;
    var banner = document.createElement('div');
    banner.id = 'lk-sw-update-banner';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9999',
      'background:#4f46e5', 'color:#fff', 'text-align:center',
      'padding:10px 16px', 'font-size:0.95rem', 'font-weight:600',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:12px'
    ].join(';');
    banner.innerHTML =
      '<span>🔄 Nuova versione disponibile</span>' +
      '<button onclick="location.reload()" style="' +
        'background:#fff;color:#4f46e5;border:none;border-radius:6px;' +
        'padding:4px 14px;font-weight:700;cursor:pointer;font-size:0.9rem' +
      '">Aggiorna</button>';
    document.body ? document.body.prepend(banner) :
      document.addEventListener('DOMContentLoaded', function() { document.body.prepend(banner); });
  });
}

let _lkSeq = 0;
function lkApi(url, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    const cbName = '_lkCb_' + (++_lkSeq) + '_' + Date.now();

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout risposta server'));
    }, timeoutMs || 15000);

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
    document.head.appendChild(script);
  });
}
