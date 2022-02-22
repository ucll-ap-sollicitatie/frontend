import type { NextPage } from "next";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { capitalize } from "../../helpers/helperFunctions";
import { useRequest } from "../../helpers/useRequest";
import User from "../../interfaces/User";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import RemoveButton from "../buttons/RemoveButton";
import ShowButton from "../buttons/ShowButton";
import { useSession } from "next-auth/react";
import Unauthenticated from "../Unauthenticated";

const UsersTable: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [r_u_number, setR_u_number] = useState<number | string>("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id: number | string) => {
    setR_u_number(id);
    setShow(true);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3001/users/${r_u_number}`, {
      method: "DELETE",
    });

    handleClose();
    mutate("http://localhost:3001/users");
    router.push(
      {
        pathname: "/users",
        query: { toast: "Gebruiker verwijderd" },
      },
      "/users"
    );
  };

  const { data: users, error } = useRequest("users");

  if (error) return <div>Er is een probleem opgetreden bij het laden van de gebruikers.</div>;
  if (!users) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gebruiker verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bent u zeker dat u gebruiker <span className="font-italic">{r_u_number}</span> wilt verwijderen?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleClose}>
            Sluiten
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Verwijderen
          </Button>
        </Modal.Footer>
      </Modal>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>R/U-nummer</th>
            <th>Voornaam</th>
            <th>Familienaam</th>
            <th>E-mail</th>
            <th>Richting</th>
            <th>Rol</th>
            <th>Bekijken</th>
            <th>Verwijderen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.r_u_number}>
              <td>{user.r_u_number}</td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.formation}</td>
              <td>{capitalize(user.role)}</td>
              <td>
                <ShowButton url={`/users/${user.r_u_number}`} />
              </td>
              <td>
                <RemoveButton handleShow={handleShow} id={user.r_u_number} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsersTable;
