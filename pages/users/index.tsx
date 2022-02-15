import type { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import UsersTable from "../../components/UsersTable";
import User from "../../interfaces/User";

const Profile: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Gebruikers</h1>

        <UsersTable />
      </Layout>
    </>
  );
};

export default Profile;
