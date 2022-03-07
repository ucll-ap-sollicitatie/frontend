import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import UserProfile from "../../components/users/UserProfile";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const props = {
    user: null,
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  if (params !== undefined) {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`);
    const user = await userRes.json();

    if (userRes.status === 404) {
      return {
        notFound: true,
      };
    }

    const videosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
    const videos = await videosRes.json();

    if (videosRes.ok) {
      props.videos = videos;
    }
    props.user = user;
  }

  return {
    props: props,
  };
};

interface Props {
  user: User;
  videos: Video[];
}

const UserDetails: NextPage<Props> = ({ user, videos }) => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;

  return <UserProfile user={user} videos={videos} />;
};

export default UserDetails;
