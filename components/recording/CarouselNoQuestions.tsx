import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Carousel, Image } from "react-bootstrap";

const CarouselNoQuestions: NextPage = () => {
  const t = useTranslations("recording");

  return (
    <Carousel interval={null} variant="dark" wrap={false}>
      <Carousel.Item>
        <Image className="w-50" src="https://via.placeholder.com/600x400/ffffff/ffffff" alt="Carousel slide" />
        <Carousel.Caption>
          <h3>{t("carousel_no_questions")}</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselNoQuestions;
