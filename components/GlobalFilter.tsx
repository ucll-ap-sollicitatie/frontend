import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Form } from "react-bootstrap";

interface Props {
  filter: string;
  setFilter: (filter: any) => void;
}

const GlobalFilter: NextPage<Props> = ({ filter, setFilter }) => {
  const t = useTranslations("table");

  return (
    <span className="pt-3 pb-3 d-flex gap-2 align-items-center">
      {t("search")}: <Form.Control style={{ maxWidth: "256px" }} type="text" value={filter || ""} onChange={(e) => setFilter(e.target.value)} defaultValue="" />
    </span>
  );
};

export default GlobalFilter;
