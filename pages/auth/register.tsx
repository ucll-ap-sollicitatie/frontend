import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Layout from "../../components/layout/Layout";
import AddUserForm from "../../components/users/AddUserForm";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Register: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Layout>
      <h1>{t("register_new_account")}</h1>

      <AddUserForm />
    </Layout>
  );
};

export default Register;
