import type { NextPage } from "next";
import { Spinner, Table } from "react-bootstrap";
import { useRequest } from "../helpers/useRequest";
import User from "../interfaces/User";

const UsersTable: NextPage = () => {
  const { data: users, error } = useRequest("users", 5000);

  if (error) return <div>Failed to load users</div>;
  if (!users)
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>R/U-nummer</th>
            <th>Voornaam</th>
            <th>Familienaam</th>
            <th>E-mail</th>
            <th>Richting</th>
            <th>Rol</th>
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
              <td>{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsersTable;
