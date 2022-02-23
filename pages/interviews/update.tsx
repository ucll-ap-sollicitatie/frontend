import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import UpdateInterviewForm from "../../components/interviews/UpdateInterviewForm";
import { useRouter } from "next/router";

const UpdateInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const router = useRouter();
  const query = router.query as { id: string };
  if (query.id === undefined) return <p>Sollicitatie niet gevonden</p>;

  return (
    <Layout>
      <h1>Sollicatie aanpassen</h1>

      <UpdateInterviewForm id={query.id} />
    </Layout>
  );
};

export default UpdateInterview;
