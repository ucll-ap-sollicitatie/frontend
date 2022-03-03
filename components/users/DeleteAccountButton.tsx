import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";
import Link from "next/link";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const DeleteAccountButton: NextPage = () => {
  const t = useTranslations("users");

  return (
    <Link href={`/profile/delete`} passHref>
      <Button className="mt-2" variant="outline-danger">
        {t("account_delete_title")}
      </Button>
    </Link>
  );
};

export default DeleteAccountButton;
