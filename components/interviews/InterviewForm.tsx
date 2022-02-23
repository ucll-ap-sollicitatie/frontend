import type { NextPage } from "next";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import { QuestionInputType } from "../../interfaces/QuestionInputType";
import QuestionInput from "./QuestionInput";
import update from "immutability-helper";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  category: QuestionCategory | undefined;
  questions: Question[] | [];
}

const InterviewForm: NextPage<Props> = ({ onSubmit, category, questions }) => {
  const [questionInputs, setQuestionInputs] = useState<QuestionInputType[]>([{ id: 1 }]);

  const getLastQuestionInputId = () => {
    if (questionInputs.length === 0) return 0;

    return Math.max.apply(
      Math,
      questionInputs.map((questionInput: QuestionInputType) => questionInput.id)
    );
  };

  function addQuestionInput() {
    setQuestionInputs([...questionInputs, { id: getLastQuestionInputId() + 1 }]);
  }

  for (let i = 0; i < questions.length; i++) {
    addQuestionInput();
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

  const deleteQuestionInput = (id: number) => {
    setQuestionInputs((prevQuestionInputs: QuestionInputType[]) =>
      prevQuestionInputs.filter((questionInput: QuestionInputType) => questionInput.id !== id)
    );
  };

  return (
    <Form onSubmit={onSubmit} id="addInterviewForm">
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
            moveQuestionInput={moveQuestionInput}
            deleteQuestionInput={deleteQuestionInput}
          />
        ))}
      </Stack>

      <Button variant="link" size="sm" onClick={addQuestionInput} className="d-block p-0">
        Voeg vraag toe
      </Button>

      <Button variant="primary" type="submit" className="mt-4">
        Sollicitatie aanmaken
      </Button>
    </Form>
  );
};

export default InterviewForm;

InterviewForm.defaultProps = {
  questions: [],
};
