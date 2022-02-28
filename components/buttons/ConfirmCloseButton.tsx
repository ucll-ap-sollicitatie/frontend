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
  handleClose: () => void;
}

const ConfirmCloseButton: NextPage<Props> = ({ handleClose }) => {
  const t = useTranslations("buttons");

  return (
    <Button variant="primary" onClick={handleClose}>
      {t("close")}
    </Button>
  );
};

export default ConfirmCloseButton;
