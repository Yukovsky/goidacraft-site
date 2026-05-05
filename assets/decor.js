/* Decor / interactivity for Goidacraft v2.
   - Replaces SVG gear factory with PNG cog elements.
   - Parallax + gear-speed + ambient sound (synthesized).
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

  // ====== Ambient sound (WebAudio synth) ======
  let audioCtx = null, soundOn = false, tickInterval = null, steamNode = null;
  window.setSound = function (on) {
    soundOn = on;
    if (on) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      startTick(); startSteam();
    } else { stopTick(); stopSteam(); }
  };
  function startTick() {
    if (tickInterval) return;
    tickInterval = setInterval(() => {
      if (!soundOn || !audioCtx) return;
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = 1800 + Math.random() * 200; o.type = 'square';
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.04, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g).connect(audioCtx.destination);
      o.start(t); o.stop(t + 0.08);
    }, 1000);
  }
  function stopTick() { if (tickInterval) { clearInterval(tickInterval); tickInterval = null; } }
  function startSteam() {
    if (steamNode || !audioCtx) return;
    const bs = 2 * audioCtx.sampleRate;
    const buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bs; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf; noise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 0.8;
    const gain = audioCtx.createGain(); gain.gain.value = 0.012;
    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();
    steamNode = { noise, gain };
  }
  function stopSteam() { if (steamNode) { try { steamNode.noise.stop(); } catch(e){} steamNode = null; } }

  document.addEventListener('DOMContentLoaded', populateGears);
})();
