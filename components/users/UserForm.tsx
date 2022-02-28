import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Formation } from "../../interfaces/Formation";
import { Role } from "../../interfaces/Role";
import User from "../../interfaces/User";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  user?: User;
}

const UserForm: NextPage<Props> = ({ onSubmit, user }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
      const data = await response.json();
      setRoles(data);
    };

    const fetchFormations = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formations`);
      const data = await response.json();
      setFormations(data);
    };

    fetchRoles();
    fetchFormations();
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} className="col-md-12 col-lg-10 col-xl-8">
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="user_name">
              <Form.Label>Voornaam</Form.Label>
              <Form.Control type="text" placeholder="Voornaam" defaultValue={user !== undefined ? user.name : ""} required />
            </Form.Group>

            <Form.Group controlId="surname">
              <Form.Label>Familienaam</Form.Label>
              <Form.Control type="text" placeholder="Familienaam" defaultValue={user !== undefined ? user.surname : ""} required />
            </Form.Group>

            <Form.Group controlId="r_u_number">
              <Form.Label>R/U-nummer</Form.Label>
              <Form.Control type="text" placeholder="R/U-nummer" defaultValue={user !== undefined ? user.r_u_number : ""} required />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>E-mail adres</Form.Label>
              <Form.Control type="email" placeholder="E-mail adres" defaultValue={user !== undefined ? user.email : ""} required />
            </Form.Group>
          </Stack>

          <Stack gap={3}>
            <Form.Group controlId="password">
              <Form.Label>Wachtwoord</Form.Label>
              <Form.Control type="password" placeholder="Wachtwoord" required />
            </Form.Group>

            <Form.Group controlId="password_check">
              <Form.Label>Wachtwoord verifiëren</Form.Label>
              <Form.Control type="password" placeholder="Wachtwoord verifiëren" required />
            </Form.Group>

            <Form.Group controlId="role_id">
              <Form.Label>Rol</Form.Label>
              <Form.Select required>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id} selected={user !== undefined && user.role === role.role}>
                    {role.role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formation_id">
              <Form.Label>Richting</Form.Label>
              <Form.Select required>
                {formations.map((formation) => (
                  <option key={formation.formation_id} value={formation.formation_id} selected={user !== undefined && user.formation === formation.formation}>
                    {formation.formation}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          {user ? "Profiel aanpassen" : "Registreren"}
        </Button>
      </Form>
    </>
  );
};

export default UserForm;
