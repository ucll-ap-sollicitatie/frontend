import type { NextPage } from "next";
import Link from "next/link";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { capitalize } from "../helpers/helperFunctions";
import { useRequest } from "../helpers/useRequest";
import { BsFillTrashFill, BsFillArrowUpRightCircleFill } from "react-icons/bs";
import User from "../interfaces/User";
import { useState } from "react";
import { useSWRConfig } from "swr";

const UsersTable: NextPage = () => {
  const { mutate } = useSWRConfig();

  const [r_u_number, setR_u_number] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (r_u_number: string) => {
    setR_u_number(r_u_number);
    setShow(true);
  };

  const handeDeleteUser = async () => {
    const res = await fetch(`http://localhost:3001/users/${r_u_number}`, {
      method: "DELETE",
    });

    handleClose();
    mutate("http://localhost:3001/users");
  };

  const { data: users, error } = useRequest("users");

  if (error) return <div>Failed to load users</div>;
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
          <Button variant="danger" onClick={handeDeleteUser}>
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
            <th>View</th>
            <th>Remove</th>
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
                <Link href={`/users/${user.r_u_number}`}>
                  <a className="d-flex align-items-center gap-1">
                    View <BsFillArrowUpRightCircleFill />
                  </a>
                </Link>
              </td>
              <td>
                <a onClick={() => handleShow(user.r_u_number)} className="pointer d-flex align-items-center gap-1 pe-auto">
                  Remove <BsFillTrashFill />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsersTable;
