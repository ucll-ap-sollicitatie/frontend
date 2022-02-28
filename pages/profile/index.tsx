import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";
import OwnVideoOverview from "../../components/videos/OwnVideoOverview";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
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
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col>
          <h1>Profiel</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>Uw Video&apos;s</h1>
          <OwnVideoOverview videos={videos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Home;
