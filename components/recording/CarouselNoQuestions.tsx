import { NextPage } from "next";
import { Carousel } from "react-bootstrap";

const CarouselNoQuestions: NextPage = () => {
  return (
    <Carousel interval={null} variant="dark" wrap={false}>
      <Carousel.Item>
        <img className="w-50" src="https://via.placeholder.com/600x400/ffffff/ffffff" alt="Carousel slide" />
        <Carousel.Caption>
          <h3>Deze categorie bevat geen vragen</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselNoQuestions;
