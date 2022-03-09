import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import IntroductionComponent from "../components/home/IntroductionComponent";
import IntroductionNotEditedComponent from "../components/home/IntroductionNotEditedComponent";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import RandomFavoritesOverview from "../components/videos/RandomFavoritesOverview";
import User from "../interfaces/User";
import Video from "../interfaces/Video";
import Error from "./_error";

export async function getServerSideProps({ locale }) {
  let props = {
    messages: (await import(`../public/locales/${locale}.json`)).default,
  };

  return {
    props,
  };
}

const Home: NextPage = () => {
  const t = useTranslations("home");
  const v = useTranslations("videos");
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchFavoriteVideos = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/random/random`);
      const data = await response.json();
      setFavoriteVideos(data);
    };

    fetchFavoriteVideos();
  }, []);

  const { data: session } = useSession();
  const user = session?.user as User;

  const chooseIntroduction = () => {
    if (!user.introduced) {
      if (!user.edited) {
        return <IntroductionNotEditedComponent session_user={user} />;
      } else {
        return <IntroductionComponent session_user={user} />;
      }
    }
  };

  const breadcrumb_items = [{ text: t("title") }];

  if (!session || session.user === undefined) return <Unauthenticated />;

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>
        {t("welcome")}, {user.name || user.email}!
      </h1>

      {chooseIntroduction()}
      <br />

      <h2>{t("favorites_title")}</h2>
      {favoriteVideos.length > 0 ? <RandomFavoritesOverview videos={favoriteVideos} user={user} /> : <p>{v("no_videos")}</p>}
    </Layout>
  );
};

export default Home;
