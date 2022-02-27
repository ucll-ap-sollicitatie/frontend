import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import Task from "../../interfaces/Task";
import SpinnerComponent from "../SpinnerComponent";
import Unauthorized from "../Unauthorized";
import TaskForm from "./TaskForm";

interface Props {
  task_id: string;
}

const UpdateTaskForm: NextPage<Props> = ({ task_id }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`http://localhost:3001/tasks/${task_id}`);
      const data = await res.json();
      setTask(data);
    };

    fetchTask();
    setLoading(false);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch("http://localhost:3001/tasks", {
      body: JSON.stringify({
        title: target.title.value,
        description: target.description.value,
        deadline: target.deadline.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!res.ok) {
      setError("Er was een probleem bij het aanpassen van de taak.");
      setShow(true);
    } else {
      router.push({
        pathname: "/dashboard",
      });
    }
  };

  if (loading) return <SpinnerComponent />;
  if (task?.teacher_email !== session?.user?.email && session?.user?.role !== "Admin") return <div>U mag deze taak niet aanpassen.</div>;
  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <TaskForm onSubmit={onSubmit} task={task} />
    </>
  );
};

export default UpdateTaskForm;
