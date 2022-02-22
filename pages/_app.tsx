import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import ToastComponent from "../components/ToastComponent";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Amogus from "../components/Amogus";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Head>
        <title>Slim op sollicitatie</title>
        <meta name="description" content="Slim op sollicitatie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextNProgress options={{ showSpinner: false }} />

      <Amogus url={"/amogus.mp3"} />

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
    </>
  );
}

export default MyApp;
