import type { NextPage } from "next";
import { Table } from "react-bootstrap";
import { BsArrowBarDown, BsArrowBarUp, BsArrowsExpand } from "react-icons/bs";
import { useTable, useSortBy } from "react-table";
import RemoveButton from "./buttons/RemoveButton";
import ShowButton from "./buttons/ShowButton";

const ReactTable: NextPage = ({ columns, data, url, id, handleShow }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  console.log(rows);

  return (
    <Table {...getTableProps()} bordered hover responsive>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {" "}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <BsArrowBarDown color="blue" />
                    ) : (
                      <BsArrowBarUp color="blue" />
                    )
                  ) : (
                    <BsArrowsExpand color="blue" />
                  )}
                </span>
              </th>
            ))}
            <th>Bekijken</th>
            <th>Verwijderen</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td>{cell.render("Cell")}</td>;
              })}
              <td>
                <ShowButton url={`${url}/${row.original[id]}`} />
              </td>
              <td>
                <RemoveButton handleShow={handleShow} id={row.original[id]} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default ReactTable;
