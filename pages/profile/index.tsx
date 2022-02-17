import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import User from "../../interfaces/User";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Layout>
        <h1>Profile</h1>

        {!session ? (
          <>
            <p>U bent momenteel niet ingelogd.</p>
          </>
        ) : (
          <>
            <ProfileCard user={session.user} />
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
