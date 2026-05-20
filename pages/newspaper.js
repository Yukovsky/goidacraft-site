import React, { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

const CDN = 'https://cdn.jsdelivr.net/gh/Yukovsky/goidacraft-newspaper@main'

export default function NewspaperPage() {
  const [issues, setIssues]       = useState([])
  const [current, setCurrent]     = useState(0)
  const [loaded, setLoaded]       = useState(false)
  const [downloading, setDl]      = useState(false)
  const issuesRef = useRef([])
  const lockRef   = useRef(false)

  const handleDownload = useCallback(async (issue) => {
    if (downloading) return
    setDl(true)
    try {
      const res  = await fetch(issue.src)
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `Газета-Гойдакрафт-Выпуск-${issue.num}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(issue.src, '_blank', 'noopener,noreferrer')
    } finally {
      setDl(false)
    }
  }, [downloading])

  useEffect(() => {
    fetch(`${CDN}/manifest.json`)
      .then(r => r.json())
      .then(data => {
        const arr = Object.entries(data.issues)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([n, info]) => ({
            num: Number(n),
            date:  info.date,
            title: info.title,
            src:   `${CDN}/issues/issue-${n}.pdf`,
          }))
        issuesRef.current = arr
        setIssues(arr)
        setCurrent(arr.length - 1)
        setLoaded(true)
      })
      .catch(() => {})
  }, [])

  const go = useCallback((dir) => {
    if (lockRef.current) return
    const len = issuesRef.current.length
    if (!len) return
    setCurrent(prev => {
      const next = prev + dir
      if (next < 0 || next >= len) return prev
      lockRef.current = true
      setTimeout(() => { lockRef.current = false }, 300)
      return next
    })
  }, [])

  const jumpTo = useCallback((idx) => {
    if (lockRef.current) return
    if (idx < 0 || idx >= issuesRef.current.length) return
    setCurrent(prev => {
      if (prev === idx) return prev
      lockRef.current = true
      setTimeout(() => { lockRef.current = false }, 300)
      return idx
    })
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft')  go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const issue = issues[current]

  return (
    <>
      <Head>
        <title>Серверная газета Гойдакрафт — Архив выпусков PDF</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Серверная газета Гойдакрафта — архив выпусков PDF. Хроники событий, объявления и история Minecraft сервера. Читайте онлайн или скачивайте." />
        <meta name="keywords" content="газета гойдакрафт, goidacraft газета, серверная газета minecraft, хроники сервера гойдакрафт, новости гойдакрафт, архив выпусков, minecraft сервер газета" />
        <link rel="canonical" href="https://goidacraft.online/newspaper/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goidacraft.online/newspaper/" />
        <meta property="og:title" content="Серверная газета Гойдакрафт — Архив выпусков" />
        <meta property="og:description" content="Официальный архив серверной газеты Гойдакрафта в PDF. Хроники, события и объявления Minecraft сервера с Create: Aeronautics." />
        <meta property="og:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        {/* Twitter */}
        <meta name="twitter:title" content="Серверная газета Гойдакрафт — Архив выпусков" />
        <meta name="twitter:description" content="Официальный архив серверной газеты Гойдакрафта в PDF. Хроники, события и объявления Minecraft сервера с Create: Aeronautics." />
        <meta name="twitter:image" content="https://goidacraft.online/assets/img/goidalogo.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Серверная газета Гойдакрафт",
          "url": "https://goidacraft.online/newspaper/",
          "description": "Официальный архив серверной газеты Гойдакрафта — хроники событий, объявления и история Minecraft сервера с Create: Aeronautics.",
          "inLanguage": "ru",
          "isPartOf": { "@type": "WebSite", "name": "Гойдакрафт", "url": "https://goidacraft.online" },
          "publisher": { "@type": "Organization", "name": "Гойдакрафт", "url": "https://goidacraft.online" }
        }) }} />
      </Head>

      {/* Page header */}
      <section className="page-head nwp-page-head">
        <div className="container">
          <span className="eyebrow">Гойдакрафт · Типография</span>
          <h1>Серверная газета</h1>
          <p>Официальный хронограф событий, объявлений и хроник на борту</p>
        </div>
        <span className="cog cog-large cog-spin" aria-hidden="true"
          style={{ position: 'absolute', right: '7%', top: '8%', width: 90, height: 90, opacity: 0.1, pointerEvents: 'none' }} />
        <span className="cog cog-small cog-spin ccw" aria-hidden="true"
          style={{ position: 'absolute', right: '13%', top: '60%', width: 56, height: 56, opacity: 0.08, pointerEvents: 'none' }} />
        <span className="cog cog-large cog-spin ccw" aria-hidden="true"
          style={{ position: 'absolute', left: '4%', top: '18%', width: 72, height: 72, opacity: 0.07, pointerEvents: 'none' }} />
      </section>

      {!loaded ? (
        <section style={{ padding: '80px var(--space-page-x)', textAlign: 'center' }}>
          <p className="nwp-loading-text">Печатный станок разогревается…</p>
        </section>
      ) : (
        <section className="nwp-press">
          <div className="nwp-inner">

            {/* Blueprint label */}
            <div className="nwp-label-row">
              <span className="nwp-label-line" />
              <span className="nwp-label-text">Архив выпусков · {issues.length} изданий</span>
              <span className="nwp-label-line nwp-label-line-r" />
            </div>

            {/* Issue selector cards (tabs) */}
            <div className="nwp-issue-cards" role="tablist" aria-label="Выпуски газеты">
              {issues.map((iss, i) => (
                <button
                  key={iss.num}
                  role="tab"
                  aria-selected={i === current}
                  className={`nwp-issue-card${i === current ? ' active' : ''}`}
                  onClick={() => jumpTo(i)}
                  title={iss.date}
                >
                  <span className="nwp-ic-num">№{iss.num}</span>
                  <span className="nwp-ic-date">{iss.date}</span>
                  {i === current && <span className="nwp-ic-active-bar" aria-hidden="true" />}
                </button>
              ))}
            </div>

            {/* Active issue meta plate */}
            {issue && (
              <div className="nwp-meta brass-plate" aria-live="polite">
                <span className="rivet" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <span className="nwp-meta-num">Выпуск&nbsp;№{issue.num}</span>
                <span className="nwp-meta-dot" aria-hidden="true">◆</span>
                <span className="nwp-meta-date">{issue.date}</span>
                <span className="rivet" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            )}

            {/* Viewer: nav + PDF frame + nav */}
            <div className="nwp-stage">
              <button
                className="nwp-nav"
                onClick={() => go(-1)}
                disabled={current === 0}
                aria-label="Предыдущий выпуск"
              >
                <span className="cog cog-small cog-spin ccw" aria-hidden="true"
                  style={{ width: 26, height: 26, display: 'block', margin: '0 auto 4px' }} />
                <span className="nwp-arrow">‹</span>
              </button>

              <div className="nwp-frame nwp-pdf-wrap">
                <span className="rivet nwp-rv nwp-rv-tl" />
                <span className="rivet nwp-rv nwp-rv-tr" />
                <span className="rivet nwp-rv nwp-rv-bl" />
                <span className="rivet nwp-rv nwp-rv-br" />
                <span className="nwp-corner nwp-corner-tl" />
                <span className="nwp-corner nwp-corner-tr" />
                <span className="nwp-corner nwp-corner-bl" />
                <span className="nwp-corner nwp-corner-br" />

                {issue && (
                  <iframe
                    key={current}
                    className="nwp-pdf-frame"
                    src={issue.src}
                    title={`Выпуск №${issue.num} · ${issue.date}`}
                    aria-label={`Просмотр выпуска №${issue.num}`}
                    loading="eager"
                  >
                    {/* Fallback for browsers that don't support inline PDF */}
                    <div className="nwp-pdf-fallback">
                      <p>Встроенный просмотрщик PDF не поддерживается вашим браузером.</p>
                    </div>
                  </iframe>
                )}
              </div>

              <button
                className="nwp-nav"
                onClick={() => go(1)}
                disabled={current === issues.length - 1}
                aria-label="Следующий выпуск"
              >
                <span className="nwp-arrow">›</span>
                <span className="cog cog-small cog-spin" aria-hidden="true"
                  style={{ width: 26, height: 26, display: 'block', margin: '4px auto 0' }} />
              </button>
            </div>

            {/* Action buttons */}
            {issue && (
              <div className="nwp-actions">
                <a
                  href={issue.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nwp-action-btn nwp-action-primary"
                >
                  <span className="gear-host gear-spin"
                    data-teeth="8" data-r="9" data-color="#3a1c08" data-highlight="#7a4818" />
                  Открыть PDF
                </a>
                <button
                  className="nwp-action-btn"
                  onClick={() => handleDownload(issue)}
                  disabled={downloading}
                >
                  {downloading ? '↓ Загрузка…' : '↓ Скачать выпуск'}
                </button>
              </div>
            )}

            {/* Progress dots */}
            <div className="nwp-progress" aria-hidden="true">
              {issues.map((_, i) => (
                <span
                  key={i}
                  className={`nwp-pip${i === current ? ' active' : ''}`}
                  onClick={() => jumpTo(i)}
                />
              ))}
            </div>

            <p className="nwp-keys-hint" aria-hidden="true">
              ← → для листания · встроенный просмотрщик поддерживает зум, поиск и печать
            </p>
          </div>
        </section>
      )}
    </>
  )
}
