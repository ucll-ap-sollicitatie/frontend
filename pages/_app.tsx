import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";

import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import ToastComponent from "../components/ToastComponent";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <NextIntlProvider messages={pageProps.messages}>
        <SessionProvider session={session}>
          <DndProvider backend={HTML5Backend}>
            <NextNProgress options={{ showSpinner: false }} />

            {/* <Amogus url={"/amogus.mp3"} /> */}

            <Head>
              <title>Slim op sollicitatie</title>
              <meta name="description" content="Slim op sollicitatie" />
              <link rel="icon" href="/test.ico" />
            </Head>

            {router.query.toast && (
              <Container className="d-flex justify-content-end">
                <ToastComponent message={router.query.toast as string} />
              </Container>
            )}

            <Component {...pageProps} />
          </DndProvider>
        </SessionProvider>
      </NextIntlProvider>
    </>
  );
}

export default MyApp;
