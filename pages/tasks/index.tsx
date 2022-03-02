import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Task from "../../interfaces/Task";
import Unauthorized from "../../components/Unauthorized";
import User from "../../interfaces/User";
import SpinnerComponent from "../../components/SpinnerComponent";
import TasksReactTable from "../../components/TasksReactTable";
import Layout from "../../components/layout/Layout";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import PageTitleComponent from "../../components/PageTitleComponent";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
  const data = await res.json();
  return {
    props: {
      tasks: data,
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

interface Props {
  tasks: Task[];
}

const TasksIndex: NextPage<Props> = ({ tasks }) => {
  const t = useTranslations("tasks");
  const title = t("task_add");

  const columns = [
    {
      Header: t("task"),
      accessor: "title",
    },
    {
      Header: t("description"),
      accessor: "description",
    },
    {
      Header: t("deadline"),
      accessor: "deadline_string",
    },
    {
      Header: t("given_by"),
      accessor: "full_name",
    },
  ];

  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  useEffect(() => {
    tasks.forEach((task: Task) => (task.deadline_string = new Date(task.deadline).toLocaleString()));
    setLoading(false);
  }, [tasks]);
  if (!session || session.user === undefined) return <Unauthorized />;
  const user = session.user as User;
  if (user.role === "Lector") return <Unauthorized />;

  if (loading) return <SpinnerComponent />;
  if (tasks.length < 1) return <p>{t("no_tasks_found")}</p>;

  const breadcrumb_items = [{ text: t("my_tasks") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("my_tasks")}</h1>
      <TasksReactTable columns={columns} data={tasks} url={"/tasks"} id="task_id" />
    </Layout>
  );
};

export default TasksIndex;
