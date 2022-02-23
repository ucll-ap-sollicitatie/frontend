import { FC, useState, useCallback, FormEvent } from "react";
import update from "immutability-helper";
import QuestionInput from "../../components/interviews/QuestionInput";
import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { Alert, Breadcrumb, Button, Form, Stack } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";

export interface QuestionInputType {
  id: number;
}

const AddInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [questionInputs, setQuestionInputs] = useState<QuestionInputType[]>([{ id: 1 }]);

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

  const addInterview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const inputs = Array.from(target.elements) as HTMLInputElement[];

    // Category
    const category_res = await fetch("http://localhost:3001/question-categories", {
      body: JSON.stringify({
        category: target.category.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (category_res.status === 400) {
      const res = await category_res.json();
      setError(res.messages);
      setShow(true);
      return;
    }

    // Questions
    const category_id_res = await fetch(`http://localhost:3001/question-categories/category/${target.category.value}`);
    const { question_category_id, _ } = await category_id_res.json();

    for (let i = 1; i <= questionInputs.length; i++) {
      const questions_res = await fetch("http://localhost:3001/questions", {
        body: JSON.stringify({
          question_category_id: question_category_id,
          question: inputs[i].value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (questions_res.status === 400) {
        const res = await questions_res.json();
        setError(res.messages);
        setShow(true);
        return;
      }
    }

    // Redirect
    router.push(
      {
        pathname: "/interviews",
        query: { toast: "Sollicitatie werd succesvol aangemaakt" },
      },
      "/interviews"
    );
  };

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/interviews">Sollicitaties</Breadcrumb.Item>
        <Breadcrumb.Item active>Toevoegen</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Sollicatie aanmaken</h1>

      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <Form onSubmit={addInterview} id="addInterviewForm">
        <Stack className="mb-2" gap={3}>
          <Form.Group controlId="category">
            <Form.Label>Categorie</Form.Label>
            <Form.Control type="text" placeholder="Categorie" required />
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
          Maak interview aan
        </Button>
      </Form>
    </Layout>
  );
};

export default AddInterview;
