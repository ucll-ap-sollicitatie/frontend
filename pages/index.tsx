import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button, Stack } from "react-bootstrap";
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
              <Link href="/auth/login">
                <Button variant="primary">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary">Register</Button>
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
