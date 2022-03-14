import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Carousel, Image } from "react-bootstrap";
import { isDarkMode } from "../../helpers/helperFunctions";
import Question from "../../interfaces/Question";

// import { Carousel } from "react-responsive-carousel";

interface Props {
  handleSelect?: (selectedIndex: number) => void | undefined;
  questions: Question[];
}

const CarouselWithQuestions: NextPage<Props> = ({ handleSelect, questions }) => {
  const t = useTranslations("carousel");

  return (
    // <Carousel infiniteLoop={false} interval={0} onChange={handleSelect} swipeable={false} dynamicHeight={true}>
    //   <div>
    //     <p className="legend">Legend 1</p>
    //   </div>
    //   <div>
    //     <p className="legend">Legend 2</p>
    //   </div>
    //   <div>
    //     <p className="legend">Legend 3</p>
    //   </div>
    // </Carousel>
    <Carousel onSelect={handleSelect} interval={null} variant="dark" wrap={false}>
      {questions.map((question, index) => (
        <Carousel.Item key={index} style={{ minHeight: "320px" }}>
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
