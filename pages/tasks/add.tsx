import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddTaskForm from "../../components/tasks/AddTaskForm";
import { useTranslations } from "next-intl";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddTask: NextPage = () => {
  const t = useTranslations("tasks");
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("title")}`}</title>
      </Head>
      <h1>{t("task_add")}</h1>

      <AddTaskForm />
    </Layout>
  );
};

export default AddTask;
