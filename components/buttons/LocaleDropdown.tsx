import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { setLocale } from "../../helpers/helperFunctions";

const LocaleDropdown: NextPage = () => {
  const t = useTranslations("home");

  const router = useRouter();

  const changeLanguage = (lang: string) => {
    setLocale(lang);
    router.push(`${router.asPath}`, `${router.asPath}`, { locale: lang });
  };

  return (
    <DropdownButton variant="outline-secondary" title={t("language")}>
      <Dropdown.Item onClick={() => changeLanguage("nl")}>Nederlands</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("fr")}>Français</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("pl")}>Polski</Dropdown.Item>
    </DropdownButton>
  );
};

export default LocaleDropdown;
