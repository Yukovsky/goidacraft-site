import React, { useEffect, useRef } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { useRouter } from 'next/router'
import '../assets/styles.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const path = router.pathname
  const loaderRef = useRef(null)

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader) return

    const loaderText = loader.querySelector('.loader-text')
    const loaderProgress = loader.querySelector('.loader-progress')

    function setLoaderProgress(percent) {
      if (!loaderProgress) return
      loaderProgress.style.setProperty('--progress', `${Math.max(0, Math.min(100, percent))}%`)
    }
    function setLoaderText(msg) {
      if (loaderText) loaderText.textContent = msg
    }
    function hideLoader() {
      loader.classList.add('gone')
      document.documentElement.classList.remove('loading')
    }
    function waitForReady() {
      if (typeof window.GoidacraftWarmup?.run === 'function') return Promise.resolve()
      return new Promise(resolve => {
        const t = setTimeout(resolve, 3000)
        window.addEventListener('goidacraft:ready', () => { clearTimeout(t); resolve() }, { once: true })
      })
    }

    async function bootstrap() {
      let alreadyVisited = false
      try { alreadyVisited = sessionStorage.getItem('goida:visited') === '1' } catch (_) {}

      if (alreadyVisited) {
        hideLoader()
        waitForReady().then(() => { window.GoidacraftWarmup?.run?.() }).catch(() => {})
        return
      }

      // First entry to site this session
      try { sessionStorage.setItem('goida:visited', '1') } catch (_) {}

      // _document.js already added html.loading before first paint; ensure it
      document.documentElement.classList.add('loading')
      setLoaderProgress(0)
      setLoaderText('Подготовка маршрута...')

      const warmupDone = waitForReady()
        .then(() => { return window.GoidacraftWarmup?.run?.() })
        .catch(() => {})

      await Promise.all([
        new Promise(r => setTimeout(r, 1000)),
        warmupDone,
      ])

      setLoaderProgress(100)
      setLoaderText('Маршрут готов')
      await new Promise(r => setTimeout(r, 350))
      hideLoader()
    }

    bootstrap().catch(() => hideLoader())

    // Pointer tilt effect on loader
    const updateTilt = (e) => {
      const b = loader.getBoundingClientRect()
      const ox = e.clientX - b.left - b.width / 2
      const oy = e.clientY - b.top - b.height / 2
      loader.style.setProperty('--mx', `${ox}px`)
      loader.style.setProperty('--my', `${oy}px`)
      loader.style.setProperty('--lx', `${ox * 0.08}px`)
      loader.style.setProperty('--ly', `${oy * 0.08}px`)
    }
    const resetTilt = () => {
      loader.style.setProperty('--mx', '0px')
      loader.style.setProperty('--my', '0px')
      loader.style.setProperty('--lx', '0px')
      loader.style.setProperty('--ly', '0px')
    }
    loader.addEventListener('pointermove', updateTilt)
    loader.addEventListener('pointerleave', resetTilt)

    return () => {
      loader.removeEventListener('pointermove', updateTilt)
      loader.removeEventListener('pointerleave', resetTilt)
    }
  }, [])

  return (
    <>
      <Script src="/assets/decor.js" strategy="afterInteractive" />

      <div id="loader" ref={loaderRef}>
        <div className="loader-train-wrap">
          <div className="loader-track" aria-hidden="true" />
          <img className="loader-train" src="/assets/img/train.png" alt="Загрузка сервера Гойдакрафт" loading="lazy" decoding="async" />
          <div className="steam-stack" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
        <div className="loader-text">Подготовка маршрута…</div>
        <div className="loader-progress" />
      </div>

      <nav className="topnav">
        <div className="topnav-inner">
          <Link href="/" className="topnav-brand">
            <img
              className="topnav-logo"
              src="/assets/img/goidalogo.png"
              alt="Логотип Гойдакрафт"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            ГОЙДАКРАФТ
          </Link>
          <div className="topnav-links">
            <Link href="/" className={`topnav-link${path === '/' ? ' active' : ''}`}>Главная</Link>
            <Link href="/mods" className={`topnav-link${path === '/mods' ? ' active' : ''}`}>Моды</Link>
            <Link href="/connect" className={`topnav-link${path === '/connect' ? ' active' : ''}`}>Подключение</Link>
            <Link href="/donors" className={`topnav-link${path === '/donors' ? ' active' : ''}`}>Доноры</Link>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </>
  )
}
