import type { NextPage } from "next";
import CommentsReactTable from "./CommentsReactTable";
import Comment from "../../interfaces/Comment";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  comments: Comment[];
}

const CommentsTable: NextPage<Props> = ({ comments }) => {
  const t = useTranslations("comments");

  const columns = [
    {
      Header: t("comment"),
      accessor: "text",
    },
    {
      Header: t("name"),
      accessor: "name",
    },
    {
      Header: t("surname"),
      accessor: "surname",
    },
    {
      Header: t("date"),
      accessor: "date_string",
    },
    {
      Header: t("amount_of_likes"),
      accessor: "likes",
    },
  ];

  return <CommentsReactTable columns={columns} data={comments} url={"/videos"} id="comment_id" />;
};

export default CommentsTable;
