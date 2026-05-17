import React, { useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HomePage() {
  const loaderRef = useRef(null)

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader) return

    const loaderText = loader.querySelector('.loader-text')
    const loaderProgress = loader.querySelector('.loader-progress')

    const SKIP_KEY = window.GoidacraftWarmup?.skipKey || 'goidacraft:skip-next-loader'
    const WARMUP_MARKER_KEY = 'goidacraft:warmup-version'
    const WARMUP_VERSION = 'v3'

    function setLoaderProgress(percent) {
      if (!loaderProgress) return
      loaderProgress.style.setProperty('--progress', `${Math.max(0, Math.min(100, percent))}%`)
    }
    function setLoaderText(msg) {
      if (loaderText) loaderText.textContent = msg
    }
    function showLoader() {
      document.documentElement.classList.add('loading')
      setLoaderProgress(0)
      setLoaderText('Подготовка маршрута...')
    }
    function hideLoader() {
      loader.classList.add('gone')
      document.documentElement.classList.remove('loading')
    }
    function consumeSkip() {
      try {
        if (sessionStorage.getItem(SKIP_KEY) === '1') {
          sessionStorage.removeItem(SKIP_KEY)
          return true
        }
      } catch (_) {}
      return false
    }
    async function hasWarmCache() {
      try {
        if (localStorage.getItem(WARMUP_MARKER_KEY) !== WARMUP_VERSION) return false
      } catch (_) { return false }
      if (!('caches' in window)) return true
      try {
        const criticalUrls = [
          '/assets/img/train.png', '/assets/img/title.png', '/assets/img/goidalogo.png',
          '/assets/styles.css', '/assets/decor.js',
        ]
        const checks = await Promise.all(criticalUrls.map(async (url) => {
          const r = await caches.match(url, { ignoreSearch: true })
          return Boolean(r)
        }))
        return checks.every(Boolean)
      } catch (_) { return false }
    }
    async function runWarmup(withVisual) {
      const warmup = window.GoidacraftWarmup?.run
      if (typeof warmup !== 'function') return
      if (!withVisual) {
        await warmup()
        try { localStorage.setItem(WARMUP_MARKER_KEY, WARMUP_VERSION) } catch (_) {}
        return
      }
      const labels = { images: 'Кэшируем изображения...', server: 'Проверяем подключение к серверу...', pages: 'Готовим страницы...' }
      await warmup({
        onProgress: ({ completed, total, stage }) => {
          setLoaderProgress(Math.round((total > 0 ? completed / total : 1) * 100))
          setLoaderText(labels[stage] || 'Подготовка маршрута...')
        }
      })
      setLoaderProgress(100)
      setLoaderText('Маршрут готов')
      try { localStorage.setItem(WARMUP_MARKER_KEY, WARMUP_VERSION) } catch (_) {}
    }
    async function bootstrap() {
      const skip = consumeSkip()
      const warm = skip ? true : await hasWarmCache()
      if (warm) { hideLoader(); runWarmup(false).catch(() => {}); return }
      showLoader()
      await runWarmup(true)
      hideLoader()
    }
    bootstrap().catch(() => hideLoader())

    // Pointer tilt on loader
    const updateTilt = (e) => {
      const b = loader.getBoundingClientRect()
      const ox = e.clientX - b.left - b.width / 2
      const oy = e.clientY - b.top - b.height / 2
      loader.style.setProperty('--mx', `${ox}px`)
      loader.style.setProperty('--my', `${oy}px`)
      loader.style.setProperty('--lx', `${ox * 0.08}px`)
      loader.style.setProperty('--ly', `${oy * 0.08}px`)
    }
    loader.addEventListener('pointermove', updateTilt)
    loader.addEventListener('pointerleave', () => {
      loader.style.setProperty('--mx', '0px')
      loader.style.setProperty('--my', '0px')
      loader.style.setProperty('--lx', '0px')
      loader.style.setProperty('--ly', '0px')
    })

    // Copy IP button
    const btn = document.getElementById('hero-copy')
    if (btn) {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.ip).catch(() => {})
        const old = btn.textContent
        btn.textContent = 'IP скопирован'
        setTimeout(() => { btn.textContent = old }, 1800)
      })
    }

    return () => {
      loader.removeEventListener('pointermove', updateTilt)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Гойдакрафт — Главная</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/img/goidalogo.png" />
        <link rel="apple-touch-icon" href="/assets/img/goidalogo.png" />
        <link rel="preload" as="image" href="/assets/img/goidalogo.png" />
        <link rel="preload" as="image" href="/assets/img/title.png" />
      </Head>

      <div id="loader" ref={loaderRef}>
        <div className="loader-train-wrap">
          <div className="loader-track" aria-hidden="true" />
          <img className="loader-train" src="/assets/img/train.png" alt="" loading="lazy" decoding="async" />
          <div className="steam-stack" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
        <div className="loader-text">Подготовка маршрута…</div>
        <div className="loader-progress" />
      </div>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <img
              className="hero-title-mark"
              src="/assets/img/title.png"
              alt="Гойдакрафт"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-actions">
              <Link href="/connect" className="hero-btn">Как подключиться</Link>
              <button className="hero-btn alt" id="hero-copy" data-ip="goidacraft.aboba.host">
                IP: goidacraft.aboba.host
              </button>
            </div>
          </div>
          <div className="hero-spacer" aria-hidden="true" />
        </div>
      </section>

      <section className="trailer-section">
        <div className="trailer-shell">
          <p className="trailer-title">▸ Трейлер сервера ◂</p>
          <div className="trailer-frame">
            <iframe
              src="https://www.youtube.com/embed/3MEuBEMHh8Q"
              title="Трейлер сервера — Гойдакрафт"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="about">
        <span className="cog cog-small cog-spin ccw deco-cog" style={{ right: '-30px', top: '40px', width: '160px', height: '160px', opacity: 0.2 }} />
        <div className="about-grid">
          <div>
            <div className="about-eyebrow">О проекте</div>
            <h2>
              <span className="line">Не про <em>анархию</em>.</span>
              <span className="line nowrap">Про <em>взаимоуважение</em>.</span>
            </h2>
          </div>
          <div className="about-body">
            <p className="about-lead">Гойдакрафт — частный role-play сервер для тех, кто играет тихо, не спеша, и любит когда механизмы шипят, а в небе летают дирижабли.</p>
          </div>
          <div className="about-full">
            <p>Цель проекта — обеспечить игрокам возможность <strong>приятного времяпрепровождения</strong> через создание доброжелательного комьюнити и предоставление свободы действий, не противоречащих базовым правилам сервера и элементарным нормам морали.</p>
            <p>Мы строим вместе: фермы из <em>Farmer&apos;s Delight</em>, железные дороги <em>Steam &apos;n&apos; Rails</em>, виноградники <em>Let&apos;s Do Vinery</em>, тяжёлые заводы <em>The Factory Must Grow</em>, дирижабли через <em>Create: Aeronautics</em>. Свобода ограничена только взаимоуважением.</p>
          </div>
        </div>

        <div className="principles">
          <div className="principle">
            <h3>Взаимоуважение</h3>
            <p>Игроки относятся друг к другу как соседи в небольшом городке. Конфликты решаются через диалог, не через TNT.</p>
          </div>
          <div className="principle">
            <h3>Взаимопомощь</h3>
            <p>Вместе строить интереснее, чем в одиночку. Делимся ресурсами, рецептами, проектами и редкими находками.</p>
          </div>
          <div className="principle">
            <h3>Коммуникация</h3>
            <p>Голосовой чат, Telegram, Discord. Обсуждаем идеи, договариваемся о территориях, организуем совместные стройки.</p>
          </div>
        </div>
      </section>

      <section className="quick-links">
        <div className="quick-links-inner">
          <Link className="ql-card" href="/mods">
            <div className="ql-icon"><span className="cog cog-large cog-spin" style={{ width: '44px', height: '44px' }} /></div>
            <h3>Список модов</h3>
            <p>Create · Let&apos;s Do · Farmer&apos;s Delight</p>
          </Link>
          <Link className="ql-card" href="/connect">
            <div className="ql-icon"><span className="cog cog-small cog-spin" style={{ width: '44px', height: '44px' }} /></div>
            <h3>Подключение</h3>
            <p>IP, версия, инструкция, сборка модов</p>
          </Link>
          <Link className="ql-card" href="/donors">
            <div className="ql-icon"><span className="cog cog-large cog-spin ccw" style={{ width: '44px', height: '44px' }} /></div>
            <h3>Доска почёта</h3>
            <p>Те, кто поддержал проект финансово</p>
          </Link>
        </div>
      </section>
    </>
  )
}
