import type { NextPage } from "next";
import { Spinner } from "react-bootstrap";

const SpinnerComponent: NextPage = () => {
  return <Spinner animation="border" variant="primary" />;
};

export default SpinnerComponent;
