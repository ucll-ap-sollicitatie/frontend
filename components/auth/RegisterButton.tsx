import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

const RegisterButton: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Link href="/auth/register" passHref>
      <Button variant="primary">{t("register_new_account")}</Button>
    </Link>
  );
};

export default RegisterButton;
