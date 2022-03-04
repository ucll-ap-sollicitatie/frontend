import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import User from "../interfaces/User";
import Link from "next/link";
import Video from "../interfaces/Video";
import RandomFavoritesOverview from "../components/videos/RandomFavoritesOverview";
import AllVideoOverview from "../components/videos/AllVideoOverview";

export async function getStaticProps({ locale }) {
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
  const router = useRouter();
  const { data: session } = useSession();
  const [edited, setEdited] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrefEdited = async () => {
      if (!session?.user) {
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/${session?.user?.email}`);
      const prefEdited = await res.json();
      if (!prefEdited.edited) {
        setEdited(false);
      }
    };

    fetchPrefEdited();
  }, [session?.user]);

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <h1>{t("title")}</h1>

      <p>
        {t("welcome")}, {user.name || user.email}! <br />
      </p>

      {!edited && (
        <p>
          {t("preferences_not_adjusted")} <br />
          <Link href={`/preferences`} passHref>
            <a className="link-success">{t("preferences_profile")}</a>
          </Link>
        </p>
      )}
      <h2>{t("favorites_title")}</h2>
      <RandomFavoritesOverview videos={videos} user={user} />
    </Layout>
  );
};

export default Home;
