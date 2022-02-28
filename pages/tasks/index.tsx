import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SpinnerComponent from "../../components/SpinnerComponent";
import Task from "../../interfaces/Task";
import TasksReactTable from "../../components/TasksReactTable";
import Unauthorized from "../../components/Unauthorized";
import Layout from "../../components/layout/Layout";
import User from "../../interfaces/User";

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

const TasksIndex: NextPage = () => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthorized />;
  const user = session.user as User;
  if (user.role === "Lector") return <Unauthorized />;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);

    if (!res.ok) {
      setError(true);
    } else {
      const data = await res.json();
      data.forEach((task: Task) => (task.deadline_string = new Date(task.deadline).toLocaleString()));
      setTasks(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <div>Geen taken gevonden.</div>;
  if (loading) return <SpinnerComponent />;

  return (
    <Layout>
      <h1>Mijn taken</h1>
      <TasksReactTable columns={columns} data={tasks} url={"/tasks"} id="task_id" />
    </Layout>
  );
};

export default TasksIndex;
