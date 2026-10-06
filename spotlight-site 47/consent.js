/* Spotlight: cookie consent + optional Google Analytics (GA4).
   Analytics loads ONLY after a visitor clicks "Accept analytics".
   To switch it on, paste your GA4 Measurement ID below (looks like G-ABC123XYZ9). */
(function () {
  document.documentElement.classList.add('js');

  var GA_ID = ''; // <-- put your GA4 Measurement ID here
  var KEY = 'spotlight_consent_v1';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var box = document.getElementById('cookie');
    if (!box) {
      box = document.createElement('div');
      box.id = 'cookie';
      box.className = 'cookie';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Cookie preferences');
      box.hidden = true;
      box.innerHTML =
        '<p class="ck-t">Cookies, kept simple</p>' +
        '<p class="ck-p">We use essential storage to make this site work. With your permission we also use analytics cookies to see which pages help visitors. Details are in our <a href="privacy.html">Privacy Policy</a>.</p>' +
        '<div class="ck-b"><button type="button" class="btn sm" id="ckAll">Accept analytics</button>' +
        '<button type="button" class="btn sm ghost" id="ckNo">Only necessary</button></div>';
      document.body.appendChild(box);
    }

    function measure() {
      document.documentElement.style.setProperty('--cb', box.offsetHeight + 'px');
    }
    function show() {
      box.hidden = false;
      document.body.classList.add('cookie-open');
      measure();
    }
    function hide() {
      box.hidden = true;
      document.body.classList.remove('cookie-open');
    }
    function choose(v) { set(v); hide(); if (v === 'all') loadGA(); }

    document.getElementById('ckAll').addEventListener('click', function () { choose('all'); });
    document.getElementById('ckNo').addEventListener('click', function () { choose('necessary'); });
    window.addEventListener('resize', function () { if (!box.hidden) measure(); });

    var opener = document.getElementById('cookieSettings');
    if (opener) opener.addEventListener('click', show);

    var saved = get();
    if (saved === 'all') loadGA();
    else if (saved !== 'necessary') setTimeout(show, 900);
  });
})();
