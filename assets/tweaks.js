/* Shared Tweaks panel for Goidacraft pages.
   Adds floating cog button bottom-right; opens panel with:
   - gear animation speed
   - parallax on/off
   - ambient sound on/off (synthesized tick + steam)
*/
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "gearSpeed": 1,
    "parallax": true,
    "sound": false
  }/*EDITMODE-END*/;

  // Read from localStorage (so user prefs persist across pages)
  let state = { ...TWEAK_DEFAULTS };
  try {
    const stored = JSON.parse(localStorage.getItem('goida_tweaks') || '{}');
    state = { ...state, ...stored };
  } catch(e){}

  function persist() {
    try { localStorage.setItem('goida_tweaks', JSON.stringify(state)); } catch(e){}
  }

  function apply() {
    if (window.setGearSpeed) setGearSpeed(state.gearSpeed);
    if (window.setParallax) setParallax(state.parallax);
    if (window.setSound) setSound(state.sound);
  }

  // Build UI
  const root = document.createElement('div');
  root.id = 'goida-tweaks-root';
  root.innerHTML = `
    <button class="gt-fab" id="gt-fab" title="Настройки">
      <svg viewBox="-32 -32 64 64" width="32" height="32"><g class="gear-spin" style="transform-origin: center;">
        <path d="M -22 -8 L -16 -8 L -14 -14 L -8 -16 L -8 -22 L 8 -22 L 8 -16 L 14 -14 L 16 -8 L 22 -8 L 22 8 L 16 8 L 14 14 L 8 16 L 8 22 L -8 22 L -8 16 L -14 14 L -16 8 L -22 8 Z"
          fill="#c89b3c" stroke="#3a1c08" stroke-width="1.5"/>
        <circle r="6" fill="#1a1108" stroke="#e8c878" stroke-width="1"/>
      </g></svg>
    </button>
    <div class="gt-panel" id="gt-panel">
      <div class="gt-header">
        <span class="gt-title">⚙ Настройки</span>
        <button class="gt-close" id="gt-close" aria-label="Закрыть">×</button>
      </div>
      <div class="gt-body">
        <div class="gt-row">
          <label class="gt-label">Скорость шестерёнок</label>
          <div class="gt-speed-row">
            <input type="range" id="gt-speed" min="0" max="3" step="0.1" value="${state.gearSpeed}">
            <span class="gt-speed-val" id="gt-speed-val">${state.gearSpeed.toFixed(1)}×</span>
          </div>
        </div>
        <div class="gt-row gt-toggle">
          <label class="gt-label" for="gt-parallax">Параллакс при скролле</label>
          <input type="checkbox" id="gt-parallax" ${state.parallax ? 'checked' : ''}>
        </div>
        <div class="gt-row gt-toggle">
          <label class="gt-label" for="gt-sound">Звук тиканья и пара</label>
          <input type="checkbox" id="gt-sound" ${state.sound ? 'checked' : ''}>
        </div>
        <p class="gt-hint">Звук синтезируется браузером. Включится после клика.</p>
      </div>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #goida-tweaks-root { position: fixed; right: 20px; bottom: 20px; z-index: 9000; font-family: var(--f-mono, monospace); }
    .gt-fab {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(180deg, #2a1c0e, #1a1108);
      border: 2px solid var(--brass-dark, #8a6a1f);
      cursor: pointer; padding: 0;
      display: grid; place-items: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.5);
      transition: transform 0.2s;
    }
    .gt-fab:hover { transform: scale(1.06); border-color: var(--brass-light, #e8c878); }
    .gt-panel {
      position: absolute; right: 0; bottom: 72px;
      width: 320px;
      background: linear-gradient(180deg, #2a1c0e, #1a1108);
      border: 3px solid var(--brass-dark, #8a6a1f);
      box-shadow: 0 16px 40px rgba(0,0,0,0.6);
      color: var(--paper-2, #d9c69a);
      transform-origin: bottom right;
      transform: scale(0.85) translateY(10px); opacity: 0; pointer-events: none;
      transition: transform 0.2s, opacity 0.2s;
    }
    .gt-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }
    .gt-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-bottom: 2px solid var(--brass-dark, #8a6a1f);
      background: linear-gradient(180deg, #3a2818, #1a1108);
    }
    .gt-title { font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--brass-light, #e8c878); }
    .gt-close { background: none; border: none; color: var(--paper-2); font-size: 22px; cursor: pointer; line-height: 1; }
    .gt-body { padding: 16px 18px 18px; }
    .gt-row { margin-bottom: 16px; }
    .gt-row.gt-toggle { display: flex; justify-content: space-between; align-items: center; }
    .gt-label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--paper-2); display: block; margin-bottom: 8px; }
    .gt-toggle .gt-label { margin: 0; }
    .gt-speed-row { display: flex; align-items: center; gap: 12px; }
    .gt-speed-row input { flex: 1; accent-color: var(--brass, #c89b3c); }
    .gt-speed-val { font-size: 13px; color: var(--brass-light); min-width: 40px; text-align: right; }
    .gt-toggle input[type="checkbox"] { width: 36px; height: 20px; appearance: none; background: #1a1108; border: 1px solid var(--brass-dark); border-radius: 10px; position: relative; cursor: pointer; }
    .gt-toggle input[type="checkbox"]::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; background: var(--copper); border-radius: 50%; transition: 0.2s; }
    .gt-toggle input[type="checkbox"]:checked { background: #3a2818; }
    .gt-toggle input[type="checkbox"]:checked::after { left: 18px; background: var(--brass-light); }
    .gt-hint { font-size: 10px; color: var(--paper-shadow, #b8a37a); opacity: 0.7; margin: 8px 0 0; line-height: 1.4; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(root);

  const fab = document.getElementById('gt-fab');
  const panel = document.getElementById('gt-panel');
  const closeBtn = document.getElementById('gt-close');
  fab.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  document.getElementById('gt-speed').addEventListener('input', e => {
    state.gearSpeed = parseFloat(e.target.value);
    document.getElementById('gt-speed-val').textContent = state.gearSpeed.toFixed(1) + '×';
    persist(); apply();
  });
  document.getElementById('gt-parallax').addEventListener('change', e => {
    state.parallax = e.target.checked; persist(); apply();
  });
  document.getElementById('gt-sound').addEventListener('change', e => {
    state.sound = e.target.checked; persist(); apply();
  });

  // Wait for decor.js to be ready
  document.addEventListener('DOMContentLoaded', apply);
  if (document.readyState !== 'loading') setTimeout(apply, 50);
})();
