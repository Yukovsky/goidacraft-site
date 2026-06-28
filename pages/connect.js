import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CACHE_MS = 300000
const BOOSTY_URL = 'https://boosty.to/goidacraft'

const IPS = [
  { ip: 'ru.goidacraft.online', region: 'СНГ', note: 'Для игроков из России и СНГ, или если европейский сервер не пускает.' },
  { ip: 'eu.goidacraft.online', region: 'ЕС', note: 'Для игроков из стран ЕС, или если не получается зайти на российский.' },
]

const TARIFFS = [
  {
    id: 'standard',
    tag: 'Стандартный',
    price: '167',
    lead: 'Закрытое тестирование — играете как обычно.',
    points: [
      'Доступ к закрытому тестированию сервера.',
      'Акция «Приведи друга» на этот тариф не распространяется.',
      'Для приобретения необходимо получить доступ к соответствующему бандлу на бусти',
    ],
  },
  {
    id: 'duo',
    tag: '1 + 1',
    price: '234',
    top: true,
    badge: 'Рекомендуем',
    lead: 'Доступ себе и другу.',
    points: [
      'Доступ для двух человек сразу.',
      'Равная ответственность: бан или вина одного — последствия для второго.',
      'Правило «позвать кого-то ещё» на вас не распространяется.',
      'Для приобретения необходимо оформить соответствующую подписку на бусти (подписку можно отменить или же продолжить поддерживаться проект)',
    ],
  },
  {
    id: 'extended',
    tag: 'Расширенный',
    price: '567',
    lead: 'Доступ с привилегиями и местом в истории сервера.',
    points: [
      'Право в будущем привести одного друга (с равной ответственностью).',
      'Ваши тикеты рассматриваются вне очереди.',
      'Имя на доске почёта и в ролике на YouTube.',
      'Именной значок рядом с ником в игре.',
      'Привелегии могут дополняться.',
      'Для приобретения необходимо оформить соответствующую подписку на бусти (подписку можно отменить или же продолжить поддерживаться проект)',
    ],
  },
]

let _cache = null
let _cacheTime = 0

async function fetchHost(host) {
  try {
    const r = await fetch(`https://api.mcsrvstat.us/2/${host}`)
    if (!r.ok) throw new Error()
    return await r.json()
  } catch (_) { return null }
}

async function fetchStatus() {
  const now = Date.now()
  if (_cache && now - _cacheTime < CACHE_MS) return _cache
  const results = await Promise.all(IPS.map(({ ip }) => fetchHost(ip)))
  _cache = results
  _cacheTime = Date.now()
  return results
}

export default function ConnectPage() {
  const [status, setStatus] = useState('loading')
  const [players, setPlayers] = useState('—')
  const [copiedIp, setCopiedIp] = useState(null)

  useEffect(() => {
    async function update() {
      const results = await fetchStatus()
      const reachable = results.filter(Boolean)
      if (reachable.length === 0) { setStatus('offline'); setPlayers('Данные не загрузились'); return }
      const anyOnline = reachable.some(d => d.online)
      const online = reachable.reduce((s, d) => s + (d.online ? (d.players?.online ?? 0) : 0), 0)
      const max = reachable.reduce((s, d) => s + (d.online ? (d.players?.max ?? 0) : 0), 0)
      setStatus(anyOnline ? 'online' : 'offline')
      setPlayers(anyOnline ? `${online}/${max} онлайн` : 'Сервер офлайн')
    }
    update()
    const t = setInterval(update, CACHE_MS)
    return () => clearInterval(t)
  }, [])

  function handleCopy(ip) {
    navigator.clipboard.writeText(ip).catch(() => {})
    setCopiedIp(ip)
    setTimeout(() => setCopiedIp(prev => (prev === ip ? null : prev)), 2000)
  }

  const statusText = status === 'loading' ? 'Проверка статуса...' : status === 'online' ? 'Онлайн' : 'Офлайн'

  return (
    <>
      <Head>
        <title>Подключение к серверу Гойдакрафт — IP и доступ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Как попасть на сервер Гойдакрафт: закрытое бета-тестирование, доступ по донату на Boosty. Два IP — ru.goidacraft.online (СНГ) и eu.goidacraft.online (ЕС). Minecraft 1.21.1, NeoForge 21.1.233." />
        <meta name="keywords" content="как зайти на гойдакрафт, goidacraft ip, ru.goidacraft.online, eu.goidacraft.online, доступ гойдакрафт, гойдакрафт бусти, boosty goidacraft, закрытое тестирование, подключение к серверу, minecraft сервер ip, neoforge 1.21.1 сервер" />
        <link rel="canonical" href="https://goidacraft.online/connect/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goidacraft.online/connect/" />
        <meta property="og:title" content="Как попасть на сервер Гойдакрафт — IP и доступ" />
        <meta property="og:description" content="Закрытое бета-тестирование, доступ по донату на Boosty. Два IP: ru.goidacraft.online (СНГ) и eu.goidacraft.online (ЕС). Minecraft 1.21.1 NeoForge 21.1.233." />
        <meta property="og:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="Как попасть на сервер Гойдакрафт — IP и доступ" />
        <meta name="twitter:description" content="Закрытое бета-тестирование, доступ по донату на Boosty. Два IP: ru. и eu.goidacraft.online. Minecraft 1.21.1 NeoForge 21.1.233." />
        <meta name="twitter:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Подключение к серверу Гойдакрафт",
          "url": "https://goidacraft.online/connect/",
          "description": "Как попасть на сервер Гойдакрафт: закрытое бета-тестирование, доступ по донату на Boosty. IP: ru.goidacraft.online (СНГ) и eu.goidacraft.online (ЕС). Minecraft 1.21.1 NeoForge 21.1.233.",
          "isPartOf": { "@type": "WebSite", "name": "Гойдакрафт", "url": "https://goidacraft.online" }
        }) }} />
      </Head>

      <section className="page-head">
        <div className="deco-gear gear-host gear-spin" data-teeth="14" data-r="80" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ left: '5%', top: '30%' }} />
        <div className="deco-gear gear-host gear-spin ccw" data-teeth="10" data-r="50" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ right: '8%', top: '25%' }} />
        <h1>Подключение</h1>
        <p>Получите доступ — и в поезд на Гойдакрафт</p>
      </section>

      <section className="server-section">
        <div className={`server-card status-${status}`}>
          <span className="rivet" /><span className="rivet" />
          <span className="rivet" /><span className="rivet" />

          <div className="server-card-head">
            <div className="lbl">
              <span id="server-status" data-status={status}>{statusText}</span>
            </div>
            <div className="server-card-head-right">
              <div className="players-kpi">
                <span className="players-kpi-value">{players}</span>
              </div>
              <span className="beta-badge">Закрытый бета-тест</span>
            </div>
          </div>

          <div className="ip-grid">
            {IPS.map(({ ip, region, note }) => (
              <div className="ip-row" key={ip}>
                <span className="ip-region">{region}</span>
                <div className="ip-string">{ip}</div>
                <button
                  className={`copy-btn${copiedIp === ip ? ' copied' : ''}`}
                  onClick={() => handleCopy(ip)}
                >
                  <span className="gear-host gear-spin" data-teeth="10" data-r="9" data-color="#3a2810" data-highlight="#5a3a18" />
                  <span className="btn-text">{copiedIp === ip ? 'Скопировано' : 'Скопировать адрес'}</span>
                </button>
                <p className="ip-row-note">{note}</p>
              </div>
            ))}
          </div>

          <dl className="server-meta">
            <div><dt>Статус</dt><dd>ЗБТ</dd></div>
            <div><dt>Платформа</dt><dd>NeoForge 21.1.233</dd></div>
            <div><dt>Версия игры</dt><dd>Minecraft 1.21.1</dd></div>
            <div><dt>Доступ</dt><dd>Boosty / по приглашению</dd></div>
          </dl>
        </div>
      </section>

      <section className="community-section">
        <div className="community-inner">
          <div className="community-head">
            <h2>Сообщество</h2>
            <div className="sub">Связь · Чаты · Анонсы</div>
          </div>
          <div className="community-links">
            <a className="community-link" href="https://t.me/+W-nS71bNZqA4OThi" target="_blank" rel="noopener noreferrer">
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.6 7.55c-.12.54-.44.67-.89.42l-2.46-1.81-1.18 1.14c-.13.13-.24.24-.49.24l.18-2.5 4.55-4.11c.2-.18-.04-.28-.31-.1l-5.62 3.54-2.42-.76c-.53-.16-.54-.53.11-.78l9.46-3.65c.44-.16.83.1.69.82z"/>
                </svg>
              </div>
              <div className="meta"><strong>Telegram-чат</strong><span>Голосовая связь и обсуждения</span></div>
              <div className="arrow">→</div>
            </a>

            <a className="community-link" href="https://t.me/goidacraft" target="_blank" rel="noopener noreferrer">
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4L2 11l6 3 9-6-7 8 9 6 3-18z"/>
                </svg>
              </div>
              <div className="meta"><strong>Telegram-канал</strong><span>Анонсы, новости, обновления</span></div>
              <div className="arrow">→</div>
            </a>

            <a className="community-link" href="https://discord.gg/prJwFwy5ns" target="_blank" rel="noopener noreferrer">
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.27 5.33A18.5 18.5 0 0014.7 4l-.21.46c1.49.36 2.74.97 3.94 1.83-2.07-1-4.13-1.43-6.43-1.43s-4.36.43-6.43 1.43c1.2-.86 2.45-1.47 3.94-1.83L9.3 4a18.5 18.5 0 00-4.57 1.33C2.43 8.93 1.8 12.42 2.13 15.86A18.7 18.7 0 007.84 18.7l.46-.62a12 12 0 01-1.92-.95l.4-.31c3.7 1.74 7.7 1.74 11.36 0l.4.31c-.6.36-1.24.68-1.92.95l.46.62a18.7 18.7 0 005.71-2.84c.4-3.96-.46-7.42-3.52-10.53zM8.52 13.91c-.93 0-1.7-.86-1.7-1.91s.75-1.91 1.7-1.91c.94 0 1.71.86 1.7 1.91 0 1.05-.76 1.91-1.7 1.91zm6.97 0c-.93 0-1.7-.86-1.7-1.91s.75-1.91 1.7-1.91c.94 0 1.71.86 1.7 1.91 0 1.05-.76 1.91-1.7 1.91z"/>
                </svg>
              </div>
              <div className="meta"><strong>Discord</strong><span>Основное сообщество и поддержка</span></div>
              <div className="arrow">→</div>
            </a>
          </div>
        </div>
      </section>

      <section className="access-section" id="access">
        <div className="access-inner">
          <h2>Доступ к закрытому тесту</h2>
          <p className="access-lead">
            Гойдакрафт на стадии <strong>закрытого бета-тестирования</strong>.
            Чтобы попасть на приватный сервер, оформите один из вариантов доступа на Boosty.
          </p>

          <div className="tariff-grid">
            {TARIFFS.map(t => (
              <article className={`tariff-card${t.top ? ' top' : ''}`} key={t.id}>
                <span className="rivet tr-rivet rv1" /><span className="rivet tr-rivet rv2" />
                <span className="rivet tr-rivet rv3" /><span className="rivet tr-rivet rv4" />
                {t.badge && <div className="tariff-badge">{t.badge}</div>}
                <div className="tariff-tag">{t.tag}</div>
                <div className="tariff-price"><span className="num">{t.price}</span><span className="cur">₽</span></div>
                <p className="tariff-lead">{t.lead}</p>
                <ul className="tariff-points">
                  {t.points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="access-cta">
            <a href={BOOSTY_URL} target="_blank" rel="noopener noreferrer" className="dl-btn-mods">
              <span className="gear-host gear-spin" data-teeth="10" data-r="11" data-color="#3a1c08" data-highlight="#7a4818" />
              Оплатить доступ на Boosty
            </a>
          </div>

          <div className="whitelist-box">
            <span className="corner tl" /><span className="corner tr" />
            <span className="corner bl" /><span className="corner br" />
            <h3>Акция «Приведи друга»</h3>
            <p>
              Для проверенных игроков акция «Приведи друга» по-прежнему действует. Администрация вправе
              отказать, если у человека испорчена репутация — временные баны, замечания, громкие скандалы
              или жалобы от других поселений.
            </p>
          </div>

          <p className="access-note">Те, кто оформил доступ ранее — для вас ничего не изменилось. Играйте как обычно.</p>
        </div>
      </section>

      <section className="steps-section">
        <div className="steps-inner">
          <h2>Как зайти на сервер</h2>
          <p>Краткая инструкция от доступа до первого ужина в таверне</p>
          <div className="steps steps-rows">
            <div className="step">
              <div className="num">01</div>
              <h3>Получите доступ</h3>
              <p>Оформите тариф на <a href={BOOSTY_URL} target="_blank" rel="noopener noreferrer">Boosty</a> или получите доступ по приглашению.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>Установите NeoForge</h3>
              <p>Нужна версия Minecraft <code>1.21.1</code>. Лоадер — NeoForge билд <code>21.1.233</code>.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Поставьте моды</h3>
              <p>Сборку можно установить вручную через <code>.zip</code> или автоматически через <code>.mrpack</code>.</p>
            </div>
            <div className="step">
              <div className="num">04</div>
              <h3>Запустите Minecraft</h3>
              <p>Выберите профиль NeoForge 1.21.1 в лаунчере. Первый запуск медленный — это нормально.</p>
            </div>
            <div className="step">
              <div className="num">05</div>
              <h3>Подключитесь к серверу</h3>
              <p>В «Сетевой игре» добавьте <code>ru.goidacraft.online</code> (СНГ) или <code>eu.goidacraft.online</code> (ЕС). Приятной игры!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="download-section">
        <h2>Сборка модов</h2>
        <Link href="/mods#build-variants" className="dl-btn">
          <span className="gear-host gear-spin" data-teeth="10" data-r="11" data-color="#3a2810" data-highlight="#5a3a18" />
          Скачать моды
        </Link>
      </section>
    </>
  )
}
