import type { NextPage } from "next";
import { Button } from "react-bootstrap";

interface Props {
  handleClose: () => void;
}

const ConfirmCloseButton: NextPage<Props> = ({ handleClose }) => {
  return (
    <Button variant="primary" onClick={handleClose}>
      Sluiten
    </Button>
  );
};

export default ConfirmCloseButton;
