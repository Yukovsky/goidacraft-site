// Prefetch internal pages and important assets on hover/click
(function(){
  if (!('addEventListener' in window)) return;
  const PAGES_CACHE = 'pages-cache-v1';

  function isSlowNetwork() {
    try {
      const nav = navigator.connection || {};
      if (nav.saveData) return true;
      const et = nav.effectiveType || '';
      return /2g|slow-2g/.test(et);
    } catch (_) { return false; }
  }

  function sameOrigin(url) {
    try { return new URL(url, location.href).origin === location.origin; } catch (_) { return false; }
  }

  async function prefetchUrl(href) {
    if (!sameOrigin(href) || isSlowNetwork()) return;
    try {
      const cache = await caches.open(PAGES_CACHE);
      const req = new Request(href, { credentials: 'same-origin' });
      const match = await cache.match(req);
      if (match) return;
      const resp = await fetch(req);
      if (resp && resp.ok) await cache.put(req, resp.clone());
    } catch (_) { /* ignore */ }
  }

  let pointerPrefetchTimer = null;
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    // small debounce to avoid accidental hovers
    clearTimeout(pointerPrefetchTimer);
    pointerPrefetchTimer = setTimeout(() => prefetchUrl(href), 120);
  }, { passive: true });

  // Also prefetch on focus (keyboard navigation)
  document.addEventListener('focusin', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    const href = a.getAttribute('href');
    if (!href) return;
    prefetchUrl(href);
  });

  // On click of internal links, set a session flag so next page can skip warmup loader
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') && !sameOrigin(href)) return;
    try { sessionStorage.setItem('goidacraft:skip-next-loader', '1'); } catch (_) {}
  });
})();
