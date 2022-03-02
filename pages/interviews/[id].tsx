import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { Breadcrumb } from "react-bootstrap";
import UpdateInterviewButton from "../../components/interviews/UpdateInterviewButton";
import Layout from "../../components/layout/Layout";
import CarouselNoQuestions from "../../components/recording/CarouselNoQuestions";
import CarouselWithQuestions from "../../components/recording/CarouselWithQuestions";
import Unauthenticated from "../../components/Unauthenticated";
import Question from "../../interfaces/Question";
import QuestionCategory from "../../interfaces/QuestionCategory";

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const categories = await data.json();

  let paths = [] as any;

  categories.map((category: QuestionCategory) => {
    paths.push(
      { params: { id: category.question_category_id.toString() }, locale: "en" },
      { params: { id: category.question_category_id.toString() }, locale: "fr" },
      { params: { id: category.question_category_id.toString() }, locale: "nl" }
    );
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
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
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

interface Props {
  questions: Question[];
  category: QuestionCategory;
}

const Interviews: NextPage<Props> = ({ questions, category }) => {
  const t = useTranslations("interviews");
  const h = useTranslations("home");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <>
      <Layout>
        <Head>
          <title>{`${h("title_short")} | ${t("interview_view")}`}</title>
        </Head>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/interviews">Sollicitaties</Breadcrumb.Item>
          <Breadcrumb.Item active>{category.category}</Breadcrumb.Item>
        </Breadcrumb>

        <h1>
          {t("title")}: {category.category}
        </h1>

        {session?.user?.role !== "Student" && <UpdateInterviewButton question_category_id={category.question_category_id} />}

        {questions.length === 0 ? <CarouselNoQuestions /> : <CarouselWithQuestions questions={questions} />}
      </Layout>
    </>
  );
};

export default Interviews;
