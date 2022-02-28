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

interface Props {
  allTasks: Task[];
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
];

const TasksTable: NextPage<Props> = ({ allTasks }) => {
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
        query: { toast: "Taak verwijderd" },
      },
      "/dashboard"
    );
  };

  if (tasks.length < 1) return <p>U heeft geen taken</p>;
  if (loading) return <SpinnerComponent />;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Taak verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bent u zeker dat u taak <span className="font-italic">{id}</span> wilt verwijderen?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <TasksReactTable columns={columns} data={tasks} url={"/tasks"} id="task_id" handleShow={handleShow} />
    </>
  );
};

export default TasksTable;
