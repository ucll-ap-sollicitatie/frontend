import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddTaskForm from "../../components/tasks/AddTaskForm";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import PageTitleComponent from "../../components/PageTitleComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddTask: NextPage = () => {
  const t = useTranslations("tasks");
  const title = t("title");
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/dashboard", text: t("tasks") }, { text: t("task_add") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("task_add")}</h1>

      <h1>{t("task_add")}</h1>
      <AddTaskForm />
    </Layout>
  );
};

export default AddTask;
