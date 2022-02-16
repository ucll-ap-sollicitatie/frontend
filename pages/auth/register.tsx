import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const Register: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Register a new account</h1>

        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPasswordCheck">
            <Form.Label>Verify password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check label="Newsletter with daily tips" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Layout>
    </>
  );
};

export default Register;
