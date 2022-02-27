import type { NextPage } from "next";
import CommentsReactTable from "../CommentsReactTable";

const columns = [
  {
    Header: "Inhoud",
    accessor: "text",
  },
  {
    Header: "Voornaam",
    accessor: "name",
  },
  {
    Header: "Achternaam",
    accessor: "surname",
  },
  {
    Header: "Datum",
    accessor: "date_string",
  },
  {
    Header: "Aantal likes",
    accessor: "likes",
  },
];

interface Props {
  comments: Comment[];
}

const CommentsTable: NextPage<Props> = ({ comments }) => {
  return <CommentsReactTable columns={columns} data={comments} url={"/videos"} id="comment_id" />;
};

export default CommentsTable;
