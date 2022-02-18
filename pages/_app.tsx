import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import ToastComponent from "../components/ToastComponent";
import { Container } from "react-bootstrap";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

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
        {router.query.toast && (
          <Container className="d-flex justify-content-end">
            <ToastComponent message={router.query.toast} />
          </Container>
        )}
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
