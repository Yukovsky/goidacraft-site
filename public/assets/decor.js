/* Decor / interactivity for Goidacraft v2.
   - Replaces SVG gear factory with PNG cog elements.
   - Parallax + gear-speed controls.
 */
(function () {
  const SKIP_NEXT_LOADER_KEY = 'goidacraft:skip-next-loader';
  const WARMUP_IMAGE_URLS = [
    '/assets/img/train.png',
    '/assets/img/title.png',
    '/assets/img/goidalogo.png',
    '/assets/img/sky-bg.webp',
    '/assets/img/hero-bg.webp',
    '/assets/img/gear-small.png',
    '/assets/img/gear-large.png',
  ];

  // ====== Auto-populate cogs ======
  // Convert any .gear-host element into a PNG cog (big/small).
  // data-size: 'large' or 'small' (default by data-r ≥ 40 -> large).
  window.populateGears = function () {
    document.querySelectorAll('.gear-host').forEach(el => {
      if (el.dataset.populated) return;
      el.dataset.populated = '1';
      const r = +el.dataset.r || 30;
      const size = el.dataset.size || (r >= 36 ? 'large' : 'small');
      const ccw = el.classList.contains('ccw');
      const px = r * 2;
      el.innerHTML = '';
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      const cog = document.createElement('span');
      cog.className = 'cog cog-' + size + ' cog-spin' + (ccw ? ' ccw' : '');
      cog.style.width  = px + 'px';
      cog.style.height = px + 'px';
      el.appendChild(cog);
    });
  };

  // ====== Parallax ======
  let parallaxEnabled = true;
  window.setParallax = function (on) {
    parallaxEnabled = on;
    if (!on) document.querySelectorAll('[data-parallax]').forEach(el => el.style.transform = '');
  };
  function onScroll() {
    if (!parallaxEnabled) return;
    const y = window.scrollY;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ====== Gear speed ======
  window.setGearSpeed = function (s) {
    document.documentElement.style.setProperty('--gear-speed', s);
  };

  // ====== Image lazy-loading + SW ======
  function enhanceImages() {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  function registerImageCacheWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/cache-worker.js').catch(() => {});
    });
  }

  function collectVisibleImageUrls() {
    const urls = new Set(WARMUP_IMAGE_URLS);
    document.querySelectorAll('img[src]').forEach((img) => {
      try {
        const absolute = new URL(img.getAttribute('src'), location.href);
        if (absolute.origin !== location.origin) return;
        urls.add(absolute.pathname);
      } catch (_) {
        // Ignore malformed URLs.
      }
    });
    return Array.from(urls);
  }

  async function prefetchImages() {
    const imageUrls = collectVisibleImageUrls();
    if (!imageUrls.length) return;

    await Promise.allSettled(imageUrls.map(async (url) => {
      try {
        await fetch(url, {
          cache: 'force-cache',
          credentials: 'same-origin',
          mode: 'same-origin',
        });
      } catch (_) {
        // Best effort; continue warmup even if one image fails.
      }
    }));
  }

  async function warmupResources(options = {}) {
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;

    const tasks = [
      { stage: 'images', run: () => prefetchImages() },
    ];

    const totalTasks = tasks.length;
    let completedTasks = 0;

    const markTaskDone = (stage) => {
      completedTasks += 1;
      onProgress?.({ completed: completedTasks, total: totalTasks, stage });
    };

    await Promise.allSettled(tasks.map(async (task) => {
      await task.run();
      markTaskDone(task.stage);
    }));
  }

  function initNavigationLoaderIntent() {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest('a[href]');
      if (!link) return;
      if (link.target && link.target !== '_self') return;

      let targetUrl;
      try {
        targetUrl = new URL(link.getAttribute('href'), location.href);
      } catch (_) {
        return;
      }

      if (targetUrl.origin !== location.origin) return;
      if (targetUrl.pathname === location.pathname && targetUrl.hash) return;

      sessionStorage.setItem(SKIP_NEXT_LOADER_KEY, '1');
    });
  }

  // ====== Mobile topnav ======
  function closeTopnav(nav, button) {
    nav.classList.remove('mobile-open');
    button.setAttribute('aria-expanded', 'false');
  }

  function initTopnavMobile() {
    document.querySelectorAll('.topnav').forEach((nav, idx) => {
      const inner = nav.querySelector('.topnav-inner');
      const links = nav.querySelector('.topnav-links');
      if (!inner || !links) return;

      const linksId = links.id || `topnav-links-${idx + 1}`;
      links.id = linksId;

      let button = nav.querySelector('.topnav-toggle');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'topnav-toggle';
        button.setAttribute('aria-label', 'Открыть меню навигации');
        button.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        inner.insertBefore(button, links);
      }

      button.setAttribute('aria-controls', linksId);
      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', () => {
        const willOpen = !nav.classList.contains('mobile-open');
        nav.classList.toggle('mobile-open', willOpen);
        button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => closeTopnav(nav, button));
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 980) closeTopnav(nav, button);
      });

      document.addEventListener('click', (event) => {
        if (!nav.classList.contains('mobile-open')) return;
        if (!nav.contains(event.target)) closeTopnav(nav, button);
      });
    });
  }

  function _init() {
    enhanceImages();
    registerImageCacheWorker();
    initNavigationLoaderIntent();
    window.GoidacraftWarmup = {
      run: warmupResources,
      skipKey: SKIP_NEXT_LOADER_KEY,
    };
    populateGears();
    initTopnavMobile();
    window.dispatchEvent(new CustomEvent('goidacraft:ready'));

    // ====== On-hover link prefetch (merged from prefetch.js) ======
    (function () {
      if (!('caches' in window)) return;
      const PAGES_CACHE = 'pages-cache-v1';

      function isSlowNetwork() {
        try {
          const nav = navigator.connection || {};
          if (nav.saveData) return true;
          return /2g|slow-2g/.test(nav.effectiveType || '');
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
          if (await cache.match(req)) return;
          const resp = await fetch(req);
          if (resp && resp.ok) await cache.put(req, resp.clone());
        } catch (_) {}
      }

      let hoverTimer = null;
      document.addEventListener('mouseover', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => prefetchUrl(href), 120);
      }, { passive: true });

      document.addEventListener('focusin', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href) prefetchUrl(href);
      });
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }
})();
