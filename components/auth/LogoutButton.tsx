import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

const LogoutButton: NextPage = () => {
  const router = useRouter();

  const t = useTranslations("home");

  const handleLogout = () => {
    signOut({ redirect: false });

    router.push(
      {
        pathname: "/",
        query: { toast: t("logout_success") },
      },
      "/"
    );
  };

  return (
    <Button variant="outline-danger" className="ms-2" onClick={handleLogout}>
      {t("logout")}
    </Button>
  );
};

export default LogoutButton;
