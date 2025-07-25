import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = localStorage.getItem('theme') === 'dark' ||
                    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 