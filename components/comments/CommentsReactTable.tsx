// @ts-nocheck :)
import type { NextPage } from "next";
import { Form, Pagination, Table } from "react-bootstrap";
import { BsArrowBarDown, BsArrowBarUp, BsArrowsExpand } from "react-icons/bs";
import { useTable, useSortBy, usePagination } from "react-table";
import RemoveButton from "../buttons/RemoveButton";
import ShowButton from "../buttons/ShowButton";
import UpdateButton from "../buttons/UpdateButton";
import Comment from "../../interfaces/Comment";
import { useTranslations } from "next-intl";

interface Props {
  columns: any;
  data: Comment[];
  url: string;
  id: string | number;
  handleShow?: (id: string | number) => void;
}

const CommentsReactTable: NextPage<Props> = ({ columns, data, url, id, handleShow }) => {
  const t = useTranslations("table");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination);

  return (
    <>
      <Table {...getTableProps()} bordered hover responsive>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column, index) => (
                <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} className="no-wrap">
                  {column.render("Header")}
                  <span>
                    {" "}
                    {column.isSorted ? column.isSortedDesc ? <BsArrowBarDown color="blue" /> : <BsArrowBarUp color="blue" /> : <BsArrowsExpand color="blue" />}
                  </span>
                </th>
              ))}
              {handleShow != null && (
                <>
                  <th>{t("update")}</th>
                  <th>{t("delete")}</th>
                </>
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return <td key={index}>{cell.render("Cell")}</td>;
                })}
                <td>
                  <ShowButton url={`${url}/${row.original.video_id}#commentBody_${row.original[id]}`} />
                </td>
                {handleShow != null && (
                  <>
                    <td>
                      <UpdateButton url={`${url}/update?task_id=${row.original[id]}`} />
                    </td>
                    <td>
                      <RemoveButton handleShow={handleShow} id={row.original[id]} />
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="d-flex flex-wrap align-items-center gap-3">
        <Pagination className="m-0">
          <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
        </Pagination>

        <span>
          {t("page")}{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>

        <span>
          {t("go_to_page")}:{" "}
          <Form.Control
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="d-inline-block"
            style={{ maxWidth: "100px" }}
          />
        </span>

        <Form.Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ maxWidth: "120px" }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {t("show")} {pageSize}
            </option>
          ))}
        </Form.Select>
      </div>
    </>
  );
};

export default CommentsReactTable;
