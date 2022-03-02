import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "react-bootstrap";
import AddInterviewButton from "../../components/interviews/AddInterviewButton";
import InterviewsTable from "../../components/interviews/InterviewsTable";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Interviews: NextPage = () => {
  const t = useTranslations("interviews");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Sollicitaties</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("title")}</h1>

      {session?.user?.role !== "Student" && <AddInterviewButton />}

      <InterviewsTable />
    </Layout>
  );
};

export default Interviews;
