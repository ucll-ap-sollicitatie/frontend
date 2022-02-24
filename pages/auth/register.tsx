import type { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import AddUserForm from "../../components/users/AddUserForm";

const Register: NextPage = () => {
  return (
    <Layout>
      <h1>Nieuw account registereren</h1>

      <AddUserForm />
    </Layout>
  );
};

export default Register;