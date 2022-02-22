import type { NextPage } from "next";
import Link from "next/link";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

interface Props {
  url: string;
}

const ShowButton: NextPage<Props> = ({ url }) => {
  return (
    <Link href={url} passHref>
      <a className="d-flex align-items-center gap-1">
        Bekijk <BsFillArrowUpRightCircleFill />
      </a>
    </Link>
  );
};

export default ShowButton;
