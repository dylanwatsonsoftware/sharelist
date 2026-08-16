import { AppProps } from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';
import Welcome from '../components/welcome';
import './styles.css';

const StyledPage = styled.div`
  .page {
  }
`;

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ShareList</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#143757" />
      </Head>
      <main className="app">
        <StyledPage>
          <div className="wrapper">
            <div className="container">
              <Welcome></Welcome>

              <Component {...pageProps} />

              <p id="love">
                Carefully crafted with
                <svg
                  fill="currentColor"
                  stroke="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                by{' '}
                <a href="https://github.com/dylanwatsonsoftware/sharelist">
                  @dylanwatsonsoftware
                </a>
              </p>
              <footer id="build-info">
                <p>
                  Version {process.env.NEXT_PUBLIC_BUILD_VERSION} ·{' '}
                  {process.env.NEXT_PUBLIC_BUILD_DATE}
                </p>
                <p>{process.env.NEXT_PUBLIC_BUILD_SUMMARY}</p>
              </footer>
            </div>
          </div>
        </StyledPage>
      </main>
    </>
  );
}

export default CustomApp;
