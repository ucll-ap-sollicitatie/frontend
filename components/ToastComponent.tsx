import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Badge, Toast } from "react-bootstrap";

interface Props {
  message: string;
}

const ToastComponent: NextPage<Props> = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide>
      <Toast.Header>
        <h5 className="m-0 me-auto">
          <Badge bg="success" className="me-auto">
            Success
          </Badge>
        </h5>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastComponent;
