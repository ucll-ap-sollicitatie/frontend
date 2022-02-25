import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import MyProfile from "../../components/users/MyProfile";
import UserProfile from "../../components/users/UserProfile";
import User from "../../interfaces/User";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/users/");
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const props = {
    user: null,
  };

  if (params !== undefined) {
    const userRes = await fetch(`http://localhost:3001/users/email/${params.id}`);
    const user = await userRes.json();

    props.user = user;
  }

  return {
    props,
  };
};

interface Props {
  user: User;
}

const UserDetails: NextPage<Props> = ({ user }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (session.user?.email !== user.email) return <UserProfile user={user} />;
  return <MyProfile user={session.user} />;
};

export default UserDetails;
