import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import AdminView from "../../components/dashboard/AdminView";
import TeacherView from "../../components/dashboard/TeacherView";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";
import Unauthorized from "../../components/Unauthorized";
import Comment from "../../interfaces/Comment";
import Task from "../../interfaces/Task";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

interface Props {
  users: User[];
  comments: Comment[];
  videos: Video[];
  tasks: Task[];
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props = {
    users: null,
    comments: null,
    videos: null,
    tasks: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const usersJson = await usersRes.json();
  if (usersRes.ok) {
    props.users = usersJson;
  }

  const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
  const commentsJson = await commentsRes.json();
  if (commentsRes.ok) {
    props.comments = commentsJson;
  }

  const videosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const videosJson = await videosRes.json();
  if (videosRes.ok) {
    props.videos = videosJson;
  }

  const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
  const tasksJson = await tasksRes.json();
  if (tasksRes.ok) {
    props.tasks = tasksJson;
  }

  return {
    props,
  };
};

const Dashboard: NextPage<Props> = ({ users, comments, tasks }) => {
  const t = useTranslations("dashboard");
  const title = t("title");
  const { data: session } = useSession();
  const user = session?.user as User;
  if (!session || user === undefined) return <Unauthenticated />;
  if (user.role === "Student") return <Unauthorized />;

  const breadcrumb_items = [{ text: t("title") }];

  return (
    <Layout>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("title")}</h1>
      {user.role === "Admin" && <AdminView users={users} comments={comments} t={t} />}
      {user.role === "Lector" && <TeacherView tasks={tasks} t={t} />}
    </Layout>
  );
};

export default Dashboard;
