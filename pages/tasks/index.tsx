import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import SpinnerComponent from "../../components/SpinnerComponent";
import TasksReactTable from "../../components/TasksReactTable";
import Unauthorized from "../../components/Unauthorized";
import Task from "../../interfaces/Task";
import User from "../../interfaces/User";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const props = {
    tasks: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
  const data = await res.json();
  if (res.ok) {
    props.tasks = data;
  }
  return {
    props,
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
    if (tasks !== null) {
      tasks.forEach((task: Task) => (task.deadline_string = new Date(task.deadline).toLocaleString()));
    }

    setLoading(false);
  }, [tasks]);
  if (!session || session.user === undefined) return <Unauthorized />;
  const user = session.user as User;
  if (user.role === "Lector") return <Unauthorized />;

  if (loading) return <SpinnerComponent />;

  const breadcrumb_items = [{ text: t("my_tasks") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("my_tasks")}</h1>
      <p>{t("tasks_index")}</p>
      {tasks ? <TasksReactTable columns={columns} data={tasks} url={"/tasks"} id="task_id" /> : <p>{t("no_tasks")}</p>}
    </Layout>
  );
};

export default TasksIndex;
