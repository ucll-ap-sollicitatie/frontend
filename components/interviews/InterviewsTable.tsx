import type { NextPage } from "next";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import ReactTable from "../ReactTable";

const columns = [
  {
    Header: "Categorie",
    accessor: "category",
  },
  {
    Header: "Aantal vragen",
    accessor: "amount_of_questions",
  },
];

const InterviewsTable: NextPage = () => {
  const [question_categories, setQuestion_categories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/question-categories");

      if (res.status !== 200) {
        setError(true);
      } else {
        const data = await res.json();
        setQuestion_categories(data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const [id, setId] = useState<number | string>(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3001/question-categories/${id}`, {
      method: "DELETE",
    });

    handleClose();
    router.push(
      {
        pathname: "/interviews",
        query: { toast: "Sollicitatie verwijderd" },
      },
      "/interviews"
    );
  };

  if (error) return <div>Er is een probleem opgetreden bij het laden van de sollicitaties.</div>;
  if (loading) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (question_categories.length === 0) return <div>Geen sollicitaties gevonden.</div>;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sollicitatie verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bent u zeker dat u deze sollicitatie wilt verwijderen?</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleClose}>
            Sluiten
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Verwijderen
          </Button>
        </Modal.Footer>
      </Modal>

      <ReactTable columns={columns} data={question_categories} url={"/interviews"} id="question_category_id" handleShow={handleShow} />
    </>
  );
};

export default InterviewsTable;
