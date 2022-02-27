import type { NextPage } from "next";
import { BsFillPencilFill } from "react-icons/bs";

interface Props {
  url: string;
}

const UpdateButton: NextPage<Props> = ({ url }) => {
  return (
    <a href={url} className="pointer d-flex align-items-center gap-1 pe-auto">
      Aanpassen <BsFillPencilFill />
    </a>
  );
};

export default UpdateButton;
