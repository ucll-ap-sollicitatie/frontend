import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

const LoginButton: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Link href="/auth/login">
      <Button variant="primary">{t("login")}</Button>
    </Link>
  );
};

export default LoginButton;
