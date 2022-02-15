import type { NextPage } from "next";
import React from "react";
import { Button } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const QUIZ = {
  id: 1,
  name: "Test",
  questions: [
    "What is your name?",
    "What is your favorite color?",
    "What is your favorite food?",
    "What is your favorite drink?",
    "What is your favorite movie?",
  ],
};

const Test: NextPage = () => {
  const [questionIndex, setQuestionIndex] = React.useState(0);

  function incrementQuestionIndex(n: -1 | 1): void {
    if (questionIndex + n < 0 || questionIndex + n >= QUIZ.questions.length) {
      return;
    }

    setQuestionIndex(questionIndex + n);
  }

  return (
    <Layout>
      <h1>Quiz: {QUIZ.name}</h1>
      <br />
      <br />

      <div className="d-flex align-items-center flex-column">
        <h3 className="mb-5">
          {questionIndex + 1}: {QUIZ.questions[questionIndex]}
        </h3>

        <div className="d-flex gap-2">
          <Button onClick={() => incrementQuestionIndex(-1)} disabled={questionIndex <= 0} variant="primary">
            Vorige vraag
          </Button>
          <Button onClick={() => incrementQuestionIndex(1)} disabled={questionIndex >= QUIZ.questions.length - 1} variant="primary">
            Volgende vraag
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Test;
