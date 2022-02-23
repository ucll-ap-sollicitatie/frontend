import type { NextPage } from "next";
import { Button, Modal, Spinner } from "react-bootstrap";
import User from "../../interfaces/User";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactTable from "../ReactTable";

const columns = [
  {
    Header: "R/U-nummer",
    accessor: "r_u_number",
  },
  {
    Header: "Voornaam",
    accessor: "name",
  },
  {
    Header: "Familienaam",
    accessor: "surname",
  },
  {
    Header: "E-mail",
    accessor: "email",
  },
  {
    Header: "Richting",
    accessor: "formation",
  },
  {
    Header: "Rol",
    accessor: "role",
  },
];

const UsersTable: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/users");

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  const [id, setId] = useState<number | string>("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE",
    });

    handleClose();
    router.push(
      {
        pathname: "/users",
        query: { toast: "Gebruiker verwijderd" },
      },
      "/users"
    );
    fetchData();
  };

  if (error) return <div>Er is een probleem opgetreden bij het laden van de gebruikers.</div>;
  if (loading) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (users.length === 0) return <div>Geen gebruikers gevonden.</div>;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gebruiker verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bent u zeker dat u gebruiker <span className="font-italic">{id}</span> wilt verwijderen?
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

      <ReactTable columns={columns} data={users} url={"/users"} id="r_u_number" handleShow={handleShow} />
    </>
  );
};

export default UsersTable;
