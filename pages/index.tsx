import { cp } from "fs/promises";
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

export async function getServerSideProps({ locale }) {
  let props = {
    favoriteVideos: null,
    messages: (await import(`../public/locales/${locale}.json`)).default,
  };

  const favResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/random/random`);
  const favoriteVideos = await favResult.json();

  if (favResult.status === 404) {
    return {
      notFound: true,
    };
  }

  props.favoriteVideos = favoriteVideos;

  return {
    props,
  };
}

interface Props {
  favoriteVideos: Video[];
}

const Home: NextPage<Props> = ({ favoriteVideos }) => {
  const t = useTranslations("home");
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
      <RandomFavoritesOverview videos={favoriteVideos} user={user} />
    </Layout>
  );
};

export default Home;
