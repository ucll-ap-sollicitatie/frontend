import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Carousel, Image } from "react-bootstrap";
import { isDarkMode } from "../../helpers/helperFunctions";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const CarouselNoQuestions: NextPage = () => {
  const t = useTranslations("carousel");

  return (
    <Carousel interval={null} variant="dark" wrap={false}>
      <Carousel.Item>
        {isDarkMode() ? (
          <Image className="d-block w-100" src="https://via.placeholder.com/800x200/222222/222222" alt="Carousel slide" />
        ) : (
          <Image className="d-block w-100" src="https://via.placeholder.com/800x200/ffffff/ffffff" alt="Carousel slide" />
        )}
        <Carousel.Caption>
          <h3>{t("carousel_no_questions")}</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselNoQuestions;
