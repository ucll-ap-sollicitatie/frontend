import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Form } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const Login: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Layout>
        <h1>Login</h1>

        {!session ? (
          <>
            <h3>OAuth</h3>
            <Button variant="primary" onClick={() => signIn()}>
              Sign in with OAuth
            </Button>

            <h3 className="mt-5">R/U-nummer</h3>
            <Form>
              <Form.Group className="mb-2 col-md-3" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-2 col-md-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBasicCheckbox">
                <Form.Check label="Remember me" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </>
        ) : (
          <>
            <p>Momenteel ingelogd als {session.user.name || session.user.email}.</p>
            <Button variant="primary" onClick={signOut}>
              Logout
            </Button>
          </>
        )}
      </Layout>
    </>
  );
};

export default Login;
