import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Carousel, Image } from "react-bootstrap";
import { isDarkMode } from "../../helpers/helperFunctions";
import Question from "../../interfaces/Question";

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
          {isDarkMode() ? (
            <Image className="d-block w-100" src="https://via.placeholder.com/800x200/222222/222222" alt="Carousel slide" />
          ) : (
            <Image className="d-block w-100" src="https://via.placeholder.com/800x200/ffffff/ffffff" alt="Carousel slide" />
          )}
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
