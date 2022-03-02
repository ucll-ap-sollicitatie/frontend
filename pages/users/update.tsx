import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateUserForm from "../../components/users/UpdateUserForm";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("users");
  const h = useTranslations("home");

  const router = useRouter();
  const query = router.query as { email: string };
  const { data: session } = useSession();
  if (query.email === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/profile", text: t("profile") }, { text: t("update_profile") }];

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("update_profile")}`}</title>
      </Head>

      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("update_profile")}</h1>

      <UpdateUserForm email={query.email} />
    </Layout>
  );
};

export default UpdateInterview;
