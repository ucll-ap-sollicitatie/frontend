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

const AddInterviewButton: NextPage = () => {
  const t = useTranslations("interviews");

  return (
    <>
      <Link href={"/interviews/add"} passHref>
        <Button variant="primary">{t("interview_add")}</Button>
      </Link>
      <br />
      <br />
    </>
  );
};

export default AddInterviewButton;
