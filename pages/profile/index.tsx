import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session || session !== undefined) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Profiel</h1>
      <ProfileCard user={session.user} />
    </Layout>
  );
};

export default Home;
