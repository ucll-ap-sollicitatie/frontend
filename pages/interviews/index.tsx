import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import AddInterviewButton from "../../components/interviews/AddInterviewButton";
import InterviewsTable from "../../components/interviews/InterviewsTable";
import Layout from "../../components/layout/Layout";
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
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const breadcrumb_items = [{ text: t("title") }];

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("title")}`}</title>
      </Head>

      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("title")}</h1>

      {user.role !== "Student" && <AddInterviewButton />}

      <InterviewsTable />
    </Layout>
  );
};

export default Interviews;
