import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";
import LoginButton from "./layout/auth/LoginButton";
import Layout from "./layout/Layout";

const Unauthenticated: NextPage = () => {
  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>

      <p>U bent momenteel niet ingelogd</p>

      <div className="d-flex gap-2 flex-column col-md-2">
        <LoginButton />
        <Link href="/auth/register">
          <Button variant="primary">Registreren</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Unauthenticated;
