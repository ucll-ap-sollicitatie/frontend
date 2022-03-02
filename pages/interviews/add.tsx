import { NextPage } from "next";
import { Breadcrumb } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Unauthenticated from "../../components/Unauthenticated";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";
import Layout from "../../components/layout/Layout";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddInterview: NextPage = () => {
  const t = useTranslations("interviews");
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("interview_add")}`}</title>
      </Head>
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
