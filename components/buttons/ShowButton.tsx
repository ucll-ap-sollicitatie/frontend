import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

interface Props {
  url: string;
}

const ShowButton: NextPage<Props> = ({ url }) => {
  const t = useTranslations("buttons");

  return (
    <Link href={url} passHref>
      <a className="d-flex align-items-center gap-1">
        {t("view")} <BsFillArrowUpRightCircleFill />
      </a>
    </Link>
  );
};

export default ShowButton;
