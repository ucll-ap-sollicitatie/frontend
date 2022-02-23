import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Col, Row } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";
import OwnVideoOverview from "../../components/OwnVideoOverview";
import { Video } from "../../interfaces/Video";

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
      <Row>
        <Col>
          <h1>Profiel</h1>
          <ProfileCard user={session.user} />
        </Col>
        <Col>
          <h1>Uw Video's</h1>
          <OwnVideoOverview videos={videos}  />
        </Col>
      </Row>
    </Layout>
  );
};

export default Home;
