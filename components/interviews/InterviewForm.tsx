import type { NextPage } from "next";
import { FormEvent, useCallback, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import { QuestionInputType } from "../../interfaces/QuestionInputType";
import QuestionInput from "./QuestionInput";
import update from "immutability-helper";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  category?: QuestionCategory | undefined;
  questions?: Question[] | [] | undefined;
}

const InterviewForm: NextPage<Props> = ({ onSubmit, category, questions }) => {
  const [id, setId] = useState<number | string>("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [questionInputs, setQuestionInputs] = useState<QuestionInputType[]>(() => {
    if (questions === undefined) return [{ id: -1, question: "" }];

    let res = [];
    for (let i = 0; i < questions.length; i++) {
      res.push({ id: i, question: questions[i].question });
    }
    return res;
  });

  const getLastQuestionInputId = () => {
    if (questionInputs.length === 0) return 0;

    return Math.max.apply(
      Math,
      questionInputs.map((questionInput: QuestionInputType) => questionInput.id)
    );
  };

  function addQuestionInput() {
    setQuestionInputs([...questionInputs, { id: getLastQuestionInputId() + 1, question: "" }]);
  }

  const moveQuestionInput = useCallback((dragIndex: number, hoverIndex: number) => {
    setQuestionInputs((prevQuestionInputs: QuestionInputType[]) =>
      update(prevQuestionInputs, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevQuestionInputs[dragIndex] as QuestionInputType],
        ],
      })
    );
  }, []);

  const showDeleteQuestionInputModal = (id: number) => {
    setId(id);
    setShow(true);
  };

  const handleDelete = () => {
    setQuestionInputs((prevQuestionInputs: QuestionInputType[]) =>
      prevQuestionInputs.filter((questionInput: QuestionInputType) => questionInput.id !== id)
    );

    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vraag verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bent u zeker dat deze vraag wilt verwijderen?</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <Form onSubmit={onSubmit} style={{ maxWidth: "48rem" }}>
        <Stack className="mb-2" gap={3}>
          <Form.Group controlId="category">
            <Form.Label>Categorie</Form.Label>
            <Form.Control type="text" placeholder="Categorie" defaultValue={category !== undefined ? category.category : ""} required />
          </Form.Group>

          {questionInputs.map((questionInput: QuestionInputType, index) => (
            <QuestionInput
              key={questionInput.id}
              id={questionInput.id}
              index={index}
              question={questionInput.question}
              moveQuestionInput={moveQuestionInput}
              showDeleteQuestionInputModal={showDeleteQuestionInputModal}
            />
          ))}
        </Stack>

        <Button variant="link" size="sm" onClick={addQuestionInput} className="d-block p-0">
          Voeg vraag toe
        </Button>

        <Button variant="primary" type="submit" className="mt-4">
          {category !== undefined ? "Sollicitatie aanpassen" : "Sollicitatie aanmaken"}
        </Button>
      </Form>
    </>
  );
};

export default InterviewForm;
