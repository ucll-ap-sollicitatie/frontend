import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { Button } from "react-bootstrap";
import LogoutButton from "../components/layout/auth/LogoutButton";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>

      <p>Welkom, {session.user.name || session.user.email}!</p>
      <LogoutButton />
    </Layout>
  );
};

export default Home;
