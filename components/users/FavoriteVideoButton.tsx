import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface Props {
  email: string;
}

const FavoriteVideoButton: NextPage<Props> = ({ email }) => {
  const t = useTranslations("users");

  return (
    <Link href={`/profile/favorites`} passHref>
      <Button variant="primary">{t("profile_favorites")}</Button>
    </Link>
  );
};

export default FavoriteVideoButton;
