import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import User from "../../interfaces/User";
import { useTranslations } from "next-intl";
import FavoriteVideoOverview from "../../components/videos/FavoriteVideoOverview";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props = {
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`);
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

const FavoriteVideos: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  videos.forEach((element) => {
    console.log(element.favorite_email);
  });

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("favorite_title")}`}</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Video&apos;s</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("favorite_title")}</h1>
      <FavoriteVideoOverview videos={videos} user={user} />
    </Layout>
  );
};

export default FavoriteVideos;
