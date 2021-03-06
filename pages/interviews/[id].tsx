import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import UpdateInterviewButton from "../../components/interviews/UpdateInterviewButton";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import CarouselNoQuestions from "../../components/recording/CarouselNoQuestions";
import CarouselWithQuestions from "../../components/recording/CarouselWithQuestions";
import Unauthenticated from "../../components/Unauthenticated";
import Question from "../../interfaces/Question";
import QuestionCategory from "../../interfaces/QuestionCategory";
import User from "../../interfaces/User";

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  if (params === undefined || params.id === undefined) {
    return { props: { questions: [], category: null } };
  }

  const category_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/${params.id}`);
  const category = await category_res.json();

  if (category_res.status === 404) {
    return {
      notFound: true,
    };
  }

  const questions_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/category/${params.id}`);
  if (!questions_res.ok) {
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
  const title = t("interview_view");
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const breadcrumb_items = [{ href: "/interviews", text: t("title") }, { text: category.category }];

  return (
    <>
      <Layout>
        <PageTitleComponent title={title} />
        <BreadcrumbComponent items={breadcrumb_items} />

        <h1>
          {t("title")}: {category.category}
        </h1>

        <p>
          {t("description")}: {category.description}
        </p>

        {user.role !== "Student" && <UpdateInterviewButton question_category_id={category.question_category_id} />}
        {questions.length === 0 ? <CarouselNoQuestions /> : <CarouselWithQuestions questions={questions} />}
      </Layout>
    </>
  );
};

export default Interviews;
