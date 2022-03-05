import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import Unauthenticated from "../Unauthenticated";
import TaskForm from "./TaskForm";

const AddTaskForm: NextPage = () => {
  const t = useTranslations("tasks");
  const e = useTranslations("errors");

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      body: JSON.stringify({
        title: target.task_title.value.trim(),
        description: target.description.value.trim(),
        deadline: target.deadline.value,
        teacher_email: session.user?.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError(t("add_failed"));
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
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <TaskForm onSubmit={onSubmit} />
    </>
  );
};

export default AddTaskForm;
