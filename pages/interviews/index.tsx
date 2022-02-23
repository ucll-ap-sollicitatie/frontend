import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import AddInterviewButton from "../../components/interviews/AddInterviewButton";
import InterviewsTable from "../../components/interviews/InterviewsTable";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";

const Interviews: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Sollicitaties</h1>

      <AddInterviewButton />
      <br />
      <br />

      <InterviewsTable />
    </Layout>
  );
};

export default Interviews;
