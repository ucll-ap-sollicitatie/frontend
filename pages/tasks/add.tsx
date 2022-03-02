import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddTaskForm from "../../components/tasks/AddTaskForm";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddTask: NextPage = () => {
  const t = useTranslations("tasks");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/dashboard", text: t("tasks") }, { text: t("task_add") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("task_add")}</h1>
      <AddTaskForm />
    </Layout>
  );
};

export default AddTask;
