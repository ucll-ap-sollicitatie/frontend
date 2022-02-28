import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  handleDelete: () => void;
}

const ConfirmRemoveButton: NextPage<Props> = ({ handleDelete }) => {
  const t = useTranslations("buttons");

  return (
    <Button variant="outline-danger" onClick={handleDelete}>
      {t("remove")}
    </Button>
  );
};

export default ConfirmRemoveButton;
