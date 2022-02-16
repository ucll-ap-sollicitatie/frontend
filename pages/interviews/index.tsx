import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`http://localhost:3001/question-categories`);
  const categories = await res.json();

  return {
    props: { categories: categories },
  };
};

interface Props {
  categories: QuestionCategory[];
}

const Interviews: NextPage<Props> = ({ categories }) => {
  return (
    <Layout>
      <h1>Interviews</h1>

      <p>Kies een interview</p>
      <ul>
        {categories.map((category) => (
          <li key={category.category}>
            <Link href={`/interviews/${category.question_category_id}`}>
              <a>{category.category}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Interviews;
