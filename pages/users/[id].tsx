import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";
import User from "../../interfaces/User";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/users/");
  const users = await data.json();

  const paths = users.map((user: User) => {
    return {
      params: { id: user.r_u_number.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:3001/users/${params.id}`);
  const user = await res.json();

  return {
    props: { user: user },
  };
};

interface Props {
  user: User;
}

const UserDetails: NextPage<Props> = ({ user }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>User details</h1>
      <ProfileCard user={user} />
    </Layout>
  );
};

export default UserDetails;
