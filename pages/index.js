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
        <title>Гойдакрафт — Minecraft сервер с Create: Aeronautics</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Приватный Minecraft сервер с Create: Aeronautics, Steam 'n' Rails и Farmer's Delight. Дирижабли, поезда, заводы. Версия 1.21.1 NeoForge. IP: goidacraft.online" />
        <meta name="keywords" content="гойдакрафт, goidacraft, майнкрафт сервер, minecraft server, create aeronautics сервер, аэронафтика сервер, aeronautics server, minecraft aeronautics server, aeronautics multiplayer, сервер с create, сервер криэйт, create mod server, neoforge server, minecraft 1.21.1 server, goidacraft online" />
        <link rel="canonical" href="https://goidacraft.online/" />
        <link rel="preload" as="image" href="/assets/img/goidalogo.png" />
        <link rel="preload" as="image" href="/assets/img/title.png" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goidacraft.online/" />
        <meta property="og:title" content="Гойдакрафт — Minecraft сервер с Create: Aeronautics" />
        <meta property="og:description" content="Приватный Minecraft role-play сервер с модами Create, Create: Aeronautics, Steam 'n' Rails и Farmer's Delight. Дирижабли, поезда, заводы на версии 1.21.1 NeoForge." />
        <meta property="og:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="Гойдакрафт — Minecraft сервер с Create: Aeronautics" />
        <meta name="twitter:description" content="Приватный Minecraft role-play сервер с модами Create, Create: Aeronautics, Steam 'n' Rails и Farmer's Delight. Дирижабли, поезда, заводы." />
        <meta name="twitter:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* JSON-LD структурированные данные */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Гойдакрафт",
          "alternateName": ["GoidaCraft", "Goidacraft", "goidacraft.online"],
          "url": "https://goidacraft.online",
          "description": "Приватный Minecraft role-play сервер с модами Create, Create: Aeronautics, Steam 'n' Rails и Farmer's Delight на версии 1.21.1 NeoForge.",
          "inLanguage": "ru",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://goidacraft.online/mods?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Гойдакрафт",
          "alternateName": ["GoidaCraft", "goidacraft.online"],
          "url": "https://goidacraft.online",
          "logo": "https://goidacraft.online/assets/img/goidalogo.png",
          "description": "Приватный Minecraft role-play сервер с модами Create, Create: Aeronautics и Farmer's Delight.",
          "sameAs": ["https://t.me/goidacraft"],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "url": "https://t.me/goidacraft"
          }
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": "Гойдакрафт — Minecraft сервер",
          "url": "https://goidacraft.online",
          "description": "Приватный Minecraft role-play сервер с модами Create, Create: Aeronautics, Steam 'n' Rails, Farmer's Delight. Версия Minecraft 1.21.1, загрузчик NeoForge 21.1.228. Дирижабли, поезда, заводы.",
          "gamePlatform": ["PC", "Windows", "macOS", "Linux"],
          "applicationCategory": "Game",
          "operatingSystem": "Windows, macOS, Linux",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB" },
          "publisher": { "@type": "Organization", "name": "Гойдакрафт", "url": "https://goidacraft.online" },
          "inLanguage": "ru",
          "keywords": "minecraft, create aeronautics, goidacraft, майнкрафт сервер, create mod, аэронафтика",
          "sameAs": ["https://t.me/goidacraft"]
        }) }} />
      </Head>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="sr-only">Гойдакрафт Майнкрафт сервер Create Aeronautics Криэйт Аэронафтика Minecraft mine Goidacraft </h1>
            <img
              className="hero-title-mark"
              src="/assets/img/title.png"
              alt="Гойдакрафт — Minecraft сервер"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              aria-hidden="true"
            />
            <div className="hero-actions">
              <Link href="/connect" className="hero-btn">Как подключиться</Link>
              <button className="hero-btn alt" id="hero-copy" data-ip="goidacraft.online">
                IP: goidacraft.online
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
            <p><strong>Гойдакрафт</strong> — это <strong>Minecraft сервер</strong> на версии <strong>1.21.1 NeoForge</strong> с акцентом на механизмы, воздухоплавание и совместное творчество. Подключение доступно с лицензией и без — IP: <strong>goidacraft.online</strong>.</p>
          </div>

          <div className="about-mods">
            <div className="about-eyebrow">Чем живёт сервер</div>
            <ul className="about-mods-list">
              <li>
                <strong>Create &amp; Create: Aeronautics</strong> — фундамент сборки. Шестерни, конвейеры, паровые механизмы и — главное — <em>летающие дирижабли</em>. Именно <strong>Aeronautics</strong> делает этот сервер уникальным среди <em>minecraft aeronautics server</em> проектов.
              </li>
              <li>
                <strong>Steam &apos;n&apos; Rails</strong> — развитая железнодорожная сеть: пути, локомотивы, сигналы и станции на базе механики <em>Create</em>.
              </li>
              <li>
                <strong>Farmer&apos;s Delight</strong> — полноценный кулинарный цикл: поля, кухня, блюда. Дополнен Ocean&apos;s Delight, Miner&apos;s Delight и другими модулями.
              </li>
              <li>
                <strong>Let&apos;s Do</strong> — жизненный контент: пекарня, пивоварня, виноделие, мебель, рыбалка, кемпинг и многое другое.
              </li>
              <li>
                <strong>Terralith + Rechiseled + Joy of Painting</strong> — живой мир с уникальным рельефом, огромным строительным потенциалом и художественными инструментами.
              </li>
            </ul>
            <p>Полный список — на <Link href="/mods">странице модов</Link>. Там же скачать сборку <em>GOIDAbase</em> или <em>GOIDAslon</em>.</p>
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
          <Link className="ql-card" href="/newspaper">
            <div className="ql-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <span className="cog cog-small cog-spin ccw" style={{ width: '28px', height: '28px' }} />
              <span className="cog cog-small cog-spin" style={{ width: '28px', height: '28px', marginLeft: '-5px' }} />
            </div>
            <h3>Газета</h3>
            <p>Хроники и события на борту</p>
          </Link>
        </div>
      </section>
    </>
  )
}
