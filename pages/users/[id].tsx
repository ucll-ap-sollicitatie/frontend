import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import MyProfile from "../../components/users/MyProfile";
import UserProfile from "../../components/users/UserProfile";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const users = await data.json();

  let paths = [] as any;

  users.map((user: User) => {
    paths.push({ params: { id: user.email }, locale: "en" }, { params: { id: user.email }, locale: "fr" }, { params: { id: user.email }, locale: "nl" });
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const props = {
    user: null,
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  if (params !== undefined) {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${params.id}`);
    const user = await userRes.json();
    const videosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
    const videos = await videosRes.json();

    props.user = user;
    props.videos = videos;
  }

  return {
    props,
  };
};

interface Props {
  user: User;
  videos: Video[];
}

const UserDetails: NextPage<Props> = ({ user, videos }) => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const session_user = session.user as User;

  if (session_user.email !== user.email) return <UserProfile user={user} videos={videos} />;
  return <MyProfile user={session_user} videos={videos} />;
};

export default UserDetails;
