import { Html, Head, Main, NextScript } from 'next/document'

const GA_ID = 'G-K8GLPESX1J'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1a0f05" />
        <meta name="msapplication-TileColor" content="#1a0f05" />
        <link rel="icon" type="image/png" href="/assets/img/goidalogo.png" />
        <link rel="apple-touch-icon" href="/assets/img/goidalogo.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');` }} />
        {/* Default OG image fallback */}
        <meta property="og:site_name" content="Гойдакрафт" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        {/* Show loader synchronously before first paint — only on first site entry this session */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(sessionStorage.getItem('goida:visited')!=='1')document.documentElement.classList.add('loading');}catch(e){}})()`}} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
