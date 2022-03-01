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

const UpdatePreferencesButton: NextPage = () => {
  const t = useTranslations("users");

  return (
    <Link href={`/preferences`} passHref>
      <Button className="mt-2" variant="primary">
        {t("preferences_edit")}
      </Button>
    </Link>
  );
};

export default UpdatePreferencesButton;
