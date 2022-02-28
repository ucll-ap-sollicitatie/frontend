import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import UsersTable from "../../components/users/UsersTable";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Profile: NextPage = () => {
  const t = useTranslations("users");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Gebruikers</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("users")}</h1>
      <UsersTable />
    </Layout>
  );
};

export default Profile;
