import { FC, useState, useCallback, FormEvent, useEffect } from "react";
import update from "immutability-helper";
import QuestionInput from "./QuestionInput";
import { NextPage } from "next";
import Layout from "../layout/Layout";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Unauthenticated from "../Unauthenticated";
import { useRouter } from "next/router";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import SpinnerComponent from "../SpinnerComponent";
import InterviewForm from "./InterviewForm";
import { Question } from "../../interfaces/Question";

export interface QuestionInputType {
  id: number;
}

interface Props {
  id: string;
}

const UpdateInterviewForm: NextPage<Props> = ({ id }) => {
  const [category, setCategory] = useState<QuestionCategory>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      fetch(`http://localhost:3001/question-categories/${id}`)
        .then((res) => res.json())
        .then((res) => {
          setCategory(res);
        })
        .catch((err) => {
          setError(true);
        });
    };

    const fetchQuestions = async () => {
      fetch(`http://localhost:3001/questions/category/${id}`)
        .then((res) => res.json())
        .then((res) => {
          setQuestions(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
        });
    };

    fetchCategory();
    fetchQuestions();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(JSON.stringify(event));
  };

  if (loading) return <SpinnerComponent />;
  if (error || !category) return <div>Er is een probleem opgetreden bij het laden van de sollicitatie.</div>;

  return <InterviewForm onSubmit={onSubmit} category={category} questions={questions} />;
};

export default UpdateInterviewForm;
