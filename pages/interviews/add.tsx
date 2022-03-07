import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddInterview: NextPage = () => {
  const t = useTranslations("interviews");
  const title = t("interview_add");
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/interviews", text: t("title") }, { text: t("interview_add") }];

  return (
    <Layout>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("interview_add")}</h1>
      <AddInterviewForm />
    </Layout>
  );
};

export default AddInterview;
