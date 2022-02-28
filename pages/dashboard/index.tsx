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
import { useTranslations } from "next-intl";

interface Props {
  users: User[];
  comments: Comment[];
  videos: Video[];
  tasks: Task[];
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

const Dashboard: NextPage<Props> = ({ users, comments, videos, tasks }) => {
  const t = useTranslations("dashboard");

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

      <h1>{t("title")}</h1>
      {user.role === "Admin" && (
        <Tabs defaultActiveKey="start" id="uncontrolled-tab">
          <Tab eventKey="start" title={t("server_information")}>
            <Accordion>
              <Accordion.Item eventKey="0" className="rounded-0">
                <Accordion.Header>{t("users")}</Accordion.Header>
                <Accordion.Body>
                  {t("amount_of_users")}: {users ? users.length : t("none")}
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      {t("amount_of_admins")}: {countRole("Admin")}
                    </div>
                    <div>
                      {t("amount_of_lecturers")}: {countRole("Lector")}
                    </div>
                    <div>
                      {t("amount_of_students")}: {countRole("Student")}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Commentaar</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      {t("amount_of_comments")}: {comments ? comments.length - countFeedback() : "Geen"}
                    </div>
                    <div>
                      {t("amount_of_feedback")}: {countFeedback()}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>{t("videos")}</Accordion.Header>
                <Accordion.Body>
                  {t("amount_of_videos")}: {videos ? videos.length : "Geen"}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>
          <Tab eventKey="profile" title={t("users_overview")}>
            <UsersTable />
          </Tab>
          <Tab eventKey="contact" title={t("comments_overview")}>
            <CommentsTable comments={comments} />
          </Tab>
        </Tabs>
      )}
      {user.role === "Lector" && (
        <Tabs defaultActiveKey="students" id="uncontrolled-tab" className="mb-3">
          <Tab eventKey="students" title={t("my_students")}>
            <StudentsTable />
          </Tab>
          <Tab eventKey="tasks" title="Taken">
            <Button href="/tasks/add" className="mb-3">
              {t("task_add")}"
            </Button>
            <TasksTable allTasks={tasks} />
          </Tab>
        </Tabs>
      )}
    </Layout>
  );
};

export default Dashboard;
