import { NextPage } from "next";
import { Button, DropdownButton, Dropdown, Stack } from "react-bootstrap";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

interface Props {
  handleRandomClick: () => void;
  categories: QuestionCategory[];
  handleCategoryClick: (category: QuestionCategory) => void;
}

const ChoosingQuestions: NextPage<Props> = ({ handleRandomClick, categories, handleCategoryClick }) => {
  return (
    <>
      <p className="mt-5">
        Wanneer je op de knop drukt, zal jouw browser toegang vragen tot jouw camera en wordt het aangezet. <br />
        Op jouw signaal begint de opname. Geen nood, je kan steeds jouw opname annuleren of stoppen wanneer je wilt.
      </p>
      <p>Vooraleer je kan beginnen, moet je een categorie van vragen kiezen.</p>
      <Stack direction="horizontal" gap={3} className="mt-5 bg-light border rounded">
        <p className="ms-1">
          Je kan opwarmen door jezelf uit te dagen om willekeurige vragen uit jou geprefereerde categorieën proberen te beantwoorden!
          <br />
          Je kan altijd jouw preferenties veranderen in jouw profiel.
        </p>
        <Button variant="outline-success" onClick={handleRandomClick} className="ms-auto me-1">
          Willekeurige vragen uit mijn preferenties
        </Button>
      </Stack>
      <Stack direction="horizontal" gap={3} className="mt-5 bg-light border rounded">
        <p className="ms-1">
          Ga voor het echte ding en beantwoord vragen enkel uit een thema die jij zelf kiest!
          <br />
          Je krijgt steeds 5 willekeurige vragen uit de gekozen categorie die je moet beantwoorden.
        </p>
        <DropdownButton variant="outline-primary" title="Categorie van vragen kiezen" className="ms-auto me-1">
          {categories.map((category: QuestionCategory) => (
            <Dropdown.Item onClick={() => handleCategoryClick(category)} key={category.question_category_id}>
              {category.category}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Stack>
    </>
  );
};

export default ChoosingQuestions;
