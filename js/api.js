/**
 * LogiKron - API Helper
 * Usa fetch() come metodo principale (funziona su Chrome, Edge, Firefox).
 * Fallback JSONP per browser che bloccano fetch() verso script.google.com.
 * NOTA: il SW esclude già i domini Google dall'intercettazione (nessun conflitto CORS).
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

// fetch() con timeout — metodo principale (non bloccato da Edge Tracking Prevention)
function _lkFetch(url, params, timeoutMs) {
  const qs = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || 15000);
  return fetch(url + '?' + qs, { signal: controller.signal })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .finally(() => clearTimeout(timer))
    .catch(err => {
      if (err.name === 'AbortError') throw new Error('Timeout risposta server');
      throw err;
    });
}

// JSONP fallback — usato solo se fetch() non è disponibile o bloccato
function _lkJsonp(url, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    const cbName = '_lkCb_' + (++_lkSeq) + '_' + Date.now();
    const timer = setTimeout(() => { cleanup(); reject(new Error('Timeout risposta server')); }, timeoutMs || 15000);
    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      const el = document.getElementById(cbName);
      if (el) el.parentNode.removeChild(el);
    }
    window[cbName] = function(data) { cleanup(); resolve(data); };
    const allParams = Object.assign({}, params, { callback: cbName });
    const qs = Object.keys(allParams).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(allParams[k])).join('&');
    const script = document.createElement('script');
    script.id = cbName;
    script.src = url + '?' + qs;
    document.head.appendChild(script);
  });
}

// Punto di accesso unico: fetch() e JSONP partono IN PARALLELO.
// Vince chi risponde prima. Se fetch() è bloccato (Edge, Android), vince JSONP.
// Se JSONP è bloccato (Edge tracking), vince fetch().
// Nessuna attesa sequenziale: il primo che arriva risolve la Promise.
function lkApi(url, params, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var settled = false;
    function win(val)  { if (!settled) { settled = true; resolve(val); } }
    function lose(err) { if (!settled) { settled = true; reject(err); } }

    // fetch() e JSONP in parallelo: entrambi "svegliano" AS contemporaneamente
    _lkFetch(url, params, timeoutMs)
      .then(win)
      .catch(function() {}); // se fetch() fallisce, aspettiamo JSONP

    _lkJsonp(url, params, timeoutMs)
      .then(win)
      .catch(lose); // se anche JSONP fallisce, rigetta
  });
}
