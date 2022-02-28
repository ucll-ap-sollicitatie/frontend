import { NextPage } from "next";
import { Carousel } from "react-bootstrap";
import { Question } from "../../interfaces/Question";

interface Props {
  handleSelect: (selectedIndex: number) => void;
  questions: Question[];
}

const CarouselWithQuestions: NextPage<Props> = ({ handleSelect, questions }) => {
  return (
    <Carousel onSelect={handleSelect} interval={null} variant="dark" wrap={false}>
      {questions.map((question, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-50" src="https://via.placeholder.com/600x400/ffffff/ffffff" alt="Carousel slide" />
          <Carousel.Caption>
            <h2>Vraag {index + 1}</h2>
            <h3>{question.question}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselWithQuestions;
