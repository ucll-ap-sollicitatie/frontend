import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

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
