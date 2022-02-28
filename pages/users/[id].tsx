import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import MyProfile from "../../components/users/MyProfile";
import UserProfile from "../../components/users/UserProfile";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const users = await data.json();

  const paths = users.map((user: User) => {
    return {
      params: { id: user.email },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const props = {
    user: null,
    videos: null,
    messages: (await import(`../public/locales/${locale}.json`)).default,
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
