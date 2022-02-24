import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";

const AddInterviewButton: NextPage = () => {
  return (
    <>
      <Link href={"/interviews/add"} passHref>
        <Button variant="primary">Sollicitatie aanmaken</Button>
      </Link>
    </>
  );
};

export default AddInterviewButton;
