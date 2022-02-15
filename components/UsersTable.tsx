import type { NextPage } from "next";
import Link from "next/link";
import { Spinner, Table } from "react-bootstrap";
import { capitalize } from "../helpers/helperFunctions";
import { useRequest } from "../helpers/useRequest";
import { BsFillTrashFill, BsFillArrowUpRightCircleFill } from "react-icons/bs";
import User from "../interfaces/User";

const UsersTable: NextPage = () => {
  const { data: users, error } = useRequest("users");

  if (error) return <div>Failed to load users</div>;
  if (!users)
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>R/U-nummer</th>
            <th>Voornaam</th>
            <th>Familienaam</th>
            <th>E-mail</th>
            <th>Richting</th>
            <th>Rol</th>
            <th>View</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.r_u_nummer}>
              <td>{user.r_u_nummer}</td>
              <td>{user.voornaam}</td>
              <td>{user.familienaam}</td>
              <td>{user.e_mail}</td>
              <td>{user.richting}</td>
              <td>{capitalize(user.rol)}</td>
              <td>
                <Link href={`/users/${user.r_u_nummer}`}>
                  <a className="d-flex align-items-center gap-1">
                    View <BsFillArrowUpRightCircleFill />
                  </a>
                </Link>
              </td>
              <td>
                <Link href="#">
                  <a className="d-flex align-items-center gap-1">
                    Remove <BsFillTrashFill />
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsersTable;
