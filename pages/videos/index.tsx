import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AllVideoOverview from "../../components/videos/AllVideoOverview";

export const getStaticProps: GetStaticProps = async () => {
  let props = {
    videos: null,
  };

  const result = await fetch("http://localhost:3001/videos");
  const data = await result.json();

  if (result.status !== 404 && result.status !== 500) {
    props.videos = data;
  }

  return {
    props,
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
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Video's</Breadcrumb.Item>
      </Breadcrumb>
      <AllVideoOverview videos={videos} user={session.user} />
    </Layout>
  );
};

export default Home;
