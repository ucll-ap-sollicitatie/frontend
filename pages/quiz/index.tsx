import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:3001/questions/categories`);
  const categories = await res.json();

  return {
    props: { categories: categories },
  };
};

interface Props {
  categories: QuestionCategory[];
}

const Quizzes: NextPage<Props> = ({ categories }) => {
  return (
    <Layout>
      <h1>Quizzes</h1>

      <p>Kies een quiz</p>
      <ul>
        {categories.map((category) => (
          <li key={category.category}>
            <Link href={`/quiz/${category.question_category_id}`}>
              <a>{category.category}</a>
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
