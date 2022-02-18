import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "react-bootstrap";
import Layout from "./layout/Layout";

const Unauthenticated: NextPage = () => {
  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>

      <p>U bent momenteel niet ingelogd</p>
      <div className="d-flex gap-2 flex-column col-md-2">
        <Button variant="primary" onClick={() => signIn()}>
          Inloggen
        </Button>
        <Link href="/auth/register">
          <Button variant="primary">Registreren</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Unauthenticated;
