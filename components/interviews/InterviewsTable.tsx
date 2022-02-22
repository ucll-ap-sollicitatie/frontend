import type { NextPage } from "next";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { useRequest } from "../../helpers/useRequest";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import RemoveButton from "../buttons/RemoveButton";
import ShowButton from "../buttons/ShowButton";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

const InterviewsTable: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

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
    mutate("http://localhost:3001/question-categories");
    router.push(
      {
        pathname: "/interviews",
        query: { toast: "Sollicitatie verwijderd" },
      },
      "/interviews"
    );
  };

  const { data: question_categories, error } = useRequest("question-categories");

  if (error) return <div>Er is een probleem opgetreden bij het laden van de sollicitaties.</div>;
  if (!question_categories) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Categorie</th>
            <th>Aantal vragen</th>
            <th>Bekijken</th>
            <th>Verwijderen</th>
          </tr>
        </thead>
        <tbody>
          {question_categories.map((question_category: QuestionCategory) => (
            <tr key={question_category.question_category_id}>
              <td>{question_category.category}</td>
              <td>{question_category.amount_of_questions}</td>
              <td>
                <ShowButton url={`/interviews/${question_category.question_category_id}`} />
              </td>
              <td>
                <RemoveButton handleShow={handleShow} id={question_category.question_category_id} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default InterviewsTable;
