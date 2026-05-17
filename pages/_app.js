import React from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { useRouter } from 'next/router'
import '../assets/styles.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const path = router.pathname

  return (
    <>
      <Script src="/assets/decor.js" strategy="afterInteractive" />
      <Script src="/assets/prefetch.js" strategy="afterInteractive" />

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

      <footer className="footer">
        <div className="footer-orn">
          <span className="rivet" />
          <span>ГОЙДАКРАФТ</span>
          <span className="rivet" />
        </div>
        © 2026 GOIDACRAFT. Все права защищены.
      </footer>
    </>
  )
}
