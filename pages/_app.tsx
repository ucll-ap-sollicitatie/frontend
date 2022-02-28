import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { SessionProvider } from "next-auth/react";
import { NextIntlProvider, useTranslations } from "next-intl";

import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import ToastComponent from "../components/ToastComponent";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const t = useTranslations("home");

  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content="Slim op sollicitatie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextNProgress options={{ showSpinner: false }} />

      {/* <Amogus url={"/amogus.mp3"} /> */}

      <NextIntlProvider messages={pageProps.messages}>
        <SessionProvider session={session}>
          {router.query.toast && (
            <Container className="d-flex justify-content-end">
              <ToastComponent message={router.query.toast as string} />
            </Container>
          )}

          <DndProvider backend={HTML5Backend}>
            <Component {...pageProps} />
          </DndProvider>
        </SessionProvider>
      </NextIntlProvider>
    </>
  );
}

export default MyApp;
