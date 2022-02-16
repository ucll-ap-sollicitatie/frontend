import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect } from "react";

import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Head>
        <title>Slim op sollicitatie</title>
        <meta name="description" content="Slim op sollicitatie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextNProgress options={{ showSpinner: false }} />

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
