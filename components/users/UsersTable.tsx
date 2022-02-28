import type { NextPage } from "next";
import { Modal } from "react-bootstrap";
import User from "../../interfaces/User";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactTable from "../ReactTable";
import SpinnerComponent from "../SpinnerComponent";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("users");

  const router = useRouter();
  const [id, setId] = useState<number | string>("");
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);

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

  const handleDelete = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
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

  if (error) return <div>{t("users_loading_failed")}</div>;
  if (loading) return <SpinnerComponent />;
  if (users.length === 0) return <div>{t("no_users")}</div>;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("remove_user")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("users_delete_confirm")}</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <ReactTable columns={columns} data={users} url={"/users"} id="email" handleShow={handleShow} />
    </>
  );
};

export default UsersTable;
