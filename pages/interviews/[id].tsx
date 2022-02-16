import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Carousel } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/question-categories");
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

  const questions_res = await fetch(`http://localhost:3001/questions-by-category/${params.id}`);
  const questions = await questions_res.json();

  const category_res = await fetch(`http://localhost:3001/question-categories/${params.id}`);
  const category = await category_res.json();

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
  if (questions.length === 0) {
    return (
      <>
        <Layout>
          <h1>Interview: {category.category}</h1>

          <Carousel interval={null} variant="dark" wrap={false}>
            <Carousel.Item>
              <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
              <Carousel.Caption>
                <h3>Deze categorie bevat geen vragen</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <h1>Interview: {category.category}</h1>

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
      </Layout>
    </>
  );
};

export default Interviews;
