import type { GetStaticProps, NextPage } from "next";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { Video } from "../../interfaces/Video";
import { Table } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import Link from "next/link";
import AllVideoOverview from "../../components/AllVideoOverview";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`http://localhost:3001/videos`);
  const videos = await res.json();

  return {
    props: { videos: videos },
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
      <AllVideoOverview videos={videos}/>
    </Layout>
  );
};

export default Home;
