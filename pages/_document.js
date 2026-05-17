import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* Show loader synchronously before first paint — only on first site entry this session */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(sessionStorage.getItem('goida:visited')!=='1')document.documentElement.classList.add('loading');}catch(e){}})()`}} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
