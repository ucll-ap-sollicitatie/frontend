import type { NextPage } from "next";
import { BsFillTrashFill } from "react-icons/bs";

interface Props {
  handleShow: (id: string | number) => void;
  id: string | number;
}

const RemoveButton: NextPage<Props> = ({ handleShow, id }) => {
  return (
    <a onClick={() => handleShow(id)} className="pointer d-flex align-items-center gap-1 pe-auto">
      Verwijder <BsFillTrashFill />
    </a>
  );
};

export default RemoveButton;
