import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const MODULES = ['AuthBridge','WorldChunker','RailNet','CreateBus','VoiceRelay','KubeRunner','EconomyPipe','BackupNode']
const LEVELS  = ['info','sys','warn','info','info','sys','info','warn']

function makeMockRows(seed) {
  const rows = []
  for (let i = 1; i <= 100; i++) {
    const mod = MODULES[i % MODULES.length]
    const level = LEVELS[i % LEVELS.length]
    const base = String(i).padStart(3, '0')
    const pool = [
      `boot/${base}: модуль ${mod} инициализирован`,
      `tick/${base}: heartbeat ok, ms=${15 + (i % 14)}`,
      `jobs/${base}: очередь задач = ${2 + (i % 7)}`,
      `sync/${base}: обновление профиля ${seed}_${(i % 9) + 1}`,
      `disk/${base}: snapshot segment ${Math.ceil(i / 5)} ready`,
      `net/${base}: handshake с node-${(i % 6) + 1} подтверждён`,
      `chat/${base}: фильтр проверил сообщение (${(i % 4) + 1}/4)`,
      `cache/${base}: ttl для чанка ${(i % 28) + 1}m`,
    ]
    rows.push({ text: pool[i % pool.length], level })
  }
  return rows
}

function nowStamp() {
  return new Date().toLocaleTimeString('ru-RU', { hour12: false })
}

export default function ConsolePage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [metrics, setMetrics] = useState({ online: 17, tps: 19.9, ram: 13.1 })
  const outputRef = useRef(null)
  const mockRowsRef = useRef([])
  const streamIndexRef = useRef(0)
  const logRef = useRef([])

  function push(text, type = 'info') {
    const stamp = nowStamp()
    logRef.current.push(`[${stamp}] ${text}`)
    setLines(prev => [...prev, { text, type, stamp }])
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    const access = typeof window !== 'undefined' && sessionStorage.getItem('goida_console_access') === '1'
    if (access) {
      sessionStorage.removeItem('goida_console_access')
      setHasAccess(true)
      const params = new URLSearchParams(window.location.search)
      const ctx = (params.get('target') || 'guest').trim()
      mockRowsRef.current = makeMockRows(ctx)
      push('admin-gateway: доступ подтверждён', 'ok')
      push(`контекст сессии: ${ctx}`, 'sys')
    }
  }, [])

  useEffect(() => {
    if (!hasAccess) return
    let timer
    function stream() {
      if (streamIndexRef.current >= mockRowsRef.current.length) return
      const row = mockRowsRef.current[streamIndexRef.current]
      push(row.text, row.level)
      streamIndexRef.current++
      timer = setTimeout(stream, 500 + Math.floor(Math.random() * 3500))
    }
    timer = setTimeout(stream, 500 + Math.floor(Math.random() * 3500))
    const metricsInterval = setInterval(() => {
      setMetrics(prev => {
        const online = Math.min(24, Math.max(12, prev.online + (Math.random() < 0.55 ? 0 : Math.random() < 0.5 ? -1 : 1)))
        const tps = Math.min(20, Math.max(19.6, prev.tps + (Math.random() - 0.5) * 0.08))
        const ram = Math.min(13.8, Math.max(12.6, prev.ram + (Math.random() - 0.5) * 0.16))
        push(`Метрики: online=${online}, tps=${tps.toFixed(2)}, ram=${ram.toFixed(1)}GB`, 'sys')
        return { online, tps, ram }
      })
    }, 7000)
    return () => { clearTimeout(timer); clearInterval(metricsInterval) }
  }, [hasAccess])

  function handleCommand(e) {
    e.preventDefault()
    const cmd = input.trim()
    setInput('')
    if (!cmd) return
    push('> ' + cmd, 'cmd')
    if (/^hack$/i.test(cmd)) {
      push('Консоль была взломана', 'error')
      let count = 0
      const msgs = ['critical: access token compromised','critical: kernel override detected','critical: security layer failed','critical: remote control intercepted','critical: unauthorized write access']
      const t = setInterval(() => {
        push(msgs[count % msgs.length] + ` #${String(count+1).padStart(3,'0')}`, 'error')
        count++
        if (count >= 100) { clearInterval(t); setTimeout(() => { window.location.href = '/' }, 180) }
      }, 15)
      return
    }
    const op = cmd.match(/^op\s+([\wа-яА-ЯёЁ.-]+)$/i)
    if (op) { push(`Игрок ${op[1]} назначен оператором`, 'ok'); return }
    const gm = cmd.match(/^gamemode\s+(creative|spectator|survival)\s+([\wа-яА-ЯёЁ.-]+)$/i)
    if (gm) { const labels = {creative:'Творческий',spectator:'Наблюдателя',survival:'Выживание'}; push(`Режим ${gm[2]} → ${labels[gm[1]]}`, 'ok'); return }
    const ban = cmd.match(/^ban\s+([\wа-яА-ЯёЁ.-]+)$/i)
    if (ban) { push(`Игрок ${ban[1]} заблокирован`, 'error'); return }
    const give = cmd.match(/^give\s+(\S+)\s+(\S+)$/i)
    if (give) { push(`Выдано ${give[1]} ${give[2]}`, 'ok'); return }
    push('Неверная команда', 'error')
  }

  function exportLogs() {
    const content = logRef.current.join('\n') || 'Лог пуст'
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `goidacraft-log-${Date.now()}.txt`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
    push('Журнал экспортирован', 'sys')
  }

  function clearLog() { setLines([]); logRef.current = []; push('Лог очищен', 'warn') }

  function restartMock() {
    push('Инициирован перезапуск...', 'warn')
    setTimeout(() => push('Сохранение мира... OK', 'info'), 220)
    setTimeout(() => push('Остановка сервисов... OK', 'info'), 520)
    setTimeout(() => push('Запуск ядра... OK', 'ok'), 860)
    setTimeout(() => push('Сервер снова в онлайне', 'ok'), 1180)
  }

  return (
    <>
      <Head>
        <title>Гойдакрафт — Консоль сервера</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/img/goidalogo.png" />
      </Head>

      {!hasAccess ? (
        <section className="page-head" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="panel access-denied">
            <h2>Доступ ограничен</h2>
            <p>Откройте консоль через страницу модов.</p>
            <button className="btn" onClick={() => window.location.href = '/mods'}>Вернуться к модам</button>
          </div>
        </section>
      ) : (
        <>
          <section className="page-head">
            <div className="deco-gear gear-host gear-spin" data-r="84" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ left: '5%', top: '24%' }} />
            <div className="deco-gear gear-host gear-spin ccw" data-r="48" data-color="#8a6a1f" data-highlight="#c89b3c" style={{ right: '9%', top: '28%' }} />
            <h1>ADMIN CONSOLE</h1>
          </section>

          <main className="admin-wrap">
            <div className="admin-grid">
              <aside className="panel side-panel">
                <div>
                  <p className="side-title">Состояние</p>
                  <div className="kpi"><div className="label">Игроков онлайн</div><div className="value">{metrics.online}</div></div>
                </div>
                <div className="kpi"><div className="label">TPS</div><div className="value">{metrics.tps.toFixed(2)}</div></div>
                <div className="kpi"><div className="label">RAM</div><div className="value">{metrics.ram.toFixed(1)} GB</div></div>
                <button className="btn" onClick={() => { push(`Метрики: online=${metrics.online}`, 'sys') }}>Обновить метрики</button>
                <button className="btn alt" onClick={restartMock}>Перезапустить</button>
                <button className="btn warn" onClick={clearLog}>Очистить лог</button>
              </aside>

              <section className="panel console-panel">
                <div className="console-head">
                  <div className="left">
                    <span className="dot-live" />
                    <span className="title">Серверная консоль</span>
                  </div>
                  <div className="head-actions">
                    <button type="button" onClick={exportLogs}>Экспорт журнала</button>
                  </div>
                </div>
                <div className="console-body" ref={outputRef} aria-live="polite">
                  {lines.map((l, i) => (
                    <div key={i} className={`line ${l.type}`}>
                      <span className="time">[{l.stamp}]</span>{l.text}
                    </div>
                  ))}
                </div>
                <form className="console-input-wrap" onSubmit={handleCommand} autoComplete="off">
                  <input
                    id="console-input"
                    type="text"
                    placeholder="Введите команду..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <button className="send-btn" type="submit">Отправить</button>
                </form>
              </section>
            </div>
          </main>
        </>
      )}
    </>
  )
}
