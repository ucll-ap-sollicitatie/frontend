import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Form } from "react-bootstrap";
import { isDarkMode, toggleDarkMode } from "../../helpers/helperFunctions";

const DarkModeToggle: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Form>
      <Form.Check onChange={() => toggleDarkMode()} defaultChecked={isDarkMode() ? true : false} type="switch" id="custom-switch" label={t("dark_mode")} />
    </Form>
  );
};

export default DarkModeToggle;
