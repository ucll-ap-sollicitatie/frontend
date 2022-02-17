import type { NextPage } from "next";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "react-bootstrap";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>

        {!session ? (
          <>
            <p>U bent momenteel niet ingelogd.</p>
            <div className="d-flex gap-2 flex-column col-md-2">
              <Button variant="primary" onClick={() => signIn()}>
                Inloggen
              </Button>
              <Link href="/auth/register">
                <Button variant="primary">Registreren</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p>Welkom, {session.user.name || session.user.email}!</p>
            <Button variant="primary" onClick={signOut}>
              Logout
            </Button>
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
