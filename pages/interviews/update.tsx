import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import UpdateInterviewForm from "../../components/interviews/UpdateInterviewForm";
import Error from "../_error";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Head from "next/head";
import PageTitleComponent from "../../components/PageTitleComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("interviews");
  const title = t("interview_update");
  const router = useRouter();
  const query = router.query as { id: string };
  const { data: session } = useSession();
  if (query.id === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/interviews", text: t("title") }, { text: t("interview_update") }];

  return (
    <Layout>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("interview_update")}</h1>

      <h1>{t("interview_update")}</h1>
      <UpdateInterviewForm id={query.id} />
    </Layout>
  );
};

export default UpdateInterview;
