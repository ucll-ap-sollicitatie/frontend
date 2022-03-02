import { NextPage } from "next";
import { Breadcrumb } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddInterview: NextPage = () => {
  const t = useTranslations("interviews");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/interviews", text: t("title") }, { text: t("interview_add") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("interview_add")}</h1>
      <AddInterviewForm />
    </Layout>
  );
};

export default AddInterview;
