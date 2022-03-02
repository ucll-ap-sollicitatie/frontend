import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import AddInterviewButton from "../../components/interviews/AddInterviewButton";
import InterviewsTable from "../../components/interviews/InterviewsTable";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";
import User from "../../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Interviews: NextPage = () => {
  const t = useTranslations("interviews");
  const title = t("title");
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const breadcrumb_items = [{ text: t("title") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("title")}</h1>

      {user.role !== "Student" && <AddInterviewButton />}

      <InterviewsTable />
    </Layout>
  );
};

export default Interviews;
