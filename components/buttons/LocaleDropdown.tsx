import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Dropdown, DropdownButton } from "react-bootstrap";

const LocaleDropdown: NextPage = () => {
  const t = useTranslations("home");

  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(`${router.pathname}`, `${router.pathname}`, { locale: lang });
  };

  return (
    <DropdownButton variant="outline-secondary" title={t("language")}>
      <Dropdown.Item onClick={() => changeLanguage("nl")}>Nederlands</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("fr")}>Français</Dropdown.Item>
    </DropdownButton>
  );
};

export default LocaleDropdown;
