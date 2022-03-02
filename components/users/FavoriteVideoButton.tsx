import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  email: string;
}

const FavoriteVideoButton: NextPage<Props> = ({ email }) => {
  const t = useTranslations("users");

  return (
    <Link href={`/profile/favorites`} passHref>
      <Button className="mt-2" variant="primary">
        {t("profile_favorites")}
      </Button>
    </Link>
  );
};

export default FavoriteVideoButton;
