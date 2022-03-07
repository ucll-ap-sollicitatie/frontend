import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

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
