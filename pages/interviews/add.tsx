import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";

const AddInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Sollicatie aanmaken</h1>

      <AddInterviewForm />
    </Layout>
  );
};

export default AddInterview;
