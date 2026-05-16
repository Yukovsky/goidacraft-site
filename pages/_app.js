import React from 'react'
import Script from 'next/script'
import Link from 'next/link'
import '../assets/styles.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="/assets/decor.js" strategy="afterInteractive" />

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
            <Link href="/" className="topnav-link">Главная</Link>
            <Link href="/mods" className="topnav-link">Моды</Link>
            <Link href="/connect" className="topnav-link">Подключение</Link>
            <Link href="/donors" className="topnav-link">Доноры</Link>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </>
  )
}
