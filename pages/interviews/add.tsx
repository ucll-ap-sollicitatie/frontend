import { NextPage } from "next";
import { Breadcrumb } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";

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

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/interviews">Sollicitaties</Breadcrumb.Item>
        <Breadcrumb.Item active>Toevoegen</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("interview_add")}</h1>

      <AddInterviewForm />
    </Layout>
  );
};

export default AddInterview;
