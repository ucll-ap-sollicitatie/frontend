import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import InterviewForm from "./InterviewForm";

const AddInterviewForm: NextPage = () => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    const elements = Array.from(target.elements) as HTMLInputElement[];
    const questions_inputs = elements.filter((element) => element.id.includes("question"));
    for (const question_input of questions_inputs) {
      await fetch(`http://localhost:3001/questions`, {
        body: JSON.stringify({
          question: question_input.value,
          question_category_id: question_category_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).catch((err) => {
        setError(err);
        setShow(true);
      });
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
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <InterviewForm onSubmit={onSubmit} />
    </>
  );
};

export default AddInterviewForm;
