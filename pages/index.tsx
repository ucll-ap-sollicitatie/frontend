import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useState } from "react";
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
  const [introduced, setIntroduced] = useState<boolean>(true);
  const [edited, setEdited] = useState<boolean>(true);

  useLayoutEffect(() => {
    const fetchPrefIntroduced = async () => {
      if (!session?.user) {
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/${session?.user?.email}`);
      const prefs = await res.json();
      if (!prefs.introduced) {
        setIntroduced(false);
      }
      if (!prefs.edited) {
        setEdited(false);
      }
    };

    fetchPrefIntroduced();
  });

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;
  const breadcrumb_items = [{ text: t("title") }];

  const chooseIntroduction = () => {
    if (!introduced) {
      if (!edited) {
        return <IntroductionNotEditedComponent session_user={user} />;
      } else {
        return <IntroductionComponent session_user={user} />;
      }
    }
  };

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <h1>
        {t("welcome")}, {user.name || user.email}!
      </h1>
      {chooseIntroduction()}
      <h2 className="mt-3">{t("favorites_title")}</h2>
      <RandomFavoritesOverview videos={favoriteVideos} user={user} />
    </Layout>
  );
};

export default Home;
