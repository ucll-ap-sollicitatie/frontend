import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import LogoutButton from "../components/auth/LogoutButton";
import Layout from "../components/layout/Layout";
import Unauthenticated from "../components/Unauthenticated";
import User from "../interfaces/User";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <h1>Slim op sollicitatie</h1>
      <p>Welkom, {user.name || user.email}!</p> <LogoutButton />
    </Layout>
  );
};

export default Home;
