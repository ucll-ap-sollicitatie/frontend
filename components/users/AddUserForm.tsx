import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Formation } from "../../interfaces/Formation";
import { Role } from "../../interfaces/Role";
import UserForm from "./UserForm";

const AddUserForm: NextPage = () => {
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch(`http://localhost:3001/roles`);
      const data = await response.json();
      setRoles(data);
    };

    const fetchFormations = async () => {
      const response = await fetch(`http://localhost:3001/formations`);
      const data = await response.json();
      setFormations(data);
    };

    fetchRoles();
    fetchFormations();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    if (target.password.value != target.password_check.value) {
      setError("De wachtwoorden komen niet overeen");
      setShow(true);
      return;
    }

    const res = await fetch("http://localhost:3001/users", {
      body: JSON.stringify({
        name: target.user_name.value,
        surname: target.surname.value,
        r_u_number: target.r_u_number.value,
        email: target.email.value,
        password: target.password.value,
        role_id: target.role_id.value,
        formation_id: target.formation_id.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.status === 400) {
      const response = await res.json();
      setError(response.messages);
      setShow(true);
    } else {
      router.push({
        pathname: "/preferences",
      });
    }
  };

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <UserForm onSubmit={onSubmit} />
    </>
  );
};

export default AddUserForm;
