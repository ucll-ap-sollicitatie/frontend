import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";

const InterviewsAdd: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([""]);

  const addInterview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const questions = Array.from(target.elements) as HTMLInputElement[];

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

    for (let i = 1; i < questions.length; i++) {
      const questions_res = await fetch("http://localhost:3001/questions", {
        body: JSON.stringify({
          question_category_id: question_category_id,
          question: questions[i].value,
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

          {[questions].map((question, index) => (
            <Form.Group key={index} controlId={`question${index}`}>
              <Form.Label>Vraag {index + 1}</Form.Label>
              <Form.Control type="text" placeholder="Vraag" value={question} required />
            </Form.Group>
          ))}
        </Stack>

        <Button variant="link" size="sm" onClick={() => setQuestions([...questions, ""])} className="d-block p-0">
          Voeg vraag toe
        </Button>

        <Button variant="primary" type="submit" className="mt-4">
          Maak interview aan
        </Button>
      </Form>
    </Layout>
  );
};

export default InterviewsAdd;
