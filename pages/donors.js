import React from 'react'
import Head from 'next/head'

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
]

const DONORS = [...DONORS_RAW]
  .filter(d => d.nickname && d.amount > 0)
  .sort((a, b) => b.amount - a.amount)

export default function DonorsPage() {
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

      <section className="wall">
        <svg className="wall-lamp" width="120" height="100" viewBox="0 0 120 100">
          <line x1="60" y1="0" x2="60" y2="20" stroke="#3a2810" strokeWidth="2"/>
          <ellipse cx="60" cy="22" rx="14" ry="4" fill="#8a6a1f" stroke="#3a2810" strokeWidth="1.5"/>
          <path d="M 35 28 L 85 28 L 78 70 L 42 70 Z" fill="url(#lampShade)" stroke="#3a2810" strokeWidth="2"/>
          <ellipse cx="60" cy="78" rx="20" ry="4" fill="#c89b3c" stroke="#3a2810" strokeWidth="1.5"/>
          <defs>
            <linearGradient id="lampShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c89b3c"/>
              <stop offset="100%" stopColor="#8a6a1f"/>
            </linearGradient>
          </defs>
        </svg>

        <div className="wall-inner">
          <div className="wall-title">
            <div className="ribbon">— Спасибо за поддержку —</div>
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
                <div className="name">{d.nickname}</div>
                <div className="role">поддержал проект</div>
                <span className="pr-tl" /><span className="pr-tr" />
              </div>
            ))}
          </div>

          <div className="thank-you">
            <h3>Каждый дирижабль в небе летит на вашем угле.</h3>
            <p>Гойдакрафт — это не коммерческий проект. Все средства идут только на хостинг и поддержку. Огромное спасибо каждому, кто помог проекту остаться на плаву.</p>
          </div>

          <div className="donation-appeal">
            <h3>Помогите нам развиваться</h3>
            <p>Вы можете поддержать проект, задонатив любую сумму — каждый рубль помогает нам совершенствовать сервер. Мы будем вам очень благодарны и ваше имя появится среди почётных людей выше!</p>
            <p>По вопросам пожертвований напишите в Telegram: <a href="https://t.me/Roman_Yukovsky" target="_blank" rel="noopener noreferrer">сюда</a></p>
          </div>
        </div>
      </section>
    </>
  )
}
