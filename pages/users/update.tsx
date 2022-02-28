import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateUserForm from "../../components/users/UpdateUserForm";

const UpdateInterview: NextPage = () => {
  const router = useRouter();
  const query = router.query as { email: string };
  const { data: session } = useSession();
  if (query.email === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Profiel aanpassen</h1>

      <UpdateUserForm email={query.email} />
    </Layout>
  );
};

export default UpdateInterview;
