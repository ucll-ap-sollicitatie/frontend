import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button, DropdownButton, Dropdown, Stack } from "react-bootstrap";
import QuestionCategory from "../../interfaces/QuestionCategory";

interface Props {
  handleRandomClick: () => void;
  categories: QuestionCategory[];
  handleCategoryClick: (category: QuestionCategory) => void;
}

const ChoosingQuestions: NextPage<Props> = ({ handleRandomClick, categories, handleCategoryClick }) => {
  const t = useTranslations("recording");

  return (
    <>
      <p className="mt-5">{t("choosing_category_description")}</p>
      <p>{t("choosing_category")}</p>

      <Stack direction="horizontal" gap={3} className="mt-4 p-2 border rounded flex-wrap">
        <span className="ms-1">
          {t("warmup")}
          <br />
          {t("change_preferences")}
        </span>
        <Button variant="outline-success" onClick={handleRandomClick} className="ms-auto me-1">
          {t("random_questions")}
        </Button>
      </Stack>

      <Stack direction="horizontal" gap={3} className="mt-4 p-2 border rounded flex-wrap">
        <span className="ms-1">
          {t("record_interview")}
          <br />
          {t("record_interview_questions")}
        </span>
        <DropdownButton variant="outline-primary" title={t("choose_category_button")} className="ms-auto me-1">
          {categories.map((category: QuestionCategory, index) => (
            <Dropdown.Item key={index} onClick={() => handleCategoryClick(category)}>
              {category.category}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Stack>
    </>
  );
};

export default ChoosingQuestions;
