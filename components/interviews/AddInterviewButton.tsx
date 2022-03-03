import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "react-bootstrap";

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
