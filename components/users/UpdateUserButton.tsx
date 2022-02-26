import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface Props {
  email: string;
}

const UpdateUserutton: NextPage<Props> = ({ email }) => {
  return (
    <Link href={`/users/update/?email=${email}`} passHref>
      <Button variant="primary">Profiel aanpassen</Button>
    </Link>
  );
};

export default UpdateUserutton;
