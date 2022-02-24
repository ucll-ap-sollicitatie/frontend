import type { NextPage } from "next";
import { Button } from "react-bootstrap";

interface Props {
  handleDelete: () => void;
}

const ConfirmRemoveButton: NextPage<Props> = ({ handleDelete }) => {
  return (
    <Button variant="outline-danger" onClick={handleDelete}>
      Verwijderen
    </Button>
  );
};

export default ConfirmRemoveButton;
