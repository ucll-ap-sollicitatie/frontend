import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import Unauthenticated from "../Unauthenticated";
import TaskForm from "./TaskForm";

const AddTaskForm: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch("http://localhost:3001/tasks", {
      body: JSON.stringify({
        title: target.title.value,
        description: target.description.value,
        deadline: target.deadline.value,
        teacher_email: session.user?.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError("Er was een probleem bij het aanmaken van uw taak.");
      setShow(true);
    } else {
      router.push({
        pathname: "/dashboard",
      });
    }
  };

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <TaskForm onSubmit={onSubmit} />
    </>
  );
};

export default AddTaskForm;
