import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

const LogoutButton: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Button variant="primary" onClick={() => signOut({ callbackUrl: `/?toast=Successvol uitgelogd` })}>
      {t("logout")}
    </Button>
  );
};

export default LogoutButton;
