import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BsFillPencilFill } from "react-icons/bs";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  url: string;
}

const UpdateButton: NextPage<Props> = ({ url }) => {
  const t = useTranslations("buttons");

  return (
    <Link href={url} passHref>
      <a className="pointer d-flex align-items-center gap-1 pe-auto">
        {t("update")} <BsFillPencilFill />
      </a>
    </Link>
  );
};

export default UpdateButton;
