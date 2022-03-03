import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

const LogoutButton: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Button variant="outline-danger" className="ms-2" onClick={() => signOut({ callbackUrl: `/?toast=Successvol uitgelogd` })}>
      {t("logout")}
    </Button>
  );
};

export default LogoutButton;
