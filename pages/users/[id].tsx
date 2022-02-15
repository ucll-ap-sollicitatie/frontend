import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import User from "../../interfaces/User";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/users/");
  const users = await data.json();

  const paths = users.map((user: User) => {
    return {
      params: { id: user.r_u_nummer.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:3001/users/${params.id}`);
  const users = await res.json();

  return {
    props: { user: users[0] },
  };
};

interface Props {
  user: User;
}

const UserDetails: NextPage<Props> = ({ user }) => {
  return (
    <>
      <Layout>
        <h1>User details</h1>
        <ProfileCard user={user} />
      </Layout>
    </>
  );
};

export default UserDetails;
