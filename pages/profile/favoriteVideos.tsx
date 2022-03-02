import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AllVideoOverview from "../../components/videos/AllVideoOverview";
import User from "../../interfaces/User";
import { useTranslations } from "next-intl";
import FavoriteVideoOverview from "../../components/videos/FavoriteVideoOverview";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

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

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  videos.forEach((element) => {
    console.log(element.favorite_email);
  });

  const breadcrumb_items = [{ text: t("all") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("favorite_title")}</h1>
      <FavoriteVideoOverview videos={videos} user={user} />
    </Layout>
  );
};

export default FavoriteVideos;
