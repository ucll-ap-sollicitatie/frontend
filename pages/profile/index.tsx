import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import MyProfile from "../../components/users/MyProfile";
import User from "../../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Profile: NextPage = () => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const session_user = session.user as User;
  return <MyProfile user={session_user} />;
};

export default Profile;
