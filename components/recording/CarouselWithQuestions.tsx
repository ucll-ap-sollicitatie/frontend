import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Carousel, Image } from "react-bootstrap";
import { Question } from "../../interfaces/Question";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  handleSelect?: (selectedIndex: number) => void | undefined;
  questions: Question[];
}

const CarouselWithQuestions: NextPage<Props> = ({ handleSelect, questions }) => {
  const t = useTranslations("carousel");

  return (
    <Carousel onSelect={handleSelect} interval={null} variant="dark" wrap={false}>
      {questions.map((question, index) => (
        <Carousel.Item key={index}>
          <Image className="d-block w-50" src="https://via.placeholder.com/600x400/ffffff/ffffff" alt="Carousel slide" />
          <Carousel.Caption>
            <h2>
              {t("carousel_question")} {index + 1}
            </h2>
            <h3>{question.question}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

CarouselWithQuestions.defaultProps = {
  handleSelect: undefined,
};

export default CarouselWithQuestions;
