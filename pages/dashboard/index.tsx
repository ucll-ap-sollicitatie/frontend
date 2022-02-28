import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Accordion, Breadcrumb, Button, Tab, Tabs } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import Unauthorized from "../../components/Unauthorized";
import StudentsTable from "../../components/users/StudentsTable";
import UsersTable from "../../components/users/UsersTable";
import TasksTable from "../../components/tasks/TasksTable";
import User from "../../interfaces/User";
import Comment from "../../interfaces/Comment";
import CommentsTable from "../../components/comments/CommentsTable";
import Video from "../../interfaces/Video";
import Task from "../../interfaces/Task";

interface Props {
  users: User[];
  comments: Comment[];
  videos: Video[];
  tasks: Task[];
}

export const getStaticProps: GetStaticProps = async () => {
  const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const usersJson = await usersRes.json();

  const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
  const commentsJson = (await commentsRes.json()) as Comment[];

  const videosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const videosJson = await videosRes.json();

  const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
  const tasksJson = await tasksRes.json();

  return {
    props: {
      users: usersJson,
      comments: commentsJson,
      videos: videosJson,
      tasks: tasksJson,
    },
  };
};

const Dashboard: NextPage<Props> = ({ users, comments, videos, tasks }) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  if (!session || user === undefined) return <Unauthenticated />;
  if (user.role === "Student") return <Unauthorized />;

  const countRole = (role: string) => {
    if (users.length > 0) {
      const temp = users.filter((user: User) => user.role === role);
      return temp.length;
    }
    return 0;
  };

  const countFeedback = () => {
    if (comments.length > 0) {
      const temp = comments.filter((comment: Comment) => comment.feedback);
      return temp.length;
    }
    return 0;
  };

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Dashboard</h1>
      {user.role === "Admin" && (
        <Tabs defaultActiveKey="start" id="uncontrolled-tab">
          <Tab eventKey="start" title="Server informatie">
            <Accordion>
              <Accordion.Item eventKey="0" className="rounded-0">
                <Accordion.Header>Gebruikers</Accordion.Header>
                <Accordion.Body>
                  Aantal gebruikers: {users ? users.length : "Geen"}
                  <div className="d-flex justify-content-between mt-3">
                    <div>Aantal admins: {countRole("Admin")}</div>
                    <div>Aantal lectoren: {countRole("Lector")}</div>
                    <div>Aantal studenten: {countRole("Student")}</div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Commentaar</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex justify-content-between">
                    <div>Aantal commentaar: {comments ? comments.length - countFeedback() : "Geen"}</div>
                    <div>Aantal feedback: {countFeedback()}</div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Video&apos;s</Accordion.Header>
                <Accordion.Body>Aantal video&apos;s: {videos ? videos.length : "Geen"}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>
          <Tab eventKey="profile" title="Gebruikers overzicht">
            <UsersTable />
          </Tab>
          <Tab eventKey="contact" title="Commentaar overzicht">
            <CommentsTable comments={comments} />
          </Tab>
        </Tabs>
      )}
      {user.role === "Lector" && (
        <Tabs defaultActiveKey="students" id="uncontrolled-tab" className="mb-3">
          <Tab eventKey="students" title="Mijn studenten">
            <StudentsTable />
          </Tab>
          <Tab eventKey="tasks" title="Taken">
            <Button href="/tasks/add" className="mb-3">
              Taak aanmaken
            </Button>
            <TasksTable allTasks={tasks} />
          </Tab>
        </Tabs>
      )}
    </Layout>
  );
};

export default Dashboard;
