import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";
import LoginButton from "./auth/LoginButton";
import Layout from "./layout/Layout";

const Unauthorized: NextPage = () => {
  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>

      <p>
        U heeft geen toegang tot dat gedeelte. <br /> Gelieve in te loggen.
      </p>

      <div className="d-flex gap-2 flex-column col-md-2">
        <LoginButton />
        <Link href="/auth/register" passHref>
          <Button variant="primary">Registreren</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Unauthorized;
