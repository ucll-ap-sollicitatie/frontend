import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AllVideoOverview from "../../components/videos/AllVideoOverview";
import User from "../../interfaces/User";
import { useTranslations } from "next-intl";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props = {
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const data = await result.json();

  if (result.status !== 404 && result.status !== 500) {
    props.videos = data;
  }

  return {
    props,
  };
};

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("all")}`}</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Video&apos;s</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("all")}</h1>
      <AllVideoOverview videos={videos} user={user} />
    </Layout>
  );
};

export default Home;
