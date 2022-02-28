import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LogoutButton from "../components/auth/LogoutButton";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import User from "../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

const Home: NextPage = () => {
  const t = useTranslations("home");

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <h1>{t("title")}</h1>

      <p>
        {t("welcome")}, {user.name || user.email}!
      </p>
      <LogoutButton />
    </Layout>
  );
};

export default Home;
