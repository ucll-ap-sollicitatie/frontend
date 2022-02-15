import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout/Layout";

const QUIZZES = [
  {
    id: 1,
    name: "General",
    questions: ["What is your name?", "What is your favorite color?"],
  },
  {
    id: 2,
    name: "Food",
    questions: ["What is your favorite food?", "What is your favorite drink?"],
  },
  {
    id: 3,
    name: "Movies",
    questions: ["What is your favorite movie?", "What is your favorite TV show?"],
  },
];

const Quizzes: NextPage = () => {
  return (
    <Layout>
      <h1>Quizzes</h1>

      <p>Kies een quiz</p>
      <ul>
        {QUIZZES.map((quiz) => (
          <li key={quiz.name}>
            <Link href="/quiz/[quiz-name]" as={`/quiz/${quiz.name}`}>
              <a>{quiz.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/quiz/test">
        <a>Test</a>
      </Link>
    </Layout>
  );
};

export default Quizzes;
