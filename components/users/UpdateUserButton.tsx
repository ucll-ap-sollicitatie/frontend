import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface Props {
  email: string;
}

const UpdateUserButton: NextPage<Props> = ({ email }) => {
  const t = useTranslations("users");

  return (
    <Link href={`/users/update/?email=${email}`} passHref>
      <Button variant="primary">{t("profile_edit")}</Button>
    </Link>
  );
};

export default UpdateUserButton;
