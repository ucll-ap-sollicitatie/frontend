import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import Task from "../../interfaces/Task";
import User from "../../interfaces/User";
import SpinnerComponent from "../SpinnerComponent";
import TaskForm from "./TaskForm";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  task_id: string;
}

const UpdateTaskForm: NextPage<Props> = ({ task_id }) => {
  const t = useTranslations("tasks");
  const e = useTranslations("errors");

  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`${process.env.API_URL}/tasks/${task_id}`);
      const data = await res.json();
      setTask(data);
    };

    fetchTask();
    setLoading(false);
  }, [task_id]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch(`${process.env.API_URL}/tasks`, {
      body: JSON.stringify({
        title: target.task_title.value,
        description: target.description.value,
        deadline: target.deadline.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!res.ok) {
      setError(t("task_update_failed"));
      setShow(true);
    } else {
      router.push({
        pathname: "/dashboard",
      });
    }
  };

  if (loading) return <SpinnerComponent />;
  if (task?.teacher_email !== session?.user?.email && user.role !== "Admin") return <div>{t("task_update_unauthorized")}</div>;
  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <TaskForm onSubmit={onSubmit} task={task} />
    </>
  );
};

export default UpdateTaskForm;
