import { GetStaticProps, NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import { useEffect, useState } from "react";
import Video from "../../interfaces/Video";

interface Props {
  user: User;
  videos: Video[];
}

const UserProfile: NextPage<Props> = ({ user, videos }) => {
  const [publicVideos, setPublicVideos] = useState<Video[]>([]);

  useEffect(() => {
    let temp: Video[] = [];
    videos.forEach((video) => {
      if (video.email === user.email && !video.private) {
        temp.push(video);
      }
    });
    setPublicVideos(temp);
  }, [videos, user.email]);

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col>
          <h1>{user.name}&apos;s profiel</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>{user.name}&apos;s video&apos;s</h1>
          <OwnVideoOverview videos={publicVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default UserProfile;
