import "bootstrap-dark-5/dist/css/bootstrap-nightshade.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { Container, SSRProvider } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Amogus from "../components/Amogus";
import ToastComponent from "../components/ToastComponent";
import { getLocale, initializeDarkMode } from "../helpers/helperFunctions";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  pageProps.getIn;

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
    initializeDarkMode();

    // To fix an infinite loop when going to /_error.tsx for some reason
    if (router.route !== "/_error") router.push(`${router.asPath}`, `${router.asPath}`, { locale: getLocale() });
  }, []);

  return (
    <>
      <NextIntlProvider messages={pageProps.messages}>
        <SSRProvider>
          <SessionProvider session={session}>
            <DndProvider backend={HTML5Backend}>
              <NextNProgress options={{ showSpinner: false }} />

              <Amogus url={"/amogus.mp3"} />

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
        </SSRProvider>
      </NextIntlProvider>
    </>
  );
}

export default MyApp;
