import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface Props {
  question_category_id: number | string;
}

const UpdateInterviewButton: NextPage<Props> = ({ question_category_id }) => {
  return (
    <Link href={`/interviews/update/?id=${question_category_id}`} passHref>
      <Button variant="primary">Sollicitatie aanpassen</Button>
    </Link>
  );
};

export default UpdateInterviewButton;
