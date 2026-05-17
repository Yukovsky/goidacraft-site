import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const API_URL = 'https://api.mcsrvstat.us/2/goidacraft.aboba.host'
let _cache = null
let _cacheTime = 0
const CACHE_MS = 300000

async function fetchStatus() {
  const now = Date.now()
  if (_cache && now - _cacheTime < CACHE_MS) return _cache
  try {
    const r = await fetch(API_URL)
    if (!r.ok) throw new Error()
    _cache = await r.json()
    _cacheTime = Date.now()
    return _cache
  } catch (_) { return null }
}

export default function ConnectPage() {
  const [status, setStatus] = useState('loading')
  const [players, setPlayers] = useState('—')
  const [license, setLicense] = useState('—')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function update() {
      const data = await fetchStatus()
      if (!data) { setStatus('offline'); setPlayers('Данные не загрузились'); return }
      setStatus(data.online ? 'online' : 'offline')
      setPlayers(data.online ? `${data.players?.online ?? 0}/${data.players?.max ?? '?'} онлайн` : 'Сервер офлайн')
      setLicense('С лицензией и Без')
    }
    update()
    const t = setInterval(update, CACHE_MS)
    return () => clearInterval(t)
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText('goidacraft.aboba.host').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusText = status === 'loading' ? 'Проверка статуса...' : status === 'online' ? 'Онлайн' : 'Офлайн'

  return (
    <>
      <Head>
        <title>Гойдакрафт — Подключение</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/img/goidalogo.png" />
        <link rel="preload" as="image" href="/assets/img/goidalogo.png" />
      </Head>

      <section className="page-head">
        <div className="deco-gear gear-host gear-spin" data-teeth="14" data-r="80" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ left: '5%', top: '30%' }} />
        <div className="deco-gear gear-host gear-spin ccw" data-teeth="10" data-r="50" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ right: '8%', top: '25%' }} />
        <h1>Подключение</h1>
        <p>Четыре шага и вы в поезде на Гойдакрафт</p>
      </section>

      <div className="connect-grid">
        <div className={`ip-card status-${status}`}>
          <span className="rivet" /><span className="rivet" />
          <span className="rivet" /><span className="rivet" />
          <div className="lbl">
            <span id="server-status" data-status={status}>{statusText}</span>
          </div>
          <div className="ip-string">goidacraft.aboba.host</div>
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
            <span className="gear-host gear-spin" data-teeth="10" data-r="9" data-color="#3a2810" data-highlight="#5a3a18" />
            <span className="btn-text">{copied ? '✓ Скопировано' : 'Скопировать адрес'}</span>
          </button>
          <dl className="meta">
            <dt>Платформа</dt><dd>NeoForge (билд 21.1.228)</dd>
            <dt>Версия игры</dt><dd>Minecraft 1.21.1</dd>
            <dt>Лицензия</dt><dd>{license}</dd>
            <dt>Игроки</dt><dd>{players}</dd>
          </dl>
        </div>

        <div className="communities">
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <h2>Сообщество</h2>
          <div className="sub">Связь · Чаты · Анонсы</div>

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

      <section className="steps-section">
        <div className="steps-inner">
          <h2>Как зайти на сервер</h2>
          <p>Краткая инструкция от установки до первого ужина в таверне</p>
          <div className="steps">
            <div className="step">
              <div className="num">01</div>
              <h3>Установите NeoForge</h3>
              <p>Для игры нужна версия Minecraft <code>1.21.1</code>. Лоадер — NeoForge билд <code>21.1.228</code>.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>Выберите способ установки модов</h3>
              <p>Можно поставить сборку вручную через <code>.zip</code> или автоматически через <code>.mrpack</code>.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Запустите Minecraft</h3>
              <p>Выберите профиль NeoForge 1.21.1 в лаунчере. Первый запуск медленный — это нормально.</p>
            </div>
            <div className="step">
              <div className="num">04</div>
              <h3>Подключитесь к серверу</h3>
              <p>В «Сетевой игре» добавьте <code>goidacraft.aboba.host</code>. Приятной игры!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="download-section">
        <h2>Сборка модов</h2>
        <Link href="/mods#build-variants" className="dl-btn">
          <span className="gear-host gear-spin" data-teeth="10" data-r="11" data-color="#3a1c08" data-highlight="#7a4818" />
          Скачать моды
        </Link>
      </section>
    </>
  )
}
