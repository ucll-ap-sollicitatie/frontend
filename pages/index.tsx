import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import User from "../interfaces/User";
import Video from "../interfaces/Video";
import RandomFavoritesOverview from "../components/videos/RandomFavoritesOverview";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import IntroductionNotEditedComponent from "../components/home/IntroductionNotEditedComponent";
import IntroductionComponent from "../components/home/IntroductionComponent";
import { Session } from "../interfaces/Session";

// export async function getStaticProps({ locale }) {
//   let props = {
//     videos: null,
//     messages: (await import(`../public/locales/${locale}.json`)).default,
//   };

//   const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/random/random`);
//   const data = await result.json();

//   if (result.status !== 404 && result.status !== 500) {
//     props.videos = data;
//   }

//   return {
//     props,
//   };
// }

export async function getServerSideProps({ locale }) {
  let props = {
    videos: null,
    messages: (await import(`../public/locales/${locale}.json`)).default,
  };

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/random/random`);
  const data = await result.json();

  if (result.status !== 404 && result.status !== 500) {
    props.videos = data;
  }

  return {
    props,
  };
}

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("home");
  const { data: session } = useSession();
  const [introduced, setIntroduced] = useState<boolean>(true);
  const [edited, setEdited] = useState<boolean>(true);

  useEffect(() => {
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
      <h3>{t("favorites_title")}</h3>
      <RandomFavoritesOverview videos={videos} user={user} />
    </Layout>
  );
};

export default Home;
