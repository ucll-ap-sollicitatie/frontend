// @ts-nocheck :)
import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Form, Pagination, Table } from "react-bootstrap";
import { BsArrowBarDown, BsArrowBarUp, BsArrowsExpand } from "react-icons/bs";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import ShowButton from "./buttons/ShowButton";
import GlobalFilter from "./GlobalFilter";

interface Props {
  columns: any;
  data: any;
  url: string;
  id: string | number;
}

const StudentsReactTable: NextPage<Props> = ({ columns, data, url, id }) => {
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
    state,
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable({ columns, data, initialState: { pageIndex: 0 } }, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter } = state;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

      <Table {...getTableProps()} bordered hover responsive>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="no-wrap" key={index}>
                  {column.render("Header")}
                  <span key={index}>
                    {" "}
                    {column.isSorted ? column.isSortedDesc ? <BsArrowBarDown color="blue" /> : <BsArrowBarUp color="blue" /> : <BsArrowsExpand color="blue" />}
                  </span>
                </th>
              ))}
              <th>{t("view")}</th>
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
                  <ShowButton url={`${url}/${row.original[id]}`} />
                </td>
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
            {pageIndex + 1} / {pageOptions.length}
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
          style={{ maxWidth: "136px" }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {t("show")} {pageSize}
            </option>
          ))}
        </Form.Select>
      </div>
    </>
  );
};

export default StudentsReactTable;
