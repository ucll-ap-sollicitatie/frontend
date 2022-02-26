import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateUserForm from "../../components/users/UpdateUserForm";

const UpdateInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const router = useRouter();
  const query = router.query as { email: string };
  if (query.email === undefined) return <Error statusCode={404} />;

  return (
    <Layout>
      <h1>Profiel aanpassen</h1>

      <UpdateUserForm email={query.email} />
    </Layout>
  );
};

export default UpdateInterview;
