import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const LoginButton: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Button variant="primary" onClick={() => signIn(undefined, { callbackUrl: `/?toast=Successvol ingelogd` })}>
      {t("login")}
    </Button>
  );
};

export default LoginButton;
