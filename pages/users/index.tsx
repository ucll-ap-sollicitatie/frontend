import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import UsersTable from "../../components/users/UsersTable";

const Profile: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Gebruikers</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Gebruikers</h1>
      <UsersTable />
    </Layout>
  );
};

export default Profile;