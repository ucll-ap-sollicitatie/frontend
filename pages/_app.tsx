import "bootstrap-dark-5/dist/css/bootstrap-nightshade.css";
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
import { getLocale, initializeDarkMode } from "../helpers/helperFunctions";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
    initializeDarkMode();
    router.push(`${router.asPath}`, `${router.asPath}`, { locale: getLocale() });
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
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="color-scheme" content="light dark" />
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
