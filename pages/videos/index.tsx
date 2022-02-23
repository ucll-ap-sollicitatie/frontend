import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AllVideoOverview from "../../components/AllVideoOverview";

export const getStaticProps: GetStaticProps = async () => {
  const result = await fetch("http://localhost:3001/videos");
  const data = await result.json();
  return {
    props: {
      videos: data,
    },
  };
};

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Alle video's</h1>
      <AllVideoOverview videos={videos} user={session.user} />
    </Layout>
  );
};

export default Home;
