import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";
import FavoriteVideoOverview from "../../components/videos/FavoriteVideoOverview";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props = {
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`);
  const data = await result.json();

  if (result.ok) {
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
  const title = t("favorite_title");
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const breadcrumb_items = [{ text: t("all") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("favorite_title")}</h1>
      {videos ? <FavoriteVideoOverview videos={videos} user={user} /> : <p>{t("no_videos")}</p>}
    </Layout>
  );
};

export default FavoriteVideos;
