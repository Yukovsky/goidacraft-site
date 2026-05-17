import React, { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HomePage() {
  useEffect(() => {
    const btn = document.getElementById('hero-copy')
    if (!btn) return
    const handleClick = () => {
      navigator.clipboard.writeText(btn.dataset.ip).catch(() => {})
      const old = btn.textContent
      btn.textContent = 'IP скопирован'
      setTimeout(() => { btn.textContent = old }, 1800)
    }
    btn.addEventListener('click', handleClick)
    return () => btn.removeEventListener('click', handleClick)
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
