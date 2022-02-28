import type { NextPage } from "next";
import { FormEvent, useCallback, useState } from "react";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import { QuestionInputType } from "../../interfaces/QuestionInputType";
import QuestionInput from "./QuestionInput";
import update from "immutability-helper";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  category?: QuestionCategory | undefined;
  questions?: Question[] | [] | undefined;
}

const InterviewForm: NextPage<Props> = ({ onSubmit, category, questions }) => {
  const t = useTranslations("interviews");
  const e = useTranslations("errors");

  const [id, setId] = useState<number | string>("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [showError, setShowError] = useState(false);

  const [questionInputs, setQuestionInputs] = useState<QuestionInputType[]>(() => {
    if (questions === undefined || questions.length === 0) return [{ id: -1, question: "" }];

    let res: { id: number; question: string }[] = [];
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
    if (questionInputs.length > 1) {
      setId(id);
      setShow(true);
    } else {
      setShowError(true);
    }
  };

  const handleDelete = () => {
    if (questionInputs.length > 1) {
      setQuestionInputs((prevQuestionInputs: QuestionInputType[]) => prevQuestionInputs.filter((questionInput: QuestionInputType) => questionInput.id !== id));
    }

    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("question_remove")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("question_remove_confirm")}</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <Alert variant="danger" onClose={() => setShowError(false)} show={showError} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{t("minimum_one_question")}</span>
      </Alert>

      <Form onSubmit={onSubmit} style={{ maxWidth: "48rem" }}>
        <Stack className="mb-2" gap={3}>
          <Form.Group controlId="category">
            <Form.Label>{t("category")}</Form.Label>
            <Form.Control type="text" placeholder={t("category")} defaultValue={category !== undefined ? category.category : ""} required />
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
          {t("question_add")}
        </Button>

        <Button variant="primary" type="submit" className="mt-4">
          {category !== undefined ? t("interview_update") : t("interview_add")}
        </Button>
      </Form>
    </>
  );
};

export default InterviewForm;
