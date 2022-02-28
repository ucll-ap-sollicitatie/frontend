import type { NextPage } from "next";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SpinnerComponent from "../SpinnerComponent";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";
import Task from "../../interfaces/Task";
import TasksReactTable from "../TasksReactTable";
import { useSession } from "next-auth/react";

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

const TasksTable: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [id, setId] = useState<number | string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/tasks");

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      const myTasks = data.filter((task: Task) => task.teacher_email === session?.user?.email);
      myTasks.forEach((task: Task) => (task.deadline_string = new Date(task.deadline).toLocaleString()));
      setTasks(myTasks);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
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

    fetchData();
  };

  if (error) return <div>Geen taken gevonden.</div>;
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
