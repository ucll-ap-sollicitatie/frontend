import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Task from "../../interfaces/Task";
import Unauthorized from "../../components/Unauthorized";
import User from "../../interfaces/User";
import SpinnerComponent from "../../components/SpinnerComponent";
import TasksReactTable from "../../components/TasksReactTable";
import Layout from "../../components/layout/Layout";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
  const data = await res.json();
  return {
    props: {
      tasks: data,
    },
  };
};

interface Props {
  tasks: Task[];
}

const columns = [
  {
    Header: "Titel",
    accessor: "title",
  },
  {
    Header: "Beschrijving",
    accessor: "description",
  },
  {
    Header: "Deadline",
    accessor: "deadline_string",
  },
  {
    Header: "Gegeven door",
    accessor: "full_name",
  },
];

const TasksIndex: NextPage<Props> = ({ tasks }) => {
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
  if (tasks.length < 1) return <p>Geen taken gevonden</p>;

  return (
    <Layout>
      <h1>Mijn taken</h1>
      <TasksReactTable columns={columns} data={tasks} url={"/tasks"} id="task_id" />
    </Layout>
  );
};

export default TasksIndex;
