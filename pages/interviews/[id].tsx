import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb, Carousel } from "react-bootstrap";
import UpdateInterviewButton from "../../components/interviews/UpdateInterviewButton";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const categories = await data.json();

  const paths = categories.map((category: QuestionCategory) => {
    return {
      params: { id: category.question_category_id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined || params.id === undefined) {
    return { props: { questions: [], category: null } };
  }

  const category_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/${params.id}`);
  const category = await category_res.json();

  const questions_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/category/${params.id}`);
  if (questions_res.status !== 200) {
    return { props: { questions: [], category: category } };
  }
  const questions = await questions_res.json();

  return {
    props: {
      questions: questions,
      category: category,
    },
  };
};

interface Props {
  questions: Question[];
  category: QuestionCategory;
}

const Interviews: NextPage<Props> = ({ questions, category }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <>
      <Layout>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/interviews">Sollicitaties</Breadcrumb.Item>
          <Breadcrumb.Item active>{category.category}</Breadcrumb.Item>
        </Breadcrumb>

        <h1>Sollicitatie: {category.category}</h1>

        <UpdateInterviewButton question_category_id={category.question_category_id} />
        <br />
        <br />

        {questions.length === 0 ? (
          <Carousel interval={null} variant="dark" wrap={false}>
            <Carousel.Item>
              <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
              <Carousel.Caption>
                <h3>Deze categorie bevat geen vragen</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        ) : (
          <Carousel interval={null} variant="dark" wrap={false}>
            {questions.map((question, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
                <Carousel.Caption>
                  <h3>Vraag {index + 1}</h3>
                  <h1>{question.question}</h1>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Layout>
    </>
  );
};

export default Interviews;
