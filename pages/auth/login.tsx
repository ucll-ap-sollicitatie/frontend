import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LoginForm from "../../components/auth/LoginForm";
import Layout from "../../components/layout/Layout";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Login: NextPage = () => {
  const session = useSession();

  const t = useTranslations("home");

  return (
    <Layout>
      <h1>{t("login")}</h1>

      {session.status === "authenticated" ? <p>{t("already_logged_in")}</p> : <LoginForm />}
    </Layout>
  );
};

export default Login;
