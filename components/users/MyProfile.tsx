import { GetStaticProps, NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import Video from "../../interfaces/Video";
import { useEffect, useState } from "react";

interface Props {
  user: User;
}

const MyProfile: NextPage<Props> = ({ user }) => {
  const [myVideos, setVideos] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/videos/email/${user.email}`);
    const data = await res.json();
    if (res.ok) {
      setVideos(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col>
          <h1>Uw profiel</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>Uw video's</h1>
          <OwnVideoOverview videos={myVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default MyProfile;
