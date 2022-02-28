import type { GetStaticProps, NextPage } from "next";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SpinnerComponent from "../SpinnerComponent";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";
import Task from "../../interfaces/Task";
import TasksReactTable from "../TasksReactTable";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  allTasks: Task[];
}

const TasksTable: NextPage<Props> = ({ allTasks }) => {
  const t = useTranslations("tasks");
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
  ];

  const { data: session } = useSession();
  const router = useRouter();
  const [id, setId] = useState<number | string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  useEffect(() => {
    setLoading(true);
    const myTasks = allTasks.filter((task: Task) => task.teacher_email === session?.user?.email);
    myTasks.forEach((task: Task) => (task.deadline_string = new Date(task.deadline).toLocaleString()));
    setTasks(myTasks);
    setLoading(false);
  }, [allTasks, session?.user?.email]);

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    handleClose();
    router.push(
      {
        pathname: "/dashboard",
        query: { toast: t("task_remove_success") },
      },
      "/dashboard"
    );
  };

  const { locale } = router;

  if (tasks.length < 1) return <p>{t("no_tasks")}</p>;
  if (loading) return <SpinnerComponent />;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("task_remove")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("task_remove_confirm")}</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <TasksReactTable columns={columns} data={tasks} url={`/tasks`} id="task_id" handleShow={handleShow} />
    </>
  );
};

export default TasksTable;
