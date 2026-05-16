import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Гойдакрафт — 404</title>
        <meta
          name="description"
          content="Страница не найдена. Переходите на главную или в разделы сайта Гойдакрафт."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="not-found-page">
        <section className="not-found-shell brass-plate">
          <div className="not-found-ornaments" aria-hidden="true">
            <span className="cog cog-large cog-spin not-found-cog cog-a" />
            <span className="cog cog-small cog-spin ccw not-found-cog cog-b" />
            <span className="rivet not-found-rivet rivet-a" />
            <span className="rivet not-found-rivet rivet-b" />
          </div>

          <div className="not-found-content">
            <div className="not-found-badge">404</div>
            <p className="eyebrow">Ошибка маршрута</p>
            <h1>Эта дорога не ведёт на Гойдакрафт</h1>
            <p className="not-found-text">
              Такого адреса не существует. Поезд не смог найти нужный
              маршрут, но основные разделы сайта по-прежнему доступны.
            </p>

            <div className="not-found-actions">
              <Link href="/" className="btn not-found-btn primary">
                Вернуться на главную
              </Link>
              <Link href="/mods" className="btn not-found-btn">
                Открыть моды
              </Link>
              <Link href="/connect">
                Подключение
              </Link>
              <Link href="/donors">
                Доноры
            </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .not-found-page {
          min-height: calc(100vh - 84px);
          display: grid;
          place-items: center;
          padding: clamp(24px, 5vw, 56px) var(--space-page-x);
          position: relative;
          isolation: isolate;
        }

        .not-found-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 15%, rgba(201, 155, 60, 0.16), transparent 24%),
            radial-gradient(circle at 84% 24%, rgba(184, 115, 51, 0.16), transparent 26%),
            radial-gradient(circle at 50% 72%, rgba(42, 29, 16, 0.08), transparent 34%);
          z-index: -1;
          pointer-events: none;
        }

        .not-found-shell {
          width: min(100%, 1100px);
          padding: clamp(26px, 5vw, 54px);
          overflow: hidden;
        }

        .not-found-shell::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(42, 29, 16, 0.14);
          pointer-events: none;
        }

        .not-found-ornaments {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .not-found-cog {
          position: absolute;
          opacity: 0.18;
          filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.25));
        }

        .cog-a {
          width: min(260px, 34vw);
          height: min(260px, 34vw);
          top: -42px;
          right: -40px;
        }

        .cog-b {
          width: min(180px, 24vw);
          height: min(180px, 24vw);
          left: -30px;
          bottom: -26px;
          animation-duration: 28s;
        }

        .not-found-rivet {
          position: absolute;
          opacity: 0.7;
        }

        .rivet-a {
          top: 16px;
          left: 16px;
        }

        .rivet-b {
          bottom: 16px;
          right: 16px;
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          max-width: 740px;
          margin: 0 auto;
          text-align: center;
        }

        .not-found-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 132px;
          padding: 16px 28px;
          margin-bottom: 18px;
          border-radius: 2px;
          background:
            linear-gradient(180deg, var(--brass-light) 0%, var(--brass) 34%, var(--brass-dark) 100%);
          border: 2px solid var(--brass-dark);
          color: var(--ink);
          font-family: var(--f-title);
          font-size: clamp(42px, 8vw, 72px);
          letter-spacing: 0.08em;
          text-shadow: 0 1px 0 rgba(255, 243, 198, 0.65);
          box-shadow:
            inset 0 0 0 1px rgba(255, 240, 180, 0.6),
            0 14px 24px rgba(0, 0, 0, 0.24);
        }

        h1 {
          font-size: clamp(34px, 5vw, 64px);
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .not-found-text {
          max-width: 62ch;
          margin: 0 auto;
          color: var(--ink-soft);
          font-size: clamp(16px, 1.5vw, 18px);
        }

        .not-found-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .not-found-btn {
          min-width: 210px;
          padding: 14px 22px;
          border-radius: 2px;
          background: linear-gradient(180deg, rgba(58, 40, 24, 0.92), rgba(26, 17, 8, 0.98));
          color: var(--paper-2);
          border: 1px solid var(--brass-dark);
          box-shadow: inset 0 0 0 1px rgba(255, 220, 140, 0.08);
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .not-found-btn.primary {
          color: var(--brass-light);
          border-color: var(--brass);
          box-shadow:
            inset 0 0 0 1px rgba(255, 235, 170, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .not-found-btn:hover {
          background: linear-gradient(180deg, rgba(74, 50, 29, 0.98), rgba(34, 21, 11, 1));
          color: var(--brass-light);
        }

        .not-found-links {
          display: flex;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 22px;
          font-family: var(--f-body);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .not-found-links a {
          border-bottom-color: transparent;
          color: var(--copper-dark);
        }

        .not-found-links a:hover {
          color: var(--ember);
          border-bottom-color: currentColor;
        }

        @media (max-width: 760px) {
          .not-found-page {
            min-height: calc(100vh - 72px);
          }

          .not-found-shell {
            padding: 22px 18px;
          }

          .not-found-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .not-found-btn {
            min-width: 0;
          }

          .cog-a {
            width: 220px;
            height: 220px;
            top: -54px;
            right: -70px;
          }

          .cog-b {
            width: 150px;
            height: 150px;
            left: -44px;
            bottom: -34px;
          }
        }
      `}</style>
    </>
  )
}