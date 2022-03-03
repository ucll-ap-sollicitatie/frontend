import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import User from "../interfaces/User";
import Link from "next/link";
import { Modal } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

const Home: NextPage = () => {
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
        {!edited && (
          <span>
            {t("preferences_not_adjusted")} <br />
            <Link href={`/preferences`} passHref>
              <a className="link-success">{t("preferences_profile")}</a>
            </Link>
          </span>
        )}
      </p>
    </Layout>
  );
};

export default Home;
