import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb, Button, Tab, Tabs } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import Unauthorized from "../../components/Unauthorized";
import StudentsTable from "../../components/users/StudentsTable";
import UsersTable from "../../components/users/UsersTable";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  if (session.user?.role === "Student") return <Unauthorized />;
  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Dashboard</h1>
      {session.user?.role === "Admin" && (
        <Tabs defaultActiveKey="start" id="uncontrolled-tab" className="mb-3">
          <Tab eventKey="start" title="Server informatie">
            <p>Server informatie</p>
          </Tab>
          <Tab eventKey="profile" title="Gebruikers overzicht">
            <UsersTable />
          </Tab>
          <Tab eventKey="contact" title="Commentaar overzicht">
            <p>Commentaar lijst van alle video's</p>
            <p>Update/Delete commentaar</p>
          </Tab>
        </Tabs>
      )}
      {session.user?.role === "Lector" && (
        <Tabs defaultActiveKey="students" id="uncontrolled-tab" className="mb-3">
          <Tab eventKey="students" title="Mijn studenten">
            <StudentsTable />
          </Tab>
          <Tab eventKey="tasks" title="Taken">
            <Button href="/tasks/add">Taak aanmaken</Button>
            <p>Lijst taken</p>
          </Tab>
        </Tabs>
      )}
    </Layout>
  );
};

export default Dashboard;
