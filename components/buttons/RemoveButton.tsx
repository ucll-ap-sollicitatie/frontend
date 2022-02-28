import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { BsFillTrashFill } from "react-icons/bs";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  handleShow: (id: string | number) => void;
  id: string | number;
}

const RemoveButton: NextPage<Props> = ({ handleShow, id }) => {
  const t = useTranslations("buttons");

  return (
    <a onClick={() => handleShow(id)} className="pointer d-flex align-items-center gap-1 pe-auto">
      {t("remove")} <BsFillTrashFill />
    </a>
  );
};

export default RemoveButton;
