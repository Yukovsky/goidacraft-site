/* Decor / interactivity for Goidacraft v2.
   - Replaces SVG gear factory with PNG cog elements.
   - Parallax + gear-speed controls.
 */
(function () {
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
    populateGears();
    initTopnavMobile();
  });
})();
