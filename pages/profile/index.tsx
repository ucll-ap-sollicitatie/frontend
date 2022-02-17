import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import User from "../../interfaces/User";

const Home: NextPage = () => {
  const { data: session } = useSession();
  let user: User | undefined = undefined;

  console.log(session);

  if (session && session !== undefined) {
    user = {
      r_u_number: "Test r u number",
      name: session.user.name,
      surname: "",
      email: session.user.email,
      photo_url: session.user.image,
      hashed_password: "",
      role: "Test role",
      formation: "Test formation",
    };
  }

  return (
    <>
      <Layout>
        <h1>Profile</h1>

        {!session || user === undefined ? (
          <>
            <p>U bent momenteel niet ingelogd.</p>
          </>
        ) : (
          <>
            <ProfileCard user={user} />
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
