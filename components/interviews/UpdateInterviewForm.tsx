import { useState, FormEvent, useEffect } from "react";
import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import SpinnerComponent from "../SpinnerComponent";
import InterviewForm from "./InterviewForm";
import { Question } from "../../interfaces/Question";

interface Props {
  id: string;
}

const UpdateInterviewForm: NextPage<Props> = ({ id }) => {
  const router = useRouter();

  const [category, setCategory] = useState<QuestionCategory>();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/${id}`)
        .then((res) => res.json())
        .then((res) => {
          setCategory(res);
        })
        .catch((err) => {
          setError(err);
        });
    };

    const fetchQuestions = async () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/category/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) setQuestions(res);
          else setQuestions([]);
        });
    };

    fetchCategory();
    fetchQuestions();
    setLoading(false);
  }, [id]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    // Update category
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/${id}`, {
      body: JSON.stringify({
        category: target.category.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    // Delete all old questions
    if (questions !== null) {
      for (const question of questions) {
        question as Question;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/${question.question_id}`, {
          method: "DELETE",
        });
      }
    }

    // Add all new questions
    const elements = Array.from(target.elements) as HTMLInputElement[];
    const questions_inputs = elements.filter((element) => element.id.includes("question"));
    for (const question_input of questions_inputs) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {
        body: JSON.stringify({
          question: question_input.value,
          question_category_id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    }

    router.push(
      {
        pathname: `/interviews/${id}`,
        query: { toast: "Sollicitatie succesvol aangepast" },
      },
      `/interviews/${id}`
    );
  };

  if (loading) return <SpinnerComponent />;
  if (error) return <div>Er is een probleem opgetreden bij het laden van de sollicitatie.</div>;

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      {questions !== null && <InterviewForm onSubmit={onSubmit} category={category} questions={questions} />}
    </>
  );
};

export default UpdateInterviewForm;
