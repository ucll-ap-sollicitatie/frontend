import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateTaskForm from "../../components/tasks/UpdateTaskForm";

const UpdateInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const router = useRouter();
  const query = router.query as { task_id: string };
  if (query.task_id === undefined) return <Error statusCode={404} />;

  return (
    <Layout>
      <h1>Taak aanpassen</h1>

      <UpdateTaskForm task_id={query.task_id} />
    </Layout>
  );
};

export default UpdateInterview;
