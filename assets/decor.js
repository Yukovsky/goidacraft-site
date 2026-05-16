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
    '/assets/cursor/busy.gif',
    '/assets/cursor/resize_nwse.png',
    '/assets/cursor/resize_ns.png',
    '/assets/cursor/resize_nesw.png',
    '/assets/cursor/resize_ew.png',
    '/assets/cursor/resize_all.png',
    '/assets/cursor/pointing_hand.png',
    '/assets/cursor/not_allowed.png',
    '/assets/cursor/ibeam.png',
    '/assets/cursor/grabbing.png',
    '/assets/cursor/default.png',
    '/assets/cursor/crosshair.png',
  ];
  const WARMUP_PAGE_URLS = ['/', '/mods', '/connect', '/donors'];
  const SERVER_STATUS_URL = 'https://api.mcsrvstat.us/2/goidacraft.aboba.host';

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

  async function prefetchPages() {
    await Promise.allSettled(WARMUP_PAGE_URLS.map(async (url) => {
      try {
        await fetch(url, {
          cache: 'force-cache',
          credentials: 'same-origin',
          mode: 'same-origin',
        });
      } catch (_) {
        // Best effort only.
      }
    }));
  }

  async function prefetchServerStatus() {
    try {
      if (window.ServerStatus?.fetch) {
        await window.ServerStatus.fetch();
        return;
      }

      await fetch(SERVER_STATUS_URL, {
        cache: 'no-store',
      });
    } catch (_) {
      // Server status warmup can fail without blocking UI.
    }
  }

  async function warmupResources(options = {}) {
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;

    const tasks = [
      { stage: 'images', run: () => prefetchImages() },
      { stage: 'server', run: () => prefetchServerStatus() },
      { stage: 'pages', run: () => prefetchPages() },
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

  document.addEventListener('DOMContentLoaded', () => {
    enhanceImages();
    registerImageCacheWorker();
    initNavigationLoaderIntent();
    window.GoidacraftWarmup = {
      run: warmupResources,
      skipKey: SKIP_NEXT_LOADER_KEY,
    };
    populateGears();
    initTopnavMobile();
    // ====== Favicon rotation (activated on brand hover/focus) ======
    (function () {
      const FAV_SRC = '/assets/img/goidalogo.png';
      const SIZE = 64;
      let rafId = null;
      let angle = 0;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = FAV_SRC;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext('2d');

      function setFavicon(href) {
        let link = document.querySelector('link[rel~="icon"]');
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = href;
      }

      function drawFrame() {
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();
        ctx.translate(SIZE / 2, SIZE / 2);
        ctx.rotate(angle);
        // draw image centered, slightly inset
        const drawSize = Math.min(SIZE * 0.85, SIZE - 6);
        ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
        const url = canvas.toDataURL('image/png');
        setFavicon(url);
        angle += 0.12; // radians per frame-ish
        rafId = requestAnimationFrame(drawFrame);
      }

      function startSpin() {
        if (rafId) return;
        if (!img.complete) {
          img.onload = () => { rafId = requestAnimationFrame(drawFrame); };
        } else {
          rafId = requestAnimationFrame(drawFrame);
        }
      }

      function pauseSpin() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        // keep current `angle` and current canvas favicon (do not restore)
      }

      function stopSpin() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        angle = 0;
        // restore original favicon file
        setFavicon(FAV_SRC);
      }

      const brand = document.querySelector('.topnav-brand');
      if (brand) {
        const logoEl = brand.querySelector('.topnav-logo');
        const setLogoAnimationState = (state) => { if (logoEl) logoEl.style.animationPlayState = state; };

        brand.addEventListener('mouseenter', () => {
          brand.classList.add('logo-spin');
          setLogoAnimationState('running');
          startSpin();
        });
        brand.addEventListener('mouseleave', () => {
          setLogoAnimationState('paused');
          pauseSpin();
        });
        brand.addEventListener('focus', () => {
          brand.classList.add('logo-spin');
          setLogoAnimationState('running');
          startSpin();
        }, true);
        brand.addEventListener('blur', () => {
          setLogoAnimationState('paused');
          pauseSpin();
        }, true);

        // touch handlers: start on touchstart, pause on touchend anywhere
        brand.addEventListener('touchstart', () => {
          brand.classList.add('logo-spin');
          setLogoAnimationState('running');
          startSpin();
        }, { passive: true });
        document.addEventListener('touchend', () => {
          setLogoAnimationState('paused');
          pauseSpin();
        }, { passive: true });
      }
    })();
  });
})();
