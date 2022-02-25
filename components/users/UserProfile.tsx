import { NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import { useEffect, useState } from "react";

interface Props {
  user: User;
}

const UserProfile: NextPage<Props> = ({ user }) => {
  const [publicVideos, setPublicVideos] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/videos/email/${user.email}/public`);
    const data = await res.json();
    if (res.ok) {
      setPublicVideos(data);
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
          <h1>{user.name}'s profiel</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>{user.name}'s video's</h1>
          <OwnVideoOverview videos={publicVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default UserProfile;
