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

  document.addEventListener('DOMContentLoaded', populateGears);
})();
