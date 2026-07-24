import React, { useEffect, useState } from 'react'
import Head from 'next/head'

// Цена месяца подписки "Мастер Гойды" на Boosty — правь только здесь
const BOOSTY_MONTH_PRICE = 567

const DONORS_RAW = [
  { nickname: 'byteswing',        amount: 2000   },
  { nickname: 'ice3322',          amount: 1700   },
  { nickname: 'PLYukari_Akiyama', amount: 3200   },
  { nickname: 'dzetsu',           amount: 567.8  },
  { nickname: 'puredistortion',   amount: 400    },
  { nickname: 'THE_MO0NS',        amount: 397    },
  { nickname: 'MrFUSY',           amount: 300    },
  { nickname: 'teramoccer',       amount: 250    },
  { nickname: 'YANASRALL228',     amount: 175.4  },
  { nickname: 'Sir_Trigletus',    amount: 106    },
  { nickname: 'gergobro',         amount: 215    },
  { nickname: 'drzvn',            amount: 1250   },
  { nickname: 'igotnoonexdd',     amount: 240    },
  { nickname: 'Dreemurrka',       amount: 49     },
  { nickname: 'Reanoxall',        amount: 500    },
  { nickname: 'Archk353',         amount: 100    },
  { nickname: 'feekse',           amount: 200    },
  { nickname: 'Gr1imm',           amount: 136.3  },
  { nickname: 'kRe3k0_Solos',     amount: 629    },
]

// Подписчики Boosty-тарифа "Мастер Гойды" (567 ₽/мес) — длительность в месяцах
const MASTERS_RAW = [
  { nickname: 'TonaPoTa69', months: 1 },
  { nickname: 'Sir_CarBone_Jr', months: 1 },
  { nickname: 'Dagestania91', months: 1 },
  
  
]

const DONORS = [...DONORS_RAW]
  .filter(d => d.nickname && d.amount > 0)
  .sort((a, b) => b.amount - a.amount)

const MASTERS = [...MASTERS_RAW]
  .filter(m => m.nickname && m.months > 0)
  .map(m => ({ ...m, amount: m.months * BOOSTY_MONTH_PRICE }))
  .sort((a, b) => b.months - a.months)

const TOP_DONORS = [
  ...DONORS.map(d => ({ nickname: d.nickname, amount: d.amount, kind: 'donor' })),
  ...MASTERS.map(m => ({ nickname: m.nickname, amount: m.amount, kind: 'master' })),
]
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 5)

const LONGEST_TOP_NICKNAME_LEN = Math.max(...TOP_DONORS.map(d => d.nickname.length))
const FALLBACK_LEADER_WIDTH = `calc(${LONGEST_TOP_NICKNAME_LEN}ch + 56px)`
const LEADER_CARD_PADDING = 56 // 2 * 16px карточки + запас

const ALL_NICKNAMES = [...new Set([...TOP_DONORS, ...MASTERS, ...DONORS].map(d => d.nickname))]

function measureLeaderWidth() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let maxTextWidth = 0
  TOP_DONORS.forEach((d, i) => {
    // ранг 1 отображается крупнее и жирнее — учитываем это при замере
    ctx.font = i === 0 ? "700 23px Steamwreck, Montserrat, serif" : "700 20px Steamwreck, Montserrat, serif"
    const w = ctx.measureText(d.nickname).width
    if (w > maxTextWidth) maxTextWidth = w
  })
  return Math.ceil(maxTextWidth) + LEADER_CARD_PADDING
}

// Ширина ника при font-size 1px (текст + letter-spacing 0.02em из .plaque .name).
// CSS ужимает шрифт до min(базовый, 100cqi / --name-r) — ник всегда в одну строку и всегда внутри карточки.
function measureNameRatios() {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.font = '700 100px Steamwreck, Montserrat, serif'
  const out = {}
  ALL_NICKNAMES.forEach(n => {
    out[n] = +(ctx.measureText(n).width / 100 + 0.02 * n.length).toFixed(4)
  })
  return out
}

function pluralMonths(n) {
  const n10 = n % 10, n100 = n % 100
  if (n100 >= 11 && n100 <= 14) return 'месяцев'
  if (n10 === 1) return 'месяц'
  if (n10 >= 2 && n10 <= 4) return 'месяца'
  return 'месяцев'
}

export default function DonorsPage() {
  const [leaderWidth, setLeaderWidth] = useState(FALLBACK_LEADER_WIDTH)
  const [nameRatios, setNameRatios] = useState({})

  useEffect(() => {
    let cancelled = false
    const apply = () => {
      if (cancelled) return
      setLeaderWidth(`${measureLeaderWidth()}px`)
      setNameRatios(measureNameRatios())
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply)
    } else {
      apply()
    }
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Head>
        <title>Доска почёта — Доноры сервера Гойдакрафт</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Игроки, поддержавшие сервер Гойдакрафт. Задонать любую сумму — твоё имя появится на доске и поможет серверу с Create: Aeronautics работать дальше." />
        <meta name="keywords" content="гойдакрафт донат, goidacraft поддержка, доноры сервера гойдакрафт, поддержать minecraft сервер" />
        <link rel="canonical" href="https://goidacraft.online/donors/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goidacraft.online/donors/" />
        <meta property="og:title" content="Доска почёта — Спонсоры сервера Гойдакрафт" />
        <meta property="og:description" content="Игроки, поддержавшие сервер Гойдакрафт. Поддержи развитие Minecraft сервера с Create: Aeronautics!" />
        <meta property="og:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="Доска почёта — Спонсоры сервера Гойдакрафт" />
        <meta name="twitter:description" content="Игроки, поддержавшие сервер Гойдакрафт. Поддержи развитие Minecraft сервера с Create: Aeronautics!" />
        <meta name="twitter:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Доска почёта сервера Гойдакрафт",
          "url": "https://goidacraft.online/donors/",
          "description": "Список игроков, поддержавших сервер Гойдакрафт финансово.",
          "isPartOf": { "@type": "WebSite", "name": "Гойдакрафт", "url": "https://goidacraft.online" }
        }) }} />
      </Head>

      <section className="page-head">
        <div className="deco-gear gear-host gear-spin" data-teeth="14" data-r="80" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ left: '5%', top: '30%' }} />
        <div className="deco-gear gear-host gear-spin ccw" data-teeth="10" data-r="50" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ right: '8%', top: '25%' }} />
        <h1>Доска почёта</h1>
        <p>Те, благодаря кому работают серверные двигатели</p>
      </section>

      <section className="wall top-leaders">
        <div className="wall-inner">
          <div className="wall-title">
            <div className="ribbon">— Топ поддержавших —</div>
            <p>Пятёрка тех, кто вложил в паровые машины сервера больше всех — донатом или подпиской «Мастер Гойды».</p>
          </div>

          {/* один flex-wrap ряд: 5 карточек равной ширины ложатся как 3+2, 2+2+1 или по одной — по факту нехватки места */}
          <div className="leaderboard" style={{ '--leader-w': leaderWidth }}>
            {TOP_DONORS.map((d, i) => {
              const rank = i + 1
              return (
                <div
                  key={d.nickname}
                  className={`plaque leader-plaque rank-${rank}`}
                  style={{ '--rot': `${((rank - 1) % 5 - 2) * 0.6}deg` }}
                >
                  <div className="ord">№ {String(rank).padStart(2, '0')}</div>
                  {rank === 1 && <div className="crown">★</div>}
                  <div className="name" style={{ '--name-r': nameRatios[d.nickname] }}>{d.nickname}</div>
                  <div className="role">{d.kind === 'master' ? 'Мастер Гойды' : 'Донатер'}</div>
                  <span className="pr-tl" /><span className="pr-tr" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="wall masters-wall">
        <div className="wall-inner">
          <div className="wall-title">
            <div className="ribbon ribbon-gold">— Мастера Гойды —</div>
            <p>Те, кто оформил подписку «Мастер Гойды» на Boosty и держит паровой котёл сервера под давлением на постоянной основе.</p>
          </div>

          <div className="plaques">
            {MASTERS.length === 0 ? (
              <div className="plaque master-plaque" style={{ '--rot': '0deg' }}>
                <div className="name">Список пока пуст</div>
                <div className="role">Оформите подписку на Boosty, чтобы появиться здесь!</div>
                <span className="pr-tl" /><span className="pr-tr" />
              </div>
            ) : MASTERS.map((m, i) => (
              <div
                key={m.nickname}
                className="plaque master-plaque"
                style={{ '--rot': `${((i % 5) - 2) * 0.6}deg` }}
              >
                <div className="ord">№ {String(i + 1).padStart(2, '0')}</div>
                <div className="gear-badge">⚙</div>
                <div className="name" style={{ '--name-r': nameRatios[m.nickname] }}>{m.nickname}</div>
                <div className="role">{m.months} {pluralMonths(m.months)} поддержки</div>
                <span className="pr-tl" /><span className="pr-tr" />
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="wall donors-wall">
        <div className="wall-inner">
          <div className="wall-title">
            <div className="ribbon ribbon-silver">— Донатеры —</div>
            <p>Ваш вклад идёт на оплату хостинга, домена и развитие сервера. Каждое имя на этой стене — это часовой работы парового двигателя.</p>
          </div>

          <div className="plaques">
            {DONORS.length === 0 ? (
              <div className="plaque" style={{ '--rot': '0deg' }}>
                <div className="name">Список пока пуст</div>
                <div className="role">Свяжитесь с администрацией, чтобы появиться здесь!</div>
                <span className="pr-tl" /><span className="pr-tr" />
              </div>
            ) : DONORS.map((d, i) => (
              <div
                key={d.nickname}
                className={`plaque${d.amount >= 1000 ? ' top-tier' : ''}`}
                style={{ '--rot': `${((i % 5) - 2) * 0.6}deg` }}
              >
                <div className="ord">№ {String(i + 1).padStart(2, '0')}</div>
                {d.amount >= 1000 && <div className="crown">★</div>}
                <div className="name" style={{ '--name-r': nameRatios[d.nickname] }}>{d.nickname}</div>
                <div className="role">поддержал проект</div>
                <span className="pr-tl" /><span className="pr-tr" />
              </div>
            ))}
          </div>

          <div className="thank-you">
            <h3>Каждый дирижабль в небе летит на вашем угле.</h3>
            <p>Гойдакрафт развивается силами сообщества. Огромная часть средств сообщества идут на обеспечение сервера. Огромное спасибо каждому, кто помогает проекту оставаться на плаву.</p>
          </div>

          <div className="donation-appeal">
            <h3>Как попасть на доску почёта</h3>
            <p>Оказаться на этих стенах можно двумя способами:</p>
            <ul className="appeal-ways">
              <li><strong>Подписка «Мастер Гойды»</strong> на Boosty — особое место для «Мастеров Гойды», а также имя в ролике на YouTube, тикеты вне очереди и именной значок рядом с ником в игре.</li>
              <li><strong>Любой безвозмездный донат</strong> на нашем Boosty — добровольное пожертвование на развитие сервера. Речь именно о безвозмездном донате, а не о покупке доступа к посту, базовой подписки или «1 + 1».</li>
            </ul>
            <p>Поддержать проект можно на <a href="https://boosty.to/goidacraft" target="_blank" rel="noopener noreferrer">Boosty</a>. Подробнее о тарифах доступа — на странице <a href="/connect#access">подключения</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
