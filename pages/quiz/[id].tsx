import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Carousel } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/questions/categories");
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
  const res = await fetch(`http://localhost:3001/questions-by-category/${params.id}`);
  const questions = await res.json();

  return {
    props: { questions: questions },
  };
};

interface Props {
  questions: Question[];
}

const Quiz: NextPage<Props> = ({ questions }) => {
  return (
    <>
      <Layout>
        <h1>Quiz</h1>

        <Carousel interval={null} variant="dark" wrap={false}>
          {questions.map((question, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
              <Carousel.Caption>
                <h3>Vraag {index + 1}</h3>
                <h1>{question.qestion}</h1>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Layout>
    </>
  );
};

export default Quiz;
