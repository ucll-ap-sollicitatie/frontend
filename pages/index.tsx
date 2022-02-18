import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { Button } from "react-bootstrap";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>

      <p>Welkom, {session.user.name || session.user.email}!</p>
      <Button variant="primary" onClick={signOut}>
        Logout
      </Button>
    </Layout>
  );
};

export default Home;
