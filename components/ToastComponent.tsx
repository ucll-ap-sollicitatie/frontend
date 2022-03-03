import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Badge, Toast } from "react-bootstrap";

interface Props {
  message: string;
}

const ToastComponent: NextPage<Props> = ({ message }) => {
  const t = useTranslations("home");

  // To enable the fade in animation, we need to set the initial state to false.
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide>
      <Toast.Header>
        <h5 className="m-0 me-auto">
          <Badge bg="success" className="me-auto">
            {t("success")}
          </Badge>
        </h5>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastComponent;
