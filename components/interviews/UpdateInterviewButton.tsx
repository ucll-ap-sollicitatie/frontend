import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface Props {
  question_category_id: number | string;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterviewButton: NextPage<Props> = ({ question_category_id }) => {
  const t = useTranslations("interviews");

  return (
    <Link href={`/interviews/update/?id=${question_category_id}`} passHref>
      <Button variant="primary">{t("interview_update")}</Button>
    </Link>
  );
};

export default UpdateInterviewButton;
