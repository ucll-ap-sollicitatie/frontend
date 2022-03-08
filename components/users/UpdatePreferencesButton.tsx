import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

const UpdatePreferencesButton: NextPage = () => {
  const t = useTranslations("users");

  return (
    <Link href={`/preferences`} passHref>
      <Button variant="primary">{t("preferences_edit")}</Button>
    </Link>
  );
};

export default UpdatePreferencesButton;
