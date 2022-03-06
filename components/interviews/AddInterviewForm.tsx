import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import InterviewForm from "./InterviewForm";

const AddInterviewForm: NextPage = () => {
  const t = useTranslations("interviews");
  const e = useTranslations("errors");

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    // Category
    const category_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`, {
      body: JSON.stringify({
        category: target.category.value.trim(),
        description: target.description.value.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!category_res.ok) {
      setError(t("interview_error_exists"));
      setShow(true);
      return;
    }

    // Questions
    const category_id_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/category/${target.category.value}`);
    const { question_category_id, _ } = await category_id_res.json();

    const elements = Array.from(target.elements) as HTMLInputElement[];
    const questions_inputs = elements.filter((element) => element.id.includes("question"));
    for (const question_input of questions_inputs) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {
        body: JSON.stringify({
          question: question_input.value.trim(),
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
        query: { toast: t("interview_add_success") },
      },
      "/interviews"
    );
  };

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <InterviewForm onSubmit={onSubmit} />
    </>
  );
};

export default AddInterviewForm;
