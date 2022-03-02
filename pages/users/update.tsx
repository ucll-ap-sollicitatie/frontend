import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Unauthenticated from "../../components/Unauthenticated";
import Error from "../_error";
import UpdateUserForm from "../../components/users/UpdateUserForm";
import Layout from "../../components/layout/Layout";

import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import PageTitleComponent from "../../components/PageTitleComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("users");
  const title = t("update_profile");
  const router = useRouter();
  const query = router.query as { email: string };
  const { data: session } = useSession();
  if (query.email === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/profile", text: t("profile") }, { text: t("update_profile") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />
      <h1>{t("update_profile")}</h1>

      <UpdateUserForm email={query.email} />
    </Layout>
  );
};

export default UpdateInterview;
