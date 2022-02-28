import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AddTaskForm from "../../components/tasks/AddTaskForm";
import { useTranslations } from "next-intl";

const AddTask: NextPage = () => {
  const t = useTranslations("tasks");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>{t("task_add")}</h1>

      <AddTaskForm />
    </Layout>
  );
};

export default AddTask;
