import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { Alert, Breadcrumb, Button, Form, Stack } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import AddInterviewForm from "../../components/interviews/AddInterviewForm";

const AddInterview: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/interviews">Sollicitaties</Breadcrumb.Item>
        <Breadcrumb.Item active>Toevoegen</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Sollicatie aanmaken</h1>

      <AddInterviewForm />
    </Layout>
  );
};

export default AddInterview;
