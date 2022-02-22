import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import { Formation } from "../../interfaces/Formation";
import { Role } from "../../interfaces/Role";

export const getStaticProps: GetStaticProps = async () => {
  const roles_response = await fetch(`http://localhost:3001/roles`);
  const roles = await roles_response.json();

  const formations_response = await fetch(`http://localhost:3001/formations`);
  const formations = await formations_response.json();

  return {
    props: { roles: roles, formations: formations },
  };
};

interface Props {
  roles: Role[];
  formations: Formation[];
}

const Register: NextPage<Props> = ({ roles, formations }) => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

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
      router.push(
        {
          pathname: "/preferences",
          //query: { toast: "U bent geregistreerd, gelieve via email uw account te activeren" },
        },
      );
    }
  };

  return (
    <>
      <Layout>
        <h1>Register a new account</h1>

        <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
          <Alert.Heading>Slim op sollicitatie</Alert.Heading>
          <span>{error}</span>
        </Alert>

        <Form onSubmit={registerUser} className="col-md-12 col-lg-10 col-xl-8">
          <div className="d-flex gap-4 flex-wrap">
            <Stack gap={3}>
              <Form.Group controlId="user_name">
                <Form.Label>Voornaam</Form.Label>
                <Form.Control type="text" placeholder="Voornaam" required />
              </Form.Group>

              <Form.Group controlId="surname">
                <Form.Label>Familienaam</Form.Label>
                <Form.Control type="text" placeholder="Familienaam" required />
              </Form.Group>

              <Form.Group controlId="r_u_number">
                <Form.Label>R/U-nummer</Form.Label>
                <Form.Control type="text" placeholder="R/U-nummer" required />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Email address" required />
              </Form.Group>
            </Stack>

            <Stack gap={3}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>

              <Form.Group controlId="password_check">
                <Form.Label>Verify password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>

              <Form.Group controlId="role_id">
                <Form.Label>Rol</Form.Label>
                <Form.Select required>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formation_id">
                <Form.Label>Richting</Form.Label>
                <Form.Select required>
                  {formations.map((formation) => (
                    <option key={formation.formation_id} value={formation.formation_id}>
                      {formation.formation}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Stack>
          </div>

          <Button variant="primary" type="submit" className="mt-3">
            Maak account
          </Button>
        </Form>
      </Layout>
    </>
  );
};

export default Register;
