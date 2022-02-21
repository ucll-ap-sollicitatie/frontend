import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddInterviewButton from "../../components/interviews/AddInterviewButton";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
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
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (categories === undefined || categories.length === 0) {
    return (
      <Layout>
        <h1>Sollicitaties</h1>

        <p>Er zijn geen sollicitatie categorieën beschikbaar.</p>
        <AddInterviewButton />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Sollicitaties</h1>

      <AddInterviewButton />
      <br />
      <br />

      <p>Kies een sollicitatie categorie:</p>
      <ul>
        {categories.map((category) => (
          <li key={category.question_category_id}>
            <Link href={`/interviews/${category.question_category_id}`} passHref>
              <a>{category.category}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Interviews;
